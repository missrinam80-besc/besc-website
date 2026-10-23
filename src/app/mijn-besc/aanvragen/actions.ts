'use server';
import {headers} from 'next/headers';
import {redirect} from 'next/navigation';
import {revalidatePath} from 'next/cache';
import {websiteUrl} from '@/lib/auth';
import {writeIntake} from '@/lib/intake-data';
import {parseIntakeOperation} from '@/lib/intake-contract';
import {ContentFailure} from '@/lib/content';
export async function ownIntakeAction(form:FormData){
 const root='/mijn-besc/aanvragen';if(process.env.BESC_PLATFORM_INTAKE_ENABLED!=='true'||(await headers()).get('origin')!==websiteUrl())redirect(root+'?melding=controle');
 const operation=String(form.get('operation')??''),request=String(form.get('request_id')??'');let data:unknown;
 if(operation==='application.submit')data={form_id:String(form.get('form_id')??''),notice_version:String(form.get('notice_version')??''),notice_acknowledged:form.get('notice_acknowledged')==='on',payload:{organization_name:String(form.get('organization_name')??''),requested_roles:form.getAll('requested_role').map(String),message:String(form.get('message')??'')}};
 else if(operation==='application.withdraw'||operation==='application.reply')data={id:String(form.get('id')??''),expected_version:Number(form.get('expected_version')),...(operation==='application.reply'?{message:String(form.get('message')??'')}:{})};else redirect(root+'?melding=controle');
 const parsed=parseIntakeOperation(operation,data);if(!parsed.success||!/^[a-f0-9-]{36}$/i.test(request))redirect(root+'?melding=velden');
 let id:string;try{id=(await writeIntake({operation,data:parsed.data,request_id:request})).id;}catch(e){if(!(e instanceof ContentFailure))throw e;redirect(root+'?melding='+(e.status===409?'versie':e.status===429?'wachten':'controle'));}
 revalidatePath(root);redirect(root+'/'+id+'?succes=opgeslagen');
}
