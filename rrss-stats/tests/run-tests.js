// Pruebas con datos SIMULADOS. Ejecutar: node rrss-stats/tests/run-tests.js
const assert = require('assert'), { makeEnv } = require('./mocks');
let pass = 0, fail = 0; const failures = [];
function test(name, fn) { try { fn(); pass++; console.log('  ✔ ' + name); } catch (e) { fail++; failures.push(name); console.log('  ✘ ' + name + '\n      ' + e.message); } }
const run = (env, code) => require('vm').runInContext(code, env.ctx);

console.log('\n[Util] fechas y números');
{ const env = makeEnv(); const f = (c) => run(env, c);
  test('octubre 2026 tiene 31 días y límites correctos', () => { const i = f("monthInfo_('2026-10')"); assert.strictEqual(i.days, 31); assert.strictEqual(i.last, '2026-10-31'); });
  test('mes anterior cruza el año', () => assert.strictEqual(f("prevMonth_('2026-01')"), '2025-12'));
  test('ventana de octubre en America/Santiago: medianoche local (UTC-3) = 03:00 UTC', () => { const w = f("monthWindow_('2026-10', false)"); assert.strictEqual(new Date(w.since * 1000).toISOString(), '2026-10-01T03:00:00.000Z'); assert.strictEqual(w.partial, false); });
  test('mes en curso se corta hoy y queda marcado parcial', () => { const w = f("monthWindow_('2026-11', true, new Date('2026-11-04T15:00:00Z'))"); assert.strictEqual(w.untilStr, '2026-11-04'); assert.strictEqual(w.partial, true); });
  test('troceo en tramos de 30 días cubre el rango sin huecos', () => { const c = f("chunkWindow_(monthWindow_('2026-10', false), 30)"); assert.strictEqual(c.length, 2); assert.strictEqual(c[0].until, c[1].since); });
  test('toNumber: vacío/null/texto => null, 0 => 0 (no se confunden)', () => { assert.strictEqual(f("toNumber_('')"), null); assert.strictEqual(f("toNumber_(null)"), null); assert.strictEqual(f("toNumber_('abc')"), null); assert.strictEqual(f("toNumber_(0)"), 0); assert.strictEqual(f("toNumber_('1.234,5')"), 1234.5); });
  test('recordKey normaliza mayúsculas y espacios', () => assert.strictEqual(f("recordKey_(\"Tony's Pasta \",'Instagram','2026-10','Vistas')"), "tony's pasta|instagram|2026-10|vistas"));
  test('scrub elimina tokens', () => { const s = f("scrub_('x access_token=EAAB1234567890123456789012345 y Bearer abc.def-ghi EAAZZZZZZZZZZZZZZZZZZZZZZZZZ')"); assert(!/EAAB|abc\.def|EAAZ/.test(s)); });
}

console.log('\n[Extractores] parseo de insights');
{ const env = makeEnv(); const f = (c) => run(env, c);
  test('total_value numérico', () => assert.deepStrictEqual(JSON.parse(JSON.stringify(f("parseInsightValue_({total_value:{value:120}}, 'SUMA')"))), { ok: true, value: 120 }));
  test('serie diaria aditiva se suma', () => assert.strictEqual(f("parseInsightValue_({values:[{value:1},{value:2},{value:3}]}, 'SUMA')").value, 6));
  test('alcance (no aditivo) por día NO se suma', () => { const r = f("parseInsightValue_({values:[{value:10},{value:12}]}, 'NO_ADITIVO')"); assert.strictEqual(r.ok, false); });
  test('respuesta vacía => no ok (no cero)', () => assert.strictEqual(f("parseInsightValue_(undefined, 'SUMA')").ok, false));
  test('cero real => estado CERO, no ok-dato', () => assert.strictEqual(f("resultFrom_('k', {ok:true, value:0})").status, 'CERO'));
  test('cierre de seguidores derivado correctamente', () => { const r = f("deriveClosingFollowers_(1000, {'2026-11-01':5,'2026-11-02':-2,'2026-11-03':4}, '2026-10-31', '2026-11-03')"); assert.strictEqual(r.value, 993); });
  test('cierre fuera de ventana => no disponible (no se inventa)', () => { const r = f("deriveClosingFollowers_(1000, {'2026-11-03':4}, '2026-10-31', '2026-11-03')"); assert.strictEqual(r.ok, false); });
  test('mejor contenido por vistas; sin vistas usa interacciones', () => {
    assert.strictEqual(f("bestContent_([{id:'a',vistas:10,interacciones:99},{id:'b',vistas:50,interacciones:1}]).row.id"), 'b');
    assert.strictEqual(f("bestContent_([{id:'a',vistas:null,interacciones:5},{id:'b',vistas:null,interacciones:9}]).criterio"), 'interacciones');
    assert.strictEqual(f("bestContent_([])"), null); });
}

