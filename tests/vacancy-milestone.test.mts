import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {createRequire} from 'node:module';
import {runInNewContext} from 'node:vm';
import ts from 'typescript';
import React from 'react';
import {renderToStaticMarkup} from 'react-dom/server';
import * as contract from '../src/lib/vacancy-contract.ts';
const native=createRequire(import.meta.url),id='11111111-1111-4111-8111-111111111111';
const v={schema_version:'besc-platform-publication-v1',type:'vacancy',public_id:id,revision:2,slug:'testfixture',locale:'fr-BE',title:'TESTFIXTURE <script>bad()</script>',role_label:'TESTFIXTURE',summary:'TESTFIXTURE NIET PUBLICEREN',body:{format:'plain_text',value:'TESTFIXTURE <script>literal</script>'},location_label:'TESTFIXTURE',availability_label:'TESTFIXTURE',closes_at:'2027-01-01T12:00:00Z',published_at:'2026-10-23T12:00:00Z',valid_until:null};
function load(file:string,mocks:Record<string,unknown>){const module={exports:{} as Record<string,(props:unknown)=>React.ReactNode|Promise<React.ReactNode>>};const code=ts.transpileModule(readFileSync(new URL(file,import.meta.url),'utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022,jsx:ts.JsxEmit.ReactJSX}}).outputText;runInNewContext(code,{URLSearchParams,module,exports:module.exports,process:{env:{}},require:(key:string)=>key in mocks?mocks[key]:native(key)});return module.exports;}
test('Vacancy presentation: escaped text, fixed revision and unchecked application acknowledgement',async()=>{
 const view=load('../src/components/vacancy-view.tsx',{'@/lib/vacancy-contract':contract});
 const html=renderToStaticMarkup(React.createElement(view.VacancyView as React.ComponentType<{initial:unknown;path:string}>,{initial:v,path:'vacancies/testfixture'}));
 assert(html.includes('/vrijwilligers/vacatures/testfixture/aanmelden?locale=fr-BE'));assert(html.includes('&lt;script&gt;literal'));assert(!html.includes('<script>'));
 const pass=({children}:{children:React.ReactNode})=>React.createElement('section',null,children);
 const form={id,title:'TESTFIXTURE',category:'volunteer_application',version:1,notice_version:'TESTFIXTURE-v1',notice_body:'TESTFIXTURE privacytekst',legal_basis:'TESTFIXTURE',retention_policy:'TESTFIXTURE',vacancies:[v]};
 const page=load('../src/app/vrijwilligers/vacatures/[slug]/aanmelden/page.tsx',{'@/components/shell':{Shell:pass},'@/components/intake-lease':{IntakeLease:pass},'@/lib/vacancy-data':{vacancies:async()=>v},'@/lib/intake-data':{ownIntake:async()=>({lease_id:id,forms:[form],applications:[]})},'@/lib/content':{ContentFailure:class extends Error{}},'@/app/mijn-besc/aanvragen/actions':{ownIntakeAction:async()=>{}}});
 const markup=renderToStaticMarkup(await page.default({params:Promise.resolve({slug:'testfixture'}),searchParams:Promise.resolve({locale:'fr-BE'})}));
 const check=markup.match(/<input[^>]*name="notice_acknowledged"[^>]*>/)?.[0];assert(check&&!check.includes('checked'));assert(markup.includes('name="expected_vacancy_revision" value="2"'));assert(markup.includes('name="motivation"'));assert(!markup.includes('name="actor"'));assert(!markup.includes('name="internal_note"'));
});
