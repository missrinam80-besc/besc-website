import 'server-only';
import {createServerClient} from '@supabase/ssr';
import {cookies} from 'next/headers';
import {redirect} from 'next/navigation';
export async function authClient(signal?:AbortSignal){
 const jar=await cookies();const url=process.env.BESC_AUTH_URL,key=process.env.BESC_AUTH_PUBLISHABLE_KEY;
 if(!url||!key)throw Error('auth_unavailable');
 return createServerClient(url,key,{global:{fetch:(input,init)=>fetch(input,{...init,cache:'no-store',signal:AbortSignal.any([signal??AbortSignal.timeout(5000),...(init?.signal?[init.signal]:[])])})},auth:{flowType:'pkce'},cookieOptions:{name:'besc-website-auth',httpOnly:true,sameSite:'lax',secure:process.env.NODE_ENV==='production',path:'/'},cookies:{getAll:()=>jar.getAll(),setAll(items){try{for(const {name,value,options}of items)jar.set(name,value,{...options,domain:undefined});}catch{/* Proxy persists refresh cookies before rendering. */}}}});
}
export async function viewerToken(signal?:AbortSignal){
 const db=await authClient(signal);const {data,error}=await db.auth.getUser();if(error||!data.user||data.user.is_anonymous)redirect('/login');
 const {data:session}=await db.auth.getSession();if(!session.session?.access_token)redirect('/login');return session.session.access_token;
}
export function websiteUrl(){const url=new URL(process.env.BESC_WEBSITE_URL??'https://website-dev.belgianstreamerscommunity.be');if(url.origin!=='https://website-dev.belgianstreamerscommunity.be'&&!(process.env.NODE_ENV!=='production'&&url.hostname==='localhost'))throw Error('invalid_site_origin');return url.origin;}
