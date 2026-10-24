import {notFound} from 'next/navigation';
import {Shell} from '@/components/shell';
import {ContactForm} from '@/components/contact-form';
import {SitePageView} from '@/components/site-page-view';
import {pages} from '@/lib/site-content-data';
import {ContentFailure} from '@/lib/content';
export const dynamic='force-dynamic';
export default async function Page({searchParams}:{searchParams:Promise<{locale?:string}>}){
 const {locale='nl-BE'}=await searchParams,query='?locale='+encodeURIComponent(locale);
 if(process.env.BESC_GENERAL_CONTACT_ENABLED==='true')return <Shell><ContactForm/></Shell>;
 if(process.env.BESC_SITE_PAGES_ENABLED!=='true')notFound();let data;try{data=await pages('pages/contact',query);}catch(e){if(!(e instanceof ContentFailure))throw e;if(e.status===404)notFound();return <Shell><h1>Contact is momenteel niet beschikbaar</h1></Shell>;}
 return <Shell><SitePageView initial={data} path="pages/contact" query={query}/></Shell>;
}
