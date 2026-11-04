/**
 * Almacenamiento idempotente. Parte pura (planUpsert_) + E/S de hojas.
 * Reglas: nunca sobrescribir HISTÓRICO/VALIDADO; no degradar EXTRAÍDO a PARCIAL;
 * no reemplazar un valor bueno por un ERROR/NO DISPONIBLE transitorio; sin duplicados por clave.
 */

function isGood_(estadoDato) { return estadoDato === LM.DATA.OK || estadoDato === LM.DATA.ZERO; }

/**
 * @param existing [{row, clave, valor, estado, estadoDato}]  (row = número de fila en la hoja)
 * @param incoming registros normalizados
 * @return {inserts, updates:[{row,rec}], skipped:[{rec,reason}], conflicts:[{rec,existing}]}
 */
function planUpsert_(existing, incoming) {
  var byKey = {}, plan = { inserts: [], updates: [], skipped: [], conflicts: [] }, inBatch = {};
  existing.forEach(function (e) { byKey[e.clave] = e; });
  incoming.forEach(function (rec) {
    if (inBatch[rec.clave]) { plan.skipped.push({ rec: rec, reason: 'duplicado en el mismo lote' }); return; }
    inBatch[rec.clave] = true;
    var e = byKey[rec.clave];
    if (!e) { plan.inserts.push(rec); return; }
    if (LM.LOCKED_STATES.indexOf(e.estado) >= 0) {
      var same = String(e.valor) === String(rec.valor);
      if (!same && isGood_(rec.estadoDato)) plan.conflicts.push({ rec: rec, existing: e });
      plan.skipped.push({ rec: rec, reason: 'período bloqueado (' + e.estado + ')' }); return;
    }
    if (e.estado === LM.PERIOD_STATES.EXTRACTED && rec.estado === LM.PERIOD_STATES.PARTIAL) {
      plan.skipped.push({ rec: rec, reason: 'no se degrada un período cerrado a parcial' }); return;
    }
    if (isGood_(e.estadoDato) && !isGood_(rec.estadoDato)) {
      plan.skipped.push({ rec: rec, reason: 'se conserva el valor anterior; la nueva lectura falló (' + rec.estadoDato + ')' }); return;
    }
    var unchanged = String(e.valor === '' ? null : e.valor) === String(rec.valor) && e.estadoDato === rec.estadoDato && e.estado === rec.estado;
    if (unchanged) { plan.skipped.push({ rec: rec, reason: 'sin cambios' }); return; }
    plan.updates.push({ row: e.row, rec: rec });
  });
  return plan;
}

// ---------- E/S de hojas ----------
function getSS_() {
  var active = null;
  try { active = SpreadsheetApp.getActiveSpreadsheet(); } catch (e) { /* sin contenedor */ }
  if (active) return active;
  var id = PropertiesService.getScriptProperties().getProperty('SPREADSHEET_ID') || LM.SPREADSHEET_ID;
  return SpreadsheetApp.openById(id);
}

/** Obtiene la hoja (la crea si no existe) y agrega SOLO a la derecha los encabezados que falten. */
function getSheet_(name, headers) {
  var ss = getSS_(), sh = ss.getSheetByName(name);
  if (!sh) { sh = ss.insertSheet(name); sh.getRange(1, 1, 1, headers.length).setValues([headers]); return sh; }
  if (headers && headers.length) {
    var lastCol = Math.max(sh.getLastColumn(), 1), cur = sh.getRange(1, 1, 1, lastCol).getValues()[0];
    headers.forEach(function (h) {
      if (cur.indexOf(h) < 0) { cur.push(h); sh.getRange(1, cur.length).setValue(h); }
    });
  }
  return sh;
}

function headerIndex_(sh) {
  var h = sh.getRange(1, 1, 1, sh.getLastColumn()).getValues()[0], idx = {};
  h.forEach(function (name, i) { if (name !== '') idx[name] = i; });
  return idx;
}

function readExisting_() {
  var sh = getSheet_(LM.SHEETS.REGISTROS, LM.HEADERS.REGISTROS), n = sh.getLastRow();
  if (n < 2) return { sh: sh, idx: headerIndex_(sh), rows: [] };
  var idx = headerIndex_(sh), data = sh.getRange(2, 1, n - 1, sh.getLastColumn()).getValues(), rows = [];
  data.forEach(function (r, i) {
    rows.push({ row: i + 2, clave: recordKey_(r[idx['Marca']], r[idx['Plataforma']], normMonth_(r[idx['Mes']]), r[idx['Métrica']]),
      valor: r[idx['Valor']], estado: r[idx['Estado']], estadoDato: r[idx['Estado dato']] || (r[idx['Valor']] === '' ? '' : LM.DATA.OK) });
  });
  return { sh: sh, idx: idx, rows: rows };
}

