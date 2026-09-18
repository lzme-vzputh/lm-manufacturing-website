import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const media = z.string().startsWith('/uploads/');
const productSchema = z.object({title:z.string().min(1),slug:z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),category:z.string().min(1),shortDescription:z.string().min(1),mainImage:media,mainImageAlt:z.string().min(1),gallery:z.array(z.object({image:media,alt:z.string().min(1)})).default([]),featured:z.boolean(),published:z.boolean(),displayOrder:z.number().int().nonnegative(),specifications:z.array(z.object({label:z.string(),value:z.string()})).default([])});
const product = defineCollection({loader:glob({pattern:'**/*.md',base:'./src/content/products'}),schema:productSchema});
const newsSchema = z.object({title:z.string().min(1),slug:z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),publishDate:z.coerce.date(),summary:z.string().min(1),coverImage:media,coverImageAlt:z.string().min(1),published:z.boolean(),featured:z.boolean(),seoTitle:z.string().optional(),seoDescription:z.string().optional()});
const news = defineCollection({loader:glob({pattern:'**/*.md',base:'./src/content/news'}),schema:newsSchema});
const careersSchema = z.object({title:z.string().min(1),slug:z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),department:z.string().min(1),location:z.string().min(1),employmentType:z.string().min(1),summary:z.string().min(1),responsibilities:z.array(z.string()).min(1),requirements:z.array(z.string()).min(1),publishDate:z.coerce.date(),closingDate:z.coerce.date().optional(),published:z.boolean()});
const careers = defineCollection({loader:glob({pattern:'**/*.md',base:'./src/content/careers'}),schema:careersSchema});
const productKh = defineCollection({loader:glob({pattern:'**/*.md',base:'./src/content/kh/products'}),schema:productSchema});
const newsKh = defineCollection({loader:glob({pattern:'**/*.md',base:'./src/content/kh/news'}),schema:newsSchema});
const careersKh = defineCollection({loader:glob({pattern:'**/*.md',base:'./src/content/kh/careers'}),schema:careersSchema});
export const collections = {products:product,news,careers,productsKh:productKh,newsKh,careersKh};
