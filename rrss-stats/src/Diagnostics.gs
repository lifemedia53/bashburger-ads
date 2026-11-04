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