console.log('\n[MetaApi] reintentos y seguridad');
{ test('reintenta errores transitorios y luego tiene éxito', () => {
    const env = makeEnv({ responder: (u, n) => n < 3 ? { code: 500, body: { error: { code: 2, message: 'temporal' } } } : { code: 200, body: { ok: 1 } } });
    assert.strictEqual(run(env, "metaGet_('x', {a:1}, getToken_())").ok, 1); assert.strictEqual(env.fetchLog.length, 3); assert.deepStrictEqual(env.sleeps, [1000, 2000]); });
  test('error de permisos NO se reintenta y se clasifica PERMISO', () => {
    const env = makeEnv({ responder: () => ({ code: 403, body: { error: { code: 10, message: 'sin permiso' } } }) });
    let kind; try { run(env, "metaGet_('x', {}, getToken_())"); } catch (e) { kind = e.kind; } assert.strictEqual(kind, 'PERMISO'); assert.strictEqual(env.fetchLog.length, 1); });
  test('agota reintentos y lanza TRANSITORIO', () => {
    const env = makeEnv({ responder: () => ({ code: 429, body: {} }) });
    let kind; try { run(env, "metaGet_('x', {}, getToken_())"); } catch (e) { kind = e.kind; } assert.strictEqual(kind, 'TRANSITORIO'); assert.strictEqual(env.fetchLog.length, 5); });
  test('el token va por cabecera, nunca en la URL ni en el mensaje de error', () => {
    const env = makeEnv({ responder: () => ({ code: 400, body: { error: { code: 100, message: 'falló access_token=EAAFAKETOKEN0123456789ABCDEFGHIJ' } } }) });
    let msg; try { run(env, "metaGet_('x', {a:1}, getToken_())"); } catch (e) { msg = e.message; }
    assert(!env.fetchLog[0].url.includes('EAAFAKE')); assert(env.fetchLog[0].headers.Authorization.startsWith('Bearer ')); assert(!msg.includes('EAAFAKE')); });
  test('sin token => error claro y sin llamada de red', () => {
    const env = makeEnv({ props: { META_ACCESS_TOKEN: '' } }); let msg; try { run(env, "getToken_()"); } catch (e) { msg = e.message; } assert(/META_ACCESS_TOKEN/.test(msg)); assert.strictEqual(env.fetchLog.length, 0); });
}

