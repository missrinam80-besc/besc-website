import {PageContent} from '@/components/page-content';
import {Shell} from '@/components/shell';
import {SitePageView} from '@/components/site-page-view';
import {pages} from '@/lib/site-content-data';
import {ContentFailure} from '@/lib/content';
import {releasePreviewEnabled} from '@/lib/deployment-config';
export const dynamic='force-dynamic';
export default async function Page(){
 if(!releasePreviewEnabled(process.env))return <PageContent path="news" title="De laatste verhalen" home/>;
 let data;
 try{data=await pages('pages/home','?locale=nl-BE');}
 catch(e){if(!(e instanceof ContentFailure))throw e;return <Shell><section className="state"><h1>Home is momenteel niet beschikbaar</h1><p>De actuele vrijgegeven inhoud kon niet worden bevestigd.</p></section></Shell>;}
 return <Shell><SitePageView initial={data} path="pages/home" query="?locale=nl-BE"/></Shell>;
}
