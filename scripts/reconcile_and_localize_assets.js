const fs = require('fs');
const path = require('path');
const https = require('https');

const rootDir = path.resolve(__dirname, '..');

// All files to scan
const targetExtensions = ['.html', '.js', '.css'];
function getAllFiles(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    if (stat && stat.isDirectory()) {
      if (file !== 'node_modules' && file !== '.git' && file !== 'assets' && file !== 'scripts') {
        results = results.concat(getAllFiles(fullPath));
      }
    } else {
      if (targetExtensions.some(ext => file.endsWith(ext))) {
        results.push(fullPath);
      }
    }
  });
  return results;
}

const files = getAllFiles(rootDir);
console.log(`Scanning ${files.length} project files for remote wp-content assets...`);

const remoteUrlRegex = /https:\/\/www\.wordofgrece\.com\/wp-content\/[^\s"'`\)]+/g;
const foundUrls = new Set();

files.forEach(f => {
  const content = fs.readFileSync(f, 'utf8');
  let match;
  while ((match = remoteUrlRegex.exec(content)) !== null) {
    foundUrls.add(match[0]);
  }
});

console.log(`Found ${foundUrls.size} distinct remote wp-content URLs across project files.`);

function downloadRemote(urlStr, destPath) {
  return new Promise((resolve) => {
    fs.mkdirSync(path.dirname(destPath), { recursive: true });
    if (fs.existsSync(destPath) && fs.statSync(destPath).size > 0) {
      return resolve({ url: urlStr, dest: destPath, status: 'EXISTS', size: fs.statSync(destPath).size });
    }

    const file = fs.createWriteStream(destPath);
    https.get(urlStr, { headers: { 'User-Agent': 'Mozilla/5.0' }, timeout: 15000 }, (res) => {
      if (res.statusCode !== 200) {
        file.close();
        if (fs.existsSync(destPath)) fs.unlinkSync(destPath);
        return resolve({ url: urlStr, status: res.statusCode });
      }
      res.pipe(file);
      file.on('finish', () => {
        file.close();
        const size = fs.statSync(destPath).size;
        resolve({ url: urlStr, dest: destPath, status: 200, size });
      });
    }).on('error', (err) => {
      file.close();
      if (fs.existsSync(destPath)) fs.unlinkSync(destPath);
      resolve({ url: urlStr, status: 'ERROR', error: err.message });
    });
  });
}

async function run() {
  const downloadResults = [];
  for (const urlStr of foundUrls) {
    const parsed = new URL(urlStr);
    const subpath = parsed.pathname.replace(/^\//, ''); // wp-content/...
    const localDest = path.join(rootDir, 'assets', 'remote', subpath);

    const res = await downloadRemote(urlStr, localDest);
    console.log(`Asset: ${subpath} -> ${res.status} (${res.size || 0} bytes)`);
    downloadResults.push({ url: urlStr, localDest, ...res });
  }

  console.log('\n--- Localizing References in Project Files ---');
  let totalReplacements = 0;

  files.forEach(f => {
    let content = fs.readFileSync(f, 'utf8');
    const relFile = path.relative(rootDir, f).replace(/\\/g, '/');

    // For files at root level (like index.html), path is assets/remote/wp-content/...
    // For files in subdirectories (like js/main.js or css/design-system.css):
    // In CSS or JS, assets/remote/wp-content/... or /assets/remote/wp-content/...
    // Let's calculate relative path to assets/remote/wp-content:
    let replacementPrefix = 'assets/remote/wp-content/';
    const depth = relFile.split('/').length - 1;
    if (depth > 0 && f.endsWith('.css')) {
      replacementPrefix = '../assets/remote/wp-content/';
    } else if (f.endsWith('.js')) {
      replacementPrefix = 'assets/remote/wp-content/';
    }

    const targetPattern = 'https://www.wordofgrece.com/wp-content/';
    if (content.includes(targetPattern)) {
      const count = content.split(targetPattern).length - 1;
      content = content.replaceAll(targetPattern, replacementPrefix);
      fs.writeFileSync(f, content, 'utf8');
      console.log(`Updated ${relFile}: ${count} references converted to ${replacementPrefix}`);
      totalReplacements += count;
    }
  });

  console.log(`\nReconciliation complete! Total replacements: ${totalReplacements}`);
}

run();
