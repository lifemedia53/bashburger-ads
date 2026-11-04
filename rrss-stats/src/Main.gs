/** Puntos de entrada. Ejecutar en este orden la primera vez: setupSheets → diagnose → probeMetrics → runPilotTonysOctubre2026. */

function lock_(fn) {
  var lock = LockService.getScriptLock();
  if (!lock.tryLock(30000)) { logControl_('', '', '', 'OMITIDO', 'Otra ejecución en curso; se omite para evitar duplicados', 'Lock', 'WARN'); return; }
  try { return fn(); } finally { lock.releaseLock(); }
}

/** Cuentas desde CONFIG. Se incorporan nuevas cuentas solo agregando filas (sin tocar código). */
function readAccounts_() {
  var sh = getSheet_(LM.SHEETS.CONFIG, LM.HEADERS.CONFIG_EXTRA), idx = headerIndex_(sh), n = sh.getLastRow(), out = [];
  if (n < 2) return out;
  sh.getRange(2, 1, n - 1, sh.getLastColumn()).getValues().forEach(function (r, i) {
    var id = String(r[idx['ID Meta']] || '').trim();
    out.push({ row: i + 2, marca: String(r[idx['Cliente']] || '').trim(), plat: String(r[idx['Plataforma']] || '').trim(), id: id,
      usuario: r[idx['Usuario']], activo: String(r[idx['Activo']] || '').trim().toLowerCase() === 'sí',
      adAccount: String(r[idx['Cuenta publicitaria (act_)']] || '').trim(), pageId: String(r[idx['Page ID vinculado']] || '').trim(),
      authorized: id !== '' });
  });
  return out.filter(function (a) { return a.marca && a.plat; });
}

function setupSheets() {
  getSheet_(LM.SHEETS.REGISTROS, LM.HEADERS.REGISTROS); getSheet_(LM.SHEETS.CONFIG, LM.HEADERS.CONFIG_EXTRA);
  getSheet_(LM.SHEETS.CONTROL, LM.HEADERS.CONTROL); getSheet_(LM.SHEETS.CONTENIDOS, LM.HEADERS.CONTENIDOS);
  getSheet_(LM.SHEETS.DISPONIBILIDAD, LM.HEADERS.DISPONIBILIDAD); getSheet_(LM.SHEETS.DIFERENCIAS, LM.HEADERS.DIFERENCIAS);
  return 'Hojas listas (solo se agregaron columnas/hojas nuevas; no se tocó ningún dato existente).';
}

/** Extrae y guarda una cuenta/mes. mode: 'DIARIO' (mes en curso → PARCIAL) o 'CIERRE' (mes completo → EXTRAÍDO). */
function runAccount_(account, ym, mode, now) {
  var nowIso = Utilities.formatDate(now || new Date(), LM.TZ, "yyyy-MM-dd'T'HH:mm:ssXXX");
  var partial = mode === 'DIARIO' && ym === currentMonth_(now);
  var ctx0 = { periodState: partial ? LM.PERIOD_STATES.PARTIAL : LM.PERIOD_STATES.EXTRACTED, nowIso: nowIso, now: now };
  var results = (account.plat === 'Instagram' ? extractInstagram_(account, ym, now) : extractFacebook_(account, ym, now))
    .concat(extractAds_(account, ym, now));
  var recs = toRecords_(account, ym, results, ctx0), ex = readExisting_(), plan = planUpsert_(ex.rows, recs);
  applyPlan_(ex, plan);
  plan.conflicts.forEach(function (c) {
    logControl_(account.marca, account.plat, ym, 'DIFERENCIA', 'Período bloqueado: ' + c.rec.metrica + ' API=' + c.rec.valor + ' vs hoja=' + c.existing.valor, 'API vs histórico', 'WARN');
  });
  results.filter(function (r) { return r.status === LM.DATA.ERROR; }).forEach(function (r) {
    logControl_(account.marca, account.plat, ym, 'ERROR', r.key + ': ' + r.detail, 'API', 'ERROR');
  });
  var content = [];
  try { content = extractContent_(account, ym, now); upsertContent_(content, nowIso); }
  catch (e) { logControl_(account.marca, account.plat, ym, 'ERROR', 'Contenido: ' + scrub_(e.message), 'API', 'ERROR'); }
  var best = bestContent_(content);
  if (best) logControl_(account.marca, account.plat, ym, 'INFO', 'Mejor contenido (' + best.criterio + '): ' + best.row.url, 'CONTENIDOS', 'INFO');
  var errors = results.filter(function (r) { return r.status === LM.DATA.ERROR; }).length;
  setConfigStatus_(account, errors ? '' : nowIso, errors ? errors + ' métricas con error (ver CONTROL)' : '');
  return { inserted: plan.inserts.length, updated: plan.updates.length, skipped: plan.skipped.length, conflicts: plan.conflicts.length, errors: errors };
}

