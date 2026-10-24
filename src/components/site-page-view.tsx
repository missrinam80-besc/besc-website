'use client';
import {useEffect,useState} from 'react';
import {pageListSchema,pagePublicationSchema,type PagePublication} from '@/lib/site-content-contract';
type Data={schema_version:'besc-platform-publication-v1';items:PagePublication[];next_cursor:string|null}|PagePublication;
export function SitePageView({initial,path,query='',listingPath='/'}:{initial:Data;path:string;query?:string;listingPath?:string}){
 const [data,setData]=useState<Data|null>(initial),[message,setMessage]=useState('');
 useEffect(()=>{let alive=true,busy=false;let controller:AbortController|null=null;
  const hide=()=>{document.documentElement.dataset.protected='true';setData(null);};
  const check=async()=>{if(busy)return;busy=true;controller=new AbortController();const timer=setTimeout(()=>controller?.abort(),5000);
   try{const r=await fetch('/api/platform/'+path+query,{credentials:'same-origin',cache:'no-store',redirect:'error',signal:controller.signal});if(!r.ok)throw Error();const v=(path==='pages'?pageListSchema:pagePublicationSchema).safeParse(await r.json());if(!v.success)throw Error();if(alive&&document.visibilityState==='visible'){setData(v.data);setMessage('');delete document.documentElement.dataset.protected;}}
   catch{if(alive){hide();setMessage('De vermelding is ingetrokken, niet toegankelijk of kon niet opnieuw worden gecontroleerd.');}}finally{clearTimeout(timer);busy=false;}
  };
  const resume=()=>{hide();void check();},visibility=()=>{if(document.visibilityState==='hidden'){controller?.abort();hide();}else resume();},offline=()=>{controller?.abort();hide();};
  const timer=setInterval(()=>{if(document.visibilityState==='visible')void check();},20000);window.addEventListener('focus',resume);window.addEventListener('pageshow',resume);window.addEventListener('pagehide',hide);window.addEventListener('offline',offline);document.addEventListener('visibilitychange',visibility);if(document.visibilityState==='hidden')hide();else void check();
  return()=>{alive=false;controller?.abort();clearInterval(timer);window.removeEventListener('focus',resume);window.removeEventListener('pageshow',resume);window.removeEventListener('pagehide',hide);window.removeEventListener('offline',offline);document.removeEventListener('visibilitychange',visibility);};
 },[path,query]);
 if(!data)return <section className="state" aria-live="polite"><h1>Even niet beschikbaar</h1><p>{message||'De actuele inhoud wordt gecontroleerd.'}</p><a href={listingPath}>Naar het overzicht</a></section>;
 if('items'in data)return <section className="protected-content"><h1>Informatie</h1>{data.items.map(p=><p key={p.public_id}><a href={'/'+p.slug+'?locale='+p.locale}>{p.title}</a></p>)}</section>;
 return <article className="article protected-content"><h1>{data.title}</h1><p>{data.summary}</p>{data.hero&&<figure><img src={'/page-media/'+data.hero.public_media_id} alt={data.hero.alt} width={640} height={360}/>{data.hero.credit&&<figcaption>{data.hero.credit}</figcaption>}</figure>}<div style={{whiteSpace:'pre-wrap'}}>{data.body.value}</div>{data.links.map(l=><p key={l.href}><a href={l.href}>{l.label}</a></p>)}</article>;
}
