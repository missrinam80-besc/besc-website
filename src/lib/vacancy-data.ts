import 'server-only';
import {platformRequest} from './platform-request';
import {ContentFailure} from './content';
import {vacancyPublicationSchema,vacancyListSchema} from './vacancy-contract';
export async function vacancies(path='vacancies',query=''){
 if(!/^vacancies(?:\/[a-z0-9]+(?:-[a-z0-9]+)*)?$/.test(path)||path.length>180)throw new ContentFailure(400);
 const raw=await platformRequest('publications/'+path+query,undefined,'vacancy'),v=(path==='vacancies'?vacancyListSchema:vacancyPublicationSchema).safeParse(raw);if(!v.success)throw new ContentFailure(503);return v.data;
}
