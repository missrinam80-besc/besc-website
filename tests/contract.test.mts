import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {f2PublicationSchema,f2ListSchema,safeRegistrationUrl} from '../src/lib/contract.ts';
const fixtures=JSON.parse(readFileSync(new URL('../docs/f2/contracts/fixtures.json',import.meta.url),'utf8')).fixtures;
for(const f of fixtures)test('Website consumes shared contract: '+f.id,()=>assert.equal(f2PublicationSchema.safeParse(f.payload).success,f.expected_valid));
test('Website rejects producer drift, private fields and unsafe registration links',()=>{
 const news=fixtures.find((x:{id:string})=>x.id==='news-positive').payload;
 assert(!f2ListSchema.safeParse({schema_version:'besc-website-publication-v1',items:[{...news,budget:123}],next_cursor:null}).success);
 assert(!safeRegistrationUrl('https://localhost/private/file'));
 assert(!safeRegistrationUrl('javascript:alert(1)'));
});
