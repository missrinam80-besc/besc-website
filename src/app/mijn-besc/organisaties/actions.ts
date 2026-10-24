'use server';
import {headers} from 'next/headers';
import {redirect} from 'next/navigation';
import {revalidatePath} from 'next/cache';
import {websiteUrl} from '@/lib/auth';
import {writeDelegation} from '@/lib/delegation-data';
import {parseDelegationOperation} from '@/lib/delegation-contract';
import {ContentFailure} from '@/lib/content';
export async function ownDelegationAction(form:FormData){
 const root='/mijn-besc/organisaties';if(process.env.BESC_PARTNER_DELEGATION_ENABLED!=='true'||(await headers()).get('origin')!==websiteUrl())redirect(root+'?melding=controle');
 const op=String(form.get('operation')??''),request=String(form.get('request_id')??''),delegation=String(form.get('delegation_id')??'');
 if(!/^[a-f0-9-]{36}$/i.test(delegation))redirect(root+'?melding=controle');const route=root+'/'+delegation;let data:unknown;
 if(op==='proposal.save')data={delegation_id:delegation,expected_revision:Number(form.get('expected_revision')),payload:{name:String(form.get('name')??'').trim(),description:String(form.get('description')??'').trim(),website_url:String(form.get('website_url')??'').trim()||null}};
 else if(op==='proposal.submit'||op==='proposal.withdraw')data={id:String(form.get('id')??''),expected_hash:String(form.get('expected_hash')??'')};
 else if(op==='delegation.end')data={id:delegation,reason:String(form.get('reason')??'')};else redirect(route+'?melding=controle');
 const parsed=parseDelegationOperation(op,data);if(!parsed.success||!/^[a-f0-9-]{36}$/i.test(request))redirect(route+'?melding=velden');
 try{await writeDelegation({operation:op,data:parsed.data,request_id:request});}catch(e){if(!(e instanceof ContentFailure))throw e;redirect(route+'?melding='+(e.status===409?'versie':e.status===429?'wachten':'controle'));}
 revalidatePath(root);redirect((op==='delegation.end'?root:route)+'?succes=opgeslagen');
}
