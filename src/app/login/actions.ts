'use server';
import {redirect} from 'next/navigation';
import {headers} from 'next/headers';
import {authClient,websiteUrl} from '@/lib/auth';
import {loginLimiter} from '@/lib/login-limit';
export async function login(form:FormData){
 if(process.env.BESC_WEBSITE_STAGING_ENABLED!=='true')redirect('/login?melding=uit');
 const email=String(form.get('email')??'').trim(),password=String(form.get('password')??'');
 if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)||email.length>254||password.length>1024)redirect('/login?melding=controle');
 // Bound state and attempts per submitted account; Auth also enforces its own limits.
 if(!loginLimiter.allow('password:'+email.toLowerCase(),5))redirect('/login?melding=controle');
 const h=await headers();if(h.get('origin')!==websiteUrl())redirect('/login?melding=controle');
 let error=false;try{const db=await authClient();const r=await db.auth.signInWithPassword({email,password});error=Boolean(r.error);}catch{error=true;}
 if(error)redirect('/login?melding=controle');redirect('/');
}
export async function logout(){try{const db=await authClient();await db.auth.signOut({scope:'local'});}catch{}redirect('/login');}
export async function loginLink(form:FormData){
 if(process.env.BESC_WEBSITE_STAGING_ENABLED!=='true')redirect('/login?melding=uit');
 const email=String(form.get('email')??'').trim();const h=await headers();if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)||email.length>254||h.get('origin')!==websiteUrl())redirect('/login?melding=controle');
 if(!loginLimiter.allow('link:'+email.toLowerCase(),1))redirect('/login?melding=link');
 try{const db=await authClient();await db.auth.signInWithOtp({email,options:{shouldCreateUser:false,emailRedirectTo:websiteUrl()+'/auth/callback'}});}catch{}
 // Same response for unknown accounts, delivery failure and existing accounts.
 redirect('/login?melding=link');
}
