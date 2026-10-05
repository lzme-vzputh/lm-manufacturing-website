import assert from 'node:assert/strict';
import {readFileSync, readdirSync, existsSync, mkdtempSync, mkdirSync, writeFileSync, rmSync} from 'node:fs';
import {join, resolve, relative} from 'node:path';
import {fileURLToPath} from 'node:url';
import {tmpdir} from 'node:os';
import {execFileSync} from 'node:child_process';
import {JSDOM} from 'jsdom';
import {parse} from 'yaml';
import sharp from 'sharp';

const root=resolve(fileURLToPath(new URL('..',import.meta.url)));
const dist=join(root,'dist');
const origin='https://lm-manufacturing.pages.dev';
let checks=0;
const check=(condition,message)=>{assert.ok(condition,message);checks++;};
const read=path=>readFileSync(join(root,path),'utf8');
const walk=dir=>readdirSync(dir,{withFileTypes:true}).flatMap(entry=>entry.isDirectory()?walk(join(dir,entry.name)):[join(dir,entry.name)]);
const pages=walk(dist).filter(path=>path.endsWith('.html'));
check(pages.length>=20,'Static build is missing pages');
const localFile=pathname=>{
  const cleaned=decodeURIComponent(pathname).replace(/^\//,'');
  return [join(dist,cleaned),join(dist,cleaned,'index.html'),join(dist,`${cleaned}.html`)].some(existsSync);
};

for(const path of pages){
  const name=relative(dist,path);
  const dom=new JSDOM(readFileSync(path,'utf8'),{url:new URL(name==='index.html'?'/':`/${name.replace(/index\.html$/,'')}`,origin)});
  const doc=dom.window.document;
  check(doc.querySelectorAll('h1').length===1,`${name}: expected one heading`);
  check(Boolean(doc.title.trim()),`${name}: missing title`);
  check(Boolean(doc.querySelector('meta[name="description"]')?.content),`${name}: missing description`);
  check(doc.documentElement.lang===(name.startsWith('kh/')?'kh':'en'),`${name}: wrong page language`);
  const canonical=doc.querySelector('link[rel="canonical"]')?.href;
  if(name==='404.html' || name==='manage/index.html' || name==='kh/manage/index.html')check(doc.querySelector('meta[name="robots"]')?.content.includes('noindex') && !canonical,`${name}: guide/error page must not be indexed`);
  else check(canonical?.startsWith(origin),`${name}: wrong canonical origin`);
  const switcher=doc.querySelector('.language-switch');
  check(Boolean(switcher),`${name}: missing language switch`);
  const home=doc.querySelector('.brand[href]');
  check(home?.getAttribute('href')===(name.startsWith('kh/')?'/kh':'/'),`${name}: incorrect home link`);
  for(const el of doc.querySelectorAll('a[href],link[href],img[src],script[src],iframe[src]')){
    const raw=el.getAttribute(el.hasAttribute('href')?'href':'src');
    if(!raw || raw.startsWith('#') || raw.startsWith('mailto:') || raw.startsWith('tel:'))continue;
    const url=new URL(raw,origin);
    if(url.origin===origin)check(localFile(url.pathname),`${name}: broken ${el.tagName.toLowerCase()} ${raw}`);
  }
  for(const alt of doc.querySelectorAll('link[rel="alternate"][hreflang]')){
    const url=new URL(alt.href);
    check(url.origin===origin && localFile(url.pathname),`${name}: alternate language page does not exist: ${alt.href}`);
  }
  for(const img of doc.querySelectorAll('main img'))check(img.hasAttribute('alt'),`${name}: image missing alt text`);
  dom.window.close();
}
check(!read('dist/index.html').includes('example.com'),'Default SEO domain is a placeholder');
check(!read('dist/index.html').includes('vzputh'),'Personal links leaked into public page');
check(!read('dist/index.html').includes('viiputh'),'Personal social links leaked into public page');
check(read('src/assets/css/glass.css').includes('var(--surface) 66%'),'Editable surface color is not used by the glass panels');
check(!read('dist/careers/it-team/index.html').includes('hreflang="km"'),'Untranslated career has false Khmer alternate');
check(!existsSync(join(dist,'products/chicken-noodles/index.html')),'Sample product was published');
check(!existsSync(join(dist,'news/company-update/index.html')),'Sample article was published');
check(read('dist/robots.txt').includes(`${origin}/sitemap-index.xml`),'Robots sitemap origin is wrong');
check(!read('dist/sitemap-0.xml').includes(`${origin}/manage/`) && !read('dist/sitemap-0.xml').includes(`${origin}/kh/manage/`),'Public sitemap contains the editing guide');

const cms=parse(read('.pages.yml'));
const cmsPaths=[];
const cmsFiles=[];
function collect(node){
  if(Array.isArray(node)){node.forEach(collect);return;}
  if(node && typeof node==='object'){
    if(node.type==='file' && node.path){cmsPaths.push(node.path);cmsFiles.push(node);}
    Object.values(node).forEach(collect);
  }
}
collect(cms.content);
check(cmsPaths.length>10,'CMS content paths were not found');
cmsPaths.forEach(path=>check(existsSync(join(root,path)),`CMS references missing file: ${path}`));
for(const file of cmsFiles){
  const source=read(file.path);
  const data=file.path.endsWith('.json')?JSON.parse(source):file.path.endsWith('.yml')?parse(source):null;
  if(data)for(const field of file.fields || [])check(Object.hasOwn(data,field.name),`${file.path}: CMS field ${field.name} is missing`);
}

const pageHtml=read('dist/products/index.html');
const dom=new JSDOM(pageHtml,{url:`${origin}/products/`,runScripts:'outside-only',pretendToBeVisual:true});
const {window}=dom;
window.matchMedia=query=>({matches:false,media:query,addListener(){},removeListener(){}});
window.eval(read('public/scripts/theme-init.js'));
check(window.document.documentElement.dataset.theme==='light','Theme initializes in light mode');
window.eval(read('public/scripts/header.js'));
const theme=window.document.querySelector('.theme-toggle');
theme.click();
check(window.document.documentElement.dataset.theme==='dark' && theme.getAttribute('aria-pressed')==='true','Theme toggle to dark failed');
check(window.localStorage.getItem('lm-theme')==='dark','Theme preference was not saved');
theme.click();
check(window.document.documentElement.dataset.theme==='light' && theme.getAttribute('aria-pressed')==='false','Theme toggle to light failed');
const menu=window.document.querySelector('.nav-toggle');
menu.click();
check(menu.getAttribute('aria-expanded')==='true' && window.document.querySelector('.navigation').classList.contains('is-open'),'Mobile menu did not open');
window.document.dispatchEvent(new window.KeyboardEvent('keydown',{key:'Escape',bubbles:true}));
check(menu.getAttribute('aria-expanded')==='false','Escape did not close menu');
menu.click();
window.document.querySelector('.navigation a').click();
check(menu.getAttribute('aria-expanded')==='false' && menu.getAttribute('aria-label')===menu.dataset.openLabel,'Menu link did not reset accessibility label');
dom.window.close();
const filterDom=new JSDOM(`<button data-category="all" aria-pressed="true">All</button><button data-category="Noodles" aria-pressed="false">Noodles</button><button data-category="Snacks" aria-pressed="false">Snacks</button><div data-product-category="Noodles"></div><div data-product-category="Snacks"></div><p data-filter-status data-template="Showing {count} products"></p>`,{url:origin,runScripts:'outside-only'});
const filterWindow=filterDom.window;
filterWindow.matchMedia=query=>({matches:false,media:query});
const buttons=[...filterWindow.document.querySelectorAll('[data-category]')];
const cards=[...filterWindow.document.querySelectorAll('[data-product-category]')];
filterWindow.eval(read('public/scripts/product-filter.js'));
buttons[1].click();
check(buttons[1].getAttribute('aria-pressed')==='true','Category was not selected');
check(cards.filter(card=>!card.hidden).length===cards.filter(card=>card.dataset.productCategory===buttons[1].dataset.category).length,'Category cards filtered incorrectly');
check(filterWindow.document.querySelector('[data-filter-status]').textContent.includes(String(cards.filter(card=>!card.hidden).length)),'Filter announcement count is wrong');
buttons[0].click();
check(cards.every(card=>!card.hidden),'All products button did not reset filter');
filterDom.window.close();

const fixture=mkdtempSync(join(tmpdir(),'lm-images-'));
try {
  mkdirSync(join(fixture,'public/uploads/products'),{recursive:true});
  mkdirSync(join(fixture,'src/data'),{recursive:true});
  await sharp({create:{width:12,height:12,channels:3,background:'#efb34f'}}).png().toFile(join(fixture,'public/uploads/products/demo.png'));
  writeFileSync(join(fixture,'src/data/demo.json'),'{"image":"/uploads/products/demo.png"}');
  const script=join(root,'scripts/normalize-images.mjs');
  execFileSync(process.execPath,[script,fixture]);
  check(existsSync(join(fixture,'public/uploads/products/demo.webp')),'Image conversion did not create WebP');
  check(readFileSync(join(fixture,'src/data/demo.json'),'utf8').includes('/uploads/products/demo.webp'),'Image conversion did not update content reference');
  execFileSync(process.execPath,[script,fixture]);
  check(readFileSync(join(fixture,'src/data/demo.json'),'utf8').includes('/uploads/products/demo.webp'),'Image conversion is not repeatable');
} finally {rmSync(fixture,{recursive:true,force:true});}
console.log(`Site verification passed: ${pages.length} pages and ${checks} checks.`);
