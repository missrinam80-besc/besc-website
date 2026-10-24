import 'server-only';
import {z} from 'zod';
import {platformRequest} from './platform-request';
import {ContentFailure} from './content';
import {pagePublicationSchema,pageListSchema,pageNavigationSchema} from './site-content-contract';
export async function pages(path='pages',query=''){
 if(!/^pages(?:\/[a-z0-9]+(?:-[a-z0-9]+)*)?$/.test(path)||path.length>170)throw new ContentFailure(400);
 const raw=await platformRequest('publications/'+path+query,undefined,'page'),v=(path==='pages'?pageListSchema:pagePublicationSchema).safeParse(raw);if(!v.success)throw new ContentFailure(503);return v.data;
}
export async function pageMedia(id:string){if(!z.string().uuid().safeParse(id).success)throw new ContentFailure(400);const r=await platformRequest('publications/pages/media/'+id,undefined,'page')as{bytes:Uint8Array;mime:string};if(!['image/png','image/webp'].includes(r.mime))throw new ContentFailure(503);return r;}

export async function pageNavigation(){const v=pageNavigationSchema.safeParse(await platformRequest('navigation?locale=nl-BE',undefined,'page'));if(!v.success)throw new ContentFailure(503);return v.data;}
