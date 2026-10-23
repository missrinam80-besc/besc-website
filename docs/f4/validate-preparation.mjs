// Website documentation/package checks only. No application or network action.
import assert from 'node:assert/strict';
import {execFileSync} from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {createHash} from 'node:crypto';
const base=path.dirname(fileURLToPath(import.meta.url)),repo=path.resolve(base,'../..');
const read=p=>JSON.parse(fs.readFileSync(path.join(base,p),'utf8'));
const hash=p=>createHash('sha256').update(fs.readFileSync(p,'utf8').replaceAll('\r\n','\n')).digest('hex');
const m=read('manifest.json');assert.equal(m.status,'prepared_for_review_not_implemented');assert.equal(m.live_changes,false);assert.equal(m.application_tests_executed,false);assert.equal(m.public_site_replaced,false);
for(const s of m.source_files)assert.equal(createHash('sha256').update(execFileSync('git',['show',m.baseline_website_commit+':'+s.path],{cwd:repo,encoding:'utf8'}).replaceAll('\r\n','\n')).digest('hex'),s.sha256_lf,s.path);
for(const c of m.contracts)assert.equal(hash(path.join(base,'contracts',c.file)),c.sha256_lf,c.file);
const contract=read('contracts/platform-contract.json');assert.equal(contract.staging_anonymous_access,false);assert.equal(contract.website_direct_business_table_reads,false);assert.equal(contract.success_requires_commit,true);assert.equal(contract.new_runtime_flags_default,'off');
const schema=read('contracts/public.schema.json'),fixtures=read('contracts/fixtures.json');assert.equal(schema.oneOf.length,4);assert.equal(fixtures.items.length,4);assert.equal(fixtures.publication_authorized,false);
for(const variant of schema.oneOf){assert.equal(variant.additionalProperties,false);for(const k of contract.public_projection_forbidden_fields)assert(!Object.hasOwn(variant.properties,k));}
for(const f of fixtures.items){const v=schema.oneOf.find(s=>s.properties.type.const===f.type);assert(v);for(const k of v.required)assert(Object.hasOwn(f,k));for(const k of Object.keys(f))assert(Object.hasOwn(v.properties,k));assert(JSON.stringify(f).includes('TESTFIXTURE'));}
let links=0;for(const f of fs.readdirSync(base).filter(n=>n.endsWith('.md'))){for(const match of fs.readFileSync(path.join(base,f),'utf8').matchAll(/\]\(([^)]+)\)/g)){if(/^https?:/.test(match[1]))continue;assert(fs.existsSync(path.resolve(base,match[1].split('#')[0])),f+': '+match[1]);links++;}}
console.log(JSON.stringify({website_preparation_valid:true,contracts_verified:m.contracts.length,source_hashes_verified:m.source_files.length,local_links_checked:links,application_tests_executed:false,live_changes:false}));
