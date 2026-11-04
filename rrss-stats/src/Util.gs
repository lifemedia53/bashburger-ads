/** Utilidades puras (fechas America/Santiago, claves, números). */

function pad2_(n) { return (n < 10 ? '0' : '') + n; }

/** 'YYYY-MM' -> {y, m, first:'YYYY-MM-01', last:'YYYY-MM-DD', days} */
function monthInfo_(ym) {
  var p = String(ym).split('-'), y = Number(p[0]), m = Number(p[1]);
  if (!y || !m || m < 1 || m > 12) throw new Error('Mes inválido: ' + ym);
  var days = new Date(Date.UTC(y, m, 0)).getUTCDate();
  return { ym: y + '-' + pad2_(m), y: y, m: m, days: days,
    first: y + '-' + pad2_(m) + '-01', last: y + '-' + pad2_(m) + '-' + pad2_(days) };
}

function prevMonth_(ym) {
  var i = monthInfo_(ym), y = i.y, m = i.m - 1;
  if (m === 0) { m = 12; y--; }
  return y + '-' + pad2_(m);
}

/** Mes actual en America/Santiago como 'YYYY-MM'. `now` inyectable para pruebas. */
function currentMonth_(now) {
  return Utilities.formatDate(now || new Date(), LM.TZ, 'yyyy-MM');
}
function todayStr_(now) {
  return Utilities.formatDate(now || new Date(), LM.TZ, 'yyyy-MM-dd');
}

/** Offset (minutos) de America/Santiago en un instante UTC dado. */
function tzOffsetMin_(utcMs) {
  var z = Utilities.formatDate(new Date(utcMs), LM.TZ, 'Z'); // '-0300'
  var sign = z.charAt(0) === '-' ? -1 : 1;
  return sign * (Number(z.substr(1, 2)) * 60 + Number(z.substr(3, 2)));
}

/** Epoch (segundos) de las 00:00 locales (Santiago) de 'YYYY-MM-DD'. */
function localMidnightEpoch_(ymd) {
  var p = ymd.split('-'), guess = Date.UTC(+p[0], +p[1] - 1, +p[2]);
  var ms = guess - tzOffsetMin_(guess) * 60000;
  ms = guess - tzOffsetMin_(ms) * 60000; // segunda pasada por cambios de horario
  return Math.floor(ms / 1000);
}

/** Ventana [since, until) en epoch para un mes; si `capToday`, hasta hoy inclusive. */
function monthWindow_(ym, capToday, now) {
  var i = monthInfo_(ym), lastDay = i.last;
  if (capToday) {
    var t = todayStr_(now);
    if (t >= i.first && t < i.last) lastDay = t;
  }
  var p = lastDay.split('-'), nextDay = new Date(Date.UTC(+p[0], +p[1] - 1, +p[2] + 1));
  var nextStr = nextDay.getUTCFullYear() + '-' + pad2_(nextDay.getUTCMonth() + 1) + '-' + pad2_(nextDay.getUTCDate());
  return { since: localMidnightEpoch_(i.first), until: localMidnightEpoch_(nextStr),
    sinceStr: i.first, untilStr: lastDay, partial: lastDay !== i.last };
}

/** Parte [since, until) en tramos de <= maxDays días (para sumar solo métricas aditivas). */
function chunkWindow_(w, maxDays) {
  var out = [], step = maxDays * 86400, s = w.since;
  while (s < w.until) { out.push({ since: s, until: Math.min(s + step, w.until) }); s += step; }
  return out;
}

/** Clave única: Marca|Plataforma|Mes|Métrica (en minúsculas, sin espacios extra). */
function recordKey_(marca, plat, mes, metrica) {
  return [marca, plat, mes, metrica].map(function (s) {
    return String(s == null ? '' : s).trim().toLowerCase();
  }).join('|');
}

/** Número seguro: devuelve null si no es un número finito (nunca 0 por defecto). */
function toNumber_(v) {
  if (v === null || v === undefined || v === '') return null;
  var n = typeof v === 'number' ? v : Number(String(v).replace(/\./g, '').replace(',', '.'));
  return isFinite(n) ? n : null;
}

/** Quita tokens de cualquier texto antes de registrarlo. */
function scrub_(text) {
  return String(text == null ? '' : text)
    .replace(/(access_token=)[^&\s"']+/gi, '$1[OCULTO]')
    .replace(/(Bearer\s+)[A-Za-z0-9_\-\.]+/g, '$1[OCULTO]')
    .replace(/EAA[A-Za-z0-9]{20,}/g, '[OCULTO]')
    .slice(0, 500);
}

/** Suma n días a 'YYYY-MM-DD' (n puede ser negativo). */
function addDays_(ymd, n) {
  var p = ymd.split('-'), d = new Date(Date.UTC(+p[0], +p[1] - 1, +p[2] + n));
  return d.getUTCFullYear() + '-' + pad2_(d.getUTCMonth() + 1) + '-' + pad2_(d.getUTCDate());
}

/** Google Sheets convierte '2026-10' en fecha: se normaliza SIEMPRE antes de comparar claves. */
function isDate_(v) { return Object.prototype.toString.call(v) === '[object Date]'; }
/** Las fechas de las celdas están en la zona horaria DEL SPREADSHEET (puede diferir de la del script): se formatea con esa. */
function sheetTz_() {
  try { return getSS_().getSpreadsheetTimeZone() || LM.TZ; } catch (e) { return LM.TZ; }
}
function normMonth_(v) { return isDate_(v) ? Utilities.formatDate(v, sheetTz_(), 'yyyy-MM') : String(v == null ? '' : v).trim(); }
function normDay_(v) { return isDate_(v) ? Utilities.formatDate(v, sheetTz_(), 'yyyy-MM-dd') : String(v == null ? '' : v).trim(); }
