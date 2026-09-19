import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const media = z.string().startsWith('/uploads/');
const slug = z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/);
const productControl = z.object({mainImage:media,gallery:z.array(z.object({image:media,alt:z.string().min(1)})).default([]),featured:z.boolean(),published:z.boolean(),displayOrder:z.number().int().nonnegative()});
const productSchema = z.object({title:z.string().min(1),slug,category:z.string().min(1),shortDescription:z.string().min(1),mainImageAlt:z.string().min(1),mainControl:productControl,specifications:z.array(z.object({label:z.string(),value:z.string()})).default([])});
const product = defineCollection({loader:glob({pattern:'**/*.md',base:'./src/content/products'}),schema:productSchema});
const newsControl = z.object({publishDate:z.coerce.date(),coverImage:media,published:z.boolean(),featured:z.boolean()});
const newsSchema = z.object({title:z.string().min(1),slug,summary:z.string().min(1),coverImageAlt:z.string().min(1),mainControl:newsControl,seoTitle:z.string().optional(),seoDescription:z.string().optional()});
const news = defineCollection({loader:glob({pattern:'**/*.md',base:'./src/content/news'}),schema:newsSchema});
const careerControl = z.object({publishDate:z.coerce.date(),closingDate:z.coerce.date().optional(),published:z.boolean()});
const careersSchema = z.object({title:z.string().min(1),slug,department:z.string().min(1),location:z.string().min(1),employmentType:z.string().min(1),summary:z.string().min(1),responsibilities:z.array(z.string()).min(1),requirements:z.array(z.string()).min(1),mainControl:careerControl});
const careers = defineCollection({loader:glob({pattern:'**/*.md',base:'./src/content/careers'}),schema:careersSchema});
// Shared media, ordering and dates are read from the English entry with the same slug.
const productKh = defineCollection({loader:glob({pattern:'**/*.md',base:'./src/content/kh/products'}),schema:z.object({title:z.string().min(1),slug,category:z.string().min(1),shortDescription:z.string().min(1),mainImageAlt:z.string().min(1),gallery:z.array(z.object({alt:z.string().min(1)})).default([]),specifications:z.array(z.object({label:z.string(),value:z.string()})).default([])})});
const newsKh = defineCollection({loader:glob({pattern:'**/*.md',base:'./src/content/kh/news'}),schema:z.object({title:z.string().min(1),slug,summary:z.string().min(1),coverImageAlt:z.string().min(1),seoTitle:z.string().optional(),seoDescription:z.string().optional()})});
const careersKh = defineCollection({loader:glob({pattern:'**/*.md',base:'./src/content/kh/careers'}),schema:z.object({title:z.string().min(1),slug,department:z.string().min(1),location:z.string().min(1),employmentType:z.string().min(1),summary:z.string().min(1),responsibilities:z.array(z.string()).min(1),requirements:z.array(z.string()).min(1)})});
export const collections = {products:product,news,careers,productsKh:productKh,newsKh,careersKh};
