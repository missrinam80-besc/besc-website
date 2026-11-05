import {publicMetadata} from '@/lib/seo';
import {PageContent} from '@/components/page-content';
export const dynamic='force-dynamic';
export default async function Page({searchParams}:{searchParams:Promise<Record<string,string|undefined>>}){const q=await searchParams;const suffix=q.cursor?'?cursor='+encodeURIComponent(q.cursor):'';return <PageContent path={'news'+suffix} title="Nieuws uit de community"/>;}

export async function generateMetadata({searchParams}:{searchParams:Promise<{locale?:string;cursor?:string}>}){return publicMetadata('/nieuws',await searchParams);}
