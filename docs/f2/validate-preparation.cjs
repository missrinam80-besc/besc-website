// Offline preparation checks only. No app, database, auth, deployment or network test.
const fs = require('node:fs');
const path = require('node:path');
const assert = require('node:assert/strict');
const root = __dirname;
const read = name => JSON.parse(fs.readFileSync(path.join(root, name), 'utf8'));
const manifest = read('manifest.json');
const approval = read('goedkeuringsformulier.json');
const cases = read('acceptatiegevallen.json').cases;
assert.equal(manifest.execution_approved, false);
assert.equal(manifest.live_changes, false);
assert.equal(approval.approved, false);
assert.equal(manifest.website_repo_created, true);
assert.equal(manifest.website_repo_verified_private, true);
assert.equal(manifest.cloud_history_currently_rechecked, false);
assert.equal(manifest.ssh_verified, false);
assert.equal(manifest.dns_access_verified, false);
assert.equal(manifest.tester_roster_verified, false);
assert.equal(manifest.cloud_history_reference, 123);
assert.equal(manifest.excluded_seed, '20261001110000');
assert.equal(manifest.host, 'website-dev.belgianstreamerscommunity.be');
assert.equal(manifest.server, 'BESCSRVDEV');
assert.equal(manifest.dns_provider, 'one.com');
assert.deepEqual(manifest.tester_groups_confirmed, ['crew', 'vrijwilligers']);
assert.equal(manifest.proposed_withdrawal_sla_seconds, 60);
assert(Object.values(manifest.proposed_flags).every(v => v === false));
assert.equal(manifest.preserved_flags.BESC_TWITCH_IDENTITY_LINKING_ENABLED, true);
assert(Object.entries(manifest.preserved_flags).filter(([k]) => k !== 'BESC_TWITCH_IDENTITY_LINKING_ENABLED').every(([,v]) => v === false));
const packages = new Map(manifest.packages.map(p => [p.id, p]));
assert.equal(packages.size, 8);
const visiting = new Set(), visited = new Set();
function visit(id) {
  assert(packages.has(id), `Unknown package: ${id}`);
  assert(!visiting.has(id), `Dependency cycle: ${id}`);
  if (visited.has(id)) return;
  visiting.add(id);
  packages.get(id).depends_on.forEach(visit);
  visiting.delete(id); visited.add(id);
}
packages.forEach(p => visit(p.id));
assert.equal(new Set(cases.map(c => c.id)).size, cases.length);
for (const c of cases) {
  assert(packages.has(c.package), `Unknown package in ${c.id}`);
  assert.equal(c.status, 'planned');
  assert.equal(c.actual_result, null);
  assert.equal(c.evidence_ref, null);
  assert(c.expected.length > 20 && c.action.length > 20);
}
for (const c of cases) for (const id of c.covers_packages) assert(packages.has(id));
for (const id of packages.keys()) assert(cases.some(c => c.covers_packages.includes(id)), `Uncovered package: ${id}`);
for (const category of ['B','A','P','D','W','M','C','R','E']) assert(cases.some(c => c.id.startsWith(category)));

