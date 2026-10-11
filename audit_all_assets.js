const fs = require('fs');
const path = require('path');

const root = __dirname;
const targetFiles = [
  'design-system.css',
  'theme-override.css',
  'main.js',
  'product-pic1.webp',
  'grece-logo.webp',
  'facebook.svg',
  'instagram.svg',
  'linkedin.svg',
  'pintrest.svg',
  'youtube.svg',
  '07-2.mp4',
  'banner.mp4'
];

console.log('=== 1. FINDING TARGET ASSETS ON DISK ===');
function findFilesRecursive(dir, matches = []) {
  const items = fs.readdirSync(dir);
  for (const item of items) {
    if (item === 'node_modules' || item === '.git') continue;
    const full = path.join(dir, item);
    const stat = fs.statSync(full);
    if (stat.isDirectory()) {
      findFilesRecursive(full, matches);
    } else {
      for (const t of targetFiles) {
        if (item.toLowerCase() === t.toLowerCase()) {
          matches.push({ target: t, foundPath: path.relative(root, full).replace(/\\/g, '/') });
        }
      }
    }
  }
  return matches;
}

const found = findFilesRecursive(root);
for (const t of targetFiles) {
  const m = found.filter(f => f.target.toLowerCase() === t.toLowerCase());
  if (m.length > 0) {
    console.log(`[FOUND] ${t} -> ${m.map(x => x.foundPath).join(', ')}`);
  } else {
    console.log(`[MISSING ON DISK] ${t}`);
  }
}

console.log('\n=== 2. CHECKING REFERENCES IN HTML FILES ===');
const htmlFiles = fs.readdirSync(root).filter(f => f.endsWith('.html'));
for (const h of htmlFiles) {
  const content = fs.readFileSync(path.join(root, h), 'utf8');
  for (const t of targetFiles) {
    const re = new RegExp(`['"\`(=][^'"\`)=]*${t.replace('.', '\\.')}`, 'gi');
    const hits = content.match(re);
    if (hits) {
      console.log(`[${h}] references ${t}:`);
      for (const hit of hits) {
        const clean = hit.slice(1);
        const resolved = path.join(root, clean);
        const exists = fs.existsSync(resolved);
        console.log(`   ref: "${clean}" | exists locally: ${exists}`);
      }
    }
  }
}
