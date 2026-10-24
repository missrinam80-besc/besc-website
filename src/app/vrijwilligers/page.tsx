import {Shell} from '@/components/shell';
import {VacancyView} from '@/components/vacancy-view';
import {vacancies} from '@/lib/vacancy-data';
import {ContentFailure} from '@/lib/content';
export const dynamic='force-dynamic';
export default async function Page({searchParams}:{searchParams:Promise<Record<string,string|undefined>>}){
 const q=await searchParams,query=new URLSearchParams();for(const k of ['locale','search','cursor'])if(q[k])query.set(k,q[k]);let data;try{data=await vacancies('vacancies','?'+query);}catch(e){if(!(e instanceof ContentFailure))throw e;return <Shell><h1>Vacatures zijn nu niet beschikbaar</h1></Shell>;}
 return <Shell><form action="/vrijwilligers"><label>Zoek een vacature<input name="search" maxLength={80} defaultValue={q.search}/></label><label>Taal<select name="locale" defaultValue={q.locale??'nl-BE'}><option value="nl-BE">Nederlands</option><option value="fr-BE">Frans</option><option value="en">Engels</option></select></label><button>Zoeken</button></form><VacancyView initial={data} path="vacancies" query={'?'+query}/></Shell>;
}
