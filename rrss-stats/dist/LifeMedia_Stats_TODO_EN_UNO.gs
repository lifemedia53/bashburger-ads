
// ======== Config.gs ========
/**
 * Life Media | Estadísticas RRSS — configuración central.
 * NINGÚN secreto aquí. Tokens: Propiedades del script (ver docs/SETUP.md).
 */
var LM = {
  TZ: 'America/Santiago',
  GRAPH_BASE: 'https://graph.facebook.com/',
  DEFAULT_API_VERSION: 'v23.0', // se puede cambiar con la propiedad META_API_VERSION
  SPREADSHEET_ID: '10fF2P9B7SjubbRau4x4P8zUpcL3EJ_u_ELZdL17W2-8', // no es secreto
  MAX_RETRIES: 4,
  RETRY_BASE_MS: 1000,
  RETRYABLE_CODES: [1, 2, 4, 17, 32, 341, 613], // errores transitorios de Graph
  SHEETS: {
    DASHBOARD: 'DASHBOARD', RESUMEN: 'RESUMEN', REGISTROS: 'REGISTROS',
    CONTENIDOS: 'CONTENIDOS', CONFIG: 'CONFIG', CONTROL: 'CONTROL',
    DICCIONARIO: 'DICCIONARIO', DISPONIBILIDAD: 'DISPONIBILIDAD', DIFERENCIAS: 'DIFERENCIAS_BSUITE', MANUALES: 'MANUALES', SALDOS: 'SALDOS_SEGUIDORES'
  },
  // Columnas existentes primero (no se reordenan); las nuevas se agregan a la derecha.
  HEADERS: {
    REGISTROS: ['Marca', 'Plataforma', 'Mes', 'Inicio', 'Fin', 'Métrica', 'Valor', 'Fuente', 'Estado',
      'Regla', 'Fila original', 'Observaciones', 'Fecha extracción', 'Clave', 'Estado dato', 'Detalle técnico'],
    CONTROL: ['Marca', 'Plataforma', 'Mes', 'Estado', 'Motivo', 'Origen', 'Revisión', 'Fecha', 'Nivel'],
    CONFIG_EXTRA: ['Cuenta publicitaria (act_)', 'Page ID vinculado', 'Última extracción OK', 'Último error'],
    CONTENIDOS: ['Marca', 'Plataforma', 'Mes', 'Formato', 'Fecha de publicación', 'ID contenido', 'URL', 'Vistas',
      'Alcance', 'Interacciones', 'Guardados', 'Compartidos', 'Comentarios', 'Reacciones', 'Origen', 'Estado',
      'Fecha extracción'],
    SALDOS: ['Marca', 'Plataforma', 'Fecha', 'Seguidores', 'Fuente', 'Fecha extracción'],
    MANUALES: ['Marca', 'Plataforma', 'Mes', 'Métrica', 'Valor', 'Fuente', 'Estado'],
    DISPONIBILIDAD: ['Fecha', 'Marca', 'Plataforma', 'Métrica API', 'Resultado', 'Detalle'],
    DIFERENCIAS: ['Marca', 'Plataforma', 'Mes', 'Métrica', 'Valor API', 'Valor Business Suite', 'Diferencia',
      'Diferencia %', 'Nota', 'Fecha']
  },
  // Estados del PERÍODO (columna "Estado" de REGISTROS). Los bloqueados jamás se sobrescriben.
  LOCKED_STATES: ['HISTÓRICO', 'VALIDADO'],
  PERIOD_STATES: { PARTIAL: 'PARCIAL', EXTRACTED: 'EXTRAÍDO', VALIDATED: 'VALIDADO', HISTORIC: 'HISTÓRICO' },
  // Estados del DATO (columna "Estado dato"): nunca confundir cero con falta de dato.
  DATA: { OK: 'OK', ZERO: 'CERO', NA: 'NO DISPONIBLE', ERROR: 'ERROR', PENDING: 'PENDIENTE' }
};

/**
 * Catálogo de métricas. `verificada:false` = documentada pero no comprobada con datos reales;
 * la función probeMetrics() registra la disponibilidad real en la hoja DISPONIBILIDAD.
 * regla: SUMA | NO_ADITIVO (reconsultar mes completo) | SALDO (cierre) | TEXTO
 * concepto: TOTAL (orgánico+pago según definición Meta) | ADS (solo Marketing API) — nunca se mezclan.
 */
var CATALOG = [
  // ---- Instagram (Graph API /{ig-user-id}/insights, metric_type=total_value) ----
  { key: 'ig_views', plat: 'Instagram', metrica: 'Vistas', api: 'views', regla: 'SUMA', concepto: 'TOTAL', verificada: false },
  { key: 'ig_reach', plat: 'Instagram', metrica: 'Alcance', api: 'reach', regla: 'NO_ADITIVO', concepto: 'TOTAL', verificada: false },
  { key: 'ig_interactions', plat: 'Instagram', metrica: 'Interacciones', api: 'total_interactions', regla: 'SUMA', concepto: 'TOTAL', verificada: false },
  { key: 'ig_engaged', plat: 'Instagram', metrica: 'Cuentas involucradas', api: 'accounts_engaged', regla: 'NO_ADITIVO', concepto: 'TOTAL', verificada: false },
  { key: 'ig_profile_views', plat: 'Instagram', metrica: 'Visitas al perfil', api: 'profile_views', regla: 'SUMA', concepto: 'TOTAL', verificada: false },
  { key: 'ig_link_taps', plat: 'Instagram', metrica: 'Toques en enlaces del perfil (API)', api: 'profile_links_taps', regla: 'SUMA', concepto: 'TOTAL', verificada: false },
  { key: 'ig_new_follows', plat: 'Instagram', metrica: 'Nuevos seguidores', api: 'follows_and_unfollows', breakdown: 'follow_type', pick: 'FOLLOWER', regla: 'SUMA', concepto: 'TOTAL', verificada: false,
    nota: 'Mapeo FOLLOWER=nuevos inferido (557 en días 1-30 vs 572 en Business Suite mes completo); validar.' },
  { key: 'ig_unfollows', plat: 'Instagram', metrica: 'Bajas', api: 'follows_and_unfollows', breakdown: 'follow_type', pick: 'NON_FOLLOWER', regla: 'SUMA', concepto: 'TOTAL', verificada: false,
    nota: 'Mapeo NON_FOLLOWER=bajas inferido por magnitud (agosto: 1024 bajas); validar contra seguidores netos.' },
  // ---- Facebook (Graph API /{page-id}/insights) ----
  { key: 'fb_views', plat: 'Facebook', metrica: 'Vistas', api: 'page_media_view', regla: 'SUMA', concepto: 'TOTAL', verificada: false },
  { key: 'fb_reach', plat: 'Facebook', metrica: 'Alcance', api: 'page_total_media_view_unique', regla: 'NO_ADITIVO', concepto: 'TOTAL', verificada: false },
  { key: 'fb_interactions', plat: 'Facebook', metrica: 'Acciones en publicaciones (API)', api: 'page_post_engagements', regla: 'SUMA', concepto: 'TOTAL', verificada: false },
  { key: 'fb_profile_views', plat: 'Facebook', metrica: 'Visitas al perfil', api: 'page_views_total', regla: 'SUMA', concepto: 'TOTAL', verificada: false },
  { key: 'fb_new_follows', plat: 'Facebook', metrica: 'Nuevos seguidores', api: 'page_daily_follows_unique', regla: 'SUMA', concepto: 'TOTAL', verificada: false },
  { key: 'fb_unfollows', plat: 'Facebook', metrica: 'Bajas', api: 'page_daily_unfollows_unique', regla: 'SUMA', concepto: 'TOTAL', verificada: false },
  // ---- Publicidad (Marketing API /act_{id}/insights, SOLO lectura; concepto distinto) ----
  { key: 'ads_impressions', plat: '*', metrica: 'Vistas Ads', api: 'impressions', regla: 'SUMA', concepto: 'ADS', verificada: false },
  { key: 'ads_link_clicks', plat: '*', metrica: 'Clics en enlaces Ads', api: 'inline_link_clicks', regla: 'SUMA', concepto: 'ADS', verificada: false },
  { key: 'ads_reach', plat: '*', metrica: 'Alcance Ads', api: 'reach', regla: 'NO_ADITIVO', concepto: 'ADS', verificada: false }
];

