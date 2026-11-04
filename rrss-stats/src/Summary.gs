/** RESUMEN y DASHBOARD. Solo usan períodos VALIDADO/HISTÓRICO (o EXTRAÍDO si INCLUIR_NO_VALIDADOS=true). */

var RESUMEN_MAP = { 'Vistas': 'Vistas', 'Alcance': 'Alcance (revisar)', 'Interacciones': 'Interacciones',
  'Clics en enlaces': 'Clics en enlaces', 'Visitas al perfil': 'Visitas al perfil', 'Seguidores cierre': 'Seguidores cierre',
  'Nuevos seguidores': 'Nuevos seguidores', 'Bajas': 'Bajas', 'Vistas historias': 'Vistas historias', 'Mensajes': 'Mensajes',
  'Contactos iniciados': 'Contactos iniciados', 'Vistas orgánicas': 'Vistas orgánicas', 'Vistas Ads': 'Vistas Ads' };

/** Construye filas de RESUMEN desde registros; las celdas sin dato OK quedan vacías (jamás 0). */
function buildSummary_(records, allowedStates) {
  var groups = {};
  records.forEach(function (r) {
    if (allowedStates.indexOf(r.estado) < 0 || !RESUMEN_MAP[r.metrica]) return;
    var k = [r.marca, r.plat, r.mes].join('|');
    var g = groups[k] || (groups[k] = { marca: r.marca, plat: r.plat, mes: r.mes, vals: {}, estados: {}, fuentes: {} });
    if (r.estadoDato === LM.DATA.OK || r.estadoDato === LM.DATA.ZERO) g.vals[RESUMEN_MAP[r.metrica]] = r.valor;
    g.estados[r.estado] = true; g.fuentes[r.fuente] = true;
  });
  return Object.keys(groups).map(function (k) {
    var g = groups[k], est = Object.keys(g.estados);
    var estado = est.length === 1 ? est[0] : (est.indexOf(LM.PERIOD_STATES.PARTIAL) >= 0 ? LM.PERIOD_STATES.PARTIAL : LM.PERIOD_STATES.EXTRACTED);
    return { marca: g.marca, plat: g.plat, mes: g.mes, vals: g.vals, estado: estado, fuente: 'API Meta (REGISTROS)' };
  });
}

/** Actualiza RESUMEN: inserta/actualiza por Marca+Plataforma+Mes; nunca toca filas HISTÓRICO/VALIDADO. */
function updateResumen_(rows) {
  var sh = getSS_().getSheetByName(LM.SHEETS.RESUMEN);
  if (!sh) throw new Error('Falta la hoja RESUMEN');
  var idx = headerIndex_(sh), width = sh.getLastColumn(), n = sh.getLastRow(), data = n > 1 ? sh.getRange(2, 1, n - 1, width).getValues() : [];
  var pos = {}; data.forEach(function (r, i) { pos[[r[idx['Marca']], r[idx['Plataforma']], normMonth_(r[idx['Mes']])].join('|')] = { row: i + 2, estado: r[idx['Estado']] }; });
  var written = 0, skipped = 0;
  rows.forEach(function (s) {
    var k = [s.marca, s.plat, s.mes].join('|'), cur = pos[k];
    if (cur && LM.LOCKED_STATES.indexOf(cur.estado) >= 0) { skipped++; return; }
    var row = new Array(width).fill('');
    row[idx['Marca']] = s.marca; row[idx['Plataforma']] = s.plat; row[idx['Mes']] = s.mes;
    Object.keys(s.vals).forEach(function (h) { if (idx[h] !== undefined) row[idx[h]] = s.vals[h]; });
    row[idx['Estado']] = s.estado; row[idx['Fuente']] = s.fuente;
    var target = cur ? cur.row : sh.getLastRow() + 1;
    sh.getRange(target, idx['Mes'] + 1, 1, 1).setNumberFormat('@');
    sh.getRange(target, 1, 1, width).setValues([row]); written++;
  });
  return { written: written, skipped: skipped };
}

