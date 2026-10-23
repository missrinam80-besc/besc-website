'use client';
import {useEffect,useState} from 'react';
import {creatorOwnSchema} from '@/lib/creator-contract';
export function CreatorOwnLease({leaseId,children}:{leaseId:string;children:React.ReactNode}){
 const [denied,setDenied]=useState(false);
 useEffect(()=>{let alive=true,busy=false;let controller:AbortController|null=null;
  const hide=()=>{document.documentElement.dataset.protected='true';};
  const check=async()=>{if(busy)return;busy=true;controller=new AbortController();const timer=setTimeout(()=>controller?.abort(),5000);
   try{const r=await fetch('/api/platform/me',{credentials:'same-origin',cache:'no-store',redirect:'error',signal:controller.signal});if(!r.ok)throw Error();const data=creatorOwnSchema.safeParse(await r.json());if(!data.success||data.data.lease_id!==leaseId)throw Error();if(alive&&document.visibilityState==='visible'){setDenied(false);delete document.documentElement.dataset.protected;}}
   catch{if(alive){hide();if(document.visibilityState==='visible'||!controller.signal.aborted)setDenied(true);}}
   finally{clearTimeout(timer);busy=false;}
  };
  const resume=()=>{hide();void check();};const visibility=()=>{if(document.visibilityState==='hidden'){controller?.abort();hide();}else resume();};const offline=()=>{controller?.abort();hide();};
  const timer=setInterval(()=>{if(document.visibilityState==='visible')void check();},20000);window.addEventListener('focus',resume);window.addEventListener('pageshow',resume);window.addEventListener('pagehide',hide);window.addEventListener('offline',offline);document.addEventListener('visibilitychange',visibility);if(document.visibilityState==='hidden')hide();else void check();
  return()=>{alive=false;controller?.abort();clearInterval(timer);window.removeEventListener('focus',resume);window.removeEventListener('pageshow',resume);window.removeEventListener('pagehide',hide);window.removeEventListener('offline',offline);document.removeEventListener('visibilitychange',visibility);};
 },[leaseId]);
 if(denied)return <section className="state" role="status"><h1>Je eigen toegang wordt opnieuw gecontroleerd</h1><p>Er worden geen oude profielgegevens getoond. Vernieuw de pagina om de actuele toestand te openen.</p><a href="/mijn-besc">Mijn BESC opnieuw openen</a></section>;
 return <><p className="wait-for-content" role="status">Je actuele toegang wordt gecontroleerd.</p><div className="protected-content">{children}</div></>;
}
