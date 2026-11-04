// Mocks mínimos de Apps Script para ejecutar el código en Node (pruebas con datos SIMULADOS).
const fs = require('fs'), path = require('path'), vm = require('vm');
const ORDER = ['Config', 'Util', 'MetaApi', 'Extractors', 'Normalize', 'Store', 'Summary', 'Main', 'Diagnostics', 'Triggers'];

function fmt(date, tz, f) {
  const parts = new Intl.DateTimeFormat('en-CA', { timeZone: tz, year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false, timeZoneName: 'longOffset' }).formatToParts(date);
  const g = t => (parts.find(p => p.type === t) || {}).value;
  const off = (g('timeZoneName') || 'GMT').replace('GMT', '') || '+00:00', hh = g('hour') === '24' ? '00' : g('hour');
  const z = off.replace(':', '') ; const zz = z.length === 3 ? z + '00' : z;
  return f.replace("yyyy-MM-dd'T'HH:mm:ssXXX", `${g('year')}-${g('month')}-${g('day')}T${hh}:${g('minute')}:${g('second')}${off}`)
    .replace('yyyy-MM-dd HHmm', `${g('year')}-${g('month')}-${g('day')} ${hh}${g('minute')}`)
    .replace('yyyy-MM-dd', `${g('year')}-${g('month')}-${g('day')}`).replace('yyyy-MM', `${g('year')}-${g('month')}`)
    .replace(/^Z$/, zz);
}

class Range {
  constructor(sh, r, c, nr, nc) { Object.assign(this, { sh, r, c, nr, nc }); }
  getValues() { const o = []; for (let i = 0; i < this.nr; i++) { const row = []; for (let j = 0; j < this.nc; j++) { const v = (this.sh.grid[this.r - 1 + i] || [])[this.c - 1 + j]; row.push(v === undefined ? '' : v); } o.push(row); } return o; }
  setValues(v) { v.forEach((row, i) => row.forEach((x, j) => this.sh._set(this.r + i, this.c + j, x))); }
  getValue() { return this.getValues()[0][0]; }
  setValue(x) { this.sh._set(this.r, this.c, x); return this; }
  setNumberFormat() { return this; }
  getFormula() { return this.sh.formulas[this.r + ',' + this.c] || ''; }
}
class Sheet {
  constructor(name) { this.name = name; this.grid = []; this.formulas = {}; }
  _set(r, c, x) { while (this.grid.length < r) this.grid.push([]); const row = this.grid[r - 1]; while (row.length < c) row.push(''); row[c - 1] = x; }
  getLastRow() { let n = 0; this.grid.forEach((r, i) => { if (r.some(v => v !== '')) n = i + 1; }); return n; }
  getLastColumn() { let n = 0; this.grid.forEach(r => { r.forEach((v, j) => { if (v !== '') n = Math.max(n, j + 1); }); }); return n; }
  getRange(a, b, c, d) {
    if (typeof a === 'string') { const m = a.match(/^([A-Z]+)(\d+)$/); const col = m[1].split('').reduce((s, ch) => s * 26 + ch.charCodeAt(0) - 64, 0); return new Range(this, +m[2], col, 1, 1); }
    return new Range(this, a, b, c || 1, d || 1);
  }
}
function makeEnv(opts = {}) {
  const sheets = {}, env = { sheets, fetchLog: [], props: Object.assign({ META_ACCESS_TOKEN: 'EAAFAKETOKEN0123456789ABCDEFGHIJ' }, opts.props || {}), sleeps: [], responder: opts.responder || (() => ({ code: 200, body: { data: [] } })) };
  const ss = { getSheetByName: n => sheets[n] || null, insertSheet: n => (sheets[n] = new Sheet(n)), getName: () => 'Test', getId: () => 'id' };
  const ctx = {
    console, JSON, Math, Date, Object, Array, String, Number, isFinite, Error, encodeURIComponent, parseInt,
    Utilities: { formatDate: (d, tz, f) => fmt(d, tz, f), sleep: ms => env.sleeps.push(ms) },
    PropertiesService: { getScriptProperties: () => ({ getProperty: k => env.props[k] || null, setProperty: (k, v) => { env.props[k] = v; } }) },
    SpreadsheetApp: { getActiveSpreadsheet: () => ss, openById: () => ss },
    DriveApp: { getFileById: () => ({ makeCopy: () => ({ getId: () => 'copia' }) }) },
    LockService: { getScriptLock: () => ({ tryLock: () => true, releaseLock() { } }) },
    UrlFetchApp: { fetch: (url, o) => { env.fetchLog.push({ url, headers: o.headers }); const r = env.responder(url, env.fetchLog.length); return { getResponseCode: () => r.code, getContentText: () => JSON.stringify(r.body) }; } }
  };
  vm.createContext(ctx);
  ORDER.forEach(f => vm.runInContext(fs.readFileSync(path.join(__dirname, '..', 'src', f + '.gs'), 'utf8'), ctx, { filename: f + '.gs' }));
  env.ctx = ctx; env.ss = ss; env.Sheet = Sheet;
  return env;
}
module.exports = { makeEnv, Sheet };
