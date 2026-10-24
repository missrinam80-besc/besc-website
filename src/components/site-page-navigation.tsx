import {pageNavigation} from '@/lib/site-content-data';
import {ContentFailure} from '@/lib/content';
import {SitePageLinks} from './site-page-links';
export async function SitePageNavigation(){try{return <SitePageLinks initial={await pageNavigation()}/>;}catch(e){if(!(e instanceof ContentFailure))throw e;return null;}}
