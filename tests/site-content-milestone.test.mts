import * as deployment from '../src/lib/deployment-config.ts';
import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {createRequire} from 'node:module';
import {runInNewContext} from 'node:vm';
import ts from 'typescript';
import React from 'react';
import {renderToStaticMarkup} from 'react-dom/server';
import * as contract from '../src/lib/site-content-contract.ts';
const native=createRequire(import.meta.url),id='11111111-1111-4111-8111-111111111111';
function load(file:string,mocks:Record<string,unknown>,globals:Record<string,unknown>={}){const module={exports:{} as Record<string,CallableFunction>},code=ts.transpileModule(readFileSync(new URL(file,import.meta.url),'utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022,jsx:ts.JsxEmit.ReactJSX}}).outputText;runInNewContext(code,{URL,URLSearchParams,Buffer,module,exports:module.exports,require:(key:string)=>key in mocks?mocks[key]:native(key),...globals});return module.exports;}
test('Information page renders escaped text and only explicit published navigation',()=>{
 const view=load('../src/components/site-page-view.tsx',{'@/lib/site-content-contract':contract}),p={slug:'over-besc',locale:'fr-BE',title:'TESTFIXTURE',summary:'TESTFIXTURE',body:{format:'plain_text',value:'TESTFIXTURE <script>payload</script>'},navigation:true,links:[{label:'TESTFIXTURE',href:'/events'}],hero:null,schema_version:'besc-platform-publication-v1',type:'page',public_id:id,revision:1,published_at:'2026-10-24T06:00:00Z',valid_until:null};
 const html=renderToStaticMarkup(React.createElement(view.SitePageView as React.ComponentType<{initial:unknown;path:string}>,{initial:p,path:'pages/over-besc'}));assert(html.includes('&lt;script&gt;payload'));assert(!html.includes('<script>payload</script>'));assert(html.includes('href="/events"'));assert(!html.includes('proof_document_id'));
 const links=load('../src/components/site-page-links.tsx',{'@/lib/site-content-contract':contract}),nav=renderToStaticMarkup(React.createElement(links.SitePageLinks as React.ComponentType<{initial:unknown}>,{initial:{schema_version:'besc-page-navigation-v1',items:[{public_id:id,slug:'over-besc',locale:'fr-BE',title:'TESTFIXTURE',revision:1}]}}));assert(nav.includes('/over-besc?locale=fr-BE'));
});
test('Legacy runtime: default off, protected routes untouched, exact query and fail-closed 307/410 resolution',async()=>{
 const env:Record<string,string>={BESC_WEBSITE_STAGING_ENABLED:'true',BESC_PUBLICATION_KEY:'TESTFIXTURE publication key never used live',BESC_SITE_PAGES_ENABLED:'true'};let calls=0,url='';let raw:unknown={schema_version:'besc-legacy-resolution-v1',public_id:id,revision:1,status:307,target_path:'/over-besc'};
 const m=load('../src/lib/legacy-redirect.ts',{'./site-content-contract':contract,'./deployment-config':deployment},{process:{env},fetch:async(u:URL)=>{calls++;url=String(u);return new Response(JSON.stringify(raw));}});
 assert.equal(await m.resolveLegacyRedirect('/oude','', 'fixture',AbortSignal.timeout(1000)),null);assert.equal(calls,0);env.BESC_SITE_REDIRECTS_ENABLED='true';for(const p of ['/api/secret','/login','/nieuws/item','/robots.txt','/assets/logo.png'])assert.equal(await m.resolveLegacyRedirect(p,'','fixture',AbortSignal.timeout(1000)),null);assert.equal(calls,0);
 assert.equal((await m.resolveLegacyRedirect('/oude','max-results=5','fixture',AbortSignal.timeout(1000))).status,307);assert.equal(new URL(url).searchParams.get('query'),'max-results=5');raw={...raw as object,status:410,target_path:null};assert.equal((await m.resolveLegacyRedirect('/oude','','fixture',AbortSignal.timeout(1000))).status,410);
 raw={...raw as object,status:307,target_path:'https://evil.invalid'};assert.equal(await m.resolveLegacyRedirect('/oude','','fixture',AbortSignal.timeout(1000)),null);raw={...raw as object,target_path:'/over-besc'};env.BESC_SITE_PAGES_ENABLED='false';assert.equal(await m.resolveLegacyRedirect('/oude','','fixture',AbortSignal.timeout(1000)),null);
});

test('Staging proxy emits actual 307 and HEAD 410, preserves refresh cookies and noindex',async()=>{
 const {NextRequest}=await import('next/server.js'),{webcrypto}=await import('node:crypto');
 const env={BESC_AUTH_URL:'https://auth.example.invalid',BESC_AUTH_PUBLISHABLE_KEY:'TESTFIXTURE',BESC_WEBSITE_STAGING_ENABLED:'true',BESC_SITE_REDIRECTS_ENABLED:'true',BESC_WEBSITE_URL:'https://website-dev.belgianstreamerscommunity.be',NODE_ENV:'production'};
 let mapped:unknown={schema_version:'besc-legacy-resolution-v1',public_id:id,revision:1,status:307,target_path:'/over-besc'},signedIn=true,calls=0;
 const module=load('../src/proxy.ts',{'@/lib/deployment-config':deployment,'@/lib/legacy-redirect':{resolveLegacyRedirect:async()=>{calls++;return mapped}},'@supabase/ssr':{createServerClient:(_url:string,_key:string,options:{cookies:{setAll:(items:unknown[])=>void}})=>({auth:{getUser:async()=>{options.cookies.setAll([{name:'besc-website-auth',value:'TESTFIXTURE-refreshed',options:{httpOnly:true,secure:true,sameSite:'lax',path:'/'}}]);return {error:null,data:{user:signedIn?{id,is_anonymous:false}:null}};},getSession:async()=>({data:{session:{access_token:'fixture'}}})}})}},{process:{env},crypto:webcrypto,Headers,AbortSignal});
 const redirected=await module.proxy(new NextRequest('https://website-dev.belgianstreamerscommunity.be/oude'));assert.equal(redirected.status,307);assert.equal(redirected.headers.get('location'),'https://website-dev.belgianstreamerscommunity.be/over-besc');assert(redirected.headers.get('cache-control').includes('no-store'));assert.equal(redirected.headers.get('x-robots-tag'),'noindex, nofollow');assert(redirected.headers.get('set-cookie').includes('TESTFIXTURE-refreshed'));
 mapped={...mapped as object,status:410,target_path:null};const gone=await module.proxy(new NextRequest('https://website-dev.belgianstreamerscommunity.be/oude',{method:'HEAD'}));assert.equal(gone.status,410);assert.equal(await gone.text(),'');assert(gone.headers.get('set-cookie').includes('TESTFIXTURE-refreshed'));
 signedIn=false;const before=calls;const denied=await module.proxy(new NextRequest('https://website-dev.belgianstreamerscommunity.be/oude'));assert.equal(denied.status,200);assert.equal(calls,before);
});
