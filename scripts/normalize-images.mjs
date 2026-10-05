import { existsSync } from 'node:fs';
import { readdir, readFile, writeFile, unlink } from 'node:fs/promises';
import { join, relative, extname, basename, dirname } from 'node:path';
import sharp from 'sharp';

const mediaRoot = join(process.cwd(), 'public/uploads');
const contentRoot = join(process.cwd(), 'src');
const convertible = new Set(['.jpg', '.jpeg', '.png', '.avif']);
const textFiles = new Set(['.json', '.yml', '.yaml', '.md', '.mdx', '.astro', '.ts', '.js']);

async function* files(directory) {
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const path = join(directory, entry.name);
    if (entry.isDirectory()) yield* files(path);
    else if (entry.isFile()) yield path;
  }
}

const replacements = new Map();
for await (const source of files(mediaRoot)) {
  const extension = extname(source).toLowerCase();
  if (!convertible.has(extension)) continue;
  const stem = basename(source, extname(source));
  const target = join(dirname(source), `${stem}.webp`);
  // Keep an existing WebP separate from an uploaded image with the same stem.
  let destination = target;
  if (existsSync(destination)) {
    let suffix = 1;
    do { destination = join(dirname(source), `${stem}-converted-${suffix++}.webp`); }
    while (existsSync(destination));
  }
  try {
    await sharp(source).rotate().resize({ width: 2400, withoutEnlargement: true }).webp({ quality: 82, effort: 4 }).toFile(destination);
  } catch (error) {
    console.error(`Could not convert ${relative(process.cwd(), source)}:`, error);
    process.exitCode = 1;
    continue;
  }
  const before = `/uploads/${relative(mediaRoot, source).split('\\').join('/')}`;
  const after = `/uploads/${relative(mediaRoot, destination).split('\\').join('/')}`;
  replacements.set(before, after);
  await unlink(source);
  console.log(`${before} -> ${after}`);
}

if (replacements.size) {
  for await (const file of files(contentRoot)) {
    if (!textFiles.has(extname(file).toLowerCase())) continue;
    const oldText = await readFile(file, 'utf8');
    let newText = oldText;
    for (const [before, after] of replacements) newText = newText.split(before).join(after);
    if (newText !== oldText) await writeFile(file, newText);
  }
}
