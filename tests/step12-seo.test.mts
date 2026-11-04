import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {runInNewContext} from 'node:vm';
import ts from 'typescript';
import * as deployment from '../src/lib/deployment-config.ts';
import * as contract from '../src/lib/contract.ts';
import * as pageContract from '../src/lib/site-content-contract.ts';

const env={BESC_DEPLOYMENT_ENV:'production',BESC_PUBLIC_WEBSITE_ENABLED:'true',BESC_PUBLIC_WEBSITE_INDEXING_ENABLED:'true',BESC_SITE_PAGES_ENABLED:'true',BESC_WEBSITE_URL:'https://site.example.test',BESC_CC_URL:'https://cc.example.test',BESC_APPROVED_PRODUCTION_WEBSITE_ORIGIN:'https://site.example.test',BESC_APPROVED_PRODUCTION_CC_ORIGIN:'https://cc.example.test'};
const module={exports:{} as Record<string,CallableFunction>};
const code=ts.transpileModule(readFileSync(new URL('../src/lib/seo.ts',import.meta.url),'utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022}}).outputText;
runInNewContext(code,{module,exports:module.exports,URL,URLSearchParams,process:{env:{}},require:(key:string)=>{
 if(key==='./deployment-config')return deployment;
 if(key==='./contract')return contract;
 if(key==='./site-content-contract')return pageContract;
 if(key==='./public-request')return {publicRequest:()=>{throw Error('No live request allowed');}};
 throw Error(key);
}});
const {publicMetadata,publicSitemap}=module.exports;
const id='11111111-1111-4111-8111-111111111111';
const page={schema_version:'besc-platform-publication-v1',type:'page',public_id:id,revision:1,published_at:'2026-11-04T12:00:00Z',valid_until:null,slug:'home',locale:'nl-BE',title:'TESTFIXTURE home',summary:'TESTFIXTURE summary',body:{format:'plain_text',value:'TESTFIXTURE'},navigation:true,links:[],hero:null};
const news={schema_version:'besc-website-publication-v1',type:'news',public_id:id,revision:1,published_at:'2026-11-04T12:00:00Z',slug:'testfixture',locale:'nl-BE',title:'TESTFIXTURE news',summary:'TESTFIXTURE summary',body:{format:'sanitized_html',value:'<p>TESTFIXTURE</p>'},media:[]};
const list=(items:unknown[]=[],next_cursor:string|null=null)=>({schema_version:'besc-website-publication-v1',items,next_cursor});

test('DEV, default-off, public-without-indexing and invalid origins make no upstream request',async()=>{
 let calls=0;const read=async()=>{calls++;throw Error();};
 for(const config of [{},{...env,BESC_DEPLOYMENT_ENV:'dev'},{...env,BESC_PUBLIC_WEBSITE_INDEXING_ENABLED:'false'},{...env,BESC_WEBSITE_URL:'https://unapproved.test'}]){
  assert.equal((await publicMetadata('/',{},config,read)).robots.index,false);
  assert.equal((await publicSitemap(config,read)).length,0);
 }
 assert.equal(calls,0);
});
test('Canonical and sharing metadata require a matching current public record',async()=>{
 const result=await publicMetadata('/',{},env,async()=>page);
 assert.equal(result.alternates.canonical,'https://site.example.test/');assert.equal(result.title,page.title);
 assert.equal((await publicMetadata('/nieuws/testfixture',{},env,async()=>news)).alternates.canonical,'https://site.example.test/nieuws/testfixture');
 for(const raw of [{...page,slug:'other'}, {...page,locale:'fr-BE'}, {}, {...news,type:'event'}]){
  assert.equal((await publicMetadata('/',{},env,async()=>raw)).robots.index,false);
 }
 assert.equal((await publicMetadata('/',{},env,async()=>{throw Error('withdrawn');})).robots.index,false);
});
test('Private, unknown, translated and cursor routes cannot acquire a canonical',async()=>{
 let calls=0;const read=async()=>{calls++;return page;};
 for(const path of ['/mijn-besc','/login','/api/content','/unknown','//evil.test','/nieuws/a/b'])assert.equal((await publicMetadata(path,{},env,read)).alternates.canonical,null);
 for(const query of [{locale:'fr-BE'},{cursor:'TESTFIXTURE'}])assert.equal((await publicMetadata('/nieuws',query,env,read)).robots.index,false);
 assert.equal(calls,0);
});
test('Sitemap includes only approved-origin basic routes and published nl-BE records, across pages',async()=>{
 const calls:string[]=[];
 const read=async(path:string,query:string)=>{calls.push(path+query);
  if(path==='pages')return {schema_version:'besc-platform-publication-v1',items:[page,{...page,slug:'private-page'}],next_cursor:null};
  if(path==='news')return query.includes('cursor=')?list([{...news,slug:'second'},{...news,slug:'fr-item',locale:'fr-BE'}]):list([news],'NEXT');
  return list();
 };
 const urls=(await publicSitemap(env,read)).map((x:{url:string})=>x.url);
 assert.deepEqual(Array.from(urls).sort(),['/','/nieuws','/events','/nieuws/testfixture','/nieuws/second'].map(p=>'https://site.example.test'+p).sort());
 assert.equal(calls.length,4);
});
test('Unavailable, malformed or looping source suppresses sitemap rather than advertising partial content',async()=>{
 for(const read of [async()=>{throw Error('unavailable');},async()=>({items:[]}),async(path:string)=>path==='pages'?{schema_version:'besc-platform-publication-v1',items:[],next_cursor:'LOOP'}:list()])assert.equal((await publicSitemap(env,read)).length,0);
});
test('Empty news/events expose only overviews; drafts and source URLs never enter sitemap',async()=>{
 const result=await publicSitemap({...env,BESC_SITE_PAGES_ENABLED:'false'},async()=>list());
 assert.equal(result.length,2);assert(result.every((x:{url:string})=>['https://site.example.test/nieuws','https://site.example.test/events'].includes(x.url)));
 assert.equal(pageContract.pagePayloadSchema.safeParse({...page,slug:'sitemap'}).success,false);
 assert.equal(pageContract.legacyRuntimePath('/sitemap.xml'),false);
});

test('Runtime response headers retain DEV noindex and private-route noindex when public indexing is enabled',async()=>{
 const {NextRequest}=await import('next/server.js');
 const {webcrypto}=await import('node:crypto');
 const config:Record<string,string>={};
 const proxyModule={exports:{} as Record<string,CallableFunction>};
 const proxyCode=ts.transpileModule(readFileSync(new URL('../src/proxy.ts',import.meta.url),'utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022}}).outputText;
 const {createRequire}=await import('node:module');const native=createRequire(import.meta.url);
 runInNewContext(proxyCode,{module:proxyModule,exports:proxyModule.exports,process:{env:config},Buffer,Headers,crypto:webcrypto,require:(key:string)=>{
  if(key==='@/lib/deployment-config')return deployment;
  if(key==='@/lib/legacy-redirect')return {resolveLegacyRedirect:()=>{throw Error('No legacy operation');}};
  if(key==='@supabase/ssr')return {createServerClient:()=>{throw Error('No authentication request');}};
  return native(key);
 }});
 assert.equal((await proxyModule.exports.proxy(new NextRequest('https://website-dev.belgianstreamerscommunity.be/'))).headers.get('x-robots-tag'),'noindex, nofollow');
 Object.assign(config,env);
 assert.equal((await proxyModule.exports.proxy(new NextRequest('https://site.example.test/mijn-besc'))).headers.get('x-robots-tag'),'noindex, nofollow');
 assert.equal((await proxyModule.exports.proxy(new NextRequest('https://site.example.test/nieuws'))).headers.get('x-robots-tag'),null);
});
