import 'server-only';
import {z} from 'zod';
import {platformRequest} from './platform-request';
import {ContentFailure} from './content';
import {intakeOwnSchema,intakeDetailSchema} from './intake-contract';
export async function ownIntake(){const v=intakeOwnSchema.safeParse(await platformRequest('intake',undefined,'intake'));if(!v.success)throw new ContentFailure(503);return v.data;}
export async function intakeDetail(id:string){if(!z.string().uuid().safeParse(id).success)throw new ContentFailure(404);const v=intakeDetailSchema.safeParse(await platformRequest('intake/applications/'+id,undefined,'intake'));if(!v.success||v.data.id!==id)throw new ContentFailure(503);return v.data;}
export async function writeIntake(body:unknown){const v=z.object({id:z.string().uuid()}).strict().safeParse(await platformRequest('intake/workflow',body,'intake'));if(!v.success)throw new ContentFailure(503);return v.data;}
