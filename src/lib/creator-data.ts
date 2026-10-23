import 'server-only';
import {z} from 'zod';
import {viewerToken} from './auth';
import {ContentFailure} from './content';
import {creatorOwnSchema,creatorListSchema,creatorPublicationSchema} from './creator-contract';
async function request(path:string,body?:unknown){
 if(process.env.BESC_CREATOR_PLATFORM_ENABLED!=='true'||process.env.BESC_WEBSITE_STAGING_ENABLED!=='true')throw new ContentFailure(503);
 const origin=new URL(process.env.BESC_CC_URL??'https://cc-dev.belgianstreamerscommunity.be');
 if(origin.origin!=='https://cc-dev.belgianstreamerscommunity.be'||origin.username||origin.password||origin.protocol!=='https:')throw new ContentFailure(503);
 const key=process.env.BESC_PUBLICATION_KEY;if(!key||key.length<32)throw new ContentFailure(503);
 const signal=AbortSignal.timeout(5000),token=await viewerToken(signal);let response:Response;
 try{response=await fetch(new URL('/api/v1/platform/'+path,origin),{method:body?'POST':'GET',headers:{Authorization:'Bearer '+token,'X-BESC-Publication-Key':key,...(body?{'Content-Type':'application/json'}:{})},body:body?JSON.stringify(body):undefined,cache:'no-store',redirect:'error',signal});}catch{throw new ContentFailure(503);}
 if(!response.ok)throw new ContentFailure([400,401,403,404,409,413,429].includes(response.status)?response.status:503);
 const reader=response.body?.getReader();if(!reader)throw new ContentFailure(503);const chunks:Uint8Array[]=[];let size=0;
 try{while(true){const x=await reader.read();if(x.done)break;size+=x.value.length;if(size>2097152){await reader.cancel();throw new ContentFailure(503);}chunks.push(x.value);}}catch{throw new ContentFailure(503);}
 const bytes=Buffer.concat(chunks);if(path.startsWith('publications/media/'))return {bytes:new Uint8Array(bytes),mime:response.headers.get('content-type')};
 try{return JSON.parse(bytes.toString('utf8')) as unknown;}catch{throw new ContentFailure(503);}
}
export async function ownCreator(){const parsed=creatorOwnSchema.safeParse(await request('me'));if(!parsed.success)throw new ContentFailure(503);return parsed.data;}
export async function writeCreator(body:unknown){const parsed=z.object({id:z.string().uuid()}).strict().safeParse(await request('workflow',body));if(!parsed.success)throw new ContentFailure(503);return parsed.data;}
export async function creators(path='creators',query=''){
 if(!/^creators(?:\/[a-z0-9]+(?:-[a-z0-9]+)*)?$/.test(path)||path.length>170)throw new ContentFailure(400);
 const raw=await request('publications/'+path+query),parsed=(path==='creators'?creatorListSchema:creatorPublicationSchema).safeParse(raw);if(!parsed.success)throw new ContentFailure(503);return parsed.data;
}
export async function creatorMedia(id:string){if(!z.string().uuid().safeParse(id).success)throw new ContentFailure(400);const r=await request('publications/media/'+id) as {bytes:Uint8Array;mime:string};if(!['image/png','image/webp'].includes(r.mime))throw new ContentFailure(503);return r;}
