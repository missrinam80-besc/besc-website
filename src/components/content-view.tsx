'use client';
import {useEffect,useState} from 'react';
import type {F2Publication} from '@/lib/contract';
type Data={items:F2Publication[];next_cursor:string|null}|F2Publication;
const date=(v:string)=>new Intl.DateTimeFormat('nl-BE',{dateStyle:'long',timeStyle:'short',timeZone:'Europe/Brussels'}).format(new Date(v));
function Card({item}:{item:F2Publication}){return <article className="card"><p className="eyebrow">{item.type==='event'?'Event':'Nieuws'}</p><h2><a href={(item.type==='event'?'/events/':'/nieuws/')+item.slug}>{item.title}</a></h2><p>{item.summary}</p>{item.type==='event'&&<p className="date">{date(item.starts_at)}</p>}<a className="more" href={(item.type==='event'?'/events/':'/nieuws/')+item.slug}>Lees verder <span aria-hidden="true">↗</span></a></article>;}
export function ContentView({initial,path,title}:{initial:Data;path:string;title:string}){
 const [data,setData]=useState<Data|null>(initial),[status,setStatus]=useState('');
 useEffect(()=>{let alive=true,controller:AbortController|null=null,inFlight=false;
  const hide=()=>{document.documentElement.dataset.protected='true';setData(null);setStatus('De inhoud wordt opnieuw gecontroleerd.');};
  const check=async()=>{if(inFlight)return;inFlight=true;controller=new AbortController();const timeout=setTimeout(()=>controller?.abort(),5000);
   try{const r=await fetch('/api/content/'+path,{cache:'no-store',credentials:'same-origin',redirect:'error',signal:controller.signal});if(!r.ok)throw Error('unavailable');const next=await r.json();if(alive&&document.visibilityState==='visible'){delete document.documentElement.dataset.protected;setData(next);setStatus('');}}
   catch{if(alive){setData(null);setStatus('Deze inhoud is niet meer beschikbaar of kon niet opnieuw worden gecontroleerd. Vernieuw de pagina om opnieuw te proberen.');}}
   finally{clearTimeout(timeout);inFlight=false;}
  };
  const visibility=()=>{if(document.visibilityState==='hidden'){controller?.abort();hide();}else{hide();void check();}};
  const resume=()=>{hide();void check();};
  const offline=()=>{controller?.abort();hide();};
  const timer=setInterval(()=>{if(document.visibilityState==='visible')void check();},20000);
  document.addEventListener('visibilitychange',visibility);window.addEventListener('pageshow',resume);window.addEventListener('pagehide',hide);window.addEventListener('focus',resume);window.addEventListener('offline',offline);if(document.visibilityState==='hidden')hide();else void check();
  return()=>{alive=false;controller?.abort();clearInterval(timer);document.removeEventListener('visibilitychange',visibility);window.removeEventListener('pageshow',resume);window.removeEventListener('pagehide',hide);window.removeEventListener('focus',resume);window.removeEventListener('offline',offline);};
 },[path]);
 if(!data)return <section className="state" aria-live="polite"><h1>Even niet beschikbaar</h1><p>{status}</p><a href="/">Terug naar home</a></section>;
 if('items'in data)return <section className="protected-content"><div className="section-head"><p className="eyebrow">BESC · Community</p><h1>{title}</h1></div>{!data.items.length?<div className="state"><h2>Nog niets aangekondigd</h2><p>Hier verschijnen alleen beoordeelde en vrijgegeven berichten.</p></div>:<div className="grid">{data.items.map(item=><Card key={item.public_id} item={item}/>)}</div>}{data.next_cursor&&<a className="button" href={(path.startsWith('events')?'/events':'/nieuws')+'?cursor='+encodeURIComponent(data.next_cursor)}>Meer bekijken</a>}</section>;
 return <article className="article protected-content"><a className="back" href={data.type==='event'?'/events':'/nieuws'}>← Alle {data.type==='event'?'events':'nieuwsberichten'}</a><p className="eyebrow">{data.type==='event'?'BESC · Event':'BESC · Nieuws'}</p><h1>{data.title}</h1><p className="lead">{data.summary}</p>{data.type==='event'&&<dl className="event-meta"><div><dt>Wanneer</dt><dd>{date(data.starts_at)} – {date(data.ends_at)}</dd></div><div><dt>Waar</dt><dd>{data.location_label}</dd></div></dl>}{data.media.map(m=><figure key={m.public_media_id}><img src={'/media/'+m.public_media_id} alt={m.alt}/>{m.credit&&<figcaption>{m.credit}</figcaption>}</figure>)}<div className="prose" dangerouslySetInnerHTML={{__html:data.body.value}}/>{data.type==='event'&&data.registration_url&&<a className="button" href={data.registration_url} rel="noopener noreferrer" target="_blank">Meer informatie en inschrijven</a>}</article>;
}
