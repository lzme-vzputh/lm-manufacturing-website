import { parse } from 'yaml';
import siteEnSource from '../data/site.yml?raw';
import siteKhSource from '../data/kh/site.yml?raw';
import homeEn from '../data/home.json'; import homeKh from '../data/kh/home.json';
import aboutEn from '../data/about.json'; import aboutKh from '../data/kh/about.json';
import factoryEn from '../data/factory.json'; import factoryKh from '../data/kh/factory.json';
import contactEn from '../data/contact.json'; import contactKh from '../data/kh/contact.json';
import uiEn from '../data/ui.json'; import uiKh from '../data/kh/ui.json';
import type { CollectionEntry } from 'astro:content';
import { getCollection } from 'astro:content';
export type Lang = 'en' | 'kh';
export const language = (url: URL): Lang => url.pathname === '/kh' || url.pathname.startsWith('/kh/') ? 'kh' : 'en';
export const pathFor = (path: string, lang: Lang) => /^https?:|^mailto:|^tel:|^#/.test(path) ? path : lang === 'kh' && path.startsWith('/') ? `/kh${path === '/' ? '' : path}` : path;
// Images and destination URLs belong to the English content record; Khmer owns its wording.
const homeShared = {
  ...homeKh,
  hero: {...homeKh.hero, image: homeEn.hero.image, primaryUrl: homeEn.hero.primaryUrl, secondaryUrl: homeEn.hero.secondaryUrl},
  intro: {...homeKh.intro, image: homeEn.intro.image},
  factoryImage: homeEn.factoryImage,
  cta: {...homeKh.cta, url: homeEn.cta.url},
};
const aboutShared = {...aboutKh, hero: {...aboutKh.hero, image: aboutEn.hero.image}, image: aboutEn.image};
const factoryShared = {
  ...factoryKh,
  hero: {...factoryKh.hero, image: factoryEn.hero.image},
  gallery: factoryEn.gallery.map((item, index) => ({image: item.image, alt: factoryKh.gallery?.[index]?.alt || item.alt})),
};
const contactShared = {...contactKh, hero: {...contactKh.hero, image: contactEn.hero.image}, mapEmbedUrl: contactEn.mapEmbedUrl};
const uiShared = {...uiKh, manageSections: uiKh.manageSections.map((section, index) => ({...section, path: uiEn.manageSections[index]?.path || '/'}))};
export const contentFor = (lang: Lang) => ({home:lang==='kh'?homeShared:homeEn,about:lang==='kh'?aboutShared:aboutEn,factory:lang==='kh'?factoryShared:factoryEn,contact:lang==='kh'?contactShared:contactEn,ui:lang==='kh'?uiShared:uiEn});
type Site = {companyName:string;logo:string;description:string;contact:{phone:string;email:string;address:string;businessHours:string;applicationEmail:string};social:Record<string,string>;footer:{copyright:string};seo:{defaultTitle:string;titleTemplate:string;defaultDescription:string;defaultImage:string}};
export const siteFor = (lang: Lang):Site => {
  const en = parse(siteEnSource) as Site;
  if (lang === 'en') return en;
  const kh = parse(siteKhSource) as Site;
  return {
    ...kh,
    logo: en.logo,
    contact: {...en.contact, address: kh.contact?.address || en.contact.address, businessHours: kh.contact?.businessHours || en.contact.businessHours},
    social: en.social,
    seo: {...kh.seo, defaultImage: en.seo.defaultImage},
  };
};
export const site=siteFor('en');
export const imageUrl = (value?: string) => value || '/uploads/image-placeholder.svg';
export const publicEntries = <T extends { data: { published: boolean } }>(entries: T[]) => entries.filter((entry) => entry.data.published);
export const byOrder = (a: CollectionEntry<'products'>, b: CollectionEntry<'products'>) => a.data.displayOrder - b.data.displayOrder || a.data.title.localeCompare(b.data.title);
export const byNewest = <T extends {data: {publishDate: Date}}>(a: T, b: T) => b.data.publishDate.getTime() - a.data.publishDate.getTime();

export async function productsFor(lang: Lang): Promise<CollectionEntry<'products'>[]> {
  const english = await getCollection('products');
  if (lang === 'en') return english;
  const bySlug = new Map(english.map(entry => [entry.data.slug, entry]));
  const khmer = await getCollection('productsKh');
  return khmer.flatMap(entry => {
    const base = bySlug.get(entry.data.slug);
    if (!base) return [];
    return [{...entry, data: {
      ...entry.data,
      mainImage: base.data.mainImage,
      gallery: base.data.gallery.map((photo, index) => ({...photo, alt: entry.data.gallery[index]?.alt || photo.alt})),
      featured: base.data.featured,
      displayOrder: base.data.displayOrder,
      published: entry.data.published && base.data.published,
    }} as unknown as CollectionEntry<'products'>];
  });
}

export async function newsFor(lang: Lang): Promise<CollectionEntry<'news'>[]> {
  const english = await getCollection('news');
  if (lang === 'en') return english;
  const bySlug = new Map(english.map(entry => [entry.data.slug, entry]));
  const khmer = await getCollection('newsKh');
  return khmer.flatMap(entry => {
    const base = bySlug.get(entry.data.slug);
    if (!base) return [];
    return [{...entry, data: {...entry.data,
      coverImage: base.data.coverImage, publishDate: base.data.publishDate,
      featured: base.data.featured, published: entry.data.published && base.data.published,
    }} as unknown as CollectionEntry<'news'>];
  });
}

export async function careersFor(lang: Lang): Promise<CollectionEntry<'careers'>[]> {
  const english = await getCollection('careers');
  if (lang === 'en') return english;
  const bySlug = new Map(english.map(entry => [entry.data.slug, entry]));
  const khmer = await getCollection('careersKh');
  return khmer.flatMap(entry => {
    const base = bySlug.get(entry.data.slug);
    if (!base) return [];
    return [{...entry, data: {...entry.data,
      publishDate: base.data.publishDate, closingDate: base.data.closingDate,
      published: entry.data.published && base.data.published,
    }} as unknown as CollectionEntry<'careers'>];
  });
}
