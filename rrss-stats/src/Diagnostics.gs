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
 * Descubrimiento de equivalencias con Business Suite: consulta varias métricas candidatas del mes y las anota en DISPONIBILIDAD
 * ('valor de prueba=N') para compararlas con lo que muestra Business Suite. Solo lectura.
 */
function probeCandidates(marca, ym) {
  var sh = getSheet_(LM.SHEETS.DISPONIBILIDAD, LM.HEADERS.DISPONIBILIDAD), now = new Date(), month = ym || prevMonth_(currentMonth_(now)), w = monthWindow_(month, true, now), rows = [];
  var cands = { Facebook: ['page_post_engagements', 'page_actions_post_reactions_total', 'page_total_actions', 'page_consumptions_unique',
      'page_website_clicks_logged_in_unique', 'page_cta_clicks_logged_in_total', 'page_cta_clicks_logged_in_unique', 'page_posts_impressions', 'post_engagements', 'page_follows'],
    Instagram: ['profile_links_taps', 'website_clicks', 'likes', 'comments', 'shares', 'saves', 'reposts', 'replies', 'follows_and_unfollows', 'total_interactions'] };
  readAccounts_().filter(function (a) { return a.authorized && a.activo && (!marca || a.marca === marca); }).forEach(function (a) {
    var token = a.plat === 'Facebook' ? pageToken_(a.id, getToken_(a.marca)) : getToken_(a.marca);
    (cands[a.plat] || []).forEach(function (m) {
      var params = a.plat === 'Facebook' ? { period: 'total_over_range' } : { metric_type: 'total_value', period: 'day' }, res;
      try {
        params.metric = m; params.since = w.since; params.until = w.until;
        var r = parseInsightValue_((metaGet_(a.id + '/insights', params, token).data || [])[0], 'SUMA');
        res = r.ok ? 'OK' : 'NO DISPONIBLE'; rows.push([new Date(), a.marca, a.plat, 'candidata:' + m, res, r.ok ? 'valor de prueba=' + r.value : r.detail]);
      } catch (e) { rows.push([new Date(), a.marca, a.plat, 'candidata:' + m, e.kind === 'NO_DISPONIBLE' ? 'NO DISPONIBLE' : 'ERROR', scrub_(e.message)]); }
    });
  });
  if (rows.length) sh.getRange(sh.getLastRow() + 1, 1, rows.length, 6).setValues(rows);
  return rows.length;
}
