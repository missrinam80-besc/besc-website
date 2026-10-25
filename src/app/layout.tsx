import type {Metadata} from 'next';
import {connection} from 'next/server';
import {publicWebsiteEnabled,publicIndexingEnabled} from '@/lib/deployment-config';
import './style.css';
export async function generateMetadata():Promise<Metadata>{
 const open=publicWebsiteEnabled(process.env),index=publicIndexingEnabled(process.env);
 return {title:{default:open?'Belgian Streamers Community':'BESC · Websiteproef',template:'%s · BESC'},description:open?'Belgische gamers, streamers en content creators samenbrengen.':'Afgeschermde BESC-websiteproef voor aangewezen testers.',robots:{index,follow:index}};
}
export default async function Layout({children}:{children:React.ReactNode}){await connection();const open=publicWebsiteEnabled(process.env);return <html lang="nl-BE" data-protected={open?undefined:'true'}><body><a className="skip" href="#inhoud">Naar de inhoud</a>{!open&&<noscript><p className="notice">Zet JavaScript aan om deze afgeschermde website te bekijken.</p></noscript>}{children}</body></html>;}