/** Métricas SIN equivalente oficial verificado: se registran como NO DISPONIBLE con su alternativa. */
var LIMITATIONS = [
  { plat: 'Instagram', metrica: 'Vistas orgánicas / Alcance orgánico', motivo: 'El endpoint de insights de cuenta no separa orgánico y pago. Alternativa: Marketing API entrega la parte de anuncios (Vistas Ads / Alcance Ads) como concepto aparte; no se resta para "inventar" el orgánico.' },
  { plat: 'Instagram', metrica: 'Nuevos seguidores / Bajas', motivo: 'La API da el cambio neto diario (follower_count, últimos 30 días) y follows_and_unfollows por tipo; equivalencia con Business Suite sin verificar. Alternativa: saldo diario (snapshot) y cambio neto.' },
  { plat: 'Ambas', metrica: 'Mensajes / Contactos iniciados', motivo: 'Requiere Messaging API (instagram_manage_messages / pages_messaging) y su definición difiere de "contactos iniciados" de Business Suite. Alternativa: contar conversaciones nuevas por /conversations; registrar como PENDIENTE hasta validar.' },
  { plat: 'Instagram', metrica: 'Historias', motivo: 'Los insights de historias solo existen mientras están activas (24 h). La extracción diaria las captura en CONTENIDOS; si un día no corre, ese dato se pierde.' }
];

// ======== Util.gs ========
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
function normMonth_(v) { return isDate_(v) ? Utilities.formatDate(v, LM.TZ, 'yyyy-MM') : String(v == null ? '' : v).trim(); }
function normDay_(v) { return isDate_(v) ? Utilities.formatDate(v, LM.TZ, 'yyyy-MM-dd') : String(v == null ? '' : v).trim(); }

// ======== MetaApi.gs ========
/** Cliente Graph / Marketing API (solo lectura). Token SIEMPRE desde Propiedades del script. */

function getToken_(marca) {
  var props = PropertiesService.getScriptProperties();
  var t = (marca && props.getProperty('META_TOKEN_' + String(marca).toUpperCase().replace(/[^A-Z0-9]/g, '_'))) ||
    props.getProperty('META_ACCESS_TOKEN');
  if (!t) throw new MetaError_('Falta la propiedad META_ACCESS_TOKEN (ver docs/SETUP.md)', 0, 'NO_TOKEN', false);
  return t;
}
function apiVersion_() {
  return PropertiesService.getScriptProperties().getProperty('META_API_VERSION') || LM.DEFAULT_API_VERSION;
}

function MetaError_(message, code, kind, retryable) {
  this.name = 'MetaError'; this.message = scrub_(message); this.code = code; this.kind = kind; this.retryable = !!retryable;
}
MetaError_.prototype = Object.create(Error.prototype);

function buildQuery_(params) {
  return Object.keys(params || {}).filter(function (k) { return params[k] !== undefined && params[k] !== null; })
    .map(function (k) { return encodeURIComponent(k) + '=' + encodeURIComponent(params[k]); }).join('&');
}

/**
 * GET con reintentos exponenciales. Token por cabecera (no queda en URLs ni logs).
 * Devuelve el JSON; lanza MetaError_ con kind: PERMISO | NO_DISPONIBLE | TRANSITORIO | ERROR.
 */
function metaGet_(path, params, token) {
  var url = LM.GRAPH_BASE + apiVersion_() + '/' + path + '?' + buildQuery_(params);
  var last;
  for (var attempt = 0; attempt <= LM.MAX_RETRIES; attempt++) {
    var resp;
    try {
      resp = UrlFetchApp.fetch(url, { method: 'get', muteHttpExceptions: true,
        headers: { Authorization: 'Bearer ' + token } });
    } catch (e) {
      last = new MetaError_('Red: ' + e.message, 0, 'TRANSITORIO', true);
      if (attempt < LM.MAX_RETRIES) { Utilities.sleep(LM.RETRY_BASE_MS * Math.pow(2, attempt)); continue; }
      throw last;
    }
    var status = resp.getResponseCode(), body;
    try { body = JSON.parse(resp.getContentText()); } catch (e2) { body = {}; }
    if (status >= 200 && status < 300 && !body.error) return body;
    var err = body.error || {}, code = err.code || status, sub = err.error_subcode;
    var retryable = status >= 500 || status === 429 || LM.RETRYABLE_CODES.indexOf(code) >= 0;
    var kind = retryable ? 'TRANSITORIO' : (code === 10 || code === 200 || (code >= 200 && code < 300)) ? 'PERMISO'
      : (code === 100 || code === 3001 || status === 400) ? 'NO_DISPONIBLE' : 'ERROR';
    last = new MetaError_('HTTP ' + status + ' código ' + code + (sub ? '/' + sub : '') + ': ' + (err.message || 'sin detalle'), code, kind, retryable);
    if (retryable && attempt < LM.MAX_RETRIES) { Utilities.sleep(LM.RETRY_BASE_MS * Math.pow(2, attempt)); continue; }
    throw last;
  }
  throw last;
}