function setConfigStatus_(account, okIso, err) {
  var sh = getSheet_(LM.SHEETS.CONFIG, LM.HEADERS.CONFIG_EXTRA), idx = headerIndex_(sh);
  if (okIso) { sh.getRange(account.row, idx['Última extracción OK'] + 1).setValue(okIso); sh.getRange(account.row, idx['Última extracción'] + 1).setValue(okIso); }
  sh.getRange(account.row, idx['Último error'] + 1).setValue(err || '');
  sh.getRange(account.row, idx['Conexión API'] + 1).setValue(err ? 'CON ERRORES' : (okIso ? 'OK' : 'PENDIENTE'));
}

function refreshViews_(marcaPlat, now) {
  var allowed = [LM.PERIOD_STATES.VALIDATED, LM.PERIOD_STATES.HISTORIC];
  if (PropertiesService.getScriptProperties().getProperty('INCLUIR_NO_VALIDADOS') === 'true') allowed.push(LM.PERIOD_STATES.EXTRACTED, LM.PERIOD_STATES.PARTIAL);
  var res = updateResumen_(buildSummary_(readRecords_(), allowed));
  var formulas = [];
  if (marcaPlat) formulas = updateDashboard_(marcaPlat.marca, marcaPlat.plat, marcaPlat.mes);
  if (formulas.length) logControl_(marcaPlat.marca, marcaPlat.plat, marcaPlat.mes, 'INFO', 'Celdas del DASHBOARD con fórmula (no se tocaron): ' + formulas.join(','), 'Dashboard', 'INFO');
  return res;
}

function runForAll_(monthsFn, mode, only) {
  var accounts = readAccounts_().filter(function (a) { return a.activo && a.authorized && (!only || a.marca === only); }), now = new Date(), out = [];
  readAccounts_().filter(function (a) { return a.activo && !a.authorized; }).forEach(function (a) {
    logControl_(a.marca, a.plat, '', 'PENDIENTE', 'Sin ID Meta en CONFIG: cuenta no autorizada/configurada', 'CONFIG', 'WARN');
  });
  accounts.forEach(function (a) {
    monthsFn(now).forEach(function (ym) {
      try { out.push({ a: a.marca + '/' + a.plat, ym: ym, r: runAccount_(a, ym, mode, now) }); }
      catch (e) { logControl_(a.marca, a.plat, ym, 'ERROR', scrub_(e.message), 'runAccount', 'ERROR'); setConfigStatus_(a, '', scrub_(e.message)); out.push({ a: a.marca + '/' + a.plat, ym: ym, error: scrub_(e.message) }); }
    });
  });
  if (accounts.length) { var last = accounts[0]; refreshViews_({ marca: last.marca, plat: last.plat, mes: prevMonth_(currentMonth_(now)) }, now); }
  return out;
}

/** Disparador diario: mes en curso (+ mes anterior los 3 primeros días, por si Meta ajusta datos). */
function runDaily() {
  return lock_(function () {
    return runForAll_(function (now) {
      var cur = currentMonth_(now), day = Number(todayStr_(now).slice(8));
      return day <= 3 ? [prevMonth_(cur), cur] : [cur];
    }, 'DIARIO');
  });
}

/** Cierre mensual: reconsulta el mes anterior COMPLETO (día 2 de cada mes). */
function runMonthlyClose() {
  return lock_(function () { return runForAll_(function (now) { return [prevMonth_(currentMonth_(now))]; }, 'CIERRE'); });
}

/** Extracción puntual de un mes y cliente (p. ej. '2026-10', "Tony's Pasta"). */
function runMonth(ym, marca) {
  return lock_(function () { return runForAll_(function () { return [ym]; }, 'CIERRE', marca); });
}

