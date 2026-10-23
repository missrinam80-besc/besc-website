import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {createRequire} from 'node:module';
import {runInNewContext} from 'node:vm';
import ts from 'typescript';
import React from 'react';
import {renderToStaticMarkup} from 'react-dom/server';
import * as contract from '../src/lib/delegation-contract.ts';
const native=createRequire(import.meta.url),id='11111111-1111-4111-8111-111111111111';
test('Own representation: escaped proposal, server-derived context, no role/contract inputs',async()=>{
 const state={schema_version:'besc-delegation-own-v1',lease_id:id,delegations:[{id,partner:{name:'TESTFIXTURE <script>name</script>',website_url:'https://example.invalid'},revision:1,valid_until:'2027-01-01T12:00:00Z'}],proposals:[{id,revision:1,payload:{name:'TESTFIXTURE',description:'TESTFIXTURE <script>description</script>',website_url:null},payload_sha256:'a'.repeat(64),status:'draft',message:'',current_source:true,created_at:'2026-10-23T12:00:00Z'}]};
 const pass=({children}:{children:React.ReactNode})=>React.createElement('section',null,children),mocks:Record<string,unknown>={'@/components/shell':{Shell:pass},'@/components/delegation-lease':{DelegationLease:pass},'@/lib/delegation-data':{ownDelegations:async()=>state},'@/lib/delegation-contract':contract,'@/lib/content':{ContentFailure:class extends Error{}},'../actions':{ownDelegationAction:async()=>{}}};
 const module={exports:{} as {default:(props:unknown)=>Promise<React.ReactNode>}},code=ts.transpileModule(readFileSync(new URL('../src/app/mijn-besc/organisaties/[id]/page.tsx',import.meta.url),'utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022,jsx:ts.JsxEmit.ReactJSX}}).outputText;
 runInNewContext(code,{module,exports:module.exports,require:(key:string)=>key in mocks?mocks[key]:native(key)});const html=renderToStaticMarkup(await module.exports.default({params:Promise.resolve({id}),searchParams:Promise.resolve({})}));assert(html.includes('&lt;script&gt;'));assert(!html.includes('<script>name</script>'));assert(!html.includes('<script>description</script>'));assert(html.includes('name="expected_revision" value="1"'));for(const field of ['actor','partner_id','proof_document_id','role_ids','contract'])assert(!html.includes('name="'+field+'"'));
 assert(!contract.delegatedProfileSchema.safeParse({...state.proposals[0].payload,roles:['sponsor']}).success);
});
