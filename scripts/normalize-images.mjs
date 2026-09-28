import {readdir, readFile, writeFile, mkdir, stat} from 'node:fs/promises';
import {resolve, join, relative, extname, dirname, sep} from 'node:path';
import sharp from 'sharp';

const root=resolve(process.argv[2] || '.');
const uploads=join(root,'public','uploads');
const source=join(root,'src');
const convertible=new Set(['.jpg','.jpeg','.png','.avif']);
const editable=new Set(['.astro','.css','.json','.md','.yaml','.yml']);

async function files(directory){
  try {
    const entries=await readdir(directory,{withFileTypes:true});
    const nested=await Promise.all(entries.map(entry=>entry.isDirectory()?files(join(directory,entry.name)):[join(directory,entry.name)]));
    return nested.flat();
  } catch(error){
    if(error.code==='ENOENT')return [];
    throw error;
  }
}

const images=(await files(uploads)).filter(file=>convertible.has(extname(file).toLowerCase()));
const replacements=new Map();
for(const file of images){
  const output=file.slice(0,-extname(file).length)+'.webp';
  const original=`/uploads/${relative(uploads,file).split(sep).join('/')}`;
  const converted=`/uploads/${relative(uploads,output).split(sep).join('/')}`;
  try {
    await stat(output);
  } catch(error){
    if(error.code!=='ENOENT')throw error;
    await mkdir(dirname(output),{recursive:true});
    await sharp(file).rotate().webp({quality:88,effort:4}).toFile(output);
    console.log(`Converted ${original} to ${converted}`);
  }
  replacements.set(original,converted);
}

let updated=0;
for(const file of (await files(source)).filter(file=>editable.has(extname(file).toLowerCase()))){
  const before=await readFile(file,'utf8');
  let after=before;
  for(const [oldPath,newPath] of replacements)after=after.split(oldPath).join(newPath);
  if(after!==before){
    await writeFile(file,after);
    updated++;
  }
}
console.log(`Image normalization complete: ${images.length} eligible images, ${updated} content files updated.`);