/** Lectura paginada (sigue paging.next hasta `maxPages`). */
function metaGetAll_(path, params, token, maxPages) {
  var out = [], res = metaGet_(path, params, token), pages = 1;
  (res.data || []).forEach(function (d) { out.push(d); });
  while (res.paging && res.paging.cursors && res.paging.next && pages < (maxPages || 10)) {
    var p = {}; Object.keys(params || {}).forEach(function (k) { p[k] = params[k]; });
    p.after = res.paging.cursors.after;
    res = metaGet_(path, p, token); pages++;
    (res.data || []).forEach(function (d) { out.push(d); });
  }
  return out;
}

/** Token de página (necesario para Page Insights con token de usuario de sistema). En memoria, no se guarda. */
function pageToken_(pageId, token) {
  try { var r = metaGet_(String(pageId), { fields: 'access_token' }, token); return r.access_token || token; }
  catch (e) { return token; }
}

// ======== Extractors.gs ========
/**
 * Extractores. Cada uno devuelve [{key, status, value, detail}] y NUNCA lanza por una métrica:
 * un fallo de una métrica queda como NO DISPONIBLE / ERROR en su propio resultado.
 * status ∈ LM.DATA (OK, CERO, NO DISPONIBLE, ERROR, PENDIENTE).
 */

/** Extrae el valor numérico de una respuesta de insights (total_value o serie de valores). */
function parseInsightValue_(item, regla, pick) {
  if (!item) return { ok: false, detail: 'La API no devolvió la métrica' };
  if (pick) {
    var br = item.total_value && item.total_value.breakdowns && item.total_value.breakdowns[0], hit = null;
    ((br && br.results) || []).forEach(function (x) { if ((x.dimension_values || [])[0] === pick) hit = toNumber_(x.value); });
    return hit === null ? { ok: false, detail: 'Sin resultado para ' + pick + ' en el desglose' } : { ok: true, value: hit };
  }
  if (item.total_value && item.total_value.value !== undefined) {
    var n = toNumber_(item.total_value.value);
    return n === null ? { ok: false, detail: 'total_value no numérico' } : { ok: true, value: n };
  }
  if (item.values && item.values.length) {
    var vals = item.values.map(function (v) { return toNumber_(v.value); });
    if (vals.some(function (v) { return v === null; })) return { ok: false, detail: 'serie con valores no numéricos' };
    if (regla === 'SUMA') return { ok: true, value: vals.reduce(function (a, b) { return a + b; }, 0) };
    if (item.period === 'total_over_range' || vals.length === 1) return { ok: true, value: vals[0] };
    return { ok: false, detail: 'métrica no aditiva solo disponible por día: no se suma' };
  }
  return { ok: false, detail: 'respuesta sin valores' };
}

function resultFrom_(key, parsed) {
  if (!parsed.ok) return { key: key, status: LM.DATA.NA, value: null, detail: parsed.detail };
  return { key: key, status: parsed.value === 0 ? LM.DATA.ZERO : LM.DATA.OK, value: parsed.value, detail: parsed.note || '' };
}
function failureFrom_(key, e) {
  var st = e.kind === 'NO_DISPONIBLE' ? LM.DATA.NA : LM.DATA.ERROR;
  return { key: key, status: st, value: null, detail: scrub_(e.message || e) };
}

/** Una métrica de insights para una ventana; si el rango completo falla y la métrica es SUMA, se trocea (≤30 días). */
function fetchInsight_(path, entry, w, token, baseParams) {
  function one(win) {
    var p = {}; Object.keys(baseParams).forEach(function (k) { p[k] = baseParams[k]; });
    p.metric = entry.api; p.since = win.since; p.until = win.until;
    if (entry.breakdown) p.breakdown = entry.breakdown;
    var res = metaGet_(path, p, token);
    return parseInsightValue_((res.data || [])[0], entry.regla, entry.pick);
  }
  try { return one(w); } catch (e) {
    if (entry.regla === 'NO_ADITIVO' && e.kind === 'NO_DISPONIBLE' && (w.until - w.since) > 30 * 86400) {
      // Límite de la API: máx. 30 días. NO se suma por tramos ni se estima: se consulta UNA ventana de 30 días (días 1-30) y se rotula.
      var rr = null;
      try { rr = one({ since: w.since, until: w.since + 30 * 86400 }); } catch (e3) { rr = null; }
      if (rr && rr.ok) return { ok: true, value: rr.value, note: 'Ventana días 1-30 (límite API de 30 días); el mes tiene 31 días. No es el mes completo.' };
      return { ok: false, detail: 'Límite de la API: máx. 30 días entre since y until y el mes tiene más; la ventana de 30 días también falló.' };
    }
    if (e.kind === 'TRANSITORIO' || e.kind === 'PERMISO' || entry.regla !== 'SUMA') throw e;
    var total = 0, chunks = chunkWindow_(w, 30);
    for (var i = 0; i < chunks.length; i++) {
      var r = one(chunks[i]);
      if (!r.ok) return r;
      total += r.value;
    }
    return { ok: true, value: total, chunked: true };
  }
}

function extractInstagram_(account, ym, now) {
  var token = getToken_(account.marca), w = monthWindow_(ym, true, now), out = [];
  CATALOG.filter(function (c) { return c.plat === 'Instagram'; }).forEach(function (c) {
    try {
      var r = fetchInsight_(account.id + '/insights', c, w, token, { metric_type: 'total_value', period: 'day' });
      var res = resultFrom_(c.key, r); if (r.chunked) res.detail = 'Suma de tramos de 30 días (métrica aditiva)';
      out.push(res);
    } catch (e) { out.push(failureFrom_(c.key, e)); }
  });
  out.push(extractFollowersSnapshot_(account, token, ym, now));
  out.push(extractBestHours_(account, token));
  return out;
}

