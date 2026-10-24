import {pageMedia} from '@/lib/site-content-data';
import {ContentFailure} from '@/lib/content';
export const dynamic='force-dynamic';
const headers={'Cache-Control':'private, no-store, max-age=0','X-Robots-Tag':'noindex, nofollow','X-Content-Type-Options':'nosniff','Content-Security-Policy':"default-src 'none'; sandbox"};
export async function GET(request:Request,{params}:{params:Promise<{id:string}>}){if(new URL(request.url).search)return new Response(null,{status:400,headers});try{const r=await pageMedia((await params).id);return new Response(new Uint8Array(r.bytes),{headers:{...headers,'Content-Type':r.mime}});}catch(e){if(!(e instanceof ContentFailure))throw e;return new Response(null,{status:e.status,headers});}}
