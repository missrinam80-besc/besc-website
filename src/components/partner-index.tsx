import {Shell} from '@/components/shell';
import {PartnerView} from '@/components/partner-view';
import {partners} from '@/lib/partner-data';
import {partnerRoles,partnerRoleLabels} from '@/lib/partner-contract';
import {ContentFailure} from '@/lib/content';
export async function PartnerIndex({query,esports=false}:{query:Record<string,string|string[]|undefined>;esports?:boolean}){
 const params=new URLSearchParams();let invalid=false;for(const [k,v]of Object.entries(query)){if(!['locale','limit','cursor','role','search'].includes(k)||Array.isArray(v)){invalid=true;break;}if(v)params.set(k,v);}
 if(esports){if(params.has('role')&&params.get('role')!=='esports')invalid=true;params.set('role','esports');}
 if(invalid)return <Shell><section className="state"><h1>Controleer je selectie</h1><a href={esports?'/esports':'/samenwerkingen'}>Overzicht opnieuw openen</a></section></Shell>;
 let data;try{data=await partners('partners','?'+params.toString());}catch(e){if(!(e instanceof ContentFailure))throw e;return <Shell><section className="state"><h1>Dit overzicht is nu niet beschikbaar</h1><p>Partnerpublicatie moet zijn ingeschakeld en je account moet voor staging zijn toegelaten.</p></section></Shell>;}
 if(!('items'in data))throw Error('invalid_partner_list');
 return <Shell><div className="section-head"><p className="eyebrow">Belgian Streamers Community</p><p><a href="/samenwerkingen">Samenwerkingen</a> · <a href="/esports">Esports</a></p></div><form className="creator-filters" method="get"><label>Zoeken op naam<input name="search" maxLength={80} defaultValue={params.get('search')??''}/></label>{esports?<input type="hidden" name="role" value="esports"/>:<label>Bevestigde rol<select name="role" defaultValue={params.get('role')??''}><option value="">Alle rollen</option>{partnerRoles.map(r=><option key={r} value={r}>{partnerRoleLabels[r]}</option>)}</select></label>}<label>Taal<select name="locale" defaultValue={params.get('locale')??'nl-BE'}><option value="nl-BE">Nederlands</option><option value="fr-BE">Frans</option><option value="en">Engels</option></select></label><button className="button">Filter toepassen</button></form><PartnerView initial={data} path="partners" query={'?'+params.toString()} listingPath={esports?'/esports':'/samenwerkingen'}/>{process.env.BESC_PLATFORM_INTAKE_ENABLED==='true'&&<p><a href="/mijn-besc/aanvragen">Een samenwerkingsaanvraag voorbereiden</a></p>}</Shell>;
}
