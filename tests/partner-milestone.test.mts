import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {createRequire} from 'node:module';
import {runInNewContext} from 'node:vm';
import ts from 'typescript';
import React from 'react';
import {renderToStaticMarkup} from 'react-dom/server';
import * as contract from '../src/lib/partner-contract.ts';
const native=createRequire(import.meta.url),id='11111111-1111-4111-8111-111111111111';
const p={schema_version:'besc-platform-publication-v1',type:'partner',public_id:id,revision:1,slug:'testfixture',locale:'fr-BE',name:'TESTFIXTURE <script>bad()</script>',description:'TESTFIXTURE NIET PUBLICEREN',roles:['esports'],website_url:'https://example.invalid',logo:null,published_at:'2026-10-23T12:00:00Z',valid_until:null};
function load(file:string,mocks:Record<string,unknown>){const module={exports:{} as Record<string,(props:unknown)=>React.ReactNode|Promise<React.ReactNode>>};const code=ts.transpileModule(readFileSync(new URL(file,import.meta.url),'utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022,jsx:ts.JsxEmit.ReactJSX}}).outputText;runInNewContext(code,{URLSearchParams,module,exports:module.exports,process:{env:{}},require:(key:string)=>key in mocks?mocks[key]:native(key)});return module.exports;}
test('Partner presentation: one shared detail route, escaped public text and forced esports filter',async()=>{
 const view=load('../src/components/partner-view.tsx',{'@/lib/partner-contract':contract});
 const html=renderToStaticMarkup(React.createElement(view.PartnerView as React.ComponentType<{initial:unknown;path:string}>,{initial:{schema_version:'besc-platform-publication-v1',items:[p],next_cursor:null},path:'partners'}));
 assert(html.includes('/samenwerkingen/testfixture?locale=fr-BE'));assert(html.includes('&lt;script&gt;'));assert(!html.includes('<script>bad()'));assert(!html.includes('partner_id'));assert(html.includes('Esportsorganisatie'));
 let query='';const pass=({children}:{children:React.ReactNode})=>React.createElement('section',null,children);
 const index=load('../src/components/partner-index.tsx',{'@/components/shell':{Shell:pass},'@/components/partner-view':{PartnerView:pass},'@/lib/partner-data':{partners:async(_path:string,q:string)=>{query=q;return {items:[],next_cursor:null}}},'@/lib/partner-contract':contract,'@/lib/content':{ContentFailure:class extends Error{}}});
 await index.PartnerIndex({query:{search:'TESTFIXTURE'},esports:true});assert.equal(new URLSearchParams(query).get('role'),'esports');query='';const denied=renderToStaticMarkup(await index.PartnerIndex({query:{role:'sponsor'},esports:true}));assert.equal(query,'');assert(denied.includes('Controleer je selectie'));
});
