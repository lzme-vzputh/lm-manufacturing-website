import { parse } from 'yaml';
import siteSource from '../data/site.yml?raw';
import home from '../data/home.json';
import about from '../data/about.json';
import factory from '../data/factory.json';
import contact from '../data/contact.json';
import type { CollectionEntry } from 'astro:content';

export const site = parse(siteSource) as { companyName: string; logo: string; description: string; contact: {phone: string; email: string; address: string; businessHours: string; applicationEmail: string}; social: Record<string,string>; footer: {copyright: string}; seo: {defaultTitle: string; titleTemplate: string; defaultDescription: string; defaultImage: string} };
export { home, about, factory, contact };
export const imageUrl = (value?: string) => value || '/uploads/image-placeholder.svg';
export const publicEntries = <T extends { data: { published: boolean } }>(entries: T[]) => entries.filter((entry) => entry.data.published);
export const byOrder = (a: CollectionEntry<'products'>, b: CollectionEntry<'products'>) => a.data.displayOrder - b.data.displayOrder || a.data.title.localeCompare(b.data.title);
export const byNewest = <T extends {data: {publishDate: Date}}>(a: T, b: T) => b.data.publishDate.getTime() - a.data.publishDate.getTime();
