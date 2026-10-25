import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {createRequire} from 'node:module';
import {runInNewContext} from 'node:vm';
import ts from 'typescript';
import React from 'react';
import {renderToStaticMarkup} from 'react-dom/server';
import * as deployment from '../src/lib/deployment-config.ts';
import * as contract from '../src/lib/contract.ts';
const native=createRequire(import.meta.url);
function load(file:string,mocks:Record<string,unknown>,env:Record<string,string>,extra:Record<string,unknown>={}){
 const module={exports:{} as Record<string,CallableFunction>};const code=ts.transpileModule(readFileSync(new URL(file,import.meta.url),'utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022,jsx:ts.JsxEmit.ReactJSX}}).outputText;
 runInNewContext(code,{URL,URLSearchParams,AbortSignal,Response,Buffer,module,exports:module.exports,process:{env},require:(key:string)=>key in mocks?mocks[key]:native(key),...extra});return module.exports;
}
const publicEnv={NODE_ENV:'production',BESC_DEPLOYMENT_ENV:'production',BESC_PUBLIC_WEBSITE_ENABLED:'true',BESC_SITE_PAGES_ENABLED:'true',BESC_WEBSITE_URL:'https://site.example.test',BESC_CC_URL:'https://cc.example.test',BESC_APPROVED_PRODUCTION_WEBSITE_ORIGIN:'https://site.example.test',BESC_APPROVED_PRODUCTION_CC_ORIGIN:'https://cc.example.test',BESC_PUBLIC_WEBSITE_KEY:'TESTFIXTURE-public-server-key-not-live'};
const news={schema_version:'besc-website-publication-v1',items:[],next_cursor:null};
const requests=(env:Record<string,string>,fetcher:CallableFunction)=>load('../src/lib/public-request.ts',{'server-only':{},'./deployment-config':deployment},env,{fetch:fetcher});

test('Public mode is default off and cannot combine DEV, staging or unapproved targets',()=>{
 assert.equal(deployment.publicWebsiteEnabled({}),false);assert.equal(deployment.publicWebsiteEnabled(publicEnv),true);
 for(const env of [{...publicEnv,BESC_DEPLOYMENT_ENV:'dev'},{...publicEnv,BESC_WEBSITE_STAGING_ENABLED:'true'},{...publicEnv,BESC_CC_URL:'https://wrong.example.test'}])assert.throws(()=>deployment.publicWebsiteEnabled(env));
 assert.equal(deployment.publicIndexingEnabled(publicEnv),false);
});

test('Public website sends only its separate server key to the approved CC read endpoint',async()=>{
 let calls=0;
 const m=requests(publicEnv,async(url:URL,init:RequestInit)=>{calls++;assert.equal(url.origin,'https://cc.example.test');assert.equal(url.pathname,'/api/v1/public-website/news');assert.equal(url.search,'?locale=nl-BE');assert.equal(new Headers(init.headers).get('X-BESC-Publication-Key'),publicEnv.BESC_PUBLIC_WEBSITE_KEY);assert.equal(new Headers(init.headers).get('Authorization'),null);assert.equal(new Headers(init.headers).get('Cookie'),null);assert.equal(init.redirect,'error');assert.equal(init.cache,'no-store');return Response.json(news);});
 assert.equal(JSON.stringify(await m.publicRequest('news','?locale=nl-BE')),JSON.stringify(news));assert.equal(calls,1);
 for(const path of ['../intake','intake','https://elsewhere.test','pages/home/extra','media/../../secret'])await assert.rejects(m.publicRequest(path));assert.equal(calls,1);
 await assert.rejects(m.publicRequest('news','?locale=nl-BE&locale=fr-BE'));assert.equal(calls,1);
});

test('Missing public configuration, redirect and unavailable upstream never fall back to staging',async()=>{
 let calls=0;const fail=async()=>{calls++;throw Error('upstream unavailable');};
 for(const env of [{...publicEnv,BESC_PUBLIC_WEBSITE_KEY:''},{...publicEnv,BESC_WEBSITE_STAGING_ENABLED:'true'},{...publicEnv,BESC_CC_URL:'https://wrong.example.test'}])await assert.rejects(requests(env,fail).publicRequest('news'));assert.equal(calls,0);
 await assert.rejects(requests(publicEnv,fail).publicRequest('news'));assert.equal(calls,1);
});

test('Public mode denies private platform reads and writes before acquiring a human token',async()=>{
 class ContentFailure extends Error{status:number;constructor(status:number){super();this.status=status;}}let publicCalls=0,viewerCalls=0;
 const m=load('../src/lib/platform-request.ts',{'server-only':{},'./deployment-config':deployment,'./auth':{viewerToken:async()=>{viewerCalls++;throw Error();}},'./content':{ContentFailure},'./public-request':{PublicReadFailure:ContentFailure,publicRequest:async(path:string)=>{publicCalls++;assert.equal(path,'pages/home');return {TESTFIXTURE:true};}}},publicEnv);
 for(const [path,body,feature]of [['intake',undefined,'intake'],['me',undefined,'creator'],['publications/pages/home',{data:'TESTFIXTURE'},'page'],['publications/pages/home',null,'page'],['navigation',undefined,'page']]as const)await assert.rejects(m.platformRequest(path,body,feature));
 await m.platformRequest('publications/pages/home?locale=nl-BE',undefined,'page');assert.equal(publicCalls,1);assert.equal(viewerCalls,0);
});

test('Public news renders from the bounded read adapter without viewer authentication',async()=>{
 let viewers=0;const m=load('../src/lib/content.ts',{'server-only':{},'./deployment-config':deployment,'./auth':{viewerToken:async()=>{viewers++;throw Error();}},'./contract':contract,'./public-request':{PublicReadFailure:class extends Error{},publicRequest:async()=>news}},publicEnv);
 assert.equal(JSON.stringify(await m.content('news')),JSON.stringify(news));assert.equal(viewers,0);
});

test('Oversized bodies are cancelled and active image formats are refused',async()=>{
 let cancelled=false;
 const body=new ReadableStream<Uint8Array>({start(controller){controller.enqueue(new Uint8Array(2097153));},cancel(){cancelled=true;}});
 await assert.rejects(requests(publicEnv,async()=>new Response(body)).publicRequest('news'));assert(cancelled);
 await assert.rejects(requests(publicEnv,async()=>new Response('<svg/>',{headers:{'content-type':'image/svg+xml'}})).publicRequest('media/11111111-1111-4111-8111-111111111111'));
});

test('Public presentation has the basis menu without staging claims, logout or private feature links',()=>{
 const env={...publicEnv,BESC_CREATOR_PLATFORM_ENABLED:'true',BESC_VACANCY_PLATFORM_ENABLED:'true',BESC_PARTNER_PLATFORM_ENABLED:'true'};
 const m=load('../src/components/shell.tsx',{'@/lib/deployment-config':deployment,'./site-page-navigation':{SitePageNavigation:()=>{throw Error('private_navigation_not_allowed');}},'@/app/login/actions':{logout:async()=>{}},'./theme':{Theme:()=>null}},env);
 const html=renderToStaticMarkup(React.createElement(m.Shell as React.ComponentType<{children:React.ReactNode}>,{children:'TESTFIXTURE'}));
 for(const href of ['/','/over-besc','/nieuws','/events','/contact'])assert(html.includes('href="'+href+'"'));
 for(const text of ['WEBSITEPROEF','Uitloggen','href="/creators"','href="/vrijwilligers"','href="/mijn-besc"'])assert(!html.includes(text));
});

test('Indexing requires a separate explicit flag; private paths remain noindex candidates',()=>{
 assert.equal(deployment.publicIndexingEnabled(publicEnv),false);assert.equal(deployment.publicIndexingEnabled({...publicEnv,BESC_PUBLIC_WEBSITE_INDEXING_ENABLED:'true'}),true);
 for(const path of ['/api/platform/me','/mijn-besc','/login','/creators','/unknown','/nieuws/x/y'])assert.equal(deployment.indexablePublicPath(path),false);
 assert(deployment.indexablePublicPath('/nieuws/testfixture'));
 const m=load('../src/app/robots.ts',{'@/lib/deployment-config':deployment},publicEnv);assert.equal(m.default().rules.disallow,'/');
});

test('Public auth callback is closed before touching Supabase Auth',async()=>{
 let calls=0;const m=load('../src/app/auth/callback/route.ts',{'@/lib/deployment-config':deployment,'@/lib/auth':{authClient:async()=>{calls++;throw Error();},websiteUrl:()=>publicEnv.BESC_WEBSITE_URL}},publicEnv);
 const result=await m.GET(new Request('https://site.example.test/auth/callback?code=TESTFIXTURE'));assert.equal(result.status,404);assert.equal(calls,0);
});
