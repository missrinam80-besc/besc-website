import 'server-only';
import {z} from 'zod';
import {platformRequest as request} from './platform-request';
import {ContentFailure} from './content';
import {creatorOwnSchema,creatorListSchema,creatorPublicationSchema} from './creator-contract';
export async function ownCreator(){const parsed=creatorOwnSchema.safeParse(await request('me'));if(!parsed.success)throw new ContentFailure(503);return parsed.data;}
export async function writeCreator(body:unknown){const parsed=z.object({id:z.string().uuid()}).strict().safeParse(await request('workflow',body));if(!parsed.success)throw new ContentFailure(503);return parsed.data;}
export async function creators(path='creators',query=''){
 if(!/^creators(?:\/[a-z0-9]+(?:-[a-z0-9]+)*)?$/.test(path)||path.length>170)throw new ContentFailure(400);
 const raw=await request('publications/'+path+query),parsed=(path==='creators'?creatorListSchema:creatorPublicationSchema).safeParse(raw);if(!parsed.success)throw new ContentFailure(503);return parsed.data;
}
export async function creatorMedia(id:string){if(!z.string().uuid().safeParse(id).success)throw new ContentFailure(400);const r=await request('publications/media/'+id) as {bytes:Uint8Array;mime:string};if(!['image/png','image/webp'].includes(r.mime))throw new ContentFailure(503);return r;}