console.log('\n[Normalize] estados del dato, orgánico vs ads, no aditivos');
{ const env = makeEnv(); const f = (c) => run(env, c);
  const build = `(function(){
    var acc={marca:"Tony's Pasta",plat:'Instagram'};
    var res=[{key:'ig_views',status:'OK',value:1000,detail:''},{key:'ig_reach',status:'OK',value:300,detail:''},
      {key:'ig_link_taps',status:'CERO',value:0,detail:''},{key:'ig_profile_views',status:'ERROR',value:null,detail:'HTTP 500'},
      {key:'ig_interactions',status:'NO DISPONIBLE',value:null,detail:'sin dato'},
      {key:'ads_impressions',status:'OK',value:400,detail:''},{key:'ads_reach',status:'OK',value:150,detail:''},
      {key:'ig_followers_now',status:'OK',value:137000,detail:''}];
    return toRecords_(acc,'2026-10',res,{periodState:'EXTRAÍDO',nowIso:'2026-11-04T00:00:00-03:00',now:new Date('2026-11-04T12:00:00Z')});})()`;
  const recs = f(build), by = m => recs.find(r => r.metrica === m);
  test('cero real se guarda como 0 con estado CERO', () => { assert.strictEqual(by('Clics en enlaces').valor, 0); assert.strictEqual(by('Clics en enlaces').estadoDato, 'CERO'); });
  test('error y no disponible quedan SIN valor (nunca 0)', () => { assert.strictEqual(by('Visitas al perfil').valor, null); assert.strictEqual(by('Visitas al perfil').estadoDato, 'ERROR'); assert.strictEqual(by('Interacciones').valor, null); assert.strictEqual(by('Interacciones').estadoDato, 'NO DISPONIBLE'); });
  test('orgánico sin equivalente oficial se registra NO DISPONIBLE, no se deduce restando', () => { assert.strictEqual(by('Vistas orgánicas').estadoDato, 'NO DISPONIBLE'); assert.strictEqual(by('Vistas orgánicas').valor, null); assert.strictEqual(by('Vistas').valor, 1000); assert.strictEqual(by('Vistas Ads').valor, 400); });
  test('mensajes y contactos quedan PENDIENTE', () => { assert.strictEqual(by('Mensajes').estadoDato, 'PENDIENTE'); assert.strictEqual(by('Contactos iniciados').estadoDato, 'PENDIENTE'); });
  test('alcance marcado no aditivo; seguidores como saldo; ads con nota de concepto', () => { assert.strictEqual(by('Alcance').regla, 'no aditivo'); assert.strictEqual(by('Seguidores cierre').regla, 'saldo'); assert(/Solo anuncios/.test(by('Vistas Ads').obs)); });
  test('cada registro trae fuente, fecha de extracción y clave única', () => { recs.forEach(r => { assert(r.fuente && r.extraidoEn && r.clave); }); assert.strictEqual(new Set(recs.map(r => r.clave)).size, recs.length); });
  test('variación: abs y %, y % nulo si el anterior es 0 o falta', () => {
    assert.deepStrictEqual(JSON.parse(f("JSON.stringify(computeVariation_(150,100))")), { abs: 50, pct: 0.5 });
    assert.strictEqual(f("computeVariation_(5,0)").pct, null); assert.strictEqual(f("computeVariation_(5,null)").abs, null); assert.strictEqual(f("computeVariation_(0,10)").pct, -1); });
}

console.log('\n[Store] upsert idempotente y protecciones');
{ const env = makeEnv(); const f = (c) => run(env, c);
  const R = (extra) => Object.assign({ marca: 'A', plat: 'Instagram', mes: '2026-10', metrica: 'Vistas', valor: 10, estado: 'EXTRAÍDO', estadoDato: 'OK', clave: 'a|instagram|2026-10|vistas' }, extra || {});
  const plan = (ex, inc) => { env.ex = ex; env.inc = inc; return JSON.parse(f('JSON.stringify(planUpsert_(this.ex || [], this.inc))'.replace('this.ex', 'ex_').replace('this.inc', 'inc_'))); };
  const P = (ex, inc) => { env.ctx.ex_ = ex; env.ctx.inc_ = inc; return JSON.parse(f('JSON.stringify(planUpsert_(ex_, inc_))')); };
  test('registro nuevo => inserta', () => assert.strictEqual(P([], [R()]).inserts.length, 1));
  test('repetir la extracción idéntica => sin cambios (no duplica)', () => { const p = P([{ row: 2, clave: R().clave, valor: 10, estado: 'EXTRAÍDO', estadoDato: 'OK' }], [R()]); assert.strictEqual(p.inserts.length, 0); assert.strictEqual(p.updates.length, 0); });
  test('valor corregido => actualiza la MISMA fila', () => { const p = P([{ row: 7, clave: R().clave, valor: 10, estado: 'EXTRAÍDO', estadoDato: 'OK' }], [R({ valor: 12 })]); assert.strictEqual(p.updates.length, 1); assert.strictEqual(p.updates[0].row, 7); });
  test('HISTÓRICO jamás se sobrescribe; la diferencia queda como conflicto', () => { const p = P([{ row: 3, clave: R().clave, valor: 99, estado: 'HISTÓRICO', estadoDato: 'OK' }], [R({ valor: 10 })]); assert.strictEqual(p.updates.length, 0); assert.strictEqual(p.conflicts.length, 1); });
  test('VALIDADO queda bloqueado', () => { const p = P([{ row: 3, clave: R().clave, valor: 10, estado: 'VALIDADO', estadoDato: 'OK' }], [R({ valor: 11 })]); assert.strictEqual(p.updates.length, 0); });
  test('mes cerrado no se degrada a PARCIAL', () => { const p = P([{ row: 3, clave: R().clave, valor: 10, estado: 'EXTRAÍDO', estadoDato: 'OK' }], [R({ estado: 'PARCIAL', valor: 11 })]); assert.strictEqual(p.updates.length, 0); });
  test('una lectura fallida no pisa un valor bueno', () => { const p = P([{ row: 3, clave: R().clave, valor: 10, estado: 'PARCIAL', estadoDato: 'OK' }], [R({ estado: 'PARCIAL', valor: null, estadoDato: 'ERROR' })]); assert.strictEqual(p.updates.length, 0); });
  test('duplicados dentro del mismo lote se descartan', () => assert.strictEqual(P([], [R(), R()]).inserts.length, 1));
}

