import type {Metadata, MetadataRoute} from 'next';
import {publicIndexingEnabled, websiteOrigin} from './deployment-config';
import {publicRequest} from './public-request';
import {f2ListSchema, f2PublicationSchema} from './contract';
import {pageListSchema, pagePublicationSchema} from './site-content-contract';

type Environment = Record<string, string | undefined>;
type Reader = (path: string, query?: string) => Promise<unknown>;
const pagePaths: Record<string, string> = {home:'/', 'over-besc':'/over-besc', contact:'/contact', privacy:'/privacy'};
const closed: Metadata = {robots:{index:false, follow:false}, alternates:{canonical:null}};
function enabled(env: Environment) {
  try { return publicIndexingEnabled(env); } catch { return false; }
}

// Only the public publication adapter is used: never an editor, viewer or draft read.
export async function publicMetadata(path: string, query: {locale?:string; cursor?:string} = {}, env: Environment = process.env, read: Reader = publicRequest): Promise<Metadata> {
  if (!enabled(env) || (query.locale && query.locale !== 'nl-BE') || query.cursor) return closed;
  const page = Object.entries(pagePaths).find(([, value]) => value === path);
  const item = /^\/(nieuws|events)\/([a-z0-9]+(?:-[a-z0-9]+)*)$/.exec(path);
  const list = path === '/nieuws' ? 'news' : path === '/events' ? 'events' : null;
  if (!page && !item && !list) return closed;
  if (page && env.BESC_SITE_PAGES_ENABLED !== 'true') return closed;
  try {
    let title: string, description: string;
    if (page) {
      const data = pagePublicationSchema.parse(await read('pages/'+page[0], '?locale=nl-BE'));
      if (data.slug !== page[0] || data.locale !== 'nl-BE') return closed;
      title = data.title; description = data.summary;
    } else if (item) {
      const kind = item[1] === 'nieuws' ? 'news' : 'events';
      const data = f2PublicationSchema.parse(await read(kind+'/'+item[2], '?locale=nl-BE'));
      if (data.slug !== item[2] || data.locale !== 'nl-BE' || data.type !== (kind === 'news' ? 'news' : 'event')) return closed;
      title = data.title; description = data.summary;
    } else {
      f2ListSchema.parse(await read(list!, '?locale=nl-BE&limit=1'));
      title = list === 'news' ? 'Nieuws uit de community' : 'Events van BESC';
      description = list === 'news' ? 'Vrijgegeven nieuws van Belgian Streamers Community.' : 'Vrijgegeven events van Belgian Streamers Community.';
    }
    const canonical = new URL(path, websiteOrigin(env)).href;
    return {title, description, alternates:{canonical}, robots:{index:true,follow:true}, openGraph:{title,description,url:canonical,siteName:'Belgian Streamers Community',locale:'nl_BE',type:'website'}};
  } catch { return closed; }
}

export async function publicSitemap(env: Environment = process.env, read: Reader = publicRequest): Promise<MetadataRoute.Sitemap> {
  if (!enabled(env)) return [];
  const found = new Map<string, {url:string}>();
  const origin = websiteOrigin(env);
  const add = (path:string) => found.set(path,{url:new URL(path,origin).href});
  try {
    for (const kind of ['pages','news','events'] as const) {
      if (kind === 'pages' && env.BESC_SITE_PAGES_ENABLED !== 'true') continue;
      let cursor: string | null = null;
      const seen = new Set<string>();
      for (let batch = 0; batch < 20; batch++) {
        const params = new URLSearchParams({locale:'nl-BE',limit:'50'});
        if (cursor) params.set('cursor',cursor);
        const raw = await read(kind,'?'+params.toString());
        const result = kind === 'pages' ? pageListSchema.parse(raw) : f2ListSchema.parse(raw);
        if (kind !== 'pages' && batch === 0) add(kind === 'news' ? '/nieuws' : '/events');
        for (const item of result.items) {
          if (item.locale !== 'nl-BE') continue;
          if (kind === 'pages') {
            if (Object.hasOwn(pagePaths,item.slug)) add(pagePaths[item.slug]);
          } else {
            if (item.type !== (kind === 'news' ? 'news' : 'event')) throw Error('wrong_publication_type');
            add('/'+(kind === 'news' ? 'nieuws' : 'events')+'/'+item.slug);
          }
        }
        cursor = result.next_cursor;
        if (!cursor) break;
        if (seen.has(cursor) || batch === 19) throw Error('incomplete_sitemap');
        seen.add(cursor);
      }
    }
    return [...found.values()];
  } catch { return []; }
}
