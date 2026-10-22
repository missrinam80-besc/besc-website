// Loaded ONLY by the isolated browser test subprocess via --import.
// Never imported by application code or copied into the standalone runner.
import {readFileSync} from 'node:fs';
const original=globalThis.fetch;
globalThis.fetch=async(input,init)=>{
 const url=new URL(input instanceof Request?input.url:String(input));
 if(url.hostname==='auth.fixture.invalid'){
  const state=JSON.parse(readFileSync(process.env.F2_FIXTURE_STATE,'utf8'));
  if(state.authRevoked)return Response.json({message:'invalid_token'},{status:401});
  return Response.json({id:'00000000-0000-4000-8000-000000000201',aud:'authenticated',role:'authenticated',email:'testfixture@example.invalid',email_confirmed_at:'2026-01-01T00:00:00Z',is_anonymous:false,app_metadata:{},user_metadata:{},identities:[],created_at:'2026-01-01T00:00:00Z'});
 }
 if(url.origin==='https://cc-dev.belgianstreamerscommunity.be'){
  const state=JSON.parse(readFileSync(process.env.F2_FIXTURE_STATE,'utf8'));
  const headers=new Headers(init?.headers??(input instanceof Request?input.headers:undefined));
  if(headers.get('X-BESC-Publication-Key')!==process.env.BESC_PUBLICATION_KEY||!headers.get('Authorization')?.startsWith('Bearer '))return Response.json({code:'unauthenticated'},{status:401});
  if(state.denied)return Response.json({code:'forbidden'},{status:403});
  if(state.unavailable)throw Error('TESTFIXTURE upstream unavailable');
  const path=url.pathname.split('/').slice(4),type=path[0]==='events'?'event':'news';
  if(path[0]==='media')return state.revoked?new Response(null,{status:404}):new Response(Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNk+A8AAQUBAScY42YAAAAASUVORK5CYII=','base64'),{headers:{'Content-Type':'image/png','Cache-Control':'private, no-store'}});
  let items=state.revoked?[]:state.items.filter(x=>x.type===type);
  if(path[1]){items=items.filter(x=>x.slug===path[1]);return items.length?Response.json(items[0]):Response.json({code:'not_found'},{status:404});}
  return Response.json({schema_version:'besc-website-publication-v1',items,next_cursor:null});
 }
 if(['127.0.0.1','localhost'].includes(url.hostname))return original(input,init);
 throw Error('TESTFIXTURE blocks external network');
};