/** Lee REGISTROS como objetos de registro (para resumen). */
function readRecords_() {
  var ex = readExisting_(), n = ex.sh.getLastRow(), out = [];
  if (n < 2) return out;
  var idx = ex.idx, data = ex.sh.getRange(2, 1, n - 1, ex.sh.getLastColumn()).getValues();
  data.forEach(function (r) {
    out.push({ marca: r[idx['Marca']], plat: r[idx['Plataforma']], mes: normMonth_(r[idx['Mes']]), metrica: r[idx['Métrica']],
      valor: r[idx['Valor']] === '' ? null : r[idx['Valor']], estado: r[idx['Estado']], fuente: r[idx['Fuente']],
      estadoDato: r[idx['Estado dato']] || (r[idx['Valor']] === '' ? LM.DATA.NA : LM.DATA.OK) });
  });
  return out;
}

var DASH_ROWS = [['Vistas', 'Vistas'], ['Alcance (referencial)', 'Alcance (revisar)'], ['Interacciones', 'Interacciones'],
  ['Visitas al perfil', 'Visitas al perfil'], ['Seguidores al cierre', 'Seguidores cierre'], ['Clics en enlaces', 'Clics en enlaces']];

/** Valores del dashboard (puro): [{label, valor, anterior, abs, pct, estado}] */
function buildDashboard_(resumenRows, marca, plat, mes) {
  function find(m) { return resumenRows.filter(function (r) { return r.marca === marca && r.plat === plat && r.mes === m; })[0]; }
  var cur = find(mes), prev = find(prevMonth_(mes));
  return DASH_ROWS.map(function (d) {
    var v = cur ? toNumber_(cur.vals[d[1]]) : null, p = prev ? toNumber_(prev.vals[d[1]]) : null, vr = computeVariation_(v, p);
    return { label: d[0], valor: v, anterior: p, abs: vr.abs, pct: vr.pct, estado: cur ? cur.estado : 'SIN DATOS' };
  });
}

/** Escribe el DASHBOARD. Si una celda ya tiene fórmula no se pisa (se informa). Devuelve lista de celdas con fórmula. */
function updateDashboard_(marca, plat, mes) {
  var ss = getSS_(), sh = ss.getSheetByName(LM.SHEETS.DASHBOARD);
  if (!sh) throw new Error('Falta la hoja DASHBOARD');
  var resumen = readResumenAsRows_(), vals = buildDashboard_(resumen, marca, plat, mes), formulas = [];
  // Sin datos validados para ese mes: NO se toca el dashboard (no se pisa lo que ya muestra).
  if (vals.every(function (v) { return v.estado === 'SIN DATOS'; })) return formulas;
  var colA = sh.getRange(1, 1, Math.max(sh.getLastRow(), 15), 1).getValues().map(function (r) { return r[0]; });
  var head = colA.indexOf('INDICADORES') + 1;
  if (!head) throw new Error('No se encontró el encabezado INDICADORES en DASHBOARD');
  sh.getRange('D3').setNumberFormat('@');
  [['B3', marca], ['D3', mes], ['F3', plat]].forEach(function (c) { safeSet_(sh, c[0], c[1], formulas); });
  sh.getRange(head, 6).setValue('Variación abs.');
  vals.forEach(function (v, i) {
    var r = head + 1 + i, label = sh.getRange(r, 1).getValue();
    if (label !== v.label) return; // la fila no es la esperada: no se escribe
    safeSet_(sh, 'B' + r, v.valor, formulas); safeSet_(sh, 'C' + r, v.anterior, formulas);
    safeSet_(sh, 'D' + r, v.pct, formulas); safeSet_(sh, 'E' + r, v.estado, formulas);
    // Variación absoluta como FÓRMULA: se recalcula sola cuando se cambia el mes (D3), igual que el resto del dashboard.
    // Sin separadores de argumentos: funciona igual en cualquier configuración regional (es-CL usa ';', en-US usa ',').
    sh.getRange(r, 6).setFormula('=IFERROR(B' + r + '-C' + r + ')');
  });
  return formulas;
}
function safeSet_(sh, a1, value, formulas) {
  var c = sh.getRange(a1);
  if (c.getFormula()) { formulas.push(a1); return; }
  c.setValue(value === null || value === undefined ? 'S/D' : value);
}

function readResumenAsRows_() {
  var sh = getSS_().getSheetByName(LM.SHEETS.RESUMEN), idx = headerIndex_(sh), n = sh.getLastRow(), out = [];
  if (n < 2) return out;
  sh.getRange(2, 1, n - 1, sh.getLastColumn()).getValues().forEach(function (r) {
    var vals = {}; Object.keys(idx).forEach(function (h) { if (['Marca', 'Plataforma', 'Mes', 'Estado', 'Fuente'].indexOf(h) < 0 && r[idx[h]] !== '') vals[h] = r[idx[h]]; });
    out.push({ marca: r[idx['Marca']], plat: r[idx['Plataforma']], mes: normMonth_(r[idx['Mes']]), vals: vals, estado: r[idx['Estado']] });
  });
  return out;
}

