/** Activadores y recuperación. Ejecutar setupTriggers() una sola vez (idempotente). */

var OWN_HANDLERS = ['runDaily', 'runMonthlyClose', 'retryFailed'];

function setupTriggers() {
  ScriptApp.getProjectTriggers().forEach(function (t) { if (OWN_HANDLERS.indexOf(t.getHandlerFunction()) >= 0) ScriptApp.deleteTrigger(t); });
  ScriptApp.newTrigger('runDaily').timeBased().everyDays(1).atHour(6).inTimezone(LM.TZ).create();
  ScriptApp.newTrigger('runMonthlyClose').timeBased().onMonthDay(2).atHour(7).inTimezone(LM.TZ).create();
  ScriptApp.newTrigger('retryFailed').timeBased().everyHours(6).create();
  var activos = ScriptApp.getProjectTriggers().map(function (t) { return t.getHandlerFunction(); }).filter(function (h) { return OWN_HANDLERS.indexOf(h) >= 0; });
  var msg = 'Activadores: diario 06:00, cierre mensual día 2 07:00 (America/Santiago), reintento cada 6 h. Activos: ' + activos.join(', ');
  logControl_('', '', '', 'ACTIVADORES', msg, 'setupTriggers', 'INFO');
  return msg;
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
