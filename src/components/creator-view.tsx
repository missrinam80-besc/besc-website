'use client';
import {useEffect,useState} from 'react';
import {creatorListSchema,creatorPublicationSchema,type CreatorPublication} from '@/lib/creator-contract';
type Data={schema_version:'besc-platform-publication-v1';items:CreatorPublication[];next_cursor:string|null}|CreatorPublication;
export function CreatorDetails({profile}:{profile:CreatorPublication}){return <><h1>{profile.display_name}</h1>{profile.avatar&&<figure><img src={'/creator-media/'+profile.avatar.public_media_id} alt={profile.avatar.alt} width={240} height={240}/>{profile.avatar.credit&&<figcaption>{profile.avatar.credit}</figcaption>}</figure>}{profile.bio&&<p style={{whiteSpace:'pre-wrap'}}>{profile.bio}</p>}{Boolean(profile.disciplines?.length)&&<p>Disciplines: {profile.disciplines?.join(', ')}</p>}{Boolean(profile.languages?.length)&&<p>Talen: {profile.languages?.join(', ')}</p>}<ul>{profile.platform_links?.map(p=><li key={p.platform+p.url}><a href={p.url} target="_blank" rel="noopener noreferrer">{p.platform}</a></li>)}</ul></>;}
export function CreatorView({initial,path,query=''}:{initial:Data;path:string;query?:string}){
 const [data,setData]=useState<Data|null>(initial),[message,setMessage]=useState('');
 useEffect(()=>{let alive=true,busy=false;let controller:AbortController|null=null;
  const hide=()=>{document.documentElement.dataset.protected='true';setData(null);};
  const check=async()=>{if(busy)return;busy=true;controller=new AbortController();const timer=setTimeout(()=>controller?.abort(),5000);
   try{const r=await fetch('/api/platform/'+path+query,{credentials:'same-origin',cache:'no-store',redirect:'error',signal:controller.signal});if(!r.ok)throw Error();const raw=await r.json(),parsed=(path==='creators'?creatorListSchema:creatorPublicationSchema).safeParse(raw);if(!parsed.success)throw Error();if(alive&&document.visibilityState==='visible'){setData(parsed.data);setMessage('');delete document.documentElement.dataset.protected;}}
   catch{if(alive){hide();setMessage('Het profiel is ingetrokken, niet toegankelijk of kon niet opnieuw worden gecontroleerd.');}}
   finally{clearTimeout(timer);busy=false;}
  };
  const resume=()=>{hide();void check();};const visibility=()=>{if(document.visibilityState==='hidden'){controller?.abort();hide();}else resume();};const offline=()=>{controller?.abort();hide();};
  const timer=setInterval(()=>{if(document.visibilityState==='visible')void check();},20000);window.addEventListener('focus',resume);window.addEventListener('pageshow',resume);window.addEventListener('pagehide',hide);window.addEventListener('offline',offline);document.addEventListener('visibilitychange',visibility);if(document.visibilityState==='hidden')hide();else void check();
  return()=>{alive=false;controller?.abort();clearInterval(timer);window.removeEventListener('focus',resume);window.removeEventListener('pageshow',resume);window.removeEventListener('pagehide',hide);window.removeEventListener('offline',offline);document.removeEventListener('visibilitychange',visibility);};
 },[path,query]);
 if(!data)return <section className="state" aria-live="polite"><h1>Even niet beschikbaar</h1><p>{message||'De actuele inhoud wordt gecontroleerd.'}</p><a href="/creators">Naar het creatoroverzicht</a></section>;
 if('items'in data){const q=new URLSearchParams(query);if(data.next_cursor)q.set('cursor',data.next_cursor);return <section className="protected-content"><h1>Creator Network</h1><p>Hier staan alleen beoordeelde, vrijgegeven profielen met een actuele persoonlijke veldkeuze.</p>{!data.items.length?<p>Er zijn momenteel geen beschikbare profielen voor deze selectie.</p>:<div className="grid">{data.items.map(p=><article className="card" key={p.public_id}>{p.avatar&&<img src={'/creator-media/'+p.avatar.public_media_id} alt={p.avatar.alt} width={120} height={120}/>}<h2><a href={'/creators/'+p.slug}>{p.display_name}</a></h2>{p.bio&&<p>{p.bio}</p>}<p>{p.disciplines?.join(' · ')}</p></article>)}</div>}{data.next_cursor&&<a className="button" href={'/creators?'+q.toString()}>Meer profielen</a>}</section>;}
 return <article className="article protected-content"><a href="/creators">← Alle creators</a><CreatorDetails profile={data}/></article>;
}