/** Seguidores totales = saldo. Hoy: followers_count. Cierre de mes pasado: ver deriveClosingFollowers_. */
function extractFollowersSnapshot_(account, token, ym, now) {
  try {
    var u = metaGet_(account.id, { fields: 'followers_count,username' }, token);
    var n = toNumber_(u.followers_count);
    if (n === null) return { key: 'ig_followers_now', status: LM.DATA.NA, value: null, detail: 'followers_count ausente' };
    return { key: 'ig_followers_now', status: LM.DATA.OK, value: n, detail: 'Saldo al ' + todayStr_(now) };
  } catch (e) { return failureFrom_('ig_followers_now', e); }
}

/**
 * Seguidores al cierre de un mes terminado, DERIVADO: followers_count actual menos el cambio neto diario
 * (follower_count, solo últimos 30 días) posterior al cierre. Si faltan días, NO DISPONIBLE (no se inventa).
 */
function deriveClosingFollowers_(currentFollowers, netDailyChanges, closingDate, todayDate) {
  var days = Object.keys(netDailyChanges).filter(function (d) { return d > closingDate && d <= todayDate; });
  var expected = daysBetween_(closingDate, todayDate);
  if (days.length < expected) return { ok: false, detail: 'Faltan ' + (expected - days.length) + ' días de cambio neto: el cierre quedó fuera de la ventana de 30 días' };
  var sum = days.reduce(function (a, d) { return a + netDailyChanges[d]; }, 0);
  return { ok: true, value: currentFollowers - sum };
}
function daysBetween_(a, b) {
  var pa = a.split('-'), pb = b.split('-');
  return Math.round((Date.UTC(+pb[0], +pb[1] - 1, +pb[2]) - Date.UTC(+pa[0], +pa[1] - 1, +pa[2])) / 86400000);
}

function extractBestHours_(account, token) {
  try {
    var res = metaGet_(account.id + '/insights', { metric: 'online_followers', period: 'lifetime' }, token);
    var vals = ((res.data || [])[0] || {}).values || [];
    var hours = vals.length ? vals[vals.length - 1].value : null;
    if (!hours || typeof hours !== 'object') return { key: 'ig_best_hours', status: LM.DATA.NA, value: null, detail: 'online_followers sin datos' };
    var top = Object.keys(hours).sort(function (a, b) { return hours[b] - hours[a]; }).slice(0, 3);
    return { key: 'ig_best_hours', status: LM.DATA.OK, value: top.map(function (h) { return h + 'h'; }).join(', '),
      detail: 'Top 3 horas; online_followers es una instantánea reciente, no del mes' };
  } catch (e) { return failureFrom_('ig_best_hours', e); }
}

function extractFacebook_(account, ym, now) {
  var token = pageToken_(account.id, getToken_(account.marca)), w = monthWindow_(ym, true, now), out = [];
  CATALOG.filter(function (c) { return c.plat === 'Facebook'; }).forEach(function (c) {
    try {
      out.push(resultFrom_(c.key, fetchInsight_(account.id + '/insights', c, w, token, { period: 'total_over_range' })));
    } catch (e) {
      if (e.kind === 'NO_DISPONIBLE' && c.regla === 'SUMA') {
        try { out.push(resultFrom_(c.key, fetchInsight_(account.id + '/insights', c, w, token, { period: 'day' }))); }
        catch (e2) { out.push(failureFrom_(c.key, e2)); }
      } else out.push(failureFrom_(c.key, e));
    }
  });
  try {
    var p = metaGet_(account.id, { fields: 'followers_count' }, token), n = toNumber_(p.followers_count);
    out.push(n === null ? { key: 'fb_followers_now', status: LM.DATA.NA, value: null, detail: 'followers_count ausente' }
      : { key: 'fb_followers_now', status: LM.DATA.OK, value: n, detail: 'Saldo al ' + todayStr_(now) });
  } catch (e3) { out.push(failureFrom_('fb_followers_now', e3)); }
  return out;
}

/** Publicidad (Marketing API, solo lectura). Concepto ADS: nunca se mezcla con el total orgánico/mixto. */
function extractAds_(account, ym, now) {
  var ads = CATALOG.filter(function (c) { return c.concepto === 'ADS'; });
  if (!account.adAccount) {
    return ads.map(function (c) { return { key: c.key, status: LM.DATA.PENDING, value: null, detail: 'Sin cuenta publicitaria en CONFIG' }; });
  }
  var token = getToken_(account.marca), w = monthWindow_(ym, true, now), out = [];
  var acct = 'act_' + String(account.adAccount).replace(/^act_/, '');
  try {
    var rows = metaGetAll_(acct + '/insights', { fields: 'impressions,reach,inline_link_clicks', breakdowns: 'publisher_platform', level: 'account',
      time_range: JSON.stringify({ since: w.sinceStr, until: w.untilStr }) }, token, 5);
    var want = account.plat === 'Instagram' ? 'instagram' : 'facebook';
    var row = rows.filter(function (r) { return r.publisher_platform === want; })[0];
    ads.forEach(function (c) {
      if (!row) { out.push({ key: c.key, status: LM.DATA.ZERO, value: 0, detail: 'Sin fila de entrega en ' + want + ' para el período' }); return; }
      var n = toNumber_(row[c.api]);
      out.push(n === null ? { key: c.key, status: LM.DATA.NA, value: null, detail: c.api + ' ausente' }
        : { key: c.key, status: n === 0 ? LM.DATA.ZERO : LM.DATA.OK, value: n, detail: 'Marketing API, publisher_platform=' + want });
    });
  } catch (e) { ads.forEach(function (c) { out.push(failureFrom_(c.key, e)); }); }
  return out;
}

/** Contenido del mes (IG feed/reels) + historias activas. Devuelve filas para CONTENIDOS. */
function extractContent_(account, ym, now) {
  var token = getToken_(account.marca), w = monthWindow_(ym, true, now), rows = [];
  if (account.plat !== 'Instagram') return rows;
  metaGetAll_(account.id + '/media', { fields: 'id,media_type,media_product_type,permalink,timestamp,like_count,comments_count',
    since: w.since, until: w.until, limit: 50 }, token, 6).forEach(function (m) { rows.push(contentRowIG_(account, ym, m, token)); });
  try {
    metaGetAll_(account.id + '/stories', { fields: 'id,media_type,permalink,timestamp' }, token, 2)
      .forEach(function (s) { s.media_product_type = 'STORY'; rows.push(contentRowIG_(account, ym, s, token)); });
  } catch (e) { /* sin historias activas o sin permiso */ }
  return rows;
}

