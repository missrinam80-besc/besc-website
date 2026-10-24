import {Shell} from '@/components/shell';
import {creators} from '@/lib/creator-data';
import {ContentFailure} from '@/lib/content';
import {CreatorView} from '@/components/creator-view';
export const dynamic='force-dynamic';
export default async function Page({searchParams}:{searchParams:Promise<Record<string,string|string[]|undefined>>}){
 const q=await searchParams,params=new URLSearchParams();const allowed=['platform','language','discipline','search','locale','cursor'];for(const k of Object.keys(q)){if(!allowed.includes(k)||Array.isArray(q[k]))return <Shell><section className="state"><h1>Controleer je selectie</h1><a href="/creators">Filters opnieuw kiezen</a></section></Shell>;if(q[k])params.set(k,String(q[k]));}
 let data;try{data=await creators('creators',params.size?'?'+params.toString():'');}catch(e){if(!(e instanceof ContentFailure))throw e;return <Shell><section className="state"><h1>{e.status===403?'Je hebt nog geen toegang':'Creatorprofielen zijn nu niet beschikbaar'}</h1><p>Er wordt geen oude inhoud getoond.</p><a href="/mijn-besc">Mijn BESC</a></section></Shell>;}
 return <Shell><form className="creator-filters" method="get"><label>Naam<input name="search" maxLength={80} defaultValue={q.search as string??''}/></label><label>Platform<select name="platform" defaultValue={q.platform as string??''}><option value="">Alle platforms</option>{['twitch','youtube','kick','tiktok'].map(p=><option key={p} value={p}>{p}</option>)}</select></label><label>Taal<input name="language" maxLength={30} defaultValue={q.language as string??''}/></label><label>Discipline<input name="discipline" maxLength={60} defaultValue={q.discipline as string??''}/></label><button className="button">Zoeken</button></form><p className="wait-for-content" role="status">De actuele inhoud wordt gecontroleerd.</p><CreatorView initial={data} path="creators" query={params.size?'?'+params.toString():''}/></Shell>;
}
