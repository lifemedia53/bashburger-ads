/**
 * Extractores. Cada uno devuelve [{key, status, value, detail}] y NUNCA lanza por una métrica:
 * un fallo de una métrica queda como NO DISPONIBLE / ERROR en su propio resultado.
 * status ∈ LM.DATA (OK, CERO, NO DISPONIBLE, ERROR, PENDIENTE).
 */

/** Extrae el valor numérico de una respuesta de insights (total_value o serie de valores). */
function parseInsightValue_(item, regla) {
  if (!item) return { ok: false, detail: 'La API no devolvió la métrica' };
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
  return { key: key, status: parsed.value === 0 ? LM.DATA.ZERO : LM.DATA.OK, value: parsed.value, detail: '' };
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
    var res = metaGet_(path, p, token);
    return parseInsightValue_((res.data || [])[0], entry.regla);
  }
  try { return one(w); } catch (e) {
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
    var rows = metaGetAll_(acct + '/insights', { fields: 'impressions,reach', breakdowns: 'publisher_platform', level: 'account',
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