/** Primera extracción real: Tony's Pasta, octubre 2026. No toca RESUMEN/DASHBOARD hasta validar. */
function runPilotTonysOctubre2026() {
  backupSpreadsheet_();
  return runMonth('2026-10', "Tony's Pasta");
}

/** Tras comparar con Business Suite y aprobar: marca el mes como VALIDADO (queda bloqueado) y refresca RESUMEN/DASHBOARD. */
function validateMonth(marca, plat, ym) {
  return lock_(function () {
    backupSpreadsheet_();
    var ex = readExisting_(), n = 0;
    ex.rows.forEach(function (r) {
      var parts = r.clave.split('|');
      if (parts[0] === marca.toLowerCase() && parts[1] === plat.toLowerCase() && parts[2] === ym && r.estado === LM.PERIOD_STATES.EXTRACTED) {
        ex.sh.getRange(r.row, ex.idx['Estado'] + 1).setValue(LM.PERIOD_STATES.VALIDATED); n++;
      }
    });
    logControl_(marca, plat, ym, 'VALIDADO', n + ' registros marcados VALIDADO por revisión humana', 'validateMonth', 'INFO');
    refreshViews_({ marca: marca, plat: plat, mes: ym }, new Date());
    return n;
  });
}

/** Registra diferencia API vs Business Suite (valor leído a mano por el equipo). */
function recordBsuiteDifference(marca, plat, ym, metrica, valorBS, nota) {
  var ex = readExisting_(), k = recordKey_(marca, plat, ym, metrica), api = null;
  ex.rows.forEach(function (r) { if (r.clave === k) api = r.valor; });
  var sh = getSheet_(LM.SHEETS.DIFERENCIAS, LM.HEADERS.DIFERENCIAS), diff = api === null || api === '' ? null : toNumber_(api) - toNumber_(valorBS);
  var pct = diff === null || !toNumber_(valorBS) ? null : diff / toNumber_(valorBS);
  sh.getRange(sh.getLastRow() + 1, 1, 1, 10).setValues([[marca, plat, ym, metrica, api === null ? 'S/D' : api, valorBS, diff === null ? 'S/D' : diff, pct === null ? 'S/D' : pct, nota || '', new Date()]]);
}

/**
 * Ingreso manual de un valor (p. ej. leído en Business Suite) cuando la API no lo entrega.
 * Queda con Fuente explícita y estado EXTRAÍDO (se valida igual que los demás). No pisa meses bloqueados.
 */
function setManualValue(marca, plat, ym, metrica, valor, fuente) {
  var n = toNumber_(valor);
  if (n === null) throw new Error('Valor no numérico: ' + valor);
  var info = monthInfo_(ym), nowIso = Utilities.formatDate(new Date(), LM.TZ, "yyyy-MM-dd'T'HH:mm:ssXXX");
  var regla = ['Alcance', 'Alcance orgánico', 'Alcance Ads', 'Cuentas involucradas'].indexOf(metrica) >= 0 ? 'no aditivo'
    : metrica === 'Seguidores cierre' ? 'saldo' : 'aditivo';
  var rec = { marca: marca, plat: plat, mes: ym, inicio: info.first, fin: info.last, metrica: metrica, valor: n,
    fuente: fuente || 'Business Suite (manual)', estado: LM.PERIOD_STATES.EXTRACTED, regla: regla, obs: 'Ingresado manualmente',
    extraidoEn: nowIso, clave: recordKey_(marca, plat, ym, metrica), estadoDato: n === 0 ? LM.DATA.ZERO : LM.DATA.OK, detalle: '' };
  var ex = readExisting_(), plan = planUpsert_(ex.rows, [rec]);
  applyPlan_(ex, plan);
  logControl_(marca, plat, ym, 'MANUAL', metrica + ' = ' + n + ' (' + rec.fuente + '); insertados ' + plan.inserts.length + ', actualizados ' + plan.updates.length + ', omitidos ' + plan.skipped.length, 'setManualValue', 'INFO');
  return { inserts: plan.inserts.length, updates: plan.updates.length, skipped: plan.skipped.map(function (x) { return x.reason; }) };
}
