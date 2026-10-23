'use client';
import {useEffect,useState} from 'react';
import {intakeOwnSchema,intakeDetailSchema} from '@/lib/intake-contract';
export function IntakeLease({leaseId,versionKey,detailId,children}:{leaseId:string;versionKey:string;detailId?:string;children:React.ReactNode}){
 const [blocked,setBlocked]=useState(false);
 useEffect(()=>{let alive=true,busy=false;let controller:AbortController|null=null;
  const hide=()=>{document.documentElement.dataset.protected='true';};
  const check=async()=>{if(busy)return;busy=true;controller=new AbortController();const timer=setTimeout(()=>controller?.abort(),5000);
   try{const r=await fetch('/api/platform/intake'+(detailId?'/applications/'+detailId:''),{cache:'no-store',credentials:'same-origin',redirect:'error',signal:controller.signal});if(!r.ok)throw Error();const raw=await r.json();let key:string,id:string;
    if(detailId){const v=intakeDetailSchema.parse(raw);id=v.lease_id;key=String(v.version);}else{const v=intakeOwnSchema.parse(raw);id=v.lease_id;key=JSON.stringify([v.forms.map(f=>[f.id,f.vacancies?.map(v=>[v.public_id,v.revision])??[]]),v.applications.map(a=>[a.id,a.version])]);}
    if(id!==leaseId||key!==versionKey)throw Error();if(alive&&document.visibilityState==='visible'){setBlocked(false);delete document.documentElement.dataset.protected;}
   }catch{if(alive){hide();if(document.visibilityState==='visible'||!controller.signal.aborted)setBlocked(true);}}finally{clearTimeout(timer);busy=false;}
  };
  const resume=()=>{hide();void check();},visibility=()=>{if(document.visibilityState==='hidden'){controller?.abort();hide();}else resume();},offline=()=>{controller?.abort();hide();};
  const timer=setInterval(()=>{if(document.visibilityState==='visible')void check();},20000);window.addEventListener('focus',resume);window.addEventListener('pageshow',resume);window.addEventListener('pagehide',hide);window.addEventListener('offline',offline);document.addEventListener('visibilitychange',visibility);if(document.visibilityState==='hidden')hide();else void check();
  return()=>{alive=false;controller?.abort();clearInterval(timer);window.removeEventListener('focus',resume);window.removeEventListener('pageshow',resume);window.removeEventListener('pagehide',hide);window.removeEventListener('offline',offline);document.removeEventListener('visibilitychange',visibility);};
 },[leaseId,versionKey,detailId]);
 if(blocked)return <section className="state" role="status"><h1>Controleer de actuele aanvraaggegevens</h1><p>Je toegang of gegevens zijn gewijzigd, of konden niet opnieuw worden gecontroleerd. Oude gegevens worden niet meer getoond.</p><a href={'/mijn-besc/aanvragen'+(detailId?'/'+detailId:'')}>Actuele gegevens openen</a></section>;
 return <><p className="wait-for-content" role="status">Je actuele toegang wordt gecontroleerd.</p><div className="protected-content">{children}</div></>;
}
