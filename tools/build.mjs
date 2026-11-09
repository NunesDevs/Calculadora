import fs from 'node:fs/promises';
import path from 'node:path';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const destination = path.join(root, 'dist');
const files = [
  "index.html",
  "home/index.html",
  "js/index.js",
  "styles/home.css",
  "styles/colors.css",
  "assets/backspace.svg",
  "LICENSE",
  "assets/fonts/dm-sans-latin.woff2",
  "assets/fonts/space-grotesk-latin.woff2",
  "assets/fonts/dmsans-OFL.txt",
  "assets/fonts/spacegrotesk-OFL.txt"
];
async function existing(directory, prefix = '') {
  let entries; try { entries = await fs.readdir(directory, { withFileTypes: true }); } catch (error) { if (error.code === 'ENOENT') return []; throw error; }
  const names = [];
  for (const entry of entries) {
    const relative = prefix + entry.name;
    if (entry.isSymbolicLink()) throw new Error('Symbolic links are not allowed in the output');
    if (entry.isDirectory()) names.push(...await existing(path.join(directory, entry.name), relative + '/'));
    else if (entry.isFile()) names.push(relative);
    else throw new Error('Unsupported output entry');
  }
  return names;
}
try { if ((await fs.lstat(destination)).isSymbolicLink()) throw new Error('Output directory must not be a symbolic link'); } catch (error) { if (error.code !== 'ENOENT') throw error; }
const unexpected = (await existing(destination)).filter(file => !files.includes(file));
if (unexpected.length) throw new Error('Output contains unexpected files; choose a clean destination before building');
const manifest = [];
for (const file of files) {
  const source = path.join(root, file);
  if (!(await fs.lstat(source)).isFile()) throw new Error('Runtime source must be a regular file: ' + file);
  const actual = await fs.realpath(source);
  if (!actual.startsWith(await fs.realpath(root) + path.sep)) throw new Error('Runtime source escapes the repository');
  const bytes = await fs.readFile(source);
  await fs.mkdir(path.dirname(path.join(destination, file)), { recursive: true });
  await fs.writeFile(path.join(destination, file), bytes);
  manifest.push({ file, bytes: bytes.length, sha256: crypto.createHash('sha256').update(bytes).digest('hex') });
}
console.log(JSON.stringify({ output: 'dist', files: manifest }, null, 2));
