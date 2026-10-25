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
 const module={exports:{} as Record<string,CallableFunction>};
 const code=ts.transpileModule(readFileSync(new URL(file,import.meta.url),'utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022,jsx:ts.JsxEmit.ReactJSX}}).outputText;
 runInNewContext(code,{URL,AbortSignal,Buffer,module,exports:module.exports,process:{env},require:(key:string)=>key in mocks?mocks[key]:native(key),...extra});return module.exports;
}
const production={NODE_ENV:'production',BESC_DEPLOYMENT_ENV:'production',BESC_WEBSITE_URL:'https://site.example.test',BESC_CC_URL:'https://cc.example.test',BESC_APPROVED_PRODUCTION_WEBSITE_ORIGIN:'https://site.example.test',BESC_APPROVED_PRODUCTION_CC_ORIGIN:'https://cc.example.test'};

test('Deployment targets default to DEV and reject unexpected origins and malformed URLs',()=>{
 assert.equal(deployment.websiteOrigin({NODE_ENV:'production'}),'https://website-dev.belgianstreamerscommunity.be');
 assert.equal(deployment.commandCenterOrigin({}),'https://cc-dev.belgianstreamerscommunity.be');
 for(const value of ['https://elsewhere.example.test','https://user:password@cc-dev.belgianstreamerscommunity.be','https://cc-dev.belgianstreamerscommunity.be/path','https://cc-dev.belgianstreamerscommunity.be?x=1','https://cc-dev.belgianstreamerscommunity.be#x','file:///tmp/example'])assert.throws(()=>deployment.commandCenterOrigin({BESC_CC_URL:value}));
 assert.throws(()=>deployment.websiteOrigin({BESC_DEPLOYMENT_ENV:'typo'}));
 assert.throws(()=>deployment.websiteOrigin({NODE_ENV:'production',BESC_WEBSITE_URL:'http://localhost:3000'}));
});

test('Production requires exact separately approved HTTPS origins and rejects DEV crossover',()=>{
 assert.equal(deployment.websiteOrigin(production),'https://site.example.test');assert.equal(deployment.commandCenterOrigin(production),'https://cc.example.test');
 assert.throws(()=>deployment.commandCenterOrigin({...production,BESC_APPROVED_PRODUCTION_CC_ORIGIN:undefined}));
 assert.throws(()=>deployment.commandCenterOrigin({...production,BESC_CC_URL:'https://different.example.test'}));
 for(const value of ['http://cc.example.test','https://cc.example.test:8443','https://cc-dev.belgianstreamerscommunity.be','https://localhost'])assert.throws(()=>deployment.commandCenterOrigin({...production,BESC_CC_URL:value,BESC_APPROVED_PRODUCTION_CC_ORIGIN:value}));
});

test('Wrong upstream is rejected before a viewer token or publication key can be forwarded',async()=>{
 let viewers=0,fetches=0;
 const m=load('../src/lib/content.ts',{'server-only':{},'./auth':{viewerToken:async()=>{viewers++;return 'TESTFIXTURE-viewer';}},'./deployment-config':deployment,'./contract':contract},{BESC_WEBSITE_STAGING_ENABLED:'true',BESC_CC_URL:'https://wrong.example.test',BESC_PUBLICATION_KEY:'TESTFIXTURE-not-a-live-publication-key'},{fetch:async()=>{fetches++;throw Error();}});
 await assert.rejects(m.content('news'),(e:unknown)=>(e as {status:number}).status===503);assert.equal(viewers,0);assert.equal(fetches,0);
});

test('Prepared production origins do not bypass viewer verification or disabled staging',async()=>{
 let viewers=0,fetches=0;const env={...production,BESC_WEBSITE_STAGING_ENABLED:'true',BESC_PUBLICATION_KEY:'TESTFIXTURE-not-a-live-publication-key'};
 const m=load('../src/lib/content.ts',{'server-only':{},'./auth':{viewerToken:async()=>{viewers++;throw Error('viewer_required');}},'./deployment-config':deployment,'./contract':contract},env,{fetch:async()=>{fetches++;throw Error();}});
 await assert.rejects(m.content('news'),/viewer_required/);assert.equal(viewers,1);assert.equal(fetches,0);
 env.BESC_WEBSITE_STAGING_ENABLED='false';await assert.rejects(m.content('news'),(e:unknown)=>(e as {status:number}).status===503);assert.equal(viewers,1);
});

test('Release preview keeps its exact menu and the staging warning, with original menu preserved when off',()=>{
 const env:Record<string,string>={BESC_RELEASE_PREVIEW_ENABLED:'true',BESC_CREATOR_PLATFORM_ENABLED:'true',BESC_PARTNER_PLATFORM_ENABLED:'true',BESC_VACANCY_PLATFORM_ENABLED:'true'};
 const m=load('../src/components/shell.tsx',{'@/lib/deployment-config':deployment,'./site-page-navigation':{SitePageNavigation:()=>null},'@/app/login/actions':{logout:async()=>{}},'./theme':{Theme:()=>null}},env);
 const html=renderToStaticMarkup(React.createElement(m.Shell as React.ComponentType<{children:React.ReactNode}>,{children:'TESTFIXTURE'}));
 for(const path of ['/over-besc','/nieuws','/events','/contact'])assert(html.includes('href="'+path+'"'));
 for(const path of ['/creators','/esports','/vrijwilligers','/mijn-besc'])assert(!html.includes('href="'+path+'"'));
 assert(html.includes('WEBSITEPROEF'));assert(!html.includes('href="/privacy"'));
 env.BESC_RELEASE_PREVIEW_ENABLED='false';const old=renderToStaticMarkup(React.createElement(m.Shell as React.ComponentType<{children:React.ReactNode}>,{children:'TESTFIXTURE'}));assert(old.includes('href="/creators"'));assert(old.includes('href="/esports"'));
});

test('Release home fails closed on unavailable CMS content rather than using a stale local draft',async()=>{
 class ContentFailure extends Error{};let calls=0;
 const pass=({children}:{children:React.ReactNode})=>React.createElement('section',null,children);
 const m=load('../src/app/page.tsx',{'@/components/page-content':{PageContent:()=>{throw Error('old_home_not_allowed');}},'@/components/shell':{Shell:pass},'@/components/site-page-view':{SitePageView:()=>{throw Error('unavailable_payload_rendered');}},'@/lib/site-content-data':{pages:async(path:string)=>{assert.equal(path,'pages/home');calls++;throw new ContentFailure();}},'@/lib/content':{ContentFailure},'@/lib/deployment-config':deployment},{BESC_RELEASE_PREVIEW_ENABLED:'true'});
 const html=renderToStaticMarkup(await m.default());assert.equal(calls,1);assert(html.includes('Home is momenteel niet beschikbaar'));assert(!html.includes('BESC brengt Belgische'));
});
