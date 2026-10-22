import {NextResponse,type NextRequest} from 'next/server';
import {createServerClient} from '@supabase/ssr';
export async function proxy(request:NextRequest){
 const nonce=Buffer.from(crypto.randomUUID()).toString('base64');
 const csp=`default-src 'self'; script-src 'self' 'nonce-${nonce}' 'strict-dynamic'${process.env.NODE_ENV==='development'?" 'unsafe-eval'":''}; style-src 'self' 'unsafe-inline'; img-src 'self'; font-src 'self'; connect-src 'self'; frame-ancestors 'none'; base-uri 'none'; form-action 'self'; object-src 'none'`;
 const forwarded=new Headers(request.headers);forwarded.set('x-nonce',nonce);forwarded.set('Content-Security-Policy',csp);
 let response=NextResponse.next({request:{headers:forwarded}});const url=process.env.BESC_AUTH_URL,key=process.env.BESC_AUTH_PUBLISHABLE_KEY;
 if(url&&key&&process.env.BESC_WEBSITE_STAGING_ENABLED==='true'){
  const signal=AbortSignal.any([request.signal,AbortSignal.timeout(5000)]);
  const db=createServerClient(url,key,{global:{fetch:(input,init)=>fetch(input,{...init,cache:'no-store',signal})},cookieOptions:{name:'besc-website-auth',httpOnly:true,sameSite:'lax',secure:process.env.NODE_ENV==='production',path:'/'},cookies:{getAll:()=>request.cookies.getAll(),setAll(items){for(const {name,value}of items)request.cookies.set(name,value);forwarded.set('cookie',request.headers.get('cookie')??'');response=NextResponse.next({request:{headers:forwarded}});for(const {name,value,options}of items)response.cookies.set(name,value,{...options,domain:undefined});}}});
  try{await db.auth.getUser();}catch{/* Downstream guards refuse content on auth failure. */}
 }
 response.headers.set('Cache-Control','private, no-store, max-age=0');response.headers.set('X-Robots-Tag','noindex, nofollow');response.headers.set('Content-Security-Policy',csp);return response;
}
export const config={matcher:['/((?!_next/static|_next/image|assets/|api/health|robots.txt|favicon.ico).*)']};
