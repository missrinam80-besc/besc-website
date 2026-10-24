import {Shell} from '@/components/shell';
import {PartnerView} from '@/components/partner-view';
import {partners} from '@/lib/partner-data';
import {ContentFailure} from '@/lib/content';
export const dynamic='force-dynamic';
export default async function Page({params,searchParams}:{params:Promise<{slug:string}>;searchParams:Promise<Record<string,string|string[]|undefined>>}){
 const {slug}=await params,query=await searchParams;
 if(Object.keys(query).some(k=>k!=='locale')||Array.isArray(query.locale))return <Shell><section className="state"><h1>Controleer de gekozen taal</h1></section></Shell>;
 const q=new URLSearchParams();if(query.locale)q.set('locale',query.locale);let data;
 try{data=await partners('partners/'+slug,'?'+q.toString());}catch(e){if(!(e instanceof ContentFailure))throw e;return <Shell><section className="state"><h1>Deze vermelding is niet beschikbaar</h1><a href="/samenwerkingen">Alle samenwerkingen</a></section></Shell>;}
 if('items'in data)throw Error('invalid_partner_detail');return <Shell><PartnerView initial={data} path={'partners/'+slug} query={'?'+q.toString()}/></Shell>;
}
