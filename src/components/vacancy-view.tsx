'use client';
import {useEffect,useState} from 'react';
import {vacancyListSchema,vacancyPublicationSchema,type Vacancy} from '@/lib/vacancy-contract';
type Data={schema_version:'besc-platform-publication-v1';items:Vacancy[];next_cursor:string|null}|Vacancy;
export function VacancyView({initial,path,query='',listingPath='/vrijwilligers'}:{initial:Data;path:string;query?:string;listingPath?:string}){
 const [data,setData]=useState<Data|null>(initial),[message,setMessage]=useState('');
 useEffect(()=>{let alive=true,busy=false;let controller:AbortController|null=null;
  const hide=()=>{document.documentElement.dataset.protected='true';setData(null);};
  const check=async()=>{if(busy)return;busy=true;controller=new AbortController();const timer=setTimeout(()=>controller?.abort(),5000);
   try{const r=await fetch('/api/platform/'+path+query,{credentials:'same-origin',cache:'no-store',redirect:'error',signal:controller.signal});if(!r.ok)throw Error();const v=(path==='vacancies'?vacancyListSchema:vacancyPublicationSchema).safeParse(await r.json());if(!v.success)throw Error();if(alive&&document.visibilityState==='visible'){setData(v.data);setMessage('');delete document.documentElement.dataset.protected;}}
   catch{if(alive){hide();setMessage('De vermelding is ingetrokken, niet toegankelijk of kon niet opnieuw worden gecontroleerd.');}}finally{clearTimeout(timer);busy=false;}
  };
  const resume=()=>{hide();void check();},visibility=()=>{if(document.visibilityState==='hidden'){controller?.abort();hide();}else resume();},offline=()=>{controller?.abort();hide();};
  const timer=setInterval(()=>{if(document.visibilityState==='visible')void check();},20000);window.addEventListener('focus',resume);window.addEventListener('pageshow',resume);window.addEventListener('pagehide',hide);window.addEventListener('offline',offline);document.addEventListener('visibilitychange',visibility);if(document.visibilityState==='hidden')hide();else void check();
  return()=>{alive=false;controller?.abort();clearInterval(timer);window.removeEventListener('focus',resume);window.removeEventListener('pageshow',resume);window.removeEventListener('pagehide',hide);window.removeEventListener('offline',offline);document.removeEventListener('visibilitychange',visibility);};
 },[path,query]);
 if(!data)return <section className="state" aria-live="polite"><h1>Even niet beschikbaar</h1><p>{message||'De actuele inhoud wordt gecontroleerd.'}</p><a href={listingPath}>Naar het overzicht</a></section>;
 if('items'in data){const q=new URLSearchParams(query);if(data.next_cursor)q.set('cursor',data.next_cursor);return <section className="protected-content"><h1>Vrijwilligersvacatures</h1><p>Een sollicitatie geeft geen benoeming of lidmaatschap.</p>{!data.items.length?<p>Er zijn momenteel geen open vacatures voor deze selectie.</p>:<div className="grid">{data.items.map(v=><article className="card" key={v.public_id}><h2><a href={'/vrijwilligers/vacatures/'+v.slug+'?locale='+v.locale}>{v.title}</a></h2><p>{v.summary}</p><p>{v.role_label} · {v.location_label}</p><p>{v.availability_label}</p></article>)}</div>}{data.next_cursor&&<a className="button" href={listingPath+'?'+q.toString()}>Meer vacatures</a>}</section>;}
 return <article className="article protected-content"><a href={'/vrijwilligers?locale='+data.locale}>Alle vacatures</a><h1>{data.title}</h1><p>{data.summary}</p><p>{data.role_label} · {data.location_label}</p><p>{data.availability_label}</p><div style={{whiteSpace:'pre-wrap'}}>{data.body.value}</div><p>Solliciteren tot {new Date(data.closes_at).toLocaleString('nl-BE',{timeZone:'Europe/Brussels'})}</p><a className="button" href={'/vrijwilligers/vacatures/'+data.slug+'/aanmelden?locale='+data.locale}>Vacature bekijken en solliciteren</a></article>;
}
