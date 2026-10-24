import 'server-only';
import {z} from 'zod';
import {platformRequest} from './platform-request';
import {ContentFailure} from './content';
import {partnerPublicationSchema,partnerListSchema} from './partner-contract';
export async function partners(path='partners',query=''){
 if(!/^partners(?:\/[a-z0-9]+(?:-[a-z0-9]+)*)?$/.test(path)||path.length>170)throw new ContentFailure(400);
 const raw=await platformRequest('publications/'+path+query,undefined,'partner'),v=(path==='partners'?partnerListSchema:partnerPublicationSchema).safeParse(raw);if(!v.success)throw new ContentFailure(503);return v.data;
}
export async function partnerMedia(id:string){if(!z.string().uuid().safeParse(id).success)throw new ContentFailure(400);const r=await platformRequest('publications/partners/media/'+id,undefined,'partner') as {bytes:Uint8Array;mime:string};if(!['image/png','image/webp'].includes(r.mime))throw new ContentFailure(503);return r;}