console.log('\n[Integración simulada] hojas en memoria, API simulada');
{
  const HEAD_REG = ['Marca', 'Plataforma', 'Mes', 'Inicio', 'Fin', 'Métrica', 'Valor', 'Fuente', 'Estado', 'Regla', 'Fila original', 'Observaciones'];
  const HEAD_CFG = ['CONFIGURACIÓN DE CUENTAS', 'Cliente', 'Plataforma', 'ID Meta', 'Usuario', 'Activo', 'Origen histórico', 'Conexión API', 'Última extracción'];
  const HEAD_RES = ['Marca', 'Plataforma', 'Mes', 'Vistas', 'Alcance (revisar)', 'Interacciones', 'Clics en enlaces', 'Visitas al perfil', 'Seguidores cierre', 'Nuevos seguidores', 'Bajas', 'Vistas historias', 'Mensajes', 'Contactos iniciados', 'Vistas orgánicas', 'Vistas Ads', 'Estado', 'Fuente'];
  function api(url) {
    const m = (url.match(/metric=([a-z_]+)/) || [])[1];
    if (/\/insights/.test(url) && m) {
      if (m === 'profile_views') return { code: 400, body: { error: { code: 100, message: 'metric no soportada' } } };
      const vals = { views: 5000, reach: 1200, total_interactions: 0, accounts_engaged: 300, profile_links_taps: 40 };
      if (m === 'online_followers') return { code: 200, body: { data: [{ values: [{ value: { '18': 90, '19': 120, '20': 100, '3': 5 } }] }] } };
      return { code: 200, body: { data: [{ name: m, total_value: { value: vals[m] === undefined ? 7 : vals[m] } }] } };
    }
    if (/act_999\/insights/.test(url)) return { code: 200, body: { data: [{ publisher_platform: 'instagram', impressions: '800', reach: '500' }] } };
    if (/\/media\?/.test(url)) return { code: 200, body: { data: [{ id: 'm1', media_type: 'VIDEO', media_product_type: 'REELS', permalink: 'https://ig/r1', timestamp: '2026-10-05T10:00:00+0000', like_count: 20, comments_count: 2 }, { id: 'm2', media_type: 'IMAGE', media_product_type: 'FEED', permalink: 'https://ig/p1', timestamp: '2026-10-09T10:00:00+0000', like_count: 5, comments_count: 0 }] } };
    if (/\/stories/.test(url)) return { code: 400, body: { error: { code: 100, message: 'sin historias' } } };
    if (/m1\/insights/.test(url)) return { code: 200, body: { data: [] } };
    if (/\/17841\?/.test(url)) return { code: 200, body: { followers_count: 137055, username: 'tonys.pasta' } };
    return { code: 200, body: { data: [] } };
  }
  function setup() {
    const env = makeEnv({ responder: api }), S = env.Sheet;
    const reg = env.ss.insertSheet('REGISTROS'); reg.grid = [HEAD_REG.slice(),
      ["Tony's Pasta", 'Instagram', '2026-07', '2026-07-01', '2026-07-31', 'Vistas', 214744, 'Google Sheets original', 'HISTÓRICO', 'aditivo', 24, ''],
      ["Tony's Pasta", 'Instagram', '2026-10', '2026-10-01', '2026-10-31', 'Vistas', 111, 'Google Sheets original', 'HISTÓRICO', 'aditivo', 30, '']];
    const cfg = env.ss.insertSheet('CONFIG'); cfg.grid = [HEAD_CFG.slice(), [1, "Tony's Pasta", 'Instagram', '17841', '', 'Sí', 'x', 'PENDIENTE', ''], [2, "Tony's Pasta", 'Facebook', '', '', 'Sí', 'x', 'PENDIENTE', '']];
    cfg.grid[0].push('Cuenta publicitaria (act_)'); cfg.grid[1].push('999');
    const res = env.ss.insertSheet('RESUMEN'); res.grid = [HEAD_RES.slice()];
    const dash = env.ss.insertSheet('DASHBOARD'); dash.grid = [['LIFE MEDIA'], [''], ['Marca', "Tony's Pasta", 'Mes', '2026-08', 'Plataforma', 'Instagram'], ['INDICADORES', 'Valor', 'Mes anterior', 'Variación %', 'Estado de origen'], ['Vistas'], ['Alcance (referencial)'], ['Interacciones'], ['Visitas al perfil'], ['Seguidores al cierre'], ['Clics en enlaces']];
    return env;
  }
  const NOW = "new Date('2026-11-04T12:00:00Z')";
  test('setupSheets solo agrega columnas a la derecha; datos históricos intactos', () => {
    const env = setup(); const before = JSON.stringify(env.sheets.REGISTROS.grid.slice(1)); run(env, 'setupSheets()');
    const h = env.sheets.REGISTROS.grid[0]; assert.strictEqual(h.slice(0, 12).join('|'), 'Marca|Plataforma|Mes|Inicio|Fin|Métrica|Valor|Fuente|Estado|Regla|Fila original|Observaciones'); assert(h.includes('Clave') && h.includes('Estado dato'));
    assert.strictEqual(JSON.stringify(env.sheets.REGISTROS.grid.slice(1)), before); });
  test('cuenta sin ID Meta (Facebook) no se extrae y queda PENDIENTE en CONTROL', () => {
    const env = setup(); run(env, 'setupSheets()'); run(env, `runForAll_(function(){return ['2026-10'];}, 'CIERRE')`);
    const ctl = env.sheets.CONTROL.grid.flat().join('|'); assert(/Sin ID Meta/.test(ctl));
    assert(!env.sheets.REGISTROS.grid.some(r => r[1] === 'Facebook')); });
  test('extracción de octubre: inserta, respeta histórico, métrica con error queda sin valor', () => {
    const env = setup(); run(env, 'setupSheets()'); run(env, `runForAll_(function(){return ['2026-10'];}, 'CIERRE')`);
    const idx = Object.fromEntries(env.sheets.REGISTROS.grid[0].map((h, i) => [h, i])), rows = env.sheets.REGISTROS.grid.slice(1);
    const vistas = rows.filter(r => r[idx['Métrica']] === 'Vistas' && r[idx['Mes']] === '2026-10'); assert.strictEqual(vistas.length, 1, 'no se duplica Vistas'); assert.strictEqual(vistas[0][idx['Valor']], 111, 'valor histórico intacto');
    const pv = rows.find(r => r[idx['Métrica']] === 'Visitas al perfil'); assert.strictEqual(pv[idx['Valor']], ''); assert.strictEqual(pv[idx['Estado dato']], 'NO DISPONIBLE');
    const cl = rows.find(r => r[idx['Métrica']] === 'Interacciones'); assert.strictEqual(cl[idx['Valor']], 0); assert.strictEqual(cl[idx['Estado dato']], 'CERO');
    const ctl = env.sheets.CONTROL.grid.flat().join('|'); assert(/DIFERENCIA/.test(ctl), 'conflicto histórico vs API registrado'); });
  test('repetir la extracción NO crea duplicados (idempotente)', () => {
    const env = setup(); run(env, 'setupSheets()'); const go = () => run(env, `runForAll_(function(){return ['2026-10'];}, 'CIERRE')`);
    go(); const n1 = env.sheets.REGISTROS.getLastRow(), c1 = env.sheets.CONTENIDOS.getLastRow(); go();
    assert.strictEqual(env.sheets.REGISTROS.getLastRow(), n1); assert.strictEqual(env.sheets.CONTENIDOS.getLastRow(), c1); });
  test('contenido guardado con ID y URL, sin duplicar', () => {
    const env = setup(); run(env, 'setupSheets()'); run(env, `runForAll_(function(){return ['2026-10'];}, 'CIERRE')`);
    const ids = env.sheets.CONTENIDOS.grid.slice(1).map(r => r[5]); assert.deepStrictEqual(ids.sort(), ['m1', 'm2']); });
  test('RESUMEN/DASHBOARD NO se actualizan con datos sin validar', () => {
    const env = setup(); run(env, 'setupSheets()'); run(env, `runForAll_(function(){return ['2026-10'];}, 'CIERRE')`);
    const h = env.sheets.RESUMEN.grid[0], estados = env.sheets.RESUMEN.grid.slice(1).map(r => r[h.indexOf('Estado')]);
    assert(estados.every(e => e === 'HISTÓRICO'), 'solo entran períodos HISTÓRICO/VALIDADO, nunca EXTRAÍDO: ' + estados); });
  test('validateMonth bloquea el mes y actualiza RESUMEN con variaciones; datos S/D no se vuelven 0', () => {
    const env = setup(); run(env, 'setupSheets()');
    // mes anterior validado para poder calcular variación
    env.sheets.REGISTROS.grid.push(["Tony's Pasta", 'Instagram', '2026-09', '2026-09-01', '2026-09-30', 'Vistas', 4000, 'API', 'VALIDADO', 'aditivo', '', '', '', "tony's pasta|instagram|2026-09|vistas", 'OK', '']);
    // octubre sin carga histórica previa (escenario real del piloto)
    env.sheets.REGISTROS.grid = env.sheets.REGISTROS.grid.filter(r => !(r[2] === '2026-10' && r[8] === 'HISTÓRICO'));
    run(env, `runForAll_(function(){return ['2026-10'];}, 'CIERRE')`);
    const n = run(env, `validateMonth("Tony's Pasta",'Instagram','2026-10')`); assert(n > 0);
    const res = env.sheets.RESUMEN.grid, h = res[0], oct = res.find(r => r[2] === '2026-10'); assert(oct, 'fila de octubre en RESUMEN'); assert.strictEqual(oct[h.indexOf('Vistas')], 5000); assert.strictEqual(oct[h.indexOf('Visitas al perfil')], '', 'sin dato queda vacío, no 0'); assert.strictEqual(oct[h.indexOf('Estado')], 'VALIDADO');
    const d = env.sheets.DASHBOARD.grid; assert.strictEqual(d[4][1], 5000); assert.strictEqual(d[4][2], 4000); assert.strictEqual(d[4][3], 0.25); assert.strictEqual(d[4][5], 1000);
    assert.strictEqual(d[7][1], 'S/D', 'visitas al perfil sin dato => S/D en dashboard');
    // una nueva extracción NO modifica lo validado
    run(env, `runForAll_(function(){return ['2026-10'];}, 'CIERRE')`);
    assert.strictEqual(env.sheets.REGISTROS.grid.filter(r => r[5] === 'Vistas' && r[2] === '2026-10').length, 1); });
  test('dashboard no pisa celdas con fórmula', () => {
    const env = setup(); run(env, 'setupSheets()'); env.sheets.DASHBOARD.formulas['5,2'] = '=RESUMEN!D2';
    const f = run(env, `updateDashboard_("Tony's Pasta",'Instagram','2026-10')`); assert(f.includes('B5')); assert.strictEqual(env.sheets.DASHBOARD.grid[4][1] || '', ''); });
  test('el token jamás aparece en hojas ni en CONTROL', () => {
    const env = setup(); run(env, 'setupSheets()'); run(env, `runForAll_(function(){return ['2026-10'];}, 'CIERRE')`);
    Object.values(env.sheets).forEach(s => assert(!JSON.stringify(s.grid).includes('EAAFAKE'))); });
  test('falla total de red en una cuenta: no aborta y registra ERROR sin tocar datos', () => {
    const env = setup(); run(env, 'setupSheets()'); env.responder = () => ({ code: 500, body: { error: { code: 2, message: 'caído' } } });
    const out = run(env, `runForAll_(function(){return ['2026-10'];}, 'CIERRE')`);
    assert(env.sheets.CONTROL.grid.flat().includes('ERROR')); assert.strictEqual(env.sheets.REGISTROS.grid.filter(r => r[8] === 'HISTÓRICO').length, 2); });
}

