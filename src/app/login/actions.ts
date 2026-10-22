'use server';
import {redirect} from 'next/navigation';
import {headers} from 'next/headers';
import {authClient,websiteUrl} from '@/lib/auth';
const attempts=new Map<string,{count:number;at:number}>();
export async function login(form:FormData){
 if(process.env.BESC_WEBSITE_STAGING_ENABLED!=='true')redirect('/login?melding=uit');
 const email=String(form.get('email')??'').trim(),password=String(form.get('password')??'');
 if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)||email.length>254||password.length>1024)redirect('/login?melding=controle');
 // Bound state and attempts per submitted account; Auth also enforces its own limits.
 const k=email.toLowerCase(),now=Date.now();if(attempts.size>1000)for(const [id,v]of attempts)if(now-v.at>60000)attempts.delete(id);
 const a=attempts.get(k);if(a&&now-a.at<60000&&a.count>=5)redirect('/login?melding=controle');if(attempts.size>=1000&&!a)redirect('/login?melding=controle');attempts.set(k,{at:a&&now-a.at<60000?a.at:now,count:a&&now-a.at<60000?a.count+1:1});
 const h=await headers();if(h.get('origin')!==websiteUrl())redirect('/login?melding=controle');
 let error=false;try{const db=await authClient();const r=await db.auth.signInWithPassword({email,password});error=Boolean(r.error);}catch{error=true;}
 if(error)redirect('/login?melding=controle');redirect('/');
}
export async function logout(){try{const db=await authClient();await db.auth.signOut({scope:'local'});}catch{}redirect('/login');}
export async function loginLink(form:FormData){
 if(process.env.BESC_WEBSITE_STAGING_ENABLED!=='true')redirect('/login?melding=uit');
 const email=String(form.get('email')??'').trim();const h=await headers();if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)||email.length>254||h.get('origin')!==websiteUrl())redirect('/login?melding=controle');
 const k='link:'+email.toLowerCase(),now=Date.now(),a=attempts.get(k);if(a&&now-a.at<60000)redirect('/login?melding=link');if(attempts.size>=1000)for(const [id,v]of attempts)if(now-v.at>60000)attempts.delete(id);if(attempts.size>=1000&&!a)redirect('/login?melding=controle');attempts.set(k,{at:now,count:1});
 try{const db=await authClient();await db.auth.signInWithOtp({email,options:{shouldCreateUser:false,emailRedirectTo:websiteUrl()+'/auth/callback'}});}catch{}
 // Same response for unknown accounts, delivery failure and existing accounts.
 redirect('/login?melding=link');
}