function contentRowIG_(account, ym, m, token) {
  var fmt = m.media_product_type === 'REELS' ? 'Reel' : m.media_product_type === 'STORY' ? 'Historia'
    : m.media_type === 'CAROUSEL_ALBUM' ? 'Carrusel' : 'Publicación';
  var metrics = m.media_product_type === 'STORY' ? 'views,reach,replies,total_interactions' : 'views,reach,total_interactions,saved,shares';
  var ins = {}, estado = LM.DATA.OK;
  try {
    (metaGet_(m.id + '/insights', { metric: metrics }, token).data || []).forEach(function (d) {
      ins[d.name] = d.values && d.values[0] ? toNumber_(d.values[0].value) : (d.total_value ? toNumber_(d.total_value.value) : null);
    });
  } catch (e) { estado = LM.DATA.NA; }
  function g(k) { return ins[k] === undefined ? null : ins[k]; }
  return { marca: account.marca, plat: 'Instagram', mes: (m.timestamp || '').slice(0, 7) || ym, formato: fmt,
    fecha: (m.timestamp || '').slice(0, 10), id: String(m.id), url: m.permalink || '',
    vistas: g('views'), alcance: g('reach'),
    interacciones: g('total_interactions') !== null ? g('total_interactions')
      : (m.like_count != null ? m.like_count + (m.comments_count || 0) : null),
    guardados: g('saved'), compartidos: g('shares'),
    comentarios: m.comments_count == null ? null : m.comments_count, reacciones: m.like_count == null ? null : m.like_count,
    origen: 'Graph API /media + /insights', estado: estado };
}

/** Mejor contenido del mes: mayor Vistas; si ninguno tiene vistas, mayor Interacciones. null si no hay contenido. */
function bestContent_(rows) {
  var withViews = rows.filter(function (r) { return r.vistas != null; });
  var pool = withViews.length ? withViews : rows.filter(function (r) { return r.interacciones != null; });
  var key = withViews.length ? 'vistas' : 'interacciones';
  if (!pool.length) return null;
  pool = pool.slice().sort(function (a, b) { return b[key] - a[key]; });
  return { row: pool[0], criterio: key };
}

/** Cierre de seguidores de un mes terminado, 100% automático: 1) snapshot diario del día 1 siguiente; 2) derivado de cambios netos. */
function resolveClosingFollowers_(account, ym, now) {
  var key = account.plat === 'Instagram' ? 'ig_followers_closing' : 'fb_followers_closing', closing = monthInfo_(ym).last;
  try {
    var next = addDays_(closing, 1), snap = readSnapshot_(account.marca, account.plat, next);
    if (snap !== null) return { key: key, status: snap === 0 ? LM.DATA.ZERO : LM.DATA.OK, value: snap, detail: 'Snapshot diario del ' + next + ' (≈ cierre; hasta ~6 h después)' };
    var today = todayStr_(now), through = addDays_(today, -1);
    if (daysBetween_(closing, today) > 28) return { key: key, status: LM.DATA.NA, value: null, detail: 'Cierre fuera de la ventana de 30 días de Meta y sin snapshot guardado' };
    var token = getToken_(account.marca), tk = account.plat === 'Facebook' ? pageToken_(account.id, token) : token;
    var cur = toNumber_(metaGet_(account.id, { fields: 'followers_count' }, tk).followers_count);
    if (cur === null) return { key: key, status: LM.DATA.NA, value: null, detail: 'followers_count ausente' };
    var since = localMidnightEpoch_(next), until = Math.floor((now || new Date()).getTime() / 1000), net = {};
    function addSeries(metric, sign) {
      var res = metaGet_(account.id + '/insights', { metric: metric, period: 'day', since: since, until: until }, tk);
      (((res.data || [])[0] || {}).values || []).forEach(function (v) {
        var n = toNumber_(v.value); if (n === null || !v.end_time) return;
        var day = addDays_(String(v.end_time).slice(0, 10), -1); net[day] = (net[day] || 0) + sign * n;
      });
    }
    if (account.plat === 'Instagram') addSeries('follower_count', 1);
    else { addSeries('page_daily_follows_unique', 1); addSeries('page_daily_unfollows_unique', -1); }
    var r = deriveClosingFollowers_(cur, net, closing, through);
    if (!r.ok) return { key: key, status: LM.DATA.NA, value: null, detail: r.detail };
    return { key: key, status: LM.DATA.OK, value: r.value, detail: 'DERIVADO: followers_count actual (' + cur + ') menos el cambio neto diario posterior al cierre; error posible de ±1 día de cambio neto por el corte horario de Meta' };
  } catch (e) { return failureFrom_(key, e); }
}

// ======== Normalize.gs ========
/** Normalización: resultados crudos -> registros con marca, plataforma, período, métrica, valor, origen. */

function catalogByKey_(key) {
  for (var i = 0; i < CATALOG.length; i++) if (CATALOG[i].key === key) return CATALOG[i];
  return null;
}

/**
 * @param account {marca, plat}
 * @param ym 'YYYY-MM'
 * @param results [{key,status,value,detail}]
 * @param ctx {periodState, nowIso, now}  periodState = PARCIAL (mes en curso) | EXTRAÍDO (mes cerrado)
 */