console.log('\n[Correcciones tras prueba real] alcance >30 días, cierre de seguidores, ingreso manual');
{
  function apiReach(url) {
    const m = (url.match(/metric=([a-z_]+)/) || [])[1], since = +url.match(/since=(\d+)/)[1], until = +url.match(/until=(\d+)/)[1];
    if (m === 'reach' && until - since > 2592000) return { code: 400, body: { error: { code: 100, message: '(#100) There cannot be more than 30 days (2592000 s) between since and until.' } } };
    return { code: 200, body: { data: [{ name: m, total_value: { value: 777 } }] } };
  }
  test('alcance de IG en mes de 31 días: NO DISPONIBLE, sin valor, con referencia 1-30 solo en el detalle', () => {
    const env = makeEnv({ responder: apiReach });
    const r = run(env, `(function(){var c=catalogByKey_('ig_reach');return resultFrom_('ig_reach', fetchInsight_('x/insights', c, monthWindow_('2026-10', false), getToken_(), {metric_type:'total_value',period:'day'}));})()`);
    assert.strictEqual(r.status, 'NO DISPONIBLE'); assert.strictEqual(r.value, null); assert(/Referencia días 1-30/.test(r.detail) && /777/.test(r.detail)); });
  test('alcance de IG en mes de 30 días sí se consulta completo', () => {
    const env = makeEnv({ responder: apiReach });
    const r = run(env, `(function(){var c=catalogByKey_('ig_reach');return resultFrom_('ig_reach', fetchInsight_('x/insights', c, monthWindow_('2026-09', false), getToken_(), {metric_type:'total_value',period:'day'}));})()`);
    assert.strictEqual(r.status, 'OK'); assert.strictEqual(r.value, 777); });
  test('mes cerrado: el saldo actual NO se guarda como cierre (queda PENDIENTE con el dato en el detalle)', () => {
    const env = makeEnv();
    const recs = run(env, `toRecords_({marca:'A',plat:'Instagram'},'2026-10',[{key:'ig_followers_now',status:'OK',value:137999,detail:'Saldo al 2026-11-03'}],{periodState:'EXTRAÍDO',nowIso:'x',now:new Date()})`);
    const s = recs.find(r => r.metrica === 'Seguidores cierre'); assert.strictEqual(s.valor, null); assert.strictEqual(s.estadoDato, 'PENDIENTE'); assert(/137999/.test(s.detalle)); });
  test('mes en curso: el saldo de hoy sí se guarda (parcial)', () => {
    const env = makeEnv();
    const recs = run(env, `toRecords_({marca:'A',plat:'Instagram'},'2026-11',[{key:'ig_followers_now',status:'OK',value:138000,detail:'Saldo al 2026-11-03'}],{periodState:'PARCIAL',nowIso:'x',now:new Date()})`);
    assert.strictEqual(recs.find(r => r.metrica === 'Seguidores cierre').valor, 138000); });
  test('setManualValue reemplaza un PENDIENTE, queda con fuente manual y no lo pisa una lectura fallida posterior', () => {
    const env = makeEnv(); run(env, 'setupSheets()');
    env.sheets.REGISTROS.grid.push(['A', 'Instagram', '2026-10', '', '', 'Alcance', '', 'x', 'EXTRAÍDO', 'no aditivo', '', '', '', 'a|instagram|2026-10|alcance', 'NO DISPONIBLE', '']);
    const r = run(env, `setManualValue('A','Instagram','2026-10','Alcance',"45.123",'Business Suite (manual)')`); assert.strictEqual(r.updates, 1);
    const row = env.sheets.REGISTROS.grid.filter(x => x[5] === 'Alcance'); assert.strictEqual(row.length, 1); assert.strictEqual(row[0][6], 45123); assert.strictEqual(row[0][7], 'Business Suite (manual)');
    const p = run(env, `planUpsert_(readExisting_().rows,[{clave:'a|instagram|2026-10|alcance',valor:null,estado:'EXTRAÍDO',estadoDato:'NO DISPONIBLE'}])`); assert.strictEqual(p.updates.length, 0); });
  test('setManualValue rechaza valores no numéricos', () => { const env = makeEnv(); run(env, 'setupSheets()'); let ok = false; try { run(env, `setManualValue('A','Instagram','2026-10','Alcance','abc')`); } catch (e) { ok = true; } assert(ok); });
}

