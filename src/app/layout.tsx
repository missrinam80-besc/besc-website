import type {Metadata} from 'next';
import {connection} from 'next/server';
import './style.css';
export const metadata:Metadata={title:{default:'BESC · Websiteproef',template:'%s · BESC'},description:'Afgeschermde BESC-websiteproef voor aangewezen testers.',robots:{index:false,follow:false}};
export default async function Layout({children}:{children:React.ReactNode}){await connection();return <html lang="nl-BE" data-protected="true"><body><a className="skip" href="#inhoud">Naar de inhoud</a><noscript><p className="notice">Zet JavaScript aan om deze afgeschermde website te bekijken.</p></noscript>{children}</body></html>;}
