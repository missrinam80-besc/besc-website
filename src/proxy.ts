import {websiteOrigin} from '@/lib/deployment-config';
import {resolveLegacyRedirect} from '@/lib/legacy-redirect';
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
  try{const user=await db.auth.getUser();if(!user.error&&user.data.user&&!user.data.user.is_anonymous&&['GET','HEAD'].includes(request.method)&&process.env.BESC_SITE_REDIRECTS_ENABLED==='true'){const session=await db.auth.getSession();if(session.data.session?.access_token){const mapped=await resolveLegacyRedirect(request.nextUrl.pathname,request.nextUrl.search.slice(1),session.data.session.access_token,signal);if(mapped){const refreshed=response.cookies.getAll();if(mapped.status===410)response=new NextResponse(request.method==='HEAD'?null:'Deze historische pagina is niet meer beschikbaar.',{status:410,headers:{'Content-Type':'text/plain; charset=utf-8'}});else if(mapped.target_path){const site=websiteOrigin(process.env);response=NextResponse.redirect(new URL(mapped.target_path,site),307);}for(const c of refreshed)response.cookies.set(c.name,c.value,c);}}}}catch{/* Downstream guards refuse content on auth failure. */}
 }
 response.headers.set('Cache-Control','private, no-store, max-age=0');response.headers.set('X-Robots-Tag','noindex, nofollow');response.headers.set('Content-Security-Policy',csp);return response;
}
export const config={matcher:['/((?!_next/static|_next/image|assets/|api/health|robots.txt|favicon.ico).*)']};
