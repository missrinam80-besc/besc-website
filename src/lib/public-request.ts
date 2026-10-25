import 'server-only';
import {publicWebsiteEnabled,commandCenterOrigin} from './deployment-config';
export class PublicReadFailure extends Error {
 constructor(public status:number){super('public_content_unavailable');}
}
export async function publicRequest(path:string,query=''){
 const fail=(status:number):never=>{throw new PublicReadFailure(status);};
 try{if(!publicWebsiteEnabled(process.env))return fail(503);}catch{return fail(503);}
 if(path.length>170||!(/^(news|events|pages)(\/[a-z0-9]+(?:-[a-z0-9]+)*)?$/.test(path)||/^media\/[a-f0-9-]{36}$/.test(path)))return fail(400);
 if(query.length>2200||query&&!query.startsWith('?')||query.includes('#'))return fail(400);
 const params=new URLSearchParams(query),detail=path.includes('/'),media=path.startsWith('media/');
 for(const name of params.keys())if(!(detail?['locale']:['locale','limit','cursor']).includes(name)||params.getAll(name).length!==1)return fail(400);
 if(media&&query)return fail(400);
 const key=process.env.BESC_PUBLIC_WEBSITE_KEY;
 if(!key||key.length<32||key.length>256)return fail(503);
 const url=new URL('/api/v1/public-website/'+path,commandCenterOrigin(process.env));url.search=params.toString();
 let response:Response;
 try{response=await fetch(url,{headers:{'X-BESC-Publication-Key':key},cache:'no-store',redirect:'error',signal:AbortSignal.timeout(4500)});}catch{return fail(503);}
 if(!response.ok)return fail([400,401,403,404,429].includes(response.status)?response.status:503);
 if(!response.body)return fail(503);
 const reader=response.body.getReader(),parts:Uint8Array[]=[];let length=0;
 try{while(true){const item=await reader.read();if(item.done)break;length+=item.value.byteLength;if(length>2097152){await reader.cancel();return fail(503);}parts.push(item.value);}}
 catch{return fail(503);}finally{reader.releaseLock();}
 const bytes=Buffer.concat(parts);
 if(media){const mime=response.headers.get('content-type')??'';if(!['image/png','image/webp'].includes(mime))return fail(503);return {bytes:new Uint8Array(bytes),mime};}
 try{return JSON.parse(bytes.toString('utf8')) as unknown;}catch{return fail(503);}
}