function toRecords_(account, ym, results, ctx) {
  var info = monthInfo_(ym), recs = [], seen = {};
  function push(metrica, valor, estadoDato, regla, fuente, obs, detalle) {
    var clave = recordKey_(account.marca, account.plat, ym, metrica);
    if (seen[clave]) return; seen[clave] = true;
    recs.push({ marca: account.marca, plat: account.plat, mes: ym, inicio: info.first,
      fin: ctx.periodState === LM.PERIOD_STATES.PARTIAL ? todayStr_(ctx.now) : info.last,
      metrica: metrica, valor: estadoDato === LM.DATA.OK || estadoDato === LM.DATA.ZERO ? valor : null,
      fuente: fuente, estado: ctx.periodState, regla: regla, obs: obs || '', extraidoEn: ctx.nowIso,
      clave: clave, estadoDato: estadoDato, detalle: scrub_(detalle || '') });
  }
  results.forEach(function (r) {
    var c = catalogByKey_(r.key);
    if (c) {
      if (c.plat !== '*' && c.plat !== account.plat) return;
      var fuente = c.concepto === 'ADS' ? 'Marketing API /insights (' + c.api + ')'
        : (account.plat === 'Instagram' ? 'Instagram Graph API /insights (' + c.api + ')' : 'Facebook Page Insights (' + c.api + ')');
      var obs = c.concepto === 'ADS' ? 'Solo anuncios. Concepto distinto al total; no mezclar con orgánico.' : '';
      if (c.nota) obs = (obs ? obs + ' ' : '') + c.nota;
      if (/Ventana días 1-30/.test(r.detail || '')) obs = (obs ? obs + ' ' : '') + 'ALCANCE DE 30 DE 31 DÍAS (límite de la API); mismo criterio todos los meses de 31 días.';
      if (c.regla === 'NO_ADITIVO') obs = (obs ? obs + ' ' : '') + 'No aditivo: consultado sobre el período completo, no suma de días.';
      push(c.metrica, r.value, r.status, c.regla === 'SUMA' ? 'aditivo' : 'no aditivo', fuente, obs, r.detail);
    } else if (r.key === 'ig_followers_now' || r.key === 'fb_followers_now') {
      if (ctx.periodState === LM.PERIOD_STATES.PARTIAL) {
        push('Seguidores cierre', r.value, r.status, 'saldo', 'Graph API followers_count', 'Saldo del día de extracción (mes en curso), no cierre.', r.detail);
      } else {
        // Mes cerrado: la API solo entrega el saldo ACTUAL; no se presenta como cierre.
        push('Seguidores cierre', null, r.status === LM.DATA.ERROR ? LM.DATA.ERROR : LM.DATA.PENDING, 'saldo', 'Graph API followers_count',
          'Cierre exacto pendiente: cargar con setManualValue (Business Suite) o derivar.',
          'Saldo actual de la API: ' + r.value + ' (' + r.detail + ')');
      }
    } else if (r.key === 'ig_best_hours') {
      push('Horarios de mayor actividad', r.value, r.status, 'texto', 'Instagram Graph API /insights (online_followers)', '', r.detail);
    } else if (r.key === 'ig_followers_closing' || r.key === 'fb_followers_closing') {
      // sustituye al saldo del día de extracción si está disponible
      var k = recordKey_(account.marca, account.plat, ym, 'Seguidores cierre');
      recs = recs.filter(function (x) { return x.clave !== k; }); delete seen[k];
      push('Seguidores cierre', r.value, r.status, 'saldo', 'Graph API (derivado de followers_count y cambio neto diario)', 'DERIVADO: saldo actual menos cambio neto posterior al cierre.', r.detail);
    }
  });
  // Métricas sin equivalente oficial: se registran explícitamente (no se omiten ni se vuelven cero).
  var missing = [['Vistas orgánicas', LM.DATA.NA, 'Sin split orgánico/pago oficial en insights de cuenta; ver Vistas Ads (Marketing API).'],
    ['Alcance orgánico', LM.DATA.NA, 'Sin split orgánico/pago oficial en insights de cuenta; ver Alcance Ads (Marketing API).'],
    ['Mensajes', LM.DATA.PENDING, 'Requiere Messaging API y validar definición vs Business Suite.'],
    ['Contactos iniciados', LM.DATA.PENDING, 'Requiere Messaging API y validar definición vs Business Suite.']];
  missing.push(['Clics en enlaces', LM.DATA.PENDING, 'Sin métrica de API equivalente verificada a "Clics en el enlace" de Business Suite (profile_links_taps dio 0 vs 638 en octubre).']);
  if (account.plat === 'Facebook') missing.push(['Interacciones', LM.DATA.PENDING, 'Sin métrica de API equivalente verificada a "Interacciones con el contenido" de Business Suite (page_post_engagements=240 incluye otras acciones; BS mostró 5).']);
  if (account.plat === 'Instagram') {
    missing.push(['Nuevos seguidores', LM.DATA.PENDING, 'Equivalencia API vs Business Suite sin verificar (follows_and_unfollows / follower_count).']);
    missing.push(['Bajas', LM.DATA.PENDING, 'Equivalencia API vs Business Suite sin verificar.']);
  }
  missing.forEach(function (m) { push(m[0], null, m[1], 'aditivo', 'Sin equivalente oficial verificado', '', m[2]); });
  return recs;
}

/** Variación absoluta y porcentual. null si falta alguno de los datos o el anterior es 0 (no se inventa %). */
function computeVariation_(curr, prev) {
  var c = toNumber_(curr), p = toNumber_(prev);
  if (c === null || p === null) return { abs: null, pct: null };
  return { abs: c - p, pct: p === 0 ? null : (c - p) / p };
}

// ======== Store.gs ========
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

// ======== Summary.gs ========
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
    sh.getRange(r, 6).setFormula('=IF(AND(ISNUMBER(B' + r + '),ISNUMBER(C' + r + ')),B' + r + '-C' + r + ',"S/D")');
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

// ======== Main.gs ========
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
  if (ym !== currentMonth_(now)) results.push(resolveClosingFollowers_(account, ym, now));
  if (partial) {
    results.forEach(function (r) {
      if ((r.key === 'ig_followers_now' || r.key === 'fb_followers_now') && (r.status === LM.DATA.OK || r.status === LM.DATA.ZERO)) upsertSnapshot_(account.marca, account.plat, todayStr_(now), r.value, nowIso);
    });
  }
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

/** Crea la hoja MANUALES con las filas pendientes del piloto (octubre 2026). Laura completa 'Valor' y ejecuta aplicarManuales(). */
function prepararManuales() {
  var sh = getSheet_(LM.SHEETS.MANUALES, LM.HEADERS.MANUALES), src = 'Business Suite (captura de Laura 2026-11-04)';
  if (sh.getLastRow() > 1) return 'MANUALES ya tiene filas; no se agregó nada.';
  var T = "Tony's Pasta", rows = [
    [T, 'Instagram', '2026-10', 'Alcance', '', 'Business Suite (manual)', ''],
    [T, 'Instagram', '2026-10', 'Seguidores cierre', '', 'Business Suite (manual)', ''],
    [T, 'Facebook', '2026-10', 'Seguidores cierre', '', 'Business Suite (manual)', ''],
    [T, 'Facebook', '2026-10', 'Interacciones', 5, src, ''],
    [T, 'Facebook', '2026-10', 'Clics en enlaces', 209, src, '']];
  sh.getRange(2, 3, rows.length, 1).setNumberFormat('@');
  sh.getRange(2, 1, rows.length, 7).setValues(rows);
  return 'Hoja MANUALES lista: completa los Valor vacíos y ejecuta aplicarManuales().';
}

