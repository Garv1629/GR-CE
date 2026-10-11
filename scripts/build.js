const fs = require('fs');
const path = require('path');

const rootDir = path.resolve(__dirname, '..');
const targetDirs = [
  path.join(rootDir, 'dist'),
  path.join(rootDir, 'public')
];

console.log('--- Starting Production Build for Vercel ---');

for (const outDir of targetDirs) {
  const dirName = path.basename(outDir);
  console.log(`\nPopulating target directory: ${dirName}/`);

  if (!fs.existsSync(outDir)) {
    fs.mkdirSync(outDir, { recursive: true });
  }

  // 1. Copy all .html files
  const files = fs.readdirSync(rootDir);
  for (const file of files) {
    if (file.endsWith('.html')) {
      const src = path.join(rootDir, file);
      const dest = path.join(outDir, file);
      fs.copyFileSync(src, dest);
      console.log(`[${dirName}] Copied HTML: ${file}`);
    }
  }

  // 2. Copy css folder
  const cssSrc = path.join(rootDir, 'css');
  const cssDest = path.join(outDir, 'css');
  if (fs.existsSync(cssSrc)) {
    fs.cpSync(cssSrc, cssDest, { recursive: true });
    console.log(`[${dirName}] Copied css/ directory`);
  }

  // 3. Copy js folder
  const jsSrc = path.join(rootDir, 'js');
  const jsDest = path.join(outDir, 'js');
  if (fs.existsSync(jsSrc)) {
    fs.cpSync(jsSrc, jsDest, { recursive: true });
    console.log(`[${dirName}] Copied js/ directory`);
  }

  // 4. Copy assets folder
  const assetsSrc = path.join(rootDir, 'assets');
  const assetsDest = path.join(outDir, 'assets');
  if (fs.existsSync(assetsSrc)) {
    fs.cpSync(assetsSrc, assetsDest, { recursive: true });
    console.log(`[${dirName}] Copied assets/ directory`);
  }

  // 5. Direct alias for wp-content folder
  const wpSrc = path.join(rootDir, 'assets', 'remote', 'wp-content');
  const wpDest = path.join(outDir, 'wp-content');
  if (fs.existsSync(wpSrc)) {
    fs.cpSync(wpSrc, wpDest, { recursive: true });
    console.log(`[${dirName}] Copied wp-content/ directory directly`);
  }

  // 6. Copy data folder
  const dataSrc = path.join(rootDir, 'data');
  const dataDest = path.join(outDir, 'data');
  if (fs.existsSync(dataSrc)) {
    fs.cpSync(dataSrc, dataDest, { recursive: true });
    console.log(`[${dirName}] Copied data/ directory`);
  }


}

console.log('\n--- Production Build Complete: Both dist/ and public/ assembled successfully ---');
