import {content,ContentFailure} from '@/lib/content';
export const dynamic='force-dynamic';
const headers={'Cache-Control':'private, no-store, max-age=0','X-Robots-Tag':'noindex, nofollow','X-Content-Type-Options':'nosniff'};
export async function GET(request:Request,{params}:{params:Promise<{path:string[]}>}){
 const path=(await params).path;if(path.length>2||!['news','events'].includes(path[0])||path[1]&&!/^[a-z0-9]+(-[a-z0-9]+)*$/.test(path[1]))return Response.json({code:'not_found'},{status:404,headers});
 const query=new URL(request.url).search;
 try{return Response.json(await content(path.join('/'),query),{headers});}catch(e){if(!(e instanceof ContentFailure))throw e;return Response.json({code:'not_available'},{status:e.status,headers});}
}