/** Aplica las filas de MANUALES con Valor y sin 'APLICADO'. Si el valor reemplaza uno de la API distinto, la diferencia queda en DIFERENCIAS_BSUITE. */
function aplicarManuales() {
  return lock_(function () {
    var sh = getSheet_(LM.SHEETS.MANUALES, LM.HEADERS.MANUALES), idx = headerIndex_(sh), n = sh.getLastRow(), done = 0, errs = 0;
    if (n < 2) return 'Sin filas.';
    sh.getRange(2, 1, n - 1, sh.getLastColumn()).getValues().forEach(function (r, i) {
      var valor = r[idx['Valor']], estado = String(r[idx['Estado']] || '');
      if (valor === '' || valor === null || estado.indexOf('APLICADO') === 0) return;
      var mes = r[idx['Mes']], row = i + 2;
      if (Object.prototype.toString.call(mes) === '[object Date]') mes = Utilities.formatDate(mes, LM.TZ, 'yyyy-MM');
      try {
        var marca = String(r[idx['Marca']]).trim(), plat = String(r[idx['Plataforma']]).trim(), met = String(r[idx['Métrica']]).trim();
        var k = recordKey_(marca, plat, String(mes), met), prev = null;
        readExisting_().rows.forEach(function (x) { if (x.clave === k && (x.estadoDato === LM.DATA.OK || x.estadoDato === LM.DATA.ZERO)) prev = x.valor; });
        if (prev !== null && toNumber_(prev) !== toNumber_(valor)) recordBsuiteDifference(marca, plat, String(mes), met, valor, 'Se usa Business Suite; la API tenía otro valor');
        var res = setManualValue(marca, plat, String(mes), met, valor, String(r[idx['Fuente']] || 'Business Suite (manual)'));
        var msg = res.skipped.length ? 'OMITIDO: ' + res.skipped.join(', ') : 'APLICADO ' + todayStr_();
        sh.getRange(row, idx['Estado'] + 1).setValue(msg); if (!res.skipped.length) done++;
      } catch (e) { sh.getRange(row, idx['Estado'] + 1).setValue('ERROR: ' + scrub_(e.message)); errs++; }
    });
    return 'Aplicados: ' + done + ', con error: ' + errs;
  });
}

/**
 * Reparación única: (1) respalda; (2) elimina filas API duplicadas de REGISTROS (deja la más reciente);
 * (3) retira lecturas API que se presentaban como equivalentes sin serlo; (4) fuerza texto en Mes/Inicio/Fin; (5) restaura D3 del DASHBOARD como texto.
 * Nunca toca filas HISTÓRICO/VALIDADO ni filas con 'Fila original'.
 */
var RETIRADAS = [['Instagram', 'Clics en enlaces'], ['Facebook', 'Interacciones']];
function repararDuplicados() {
  return lock_(function () {
    var backup = backupSpreadsheet_(), ex = readExisting_(), sh = ex.sh, idx = ex.idx, width = sh.getLastColumn(), n = sh.getLastRow();
    var data = n > 1 ? sh.getRange(2, 1, n - 1, width).getValues() : [], last = {}, del = {};
    function isApiRow(r) { var o = r[idx['Fila original']]; return (o === '' || o === null) && LM.LOCKED_STATES.indexOf(r[idx['Estado']]) < 0; }
    data.forEach(function (r, i) {
      if (!isApiRow(r)) return;
      var met = r[idx['Métrica']], plat = r[idx['Plataforma']], k = recordKey_(r[idx['Marca']], plat, normMonth_(r[idx['Mes']]), met);
      if (RETIRADAS.some(function (x) { return x[0] === plat && x[1] === met; }) && [LM.DATA.OK, LM.DATA.ZERO].indexOf(r[idx['Estado dato']]) >= 0) { del[i + 2] = true; return; }
      if (last[k] !== undefined) del[last[k]] = true;
      last[k] = i + 2;
    });
    var rows = Object.keys(del).map(Number).sort(function (a, b) { return b - a; });
    rows.forEach(function (row) { sh.deleteRow(row); });
    var n2 = sh.getLastRow(), fixed = 0;
    if (n2 > 1) sh.getRange(2, 1, n2 - 1, width).getValues().forEach(function (r, i) {
      if (!isApiRow(r)) return;
      textDateCols_(sh, idx, i + 2, 1);
      sh.getRange(i + 2, idx['Mes'] + 1).setValue(normMonth_(r[idx['Mes']]));
      sh.getRange(i + 2, idx['Inicio'] + 1).setValue(normDay_(r[idx['Inicio']]));
      sh.getRange(i + 2, idx['Fin'] + 1).setValue(normDay_(r[idx['Fin']])); fixed++;
    });
    var dash = getSS_().getSheetByName(LM.SHEETS.DASHBOARD);
    if (dash && isDate_(dash.getRange('D3').getValue())) { var v = normMonth_(dash.getRange('D3').getValue()); dash.getRange('D3').setNumberFormat('@'); dash.getRange('D3').setValue(v); }
    logControl_('', '', '', 'REPARACIÓN', 'Respaldo ' + backup + '; filas eliminadas: ' + rows.length + '; filas con fechas en texto: ' + fixed, 'repararDuplicados', 'INFO');
    return 'Respaldo: ' + backup + ' | filas eliminadas: ' + rows.length + ' | normalizadas: ' + fixed;
  });
}

// ======== Diagnostics.gs ========
/** Diagnóstico y verificación de disponibilidad real de métricas. Nunca imprime tokens. */

function diagnose() {
  var props = PropertiesService.getScriptProperties(), report = [];
  report.push('META_ACCESS_TOKEN: ' + (props.getProperty('META_ACCESS_TOKEN') ? 'configurado' : 'FALTA'));
  report.push('META_API_VERSION: ' + apiVersion_());
  var accounts = readAccounts_();
  report.push('Cuentas en CONFIG: ' + accounts.length + ' (autorizadas: ' + accounts.filter(function (a) { return a.authorized; }).length + ')');
  if (props.getProperty('META_ACCESS_TOKEN')) {
    var token = getToken_();
    try {
      var perms = metaGet_('me/permissions', {}, token).data || [];
      report.push('Permisos concedidos: ' + perms.filter(function (p) { return p.status === 'granted'; }).map(function (p) { return p.permission; }).join(', '));
    } catch (e) { report.push('me/permissions: ' + scrub_(e.message)); }
    accounts.filter(function (a) { return a.authorized; }).forEach(function (a) {
      try {
        var fields = a.plat === 'Instagram' ? 'id,username,followers_count' : 'id,name,followers_count';
        var r = metaGet_(a.id, { fields: fields }, a.plat === 'Facebook' ? pageToken_(a.id, token) : token);
        report.push(a.marca + ' / ' + a.plat + ': OK (' + (r.username || r.name) + ')');
      } catch (e2) { report.push(a.marca + ' / ' + a.plat + ': ' + scrub_(e2.message)); }
    });
  }
  report.forEach(function (l) { console.log(l); });
  logControl_('', '', '', 'DIAGNÓSTICO', report.join(' | '), 'diagnose', 'INFO');
  return report;
}

