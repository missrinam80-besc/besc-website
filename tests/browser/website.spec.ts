import {test,expect} from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import {writeFileSync,readFileSync,renameSync} from 'node:fs';
import {resolve} from 'node:path';
const file=process.env.F2_FIXTURE_STATE!;
const fixtures=JSON.parse(readFileSync(resolve('docs/f2/contracts/fixtures.json'),'utf8')).fixtures.filter((x:{expected_valid:boolean})=>x.expected_valid).map((x:{payload:unknown})=>x.payload);
function state(extra={}){writeFileSync(file+'.tmp',JSON.stringify({items:fixtures,revoked:false,denied:false,unavailable:false,authRevoked:false,...extra}));renameSync(file+'.tmp',file);}
function session(){const encode=(v:unknown)=>Buffer.from(JSON.stringify(v)).toString('base64url');const now=Math.floor(Date.now()/1000);const token=encode({alg:'HS256',typ:'JWT'})+'.'+encode({sub:'00000000-0000-4000-8000-000000000201',role:'authenticated',aud:'authenticated',iat:now,exp:now+3600,session_id:'00000000-0000-4000-8000-000000000202'})+'.TESTFIXTURE';return 'base64-'+encode({access_token:token,refresh_token:'TESTFIXTURE-refresh',expires_at:now+3600,expires_in:3600,token_type:'bearer',user:{id:'00000000-0000-4000-8000-000000000201',aud:'authenticated',role:'authenticated',email:'testfixture@example.invalid',app_metadata:{},user_metadata:{},created_at:'2026-01-01T00:00:00Z'}});}
test.beforeEach(async()=>state());
test('anonieme routes bevatten geen publicatie en health/robots blijven minimaal',async({page,request})=>{
 const loaded=await page.goto('/');await expect(page).toHaveURL(/\/login/);await expect(page.getByRole('heading',{name:'Welkom terug.'})).toBeVisible();expect(loaded?.headers()['content-security-policy']).toContain("'nonce-");expect(loaded?.headers()['content-security-policy']).not.toContain("script-src 'self' 'unsafe-inline'");
 for(const path of ['/nieuws','/events','/nieuws/testfixture-nieuws','/api/content/news','/media/00000000-0000-4000-8000-000000000103']){const r=await request.get(path,{maxRedirects:0});expect([302,303,307,308,401,403]).toContain(r.status());expect(await r.text()).not.toContain('TESTFIXTURE — NIET PUBLICEREN');}
 expect(await(await request.get('/api/health')).json()).toEqual({status:'ok'});expect(await(await request.get('/robots.txt')).text()).toContain('Disallow: /');
});
test('aangewezen tester ziet nieuws en events in beide thema’s zonder mobiele overflow',async({page,context})=>{
 await context.addCookies([{name:'besc-website-auth',value:session(),domain:'127.0.0.1',path:'/',httpOnly:true,sameSite:'Lax'}]);
 for(const width of [390,768,1440]){await page.setViewportSize({width,height:1000});await page.goto('/nieuws');await expect(page.getByRole('heading',{name:'TESTFIXTURE — NIET PUBLICEREN — nieuws F2'})).toBeVisible();expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBeTruthy();}
 await page.getByRole('button',{name:'Donkere weergave'}).click();expect(await page.locator('html').getAttribute('data-theme')).toBe('dark');
 await page.goto('/events/testfixture-event');await expect(page.getByRole('heading',{name:'TESTFIXTURE — NIET PUBLICEREN — event F2'})).toBeVisible();await expect(page.getByText('TESTFIXTURE — geen echt event')).toBeVisible();
 await page.screenshot({path:'test-results/f2-event-dark.png',fullPage:true});
 const violations=(await new AxeBuilder({page}).withTags(['wcag2a','wcag2aa','wcag21aa','wcag22aa']).analyze()).violations;expect(violations).toEqual([]);
});
test('intrekking verwijdert actieve weergave uiterlijk binnen 60 seconden en blokkeert volgende reads',async({page,context})=>{
 await context.addCookies([{name:'besc-website-auth',value:session(),domain:'127.0.0.1',path:'/',httpOnly:true,sameSite:'Lax'}]);
 await page.goto('/nieuws/testfixture-nieuws');await expect(page.getByRole('heading',{name:'TESTFIXTURE — NIET PUBLICEREN — nieuws F2'})).toBeVisible();
 state({revoked:true});const start=Date.now();await expect(page.getByRole('heading',{name:'Even niet beschikbaar'})).toBeVisible({timeout:35000});expect(Date.now()-start).toBeLessThan(60000);console.log(JSON.stringify({synthetic_browser_withdrawal_ms:Date.now()-start,live_auth:false}));
 const r=await page.request.get('/api/content/news/testfixture-nieuws',{headers:{'If-None-Match':'old'}});expect(r.status()).toBe(404);expect(r.headers()['cache-control']).toContain('no-store');
});
test('vervallen toegang en upstreamfout leveren geen oude inhoud terug',async({page,context})=>{
 await context.addCookies([{name:'besc-website-auth',value:session(),domain:'127.0.0.1',path:'/',httpOnly:true,sameSite:'Lax'}]);
 state({denied:true});await page.goto('/nieuws');await expect(page.getByRole('heading',{name:'Je account heeft nog geen testtoegang'})).toBeVisible();expect(await page.content()).not.toContain('TESTFIXTURE — NIET PUBLICEREN');
 state({unavailable:true});await page.goto('/nieuws');await expect(page.getByRole('heading',{name:'Even niet beschikbaar'})).toBeVisible();expect(await page.content()).not.toContain('TESTFIXTURE — NIET PUBLICEREN');
});
test('zonder JavaScript of bij ontbrekende scripts blijft beschermde inhoud verborgen',async({browser})=>{
 for(const js of [false,true]){
  const context=await browser.newContext({javaScriptEnabled:js});await context.addCookies([{name:'besc-website-auth',value:session(),domain:'127.0.0.1',path:'/',httpOnly:true,sameSite:'Lax'}]);
  const page=await context.newPage();if(js)await page.route('**/_next/static/**/*.js',route=>route.abort());
  const response=await page.goto('http://127.0.0.1:3301/nieuws/testfixture-nieuws');expect(await response!.text()).toContain('TESTFIXTURE — NIET PUBLICEREN — nieuws F2');await expect(page.locator('.protected-content')).toHaveCount(1);await expect(page.locator('.protected-content')).toBeHidden();
  await expect(page.getByText('De actuele inhoud wordt gecontroleerd.')).toBeVisible();await context.close();
 }
});
