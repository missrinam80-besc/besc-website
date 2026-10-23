import {Shell} from '@/components/shell';
import {CreatorView} from '@/components/creator-view';
import {creators} from '@/lib/creator-data';
import {ContentFailure} from '@/lib/content';
export const dynamic='force-dynamic';
export default async function Page({params}:{params:Promise<{slug:string}>}){let data;try{data=await creators('creators/'+(await params).slug);}catch(e){if(!(e instanceof ContentFailure))throw e;return <Shell><section className="state"><h1>Dit profiel is niet beschikbaar</h1><p>Het profiel is niet vrijgegeven, ingetrokken of je toegang kon niet worden bevestigd.</p><a href="/creators">Alle creators</a></section></Shell>;}return <Shell><p className="wait-for-content" role="status">De actuele inhoud wordt gecontroleerd.</p><CreatorView initial={data} path={'creators/'+(await params).slug}/></Shell>;}