/** Prueba cada métrica del catálogo contra la API real (mes anterior) y lo anota en DISPONIBILIDAD. */
function probeMetrics(marca) {
  var sh = getSheet_(LM.SHEETS.DISPONIBILIDAD, LM.HEADERS.DISPONIBILIDAD), now = new Date(), ym = prevMonth_(currentMonth_(now)), rows = [];
  readAccounts_().filter(function (a) { return a.authorized && a.activo && (!marca || a.marca === marca); }).forEach(function (a) {
    var results = (a.plat === 'Instagram' ? extractInstagram_(a, ym, now) : extractFacebook_(a, ym, now)).concat(extractAds_(a, ym, now));
    results.forEach(function (r) {
      var c = catalogByKey_(r.key);
      rows.push([new Date(), a.marca, a.plat, c ? c.api : r.key, r.status, r.detail || (r.value === null ? '' : 'valor de prueba=' + r.value)]);
    });
  });
  if (rows.length) sh.getRange(sh.getLastRow() + 1, 1, rows.length, 6).setValues(rows);
  return rows.length;
}

/**
 * Descubrimiento de equivalencias con Business Suite (solo lectura). Anota en DISPONIBILIDAD el valor CRUDO de cada candidata
 * para compararlo con Business Suite. Instagram usa una ventana de 30 días (límite de la API).
 */
function probeCandidates(marca, ym) {
  var sh = getSheet_(LM.SHEETS.DISPONIBILIDAD, LM.HEADERS.DISPONIBILIDAD), now = new Date(), month = ym || prevMonth_(currentMonth_(now)), w = monthWindow_(month, true, now), rows = [];
  var cands = {
    Facebook: [['page_post_engagements', {}], ['page_actions_post_reactions_total', {}], ['page_total_actions', {}], ['page_follows', {}], ['page_daily_follows', {}],
      ['page_video_views', {}], ['page_posts_impressions_unique', {}], ['page_content_activity', {}], ['page_post_engagements', { period: 'day' }]],
    Instagram: [['profile_links_taps', { breakdown: 'contact_type' }], ['profile_links_taps', {}], ['follows_and_unfollows', { breakdown: 'follow_type' }], ['follows_and_unfollows', {}],
      ['likes', {}], ['comments', {}], ['shares', {}], ['saves', {}], ['reposts', {}], ['replies', {}], ['total_interactions', {}], ['views', { breakdown: 'follow_type' }]] };
  readAccounts_().filter(function (a) { return a.authorized && a.activo && (!marca || a.marca === marca); }).forEach(function (a) {
    var token = a.plat === 'Facebook' ? pageToken_(a.id, getToken_(a.marca)) : getToken_(a.marca);
    (cands[a.plat] || []).forEach(function (c) {
      var params = a.plat === 'Facebook' ? { period: 'total_over_range', since: w.since, until: w.until } : { metric_type: 'total_value', period: 'day', since: w.since, until: Math.min(w.until, w.since + 30 * 86400) };
      Object.keys(c[1]).forEach(function (k) { params[k] = c[1][k]; });
      params.metric = c[0];
      var label = 'candidata:' + c[0] + (c[1].breakdown ? '[' + c[1].breakdown + ']' : '') + (c[1].period ? '[' + c[1].period + ']' : '') + (a.plat === 'Instagram' ? ' (días 1-30)' : '');
      try {
        var item = (metaGet_(a.id + '/insights', params, token).data || [])[0];
        var raw = item ? (item.total_value ? JSON.stringify(item.total_value) : JSON.stringify(item.values)) : 'sin datos';
        rows.push([new Date(), a.marca, a.plat, label, item ? 'OK' : 'NO DISPONIBLE', 'crudo=' + String(raw).slice(0, 300)]);
      } catch (e) { rows.push([new Date(), a.marca, a.plat, label, e.kind === 'NO_DISPONIBLE' ? 'NO DISPONIBLE' : 'ERROR', scrub_(e.message)]); }
    });
  });
  if (rows.length) sh.getRange(sh.getLastRow() + 1, 1, rows.length, 6).setValues(rows);
  return rows.length;
}

// ======== Triggers.gs ========
/** Activadores y recuperación. Ejecutar setupTriggers() una sola vez (idempotente). */

var OWN_HANDLERS = ['runDaily', 'runMonthlyClose', 'retryFailed'];

function setupTriggers() {
  ScriptApp.getProjectTriggers().forEach(function (t) { if (OWN_HANDLERS.indexOf(t.getHandlerFunction()) >= 0) ScriptApp.deleteTrigger(t); });
  ScriptApp.newTrigger('runDaily').timeBased().everyDays(1).atHour(6).inTimezone(LM.TZ).create();
  ScriptApp.newTrigger('runMonthlyClose').timeBased().onMonthDay(2).atHour(7).inTimezone(LM.TZ).create();
  ScriptApp.newTrigger('retryFailed').timeBased().everyHours(6).create();
  return 'Activadores: diario 06:00, cierre mensual día 2 07:00 (America/Santiago), reintento cada 6 h.';
}

/** Recuperación: si la última extracción de una cuenta activa tiene >36 h o terminó con error, se reintenta el mes en curso. */
function retryFailed() {
  return lock_(function () {
    var now = new Date(), out = [];
    readAccounts_().filter(function (a) { return a.activo && a.authorized; }).forEach(function (a) {
      var sh = getSheet_(LM.SHEETS.CONFIG, LM.HEADERS.CONFIG_EXTRA), idx = headerIndex_(sh);
      var last = sh.getRange(a.row, idx['Última extracción OK'] + 1).getValue(), err = sh.getRange(a.row, idx['Último error'] + 1).getValue();
      var stale = !last || (now - new Date(last)) > 36 * 3600 * 1000;
      if (stale || err) {
        try { out.push({ a: a.marca + '/' + a.plat, r: runAccount_(a, currentMonth_(now), 'DIARIO', now) }); }
        catch (e) { logControl_(a.marca, a.plat, currentMonth_(now), 'ERROR', 'Reintento falló: ' + scrub_(e.message), 'retryFailed', 'ERROR'); }
      }
    });
    return out;
  });
}
