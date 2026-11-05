import {publicIndexingEnabled,websiteOrigin} from '@/lib/deployment-config';
export const dynamic='force-dynamic';
export default function robots(){
 if(!publicIndexingEnabled(process.env))return {rules:{userAgent:'*',disallow:'/'}};
 return {rules:{userAgent:'*',allow:'/',disallow:['/api/','/auth/','/login','/mijn-besc','/creators','/samenwerkingen','/esports','/vrijwilligers']},sitemap:new URL('/sitemap.xml',websiteOrigin(process.env)).href};
}
