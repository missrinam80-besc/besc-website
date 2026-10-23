import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {createRequire} from 'node:module';
import {runInNewContext} from 'node:vm';
import ts from 'typescript';
import React from 'react';
import {renderToStaticMarkup} from 'react-dom/server';
import * as contract from '../src/lib/creator-contract.ts';
const native=createRequire(import.meta.url),id='11111111-1111-4111-8111-111111111111';

test('Creator DTO validates an omitted field without inventing a value; unsafe links rejected',()=>{
 const profile={schema_version:'besc-platform-publication-v1',type:'creator',public_id:id,revision:1,slug:'testfixture',locale:'nl-BE',display_name:'TESTFIXTURE — NIET PUBLICEREN',published_at:'2026-10-23T12:00:00Z',valid_until:null};
 assert(contract.creatorPublicationSchema.safeParse(profile).success);assert(!contract.creatorPublicationSchema.safeParse({...profile,consent_id:id}).success);assert(!contract.safeCreatorLink('twitch','https://twitch.tv.evil.test/testfixture'));
});
test('Mijn BESC presentation: personal confirmation unchecked and own mutations carry stable request IDs',async()=>{
 const state={lease_id:id,profile_id:id,revision:1,may_view:true,purposes:[{id,text_version:1,title:'TESTFIXTURE personal purpose',body:'TESTFIXTURE — NIET PUBLICEREN',allowed_scope:{fields:['display_name','bio']},retention_policy:'TESTFIXTURE'}],consents:[],revisions:[{id,revision:1,payload:{slug:'testfixture',locale:'nl-BE',display_name:'TESTFIXTURE',bio:'<script>alert(1)</script>'},payload_sha256:'a'.repeat(64),status:'draft',created_at:'2026-10-23T12:00:00Z',current_access:true}],entries:[]};
 const module={exports:{} as {default:(p:{searchParams:Promise<Record<string,string>>})=>Promise<React.ReactNode>}};
 const code=ts.transpileModule(readFileSync(new URL('../src/app/mijn-besc/page.tsx',import.meta.url),'utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022,jsx:ts.JsxEmit.ReactJSX}}).outputText;
 const pass=({children}:{children:React.ReactNode})=>React.createElement('section',null,children);
 const mocks:Record<string,unknown>={'@/components/shell':{Shell:pass},'@/components/creator-own-lease':{CreatorOwnLease:pass},'@/lib/creator-data':{ownCreator:async()=>state},'@/lib/content':{ContentFailure:class extends Error{}},'@/lib/creator-contract':contract,'./actions':{ownCreatorAction:async()=>{}}};
 runInNewContext(code,{process:{env:{BESC_CREATOR_PLATFORM_ENABLED:"true"}},module,exports:module.exports,require:(key:string)=>key in mocks?mocks[key]:native(key)});
 const html=renderToStaticMarkup(await module.exports.default({searchParams:Promise.resolve({})}));
 const confirmation=html.match(/<input[^>]*name="accepted"[^>]*>/)?.[0];assert(confirmation);assert(!confirmation.includes('checked'));assert(html.includes('name="request_id"'));assert(html.includes('name="consent_id"'));assert(html.includes('&lt;script&gt;'));assert(!html.includes('<script>alert(1)'));assert(!html.includes('publication_reviewer'));assert(!html.includes('name="organization_id"'));
});
