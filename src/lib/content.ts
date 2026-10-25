import {commandCenterOrigin} from './deployment-config';
import 'server-only';
import {f2ListSchema,f2PublicationSchema} from './contract';
import {viewerToken} from './auth';
export class ContentFailure extends Error{constructor(public status:number){super('content_unavailable');}}
export async function content(path:string,query=''){
 if(process.env.BESC_WEBSITE_STAGING_ENABLED!=='true')throw new ContentFailure(503);
 let origin:URL;try{origin=new URL(commandCenterOrigin(process.env));}catch{throw new ContentFailure(503);}
 const signal=AbortSignal.timeout(4500),token=await viewerToken(signal);
 const key=process.env.BESC_PUBLICATION_KEY;if(!key||key.length<32)throw new ContentFailure(503);
 let response:Response;
 try{response=await fetch(new URL('/api/v1/publications/'+path+query,origin),{headers:{Authorization:'Bearer '+token,'X-BESC-Publication-Key':key},cache:'no-store',redirect:'error',signal});}catch{throw new ContentFailure(503);}
 if(!response.ok)throw new ContentFailure([400,401,403,404,429].includes(response.status)?response.status:503);
 if(path.startsWith('media/')){const buffer=await response.arrayBuffer();if(buffer.byteLength>2097152)throw new ContentFailure(503);return {bytes:new Uint8Array(buffer),mime:response.headers.get('content-type')??'application/octet-stream'};}
 let raw:unknown;try{const text=await response.text();if(text.length>2000000)throw Error('large');raw=JSON.parse(text);}catch{throw new ContentFailure(503);}
 const detail=path.split('/').length===2,parsed=(detail?f2PublicationSchema:f2ListSchema).safeParse(raw);if(!parsed.success)throw new ContentFailure(503);
 return parsed.data;
}