/** Guarda contenido (CONTENIDOS) sin duplicar por Marca+Plataforma+ID contenido. */
function upsertContent_(rows, nowIso) {
  if (!rows.length) return 0;
  var sh = getSheet_(LM.SHEETS.CONTENIDOS, LM.HEADERS.CONTENIDOS), idx = headerIndex_(sh), width = sh.getLastColumn(), n = sh.getLastRow(), pos = {};
  if (n > 1) sh.getRange(2, 1, n - 1, width).getValues().forEach(function (r, i) { pos[[r[idx['Marca']], r[idx['Plataforma']], String(r[idx['ID contenido']])].join('|')] = i + 2; });
  var c = 0;
  rows.forEach(function (x) {
    var row = new Array(width).fill(''); function s(h, v) { if (idx[h] !== undefined) row[idx[h]] = v === null || v === undefined ? '' : v; }
    s('Marca', x.marca); s('Plataforma', x.plat); s('Mes', x.mes); s('Formato', x.formato); s('Fecha de publicación', x.fecha);
    s('ID contenido', x.id); s('URL', x.url); s('Vistas', x.vistas); s('Alcance', x.alcance); s('Interacciones', x.interacciones);
    s('Guardados', x.guardados); s('Compartidos', x.compartidos); s('Comentarios', x.comentarios); s('Reacciones', x.reacciones);
    s('Origen', x.origen); s('Estado', x.estado === LM.DATA.OK ? 'EXTRAÍDO' : 'SIN INSIGHTS'); s('Fecha extracción', nowIso);
    var k = [x.marca, x.plat, x.id].join('|'), at = pos[k] || sh.getLastRow() + 1;
    ['Mes', 'Fecha de publicación', 'ID contenido'].forEach(function (h) { if (idx[h] !== undefined) sh.getRange(at, idx[h] + 1, 1, 1).setNumberFormat('@'); });
    sh.getRange(at, 1, 1, width).setValues([row]); pos[k] = at; c++;
  });
  return c;
}

/**
 * Ajusta una fórmula del DASHBOARD para que una celda VACÍA de RESUMEN no se muestre como 0: agrega al COUNTIFS el criterio
 * "no vacío" de la columna de la métrica. Respeta el separador de la fórmula (',' o ';'). Idempotente; null si no aplica.
 */
function dashFixBlank_(f) {
  if (!f || f.indexOf('"<>"') >= 0) return null;
  var m = f.match(/SUMIFS\(RESUMEN!([A-Z]+)\$2:/), at = f.indexOf(')=0');
  if (!m || at < 0 || f.indexOf('COUNTIFS(') < 0) return null;
  var sep = f.indexOf(';') >= 0 ? ';' : ',';
  return f.slice(0, at) + sep + 'RESUMEN!' + m[1] + '$2:' + m[1] + '1000' + sep + '"<>"' + f.slice(at);
}

/** Reparación única del DASHBOARD (con respaldo): vacío ≠ 0 en B y C, y "Variación abs." con fórmula sin separadores. */
function repararDashboard() {
  return lock_(function () {
    var backup = backupSpreadsheet_(), sh = getSS_().getSheetByName(LM.SHEETS.DASHBOARD), n = Math.max(sh.getLastRow(), 15), fixed = 0, abs = 0;
    for (var r = 5; r <= n; r++) {
      var bf = sh.getRange(r, 2).getFormula();
      if (!bf || bf.indexOf('SUMIFS(') < 0) continue;
      [2, 3].forEach(function (c) {
        var cell = sh.getRange(r, c), f = cell.getFormula(), nf = dashFixBlank_(f);
        if (nf) { cell.setFormula(nf); fixed++; }
      });
      sh.getRange(r, 6).setFormula('=IFERROR(B' + r + '-C' + r + ')'); abs++;
    }
    logControl_('', '', '', 'REPARACIÓN', 'DASHBOARD: respaldo ' + backup + '; fórmulas B/C ajustadas: ' + fixed + '; variación abs.: ' + abs, 'repararDashboard', 'INFO');
    return 'Respaldo: ' + backup + ' | fórmulas ajustadas: ' + fixed + ' | variación abs.: ' + abs;
  });
}
