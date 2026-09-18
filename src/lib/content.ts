import { parse } from 'yaml';
import siteEnSource from '../data/site.yml?raw';
import siteKhSource from '../data/kh/site.yml?raw';
import homeEn from '../data/home.json'; import homeKh from '../data/kh/home.json';
import aboutEn from '../data/about.json'; import aboutKh from '../data/kh/about.json';
import factoryEn from '../data/factory.json'; import factoryKh from '../data/kh/factory.json';
import contactEn from '../data/contact.json'; import contactKh from '../data/kh/contact.json';
import uiEn from '../data/ui.json'; import uiKh from '../data/kh/ui.json';
import type { CollectionEntry } from 'astro:content';
export type Lang = 'en' | 'kh';
export const language = (url: URL): Lang => url.pathname === '/kh' || url.pathname.startsWith('/kh/') ? 'kh' : 'en';
export const pathFor = (path: string, lang: Lang) => /^https?:|^mailto:|^tel:|^#/.test(path) ? path : lang === 'kh' && path.startsWith('/') ? `/kh${path === '/' ? '' : path}` : path;
export const contentFor = (lang: Lang) => ({home:lang==='kh'?homeKh:homeEn,about:lang==='kh'?aboutKh:aboutEn,factory:lang==='kh'?factoryKh:factoryEn,contact:lang==='kh'?contactKh:contactEn,ui:lang==='kh'?uiKh:uiEn});
type Site = {companyName:string;logo:string;description:string;contact:{phone:string;email:string;address:string;businessHours:string;applicationEmail:string};social:Record<string,string>;footer:{copyright:string};seo:{defaultTitle:string;titleTemplate:string;defaultDescription:string;defaultImage:string}};
export const siteFor = (lang: Lang):Site => {
  const en=parse(siteEnSource), kh=parse(siteKhSource);
  if(lang==='en') return en;
  // Identity, links and contact endpoints are shared so editors change them only once.
  return {...kh,logo:en.logo,contact:{...kh.contact,phone:en.contact.phone,email:en.contact.email,applicationEmail:en.contact.applicationEmail},social:en.social,seo:{...kh.seo,defaultImage:en.seo.defaultImage}};
};
export const site=siteFor('en');
export const imageUrl = (value?: string) => value || '/uploads/image-placeholder.svg';
export const publicEntries = <T extends { data: { published: boolean } }>(entries: T[]) => entries.filter((entry) => entry.data.published);
export const byOrder = (a: CollectionEntry<'products'>, b: CollectionEntry<'products'>) => a.data.displayOrder - b.data.displayOrder || a.data.title.localeCompare(b.data.title);
export const byNewest = <T extends {data: {publishDate: Date}}>(a: T, b: T) => b.data.publishDate.getTime() - a.data.publishDate.getTime();
