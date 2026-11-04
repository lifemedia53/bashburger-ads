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
