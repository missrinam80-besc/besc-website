import {vacancies} from '@/lib/vacancy-data';
import {partners} from '@/lib/partner-data';
import {ownIntake,intakeDetail} from '@/lib/intake-data';
import {ownCreator,creators} from '@/lib/creator-data';
import {ContentFailure} from '@/lib/content';
export const dynamic='force-dynamic';
const headers={'Cache-Control':'private, no-store, max-age=0','X-Robots-Tag':'noindex, nofollow','X-Content-Type-Options':'nosniff'};
export async function GET(request:Request,{params}:{params:Promise<{path:string[]}>}){
 const path=(await params).path;const query=new URL(request.url).search;
 if(path[0]==='vacancies'){if(path.length>2||path[1]&&!/^[a-z0-9]+(-[a-z0-9]+)*$/.test(path[1]))return Response.json({code:'not_found'},{status:404,headers});try{return Response.json(await vacancies(path.join('/'),query),{headers});}catch(e){if(!(e instanceof ContentFailure))throw e;return Response.json({code:'not_available'},{status:e.status,headers});}}
 if(path[0]==='partners'){if(path.length>2||path[1]&&!/^[a-z0-9]+(-[a-z0-9]+)*$/.test(path[1]))return Response.json({code:'not_found'},{status:404,headers});try{return Response.json(await partners(path.join('/'),query),{headers});}catch(e){if(!(e instanceof ContentFailure))throw e;return Response.json({code:'not_available'},{status:e.status,headers});}}
 if(path[0]==='intake'){if(query||!(path.length===1||path.length===3&&path[1]==='applications'))return Response.json({code:'not_found'},{status:404,headers});try{return Response.json(path.length===1?await ownIntake():await intakeDetail(path[2]),{headers});}catch(e){if(!(e instanceof ContentFailure))throw e;return Response.json({code:'not_available'},{status:e.status,headers});}}
 if(path.length>2||!['me','creators'].includes(path[0])||path[0]==='me'&&(path.length!==1||query)||path[1]&&!/^[a-z0-9]+(-[a-z0-9]+)*$/.test(path[1]))return Response.json({code:'not_found'},{status:404,headers});
 try{return Response.json(path[0]==='me'?await ownCreator():await creators(path.join('/'),query),{headers});}catch(e){if(!(e instanceof ContentFailure))throw e;return Response.json({code:'not_available'},{status:e.status,headers});}
}
