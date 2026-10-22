import {notFound} from 'next/navigation';
import {PageContent} from '@/components/page-content';
export const dynamic='force-dynamic';
export default async function Page({params}:{params:Promise<{slug:string}>}){const {slug}=await params;if(!/^[a-z0-9]+(-[a-z0-9]+)*$/.test(slug)||slug.length>160)notFound();return <PageContent path={'news/'+slug} title="Nieuws uit de community"/>;}
