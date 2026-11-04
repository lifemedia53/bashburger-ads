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
