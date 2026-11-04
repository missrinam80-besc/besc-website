import {publicSitemap} from '@/lib/seo';
export const dynamic = 'force-dynamic';
export default async function sitemap() { return publicSitemap(); }
