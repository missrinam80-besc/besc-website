import {randomUUID} from 'node:crypto';
import {Shell} from '@/components/shell';
import {IntakeLease} from '@/components/intake-lease';
import {intakeDetail} from '@/lib/intake-data';
import {ContentFailure} from '@/lib/content';
import {intakeStatusLabels,intakeRoleLabels} from '@/lib/intake-contract';
import {ownIntakeAction} from '../actions';
export const dynamic='force-dynamic';
export default async function Page({params,searchParams}:{params:Promise<{id:string}>;searchParams:Promise<Record<string,string|undefined>>}){
 const {id}=await params,query=await searchParams;let a;try{a=await intakeDetail(id);}catch(e){if(!(e instanceof ContentFailure))throw e;return <Shell><section className="state"><h1>Deze aanvraag is niet beschikbaar</h1><a href="/mijn-besc/aanvragen">Mijn aanvragen</a></section></Shell>;}
 const hidden=()=> <><input type="hidden" name="request_id" value={randomUUID()}/><input type="hidden" name="id" value={a.id}/><input type="hidden" name="expected_version" value={a.version}/></>;
 return <Shell><IntakeLease leaseId={a.lease_id} versionKey={String(a.version)} detailId={a.id}><a href="/mijn-besc/aanvragen">Mijn aanvragen</a><h1>{a.form.title}</h1>{query.succes&&<p className="notice" role="status">De handeling is opgeslagen. Hieronder staan je actuele gegevens.</p>}<p>Status: {intakeStatusLabels[a.status]}</p><p>Ontvangstnummer: {a.id}</p>
 <section className="creator-panel"><h2>Wat je hebt ingediend</h2>{a.category==='general_contact'?<><h3>{a.payload.subject}</h3><p style={{whiteSpace:'pre-wrap'}}>{a.payload.message}</p></>:a.category==='volunteer_application'?<><h3>{a.vacancy.title} · vacatureversie {a.vacancy.revision}</h3><p>{a.vacancy.role_label} · {a.vacancy.location_label}</p><details><summary>Vacature zoals ingediend</summary><p style={{whiteSpace:'pre-wrap'}}>{a.vacancy.body.value}</p><p>{a.vacancy.availability_label}</p></details><p style={{whiteSpace:'pre-wrap'}}>{a.payload.motivation}</p><p>Beschikbaarheid: {a.payload.availability}</p></>:<><p>{a.payload.organization_name}</p><p>{a.payload.requested_roles.map(r=>intakeRoleLabels[r]).join(', ')}</p><p style={{whiteSpace:'pre-wrap'}}>{a.payload.message}</p></>}<details><summary>Vastgelegde formuliertekst {a.form.notice_version}</summary><p>{a.form.notice_body}</p><p>Grondslag: {a.form.legal_basis}</p><p>Bewaarbehandeling: {a.form.retention_policy}</p></details></section>
 <section className="creator-panel"><h2>Opvolging</h2>{a.events.map(e=><article key={e.version}><p>{intakeStatusLabels[e.status]} · {new Date(e.created_at).toLocaleString('nl-BE',{timeZone:'Europe/Brussels'})}</p>{e.message&&<p style={{whiteSpace:'pre-wrap'}}>{e.message}</p>}</article>)}</section>
 {a.status==='needs_information'&&<section className="creator-panel"><h2>Je aanvulling</h2><form action={ownIntakeAction} className="creator-form">{hidden()}<input type="hidden" name="operation" value="application.reply"/><label>Aanvullende informatie<textarea name="message" required maxLength={4000}/></label><button className="button">Aanvulling versturen</button></form></section>}
 {!['closed','rejected','withdrawn'].includes(a.status)&&<section className="creator-panel"><h2>Aanvraag intrekken</h2><p>Dit stopt de behandeling. De vastgelegde bewaarbehandeling blijft van toepassing.</p><form action={ownIntakeAction}>{hidden()}<input type="hidden" name="operation" value="application.withdraw"/><button className="quiet">Mijn aanvraag intrekken</button></form></section>}
 <p>Administratief afgerond betekent geen benoeming, overeenkomst of publieke partnerrol.</p></IntakeLease></Shell>;
}