// Deliberately limited to the keywords used in this package, not a general
// JSON Schema validator. Unsupported keywords fail instead of being ignored.
const supported = new Set(['$schema','$id','title','$ref','oneOf','type','const','enum','minimum','minLength','maxLength','pattern','format','required','properties','additionalProperties','items','maxItems']);
const schemas = Object.fromEntries(['news','event','list','news-list','event-list'].map(k => [`${k}.schema.json`, read(`contracts/${k}.schema.json`)]));
function checkSchema(s) {
  for (const k of Object.keys(s)) assert(supported.has(k), `Unsupported schema keyword: ${k}`);
  if (s.$ref) { assert(schemas[s.$ref], `Unknown schema ref: ${s.$ref}`); return; }
  if (s.properties) Object.values(s.properties).forEach(checkSchema);
  if (s.items) checkSchema(s.items);
  if (s.oneOf) s.oneOf.forEach(checkSchema);
  if (s.format) assert(['uuid','date-time'].includes(s.format));
}
Object.values(schemas).forEach(checkSchema);
function matches(s, v) {
  if (s.$ref) return matches(schemas[s.$ref], v);
  if (s.oneOf && s.oneOf.filter(x => matches(x,v)).length !== 1) return false;
  if ('const' in s && s.const !== v) return false;
  if (s.enum && !s.enum.includes(v)) return false;
  const type = v === null ? 'null' : Array.isArray(v) ? 'array' : typeof v === 'number' && Number.isInteger(v) ? 'integer' : typeof v;
  if (s.type && ![].concat(s.type).some(t => t === type || t === 'number' && type === 'integer')) return false;
  if (typeof v === 'number' && s.minimum !== undefined && v < s.minimum) return false;
  if (typeof v === 'string') {
    const length = [...v].length;
    if (s.minLength !== undefined && length < s.minLength || s.maxLength !== undefined && length > s.maxLength) return false;
    if (s.pattern && !new RegExp(s.pattern).test(v)) return false;
    if (s.format === 'uuid' && !/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(v)) return false;
    if (s.format === 'date-time' && (!/^\d{4}-\d\d-\d\dT\d\d:\d\d:\d\d(?:\.\d+)?(?:Z|[+-]\d\d:\d\d)$/.test(v) || !Number.isFinite(Date.parse(v)))) return false;
  }
  if (Array.isArray(v)) {
    if (s.maxItems !== undefined && v.length > s.maxItems) return false;
    if (s.items && !v.every(x => matches(s.items,x))) return false;
  } else if (v && typeof v === 'object') {
    if (s.required && !s.required.every(k => Object.hasOwn(v,k))) return false;
    if (s.additionalProperties === false && Object.keys(v).some(k => !Object.hasOwn(s.properties ?? {}, k))) return false;
    if (s.properties && !Object.entries(s.properties).every(([k,ss]) => !Object.hasOwn(v,k) || matches(ss,v[k]))) return false;
  }
  return true;
}
const fixtures = read('contracts/fixtures.json').fixtures;
for (const f of fixtures) assert.equal(matches(schemas[`${f.schema}.schema.json`],f.payload), f.expected_valid, f.id);
const positive = fixtures.filter(f => f.expected_valid);
for (const typ of ['news','event']) {
  const payload = positive.find(f => f.schema === typ).payload;
  const list = {schema_version: manifest.contract_version, items:[payload], next_cursor:null};
  assert(matches(schemas['list.schema.json'],list));
  assert(matches(schemas[`${typ}-list.schema.json`],list));
  const other = positive.find(f => f.schema !== typ).payload;
  assert(!matches(schemas[`${typ}-list.schema.json`],{...list,items:[other]}));
}
const api = read('contracts/openapi.json');
assert.equal(api.openapi, '3.1.0');
assert.equal(Object.keys(api.paths).length, 5);
assert.deepEqual(api.security, [{SiteKey:[],ViewerJWT:[]}]);
const allOps = Object.values(api.paths).map(p => p.get.operationId);
assert.equal(new Set(allOps).size, allOps.length);
function apiRefs(x) {
  if (!x || typeof x !== 'object') return;
  if (x.$ref) {
    if (x.$ref.startsWith('#/')) assert(x.$ref.split('/').slice(1).reduce((o,k) => o?.[k],api), `Broken OpenAPI ref ${x.$ref}`);
    else assert(schemas[x.$ref], `Broken external OpenAPI ref ${x.$ref}`);
  }
  Object.values(x).forEach(apiRefs);
}
apiRefs(api);
let links = 0;
for (const name of fs.readdirSync(root).filter(n => n.endsWith('.md'))) {
  const text = fs.readFileSync(path.join(root,name),'utf8');
  for (const match of text.matchAll(/\]\(([^)]+)\)/g)) {
    if (/^(https?:|#)/.test(match[1])) continue;
    assert(fs.existsSync(path.resolve(root,match[1].split('#')[0])), `Broken local link in ${name}: ${match[1]}`);
    links++;
  }
}
console.log(JSON.stringify({preparation_valid:true,packages:packages.size,planned_cases:cases.length,shape_fixtures_checked:fixtures.length,api_paths:5,local_links_checked:links,application_tests_executed:false,live_changes:false}));
