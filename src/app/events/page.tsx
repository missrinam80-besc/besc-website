import {PageContent} from '@/components/page-content';
export const dynamic='force-dynamic';
export default async function Page({searchParams}:{searchParams:Promise<Record<string,string|undefined>>}){const q=await searchParams;const suffix=q.cursor?'?cursor='+encodeURIComponent(q.cursor):'';return <PageContent path={'events'+suffix} title="Events van BESC"/>;}
