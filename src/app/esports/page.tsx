import {PartnerIndex} from '@/components/partner-index';
export const dynamic='force-dynamic';
export default async function Page({searchParams}:{searchParams:Promise<Record<string,string|string[]|undefined>>}){return <PartnerIndex query={await searchParams} esports={true}/>;}
