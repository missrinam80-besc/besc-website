'use server';
import {headers} from 'next/headers';
import {redirect} from 'next/navigation';
import {revalidatePath} from 'next/cache';
import {websiteUrl} from '@/lib/auth';
import {writeCreator} from '@/lib/creator-data';
import {parseCreatorOperation,creatorFields} from '@/lib/creator-contract';
import {ContentFailure} from '@/lib/content';
export async function ownCreatorAction(form:FormData){
 const route='/mijn-besc';if(process.env.BESC_CREATOR_PLATFORM_ENABLED!=='true'||(await headers()).get('origin')!==websiteUrl())redirect(route+'?melding=controle');
 const operation=String(form.get('operation')??''),request=String(form.get('request_id')??'');let data:unknown;
 if(operation==='profile.save'){
  const payload:Record<string,unknown>={slug:String(form.get('slug')??'').trim(),locale:String(form.get('locale')??'nl-BE'),display_name:String(form.get('display_name')??'').trim(),bio:String(form.get('bio')??'').trim(),platform_links:['twitch','youtube','kick','tiktok'].flatMap(platform=>{const url=String(form.get(platform)??'').trim();return url?[{platform,url}]:[]}),disciplines:String(form.get('disciplines')??'').split(',').map(s=>s.trim()).filter(Boolean),languages:String(form.get('languages')??'').split(',').map(s=>s.trim()).filter(Boolean)};
  const media=String(form.get('avatar_id')??'').trim();if(media)payload.avatar={public_media_id:media,alt:String(form.get('avatar_alt')??'').trim(),credit:String(form.get('avatar_credit')??'').trim()};else payload.avatar=null;
  data={expected_revision:Number(form.get('expected_revision')),payload};
 }else if(operation==='consent.give'){
  const selected=form.getAll('scope_field').map(String);if(selected.some(s=>!(creatorFields as readonly string[]).includes(s)))redirect(route+'?melding=velden');
  data={purpose_id:String(form.get('purpose_id')??''),scope:{fields:selected},accepted:form.get('accepted')==='on'};
 }else if(operation==='profile.submit')data={id:String(form.get('id')??''),expected_hash:String(form.get('expected_hash')??''),consent_id:String(form.get('consent_id')??'')};
 else if(operation==='consent.withdraw')data={id:String(form.get('id')??''),reason:'Op eigen verzoek ingetrokken'};
 else if(operation==='profile.withdraw')data={profile_id:String(form.get('profile_id')??''),reason:'Op eigen verzoek ingetrokken'};
 else redirect(route+'?melding=controle');
 const parsed=parseCreatorOperation(operation,data);if(!parsed.success||!/^[a-f0-9-]{36}$/i.test(request))redirect(route+'?melding=velden');
 try{await writeCreator({operation,data:parsed.data,request_id:request});}catch(e){if(!(e instanceof ContentFailure))throw e;redirect(route+'?melding='+(e.status===409?'versie':e.status===429?'wachten':'controle'));}
 revalidatePath(route);redirect(route+'?succes=opgeslagen');
}
