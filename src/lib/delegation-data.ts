import 'server-only';
import {z} from 'zod';
import {platformRequest} from './platform-request';
import {ContentFailure} from './content';
import {delegationOwnSchema} from './delegation-contract';
export async function ownDelegations(id?:string){if(id&&!z.string().uuid().safeParse(id).success)throw new ContentFailure(404);const v=delegationOwnSchema.safeParse(await platformRequest('representation'+(id?'/delegations/'+id:''),undefined,'delegation'));if(!v.success||id&&(v.data.delegations.length!==1||v.data.delegations[0].id!==id))throw new ContentFailure(503);return v.data;}
export async function writeDelegation(body:unknown){const v=z.object({id:z.string().uuid()}).strict().safeParse(await platformRequest('representation/workflow',body,'delegation'));if(!v.success)throw new ContentFailure(503);return v.data;}
