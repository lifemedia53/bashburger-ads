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
