import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {createRequire} from 'node:module';
import {runInNewContext} from 'node:vm';
import ts from 'typescript';
import React from 'react';
import {renderToStaticMarkup} from 'react-dom/server';
const native=createRequire(import.meta.url),id='11111111-1111-4111-8111-111111111111';
test('Contact form: exact notice, unchecked read acknowledgement, no e-mail/role input or old Monday embed',async()=>{
 const state={lease_id:id,forms:[{id,category:'general_contact',title:'TESTFIXTURE NIET PUBLICEREN',notice_version:'TEST-v1',notice_body:'TESTFIXTURE <script>privacy</script>',legal_basis:'TESTFIXTURE',retention_policy:'TESTFIXTURE'}],applications:[]};
 const pass=({children}:{children:React.ReactNode})=>React.createElement('section',null,children),mocks:Record<string,unknown>={'./intake-lease':{IntakeLease:pass},'@/lib/intake-data':{ownIntake:async()=>state},'@/lib/content':{ContentFailure:class extends Error{}},'@/app/mijn-besc/aanvragen/actions':{ownIntakeAction:async()=>{}}};
 const module={exports:{} as {ContactForm:()=>Promise<React.ReactNode>}},code=ts.transpileModule(readFileSync(new URL('../src/components/contact-form.tsx',import.meta.url),'utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022,jsx:ts.JsxEmit.ReactJSX}}).outputText,env:Record<string,string>={BESC_GENERAL_CONTACT_ENABLED:'true',BESC_PLATFORM_INTAKE_ENABLED:'true'};
 runInNewContext(code,{module,exports:module.exports,process:{env},require:(key:string)=>key in mocks?mocks[key]:native(key)});const html=renderToStaticMarkup(await module.exports.ContactForm()),check=html.match(/<input[^>]*name="notice_acknowledged"[^>]*>/)?.[0];assert(check&&!check.includes('checked'));assert(html.includes('&lt;script&gt;privacy'));assert(html.includes('name="request_id"'));assert(html.includes('name="subject"'));for(const field of ['email','actor','user_id','role','internal_note'])assert(!html.includes('name="'+field+'"'));assert(!html.includes('monday.com'));assert(!html.includes('<iframe'));
 env.BESC_GENERAL_CONTACT_ENABLED='false';const closed=renderToStaticMarkup(await module.exports.ContactForm());assert(!closed.includes('name="message"'));assert(closed.includes('niet beschikbaar'));
});