console.log('\n[MANUALES] carga asistida por hoja');
{
  function setupM() { const env = makeEnv(); run(env, 'setupSheets()'); run(env, 'prepararManuales()');
    env.sheets.REGISTROS.grid.push(["Tony's Pasta", 'Facebook', '2026-10', '', '', 'Interacciones', 240, 'API', 'EXTRAÍDO', 'aditivo', '', '', '', "tony's pasta|facebook|2026-10|interacciones", 'OK', '']);
    env.sheets.REGISTROS.grid.push(["Tony's Pasta", 'Instagram', '2026-10', '', '', 'Alcance', '', 'API', 'EXTRAÍDO', 'no aditivo', '', '', '', "tony's pasta|instagram|2026-10|alcance", 'NO DISPONIBLE', '']);
    return env; }
  test('prepararManuales crea las filas pendientes y es idempotente', () => { const env = setupM(); assert.strictEqual(env.sheets.MANUALES.getLastRow(), 6); run(env, 'prepararManuales()'); assert.strictEqual(env.sheets.MANUALES.getLastRow(), 6); });
  test('aplicarManuales: omite filas sin valor, aplica las llenas, registra diferencia API vs BS y no repite', () => {
    const env = setupM(); const m = env.sheets.MANUALES, h = m.grid[0], vi = h.indexOf('Valor');
    m.grid[1][vi] = '45.123'; // IG Alcance (texto con punto de miles)
    const out = run(env, 'aplicarManuales()'); assert(/Aplicados: 3/.test(out), out);
    const reg = env.sheets.REGISTROS.grid, inter = reg.filter(r => r[5] === 'Interacciones' && r[1] === 'Facebook'); assert.strictEqual(inter.length, 1); assert.strictEqual(inter[0][6], 5);
    assert.strictEqual(reg.find(r => r[5] === 'Alcance' && r[1] === 'Instagram')[6], 45123);
    const dif = env.sheets.DIFERENCIAS_BSUITE.grid.slice(1); assert.strictEqual(dif.length, 1); assert.strictEqual(dif[0][4], 240); assert.strictEqual(dif[0][5], 5);
    const out2 = run(env, 'aplicarManuales()'); assert(/Aplicados: 0/.test(out2)); assert.strictEqual(env.sheets.DIFERENCIAS_BSUITE.getLastRow(), 2); });
  test('un valor no numérico queda con ERROR en la hoja y no rompe el resto', () => {
    const env = setupM(); const m = env.sheets.MANUALES, h = m.grid[0]; m.grid[1][h.indexOf('Valor')] = 'abc';
    run(env, 'aplicarManuales()'); assert(/^ERROR/.test(m.grid[1][h.indexOf('Estado')])); assert(/APLICADO/.test(m.grid[4][h.indexOf('Estado')])); });
}

console.log(`\nResultado: ${pass} OK, ${fail} fallos`); if (fail) { console.log(failures.join('\n')); process.exit(1); }
