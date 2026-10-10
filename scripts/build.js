const fs = require('fs');
const path = require('path');

const rootDir = path.resolve(__dirname, '..');
const publicDir = path.join(rootDir, 'public');

console.log('--- Starting Production Build for Vercel ---');

// 1. Ensure public dir exists
if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir, { recursive: true });
}

// 2. Copy all .html files from root
const files = fs.readdirSync(rootDir);
for (const file of files) {
  if (file.endsWith('.html')) {
    const src = path.join(rootDir, file);
    const dest = path.join(publicDir, file);
    fs.copyFileSync(src, dest);
    console.log(`Copied HTML: ${file}`);
  }
}

// 3. Copy css folder
const cssSrc = path.join(rootDir, 'css');
const cssDest = path.join(publicDir, 'css');
if (fs.existsSync(cssSrc)) {
  fs.cpSync(cssSrc, cssDest, { recursive: true });
  console.log('Copied css/ directory');
}

// 4. Copy js folder
const jsSrc = path.join(rootDir, 'js');
const jsDest = path.join(publicDir, 'js');
if (fs.existsSync(jsSrc)) {
  fs.cpSync(jsSrc, jsDest, { recursive: true });
  console.log('Copied js/ directory');
}

// 5. Copy assets folder
const assetsSrc = path.join(rootDir, 'assets');
const assetsDest = path.join(publicDir, 'assets');
if (fs.existsSync(assetsSrc)) {
  fs.cpSync(assetsSrc, assetsDest, { recursive: true });
  console.log('Copied assets/ directory');
}

// 6. Direct alias for wp-content folder
const wpSrc = path.join(rootDir, 'assets', 'remote', 'wp-content');
const wpDest = path.join(publicDir, 'wp-content');
if (fs.existsSync(wpSrc)) {
  fs.cpSync(wpSrc, wpDest, { recursive: true });
  console.log('Copied wp-content/ directory directly to public root');
}

console.log('--- Production Build Complete: All static assets assembled in public/ ---');
