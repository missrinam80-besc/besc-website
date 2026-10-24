import {Shell} from '@/components/shell';
import {DelegationLease} from '@/components/delegation-lease';
import {ownDelegations} from '@/lib/delegation-data';
import {delegationVersionKey} from '@/lib/delegation-contract';
import {ContentFailure} from '@/lib/content';
export const dynamic='force-dynamic';
export default async function Page(){
 let state;try{state=await ownDelegations();}catch(e){if(!(e instanceof ContentFailure))throw e;return <Shell><h1>Mijn vertegenwoordiging is nu niet beschikbaar</h1><p>Je eigen account en elke partnerdelegatie worden afzonderlijk toegelaten.</p><a href="/mijn-besc">Mijn BESC</a></Shell>;}
 return <Shell><DelegationLease leaseId={state.lease_id} versionKey={delegationVersionKey(state)}><a href="/mijn-besc">Mijn BESC</a><h1>Organisaties die ik vertegenwoordig</h1><p>Een profielvoorstel geeft geen contractinzage, financiële toegang of publieke partnerrol. Je kunt alleen handelen binnen de expliciete, actuele delegatie.</p>{!state.delegations.length&&<p>Er zijn geen actuele partnerdelegaties voor je account.</p>}{state.delegations.map(d=><article className="creator-panel" key={d.id}><h2><a href={'/mijn-besc/organisaties/'+d.id}>{d.partner.name}</a></h2><p>Geldig tot {new Date(d.valid_until).toLocaleString('nl-BE',{timeZone:'Europe/Brussels'})}</p><p>{d.revision} eigen voorstelversie(s)</p></article>)}</DelegationLease></Shell>;
}
