import {publicWebsiteEnabled} from '@/lib/deployment-config';
import {NextResponse} from 'next/server';
import {authClient,websiteUrl} from '@/lib/auth';
export async function GET(request:Request){if(publicWebsiteEnabled(process.env))return new Response(null,{status:404});const code=new URL(request.url).searchParams.get('code');if(code&&code.length<=2048){try{const db=await authClient();const {error}=await db.auth.exchangeCodeForSession(code);if(!error)return NextResponse.redirect(websiteUrl()+'/');}catch{}}return NextResponse.redirect(websiteUrl()+'/login?melding=controle');}
