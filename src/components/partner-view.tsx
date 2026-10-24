'use client';
import {useEffect,useState} from 'react';
import {partnerListSchema,partnerPublicationSchema,partnerRoleLabels,type PartnerPublication} from '@/lib/partner-contract';
type Data={schema_version:'besc-platform-publication-v1';items:PartnerPublication[];next_cursor:string|null}|PartnerPublication;
export function PartnerDetails({partner}:{partner:PartnerPublication}){return <><h1>{partner.name}</h1>{partner.logo&&<figure><img src={'/partner-media/'+partner.logo.public_media_id} alt={partner.logo.alt} width={240} height={240}/>{partner.logo.credit&&<figcaption>{partner.logo.credit}</figcaption>}</figure>}<p style={{whiteSpace:'pre-wrap'}}>{partner.description}</p><ul>{partner.roles.map(r=><li key={r}>{partnerRoleLabels[r]}</li>)}</ul>{partner.website_url&&<p><a href={partner.website_url} target="_blank" rel="noopener noreferrer">Website van {partner.name}</a></p>}</>;}
export function PartnerView({initial,path,query='',listingPath='/samenwerkingen'}:{initial:Data;path:string;query?:string;listingPath?:string}){
 const [data,setData]=useState<Data|null>(initial),[message,setMessage]=useState('');
 useEffect(()=>{let alive=true,busy=false;let controller:AbortController|null=null;
  const hide=()=>{document.documentElement.dataset.protected='true';setData(null);};
  const check=async()=>{if(busy)return;busy=true;controller=new AbortController();const timer=setTimeout(()=>controller?.abort(),5000);
   try{const r=await fetch('/api/platform/'+path+query,{credentials:'same-origin',cache:'no-store',redirect:'error',signal:controller.signal});if(!r.ok)throw Error();const v=(path==='partners'?partnerListSchema:partnerPublicationSchema).safeParse(await r.json());if(!v.success)throw Error();if(alive&&document.visibilityState==='visible'){setData(v.data);setMessage('');delete document.documentElement.dataset.protected;}}
   catch{if(alive){hide();setMessage('De vermelding is ingetrokken, niet toegankelijk of kon niet opnieuw worden gecontroleerd.');}}finally{clearTimeout(timer);busy=false;}
  };
  const resume=()=>{hide();void check();},visibility=()=>{if(document.visibilityState==='hidden'){controller?.abort();hide();}else resume();},offline=()=>{controller?.abort();hide();};
  const timer=setInterval(()=>{if(document.visibilityState==='visible')void check();},20000);window.addEventListener('focus',resume);window.addEventListener('pageshow',resume);window.addEventListener('pagehide',hide);window.addEventListener('offline',offline);document.addEventListener('visibilitychange',visibility);if(document.visibilityState==='hidden')hide();else void check();
  return()=>{alive=false;controller?.abort();clearInterval(timer);window.removeEventListener('focus',resume);window.removeEventListener('pageshow',resume);window.removeEventListener('pagehide',hide);window.removeEventListener('offline',offline);document.removeEventListener('visibilitychange',visibility);};
 },[path,query]);
 if(!data)return <section className="state" aria-live="polite"><h1>Even niet beschikbaar</h1><p>{message||'De actuele inhoud wordt gecontroleerd.'}</p><a href={listingPath}>Naar het overzicht</a></section>;
 if('items'in data){const q=new URLSearchParams(query);if(data.next_cursor)q.set('cursor',data.next_cursor);return <section className="protected-content"><h1>{listingPath==='/esports'?'Esports':'Samenwerkingen'}</h1><p>Alleen beoordeelde, afzonderlijk vrijgegeven vermeldingen met actuele, onderbouwde rollen.</p>{!data.items.length?<p>Er zijn momenteel geen beschikbare vermeldingen voor deze selectie.</p>:<div className="grid">{data.items.map(p=><article className="card" key={p.public_id}>{p.logo&&<img src={'/partner-media/'+p.logo.public_media_id} alt={p.logo.alt} width={120} height={120}/>}<h2><a href={'/samenwerkingen/'+p.slug+'?locale='+p.locale}>{p.name}</a></h2><p>{p.description}</p><p>{p.roles.map(r=>partnerRoleLabels[r]).join(' · ')}</p></article>)}</div>}{data.next_cursor&&<a className="button" href={listingPath+'?'+q.toString()}>Meer vermeldingen</a>}</section>;}
 return <article className="article protected-content"><a href="/samenwerkingen">Alle samenwerkingen</a><PartnerDetails partner={data}/></article>;
}
