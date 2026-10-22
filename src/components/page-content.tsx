import {content,ContentFailure} from '@/lib/content';
import {ContentView} from './content-view';
import {Shell} from './shell';
export async function PageContent({path,title,home=false}:{path:string;title:string;home?:boolean}){
 let data;try{data=await content(path);}catch(e){const status=e instanceof ContentFailure?e.status:503;if(!(e instanceof ContentFailure))throw e;return <Shell><section className="state"><p className="eyebrow">BESC · Websiteproef</p><h1>{status===403?'Je account heeft nog geen testtoegang':status===404?'Dit bericht is niet beschikbaar':'Even niet beschikbaar'}</h1><p>{status===403?'Alleen aangewezen crew en vrijwilligers kunnen deze websiteproef bekijken.':'De inhoud kon niet worden bevestigd. Er wordt geen oude inhoud getoond.'}</p><a href="/login">Naar aanmelden</a></section></Shell>;}
 if('bytes'in data)throw Error('wrong_content_type');
 return <Shell>{home&&<section className="hero"><div><p className="eyebrow">Belgian Streamers Community</p><h1>Samen maken<br/>we meer mogelijk.</h1><p>Ontdek de events en verhalen van BESC.</p><a href="/events" className="button">Bekijk de events <span aria-hidden="true">↗</span></a></div><div className="brand-mark" aria-hidden="true">BESC<span>Community.<br/>Samen.</span></div></section>}<p className="wait-for-content" role="status">De actuele inhoud wordt gecontroleerd.</p><ContentView initial={data} path={path} title={title}/></Shell>;
}
