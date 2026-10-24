import {Shell} from '@/components/shell';
import {VacancyView} from '@/components/vacancy-view';
import {vacancies} from '@/lib/vacancy-data';
import {ContentFailure} from '@/lib/content';
export const dynamic='force-dynamic';
export default async function Page({params,searchParams}:{params:Promise<{slug:string}>;searchParams:Promise<{locale?:string}>}){
 const {slug}=await params,{locale='nl-BE'}=await searchParams,query='?locale='+encodeURIComponent(locale);let data;try{data=await vacancies('vacancies/'+slug,query);}catch(e){if(!(e instanceof ContentFailure))throw e;return <Shell><h1>Deze vacature is niet beschikbaar</h1><a href="/vrijwilligers">Alle vacatures</a></Shell>;}
 return <Shell><VacancyView initial={data} path={'vacancies/'+slug} query={query}/></Shell>;
}