function recordToRow_(rec, idx, width) {
  var row = new Array(width).fill('');
  function set(h, v) { if (idx[h] !== undefined) row[idx[h]] = v === null || v === undefined ? '' : v; }
  set('Marca', rec.marca); set('Plataforma', rec.plat); set('Mes', rec.mes); set('Inicio', rec.inicio); set('Fin', rec.fin);
  set('Métrica', rec.metrica); set('Valor', rec.valor); set('Fuente', rec.fuente); set('Estado', rec.estado);
  set('Regla', rec.regla); set('Observaciones', rec.obs); set('Fecha extracción', rec.extraidoEn); set('Clave', rec.clave);
  set('Estado dato', rec.estadoDato); set('Detalle técnico', rec.detalle);
  return row;
}

/** Aplica el plan. Las actualizaciones tocan solo las columnas de la API (no 'Fila original'). */
/** Formato texto en Mes/Inicio/Fin ANTES de escribir, para que Sheets no los convierta en fechas. */
function textDateCols_(sh, idx, row, nrows) {
  ['Mes', 'Inicio', 'Fin'].forEach(function (h) { if (idx[h] !== undefined) sh.getRange(row, idx[h] + 1, nrows, 1).setNumberFormat('@'); });
}
function applyPlan_(ctx, plan) {
  var width = ctx.sh.getLastColumn();
  if (plan.inserts.length) {
    var rows = plan.inserts.map(function (r) { return recordToRow_(r, ctx.idx, width); }), at = ctx.sh.getLastRow() + 1;
    textDateCols_(ctx.sh, ctx.idx, at, rows.length);
    ctx.sh.getRange(at, 1, rows.length, width).setValues(rows);
  }
  plan.updates.forEach(function (u) {
    var row = recordToRow_(u.rec, ctx.idx, width), cur = ctx.sh.getRange(u.row, 1, 1, width).getValues()[0];
    if (ctx.idx['Fila original'] !== undefined) row[ctx.idx['Fila original']] = cur[ctx.idx['Fila original']];
    textDateCols_(ctx.sh, ctx.idx, u.row, 1);
    ctx.sh.getRange(u.row, 1, 1, width).setValues([row]);
  });
}

function logControl_(marca, plat, mes, estado, motivo, origen, nivel) {
  var sh = getSheet_(LM.SHEETS.CONTROL, LM.HEADERS.CONTROL), idx = headerIndex_(sh), width = sh.getLastColumn();
  var row = new Array(width).fill('');
  function set(h, v) { if (idx[h] !== undefined) row[idx[h]] = v; }
  set('Marca', marca); set('Plataforma', plat); set('Mes', mes); set('Estado', estado); set('Motivo', scrub_(motivo));
  set('Origen', origen || 'Apps Script'); set('Revisión', 'Automático'); set('Fecha', new Date()); set('Nivel', nivel || 'INFO');
  sh.getRange(sh.getLastRow() + 1, 1, 1, width).setValues([row]);
}

function backupSpreadsheet_() {
  var ss = getSS_(), name = ss.getName() + ' — RESPALDO ' + Utilities.formatDate(new Date(), LM.TZ, 'yyyy-MM-dd HHmm');
  var file = DriveApp.getFileById(ss.getId()), copy = file.makeCopy(name);
  PropertiesService.getScriptProperties().setProperty('ULTIMO_RESPALDO', copy.getId());
  return copy.getId();
}

// ---------- Saldos diarios de seguidores (para cierres exactos hacia adelante) ----------
function normDate_(v) {
  return Object.prototype.toString.call(v) === '[object Date]' ? Utilities.formatDate(v, LM.TZ, 'yyyy-MM-dd') : String(v);
}
function readSnapshot_(marca, plat, fecha) {
  var sh = getSS_().getSheetByName(LM.SHEETS.SALDOS);
  if (!sh || sh.getLastRow() < 2) return null;
  var idx = headerIndex_(sh), out = null;
  sh.getRange(2, 1, sh.getLastRow() - 1, sh.getLastColumn()).getValues().forEach(function (r) {
    if (r[idx['Marca']] === marca && r[idx['Plataforma']] === plat && normDate_(r[idx['Fecha']]) === fecha) out = toNumber_(r[idx['Seguidores']]);
  });
  return out;
}
/** Guarda el saldo de hoy (una fila por Marca+Plataforma+Fecha; repetir actualiza, no duplica). */
function upsertSnapshot_(marca, plat, fecha, valor, nowIso) {
  var sh = getSheet_(LM.SHEETS.SALDOS, LM.HEADERS.SALDOS), idx = headerIndex_(sh), n = sh.getLastRow(), at = 0, width = sh.getLastColumn();
  if (n > 1) sh.getRange(2, 1, n - 1, width).getValues().forEach(function (r, i) {
    if (r[idx['Marca']] === marca && r[idx['Plataforma']] === plat && normDate_(r[idx['Fecha']]) === fecha) at = i + 2;
  });
  var row = new Array(width).fill(''); function s(h, v) { row[idx[h]] = v; }
  s('Marca', marca); s('Plataforma', plat); s('Fecha', fecha); s('Seguidores', valor); s('Fuente', 'Graph API followers_count'); s('Fecha extracción', nowIso);
  var target = at || n + 1;
  sh.getRange(target, 3, 1, 1).setNumberFormat('@');
  sh.getRange(target, 1, 1, width).setValues([row]);
}
