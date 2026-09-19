import { parse } from 'yaml';
import siteEnSource from '../data/site.yml?raw';
import homeEn from '../data/home.json'; import homeKh from '../data/kh/home.json';
import aboutEn from '../data/about.json'; import aboutKh from '../data/kh/about.json';
import factoryEn from '../data/factory.json'; import factoryKh from '../data/kh/factory.json';
import contactEn from '../data/contact.json'; import contactKh from '../data/kh/contact.json';
import uiEn from '../data/ui.json'; import uiKh from '../data/kh/ui.json';
import productsPageEn from '../data/products-page.json'; import productsPageKh from '../data/kh/products-page.json';
import newsPageEn from '../data/news-page.json'; import newsPageKh from '../data/kh/news-page.json';
import careersPageEn from '../data/careers-page.json'; import careersPageKh from '../data/kh/careers-page.json';
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
const productsPageShared={...productsPageKh,hero:{...productsPageKh.hero,image:productsPageEn.hero.image}};
const newsPageShared={...newsPageKh,hero:{...newsPageKh.hero,image:newsPageEn.hero.image}};
const careersPageShared={...careersPageKh,hero:{...careersPageKh.hero,image:careersPageEn.hero.image}};
export const contentFor = (lang: Lang) => ({home:lang==='kh'?homeShared:homeEn,about:lang==='kh'?aboutShared:aboutEn,factory:lang==='kh'?factoryShared:factoryEn,contact:lang==='kh'?contactShared:contactEn,productsPage:lang==='kh'?productsPageShared:productsPageEn,newsPage:lang==='kh'?newsPageShared:newsPageEn,careersPage:lang==='kh'?careersPageShared:careersPageEn,ui:lang==='kh'?uiShared:uiEn});
type Site = {companyName:string;logo:string;fontUrl?:string;fontKhUrl?:string;description:string;contact:{phone:string;email:string;address:string;businessHours:string;applicationEmail:string};social:Record<string,string>;footer:{copyright:string};seo:{defaultTitle:string;titleTemplate:string;defaultDescription:string;defaultImage:string};appearance?:Record<string,string>};
type SiteSource = {
  companyNameEn:string; companyNameKh:string; logo:string; fontUrl?:string; fontKhUrl?:string;
  descriptionEn:string; descriptionKh:string;
  contact:{phone:string;email:string;addressEn:string;addressKh:string;businessHoursEn:string;businessHoursKh:string;applicationEmail:string};
  social:Record<string,string>;
  footer:{copyrightEn:string;copyrightKh:string};
  seo:{defaultTitleEn:string;defaultTitleKh:string;titleTemplateEn:string;titleTemplateKh:string;defaultDescriptionEn:string;defaultDescriptionKh:string;defaultImage:string};
  appearance?:Record<string,string>;
};
export const siteFor = (lang: Lang):Site => {
  const source = parse(siteEnSource) as SiteSource;
  const kh = lang === 'kh';
  return {
    companyName: kh ? source.companyNameKh : source.companyNameEn,
    logo: source.logo,
    fontUrl: source.fontUrl,
    fontKhUrl: source.fontKhUrl,
    description: kh ? source.descriptionKh : source.descriptionEn,
    contact: {
      phone: source.contact.phone,
      email: source.contact.email,
      address: kh ? source.contact.addressKh : source.contact.addressEn,
      businessHours: kh ? source.contact.businessHoursKh : source.contact.businessHoursEn,
      applicationEmail: source.contact.applicationEmail,
    },
    social: source.social,
    footer: {copyright: kh ? source.footer.copyrightKh : source.footer.copyrightEn},
    seo: {
      defaultTitle: kh ? source.seo.defaultTitleKh : source.seo.defaultTitleEn,
      titleTemplate: kh ? source.seo.titleTemplateKh : source.seo.titleTemplateEn,
      defaultDescription: kh ? source.seo.defaultDescriptionKh : source.seo.defaultDescriptionEn,
      defaultImage: source.seo.defaultImage,
    },
    appearance: source.appearance,
  };
};
export const site=siteFor('en');
export const imageUrl = (value?: string) => value || '/uploads/image-placeholder.svg';
export const publicEntries = <T extends { data: { mainControl: {published: boolean} } }>(entries: T[]) => entries.filter((entry) => entry.data.mainControl.published);
export const byOrder = (a: CollectionEntry<'products'>, b: CollectionEntry<'products'>) => a.data.mainControl.displayOrder - b.data.mainControl.displayOrder || a.data.title.localeCompare(b.data.title);
export const byNewest = <T extends {data: {mainControl:{publishDate: Date}}}>(a: T, b: T) => b.data.mainControl.publishDate.getTime() - a.data.mainControl.publishDate.getTime();

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
      mainControl: {...base.data.mainControl,
        gallery: base.data.mainControl.gallery.map((photo, index) => ({...photo, alt: entry.data.gallery[index]?.alt || photo.alt})),
      },
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
      mainControl: base.data.mainControl,
    }} as unknown as CollectionEntry<'news'>];
  });
}

export async function careersFor(lang: Lang): Promise<CollectionEntry<'careers'>[]> {
  const english = await getCollection('careers');
  if (lang === 'en') return english;
  const khmer = await getCollection('careersKh');
  const translations = new Map(khmer.map(entry => [entry.data.slug, entry]));
  return english.filter(base => base.data.mainControl.published).map(base => {
    const entry = translations.get(base.data.slug);
    if (!entry) return base;
    return {...entry, data: {...entry.data,
      mainControl: base.data.mainControl,
    }} as unknown as CollectionEntry<'careers'>;
  });
}
