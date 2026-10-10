const fs = require('fs');
const path = require('path');
const https = require('https');

const report = JSON.parse(fs.readFileSync('audit_report.json', 'utf8'));

// Extract all remote URLs from workingUrls
const remoteUrls = report.workingUrls
  .filter(item => item.isRemote && !item.url.includes('fonts.googleapis.com'))
  .map(item => item.url);

console.log(`Found ${remoteUrls.length} remote URLs to download.`);

function downloadFile(urlStr, destPath) {
  return new Promise((resolve) => {
    fs.mkdirSync(path.dirname(destPath), { recursive: true });
    
    // If file already exists and is non-empty, skip
    if (fs.existsSync(destPath) && fs.statSync(destPath).size > 1000) {
      return resolve({ url: urlStr, dest: destPath, status: 'EXISTS', size: fs.statSync(destPath).size });
    }

    const file = fs.createWriteStream(destPath);
    https.get(urlStr, { headers: { 'User-Agent': 'Mozilla/5.0' }, timeout: 15000 }, (res) => {
      if (res.statusCode !== 200) {
        file.close();
        fs.unlinkSync(destPath);
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
  const downloadMap = [];
  for (const urlStr of remoteUrls) {
    const parsed = new URL(urlStr);
    // Relative local path: e.g. assets/cdn/wp-content/uploads/...
    // Or simplified: assets/images/remote/<filename>
    const filename = path.basename(parsed.pathname);
    // Preserving subpath structure for safety
    const subpath = parsed.pathname.replace(/^\//, '');
    const localDest = path.join(__dirname, '..', 'assets', 'remote', subpath);
    
    console.log(`Downloading: ${urlStr} -> ${subpath}...`);
    const res = await downloadFile(urlStr, localDest);
    console.log(`Result: ${res.status} (${res.size || 0} bytes)`);
    downloadMap.push({
      remoteUrl: urlStr,
      localRel: `assets/remote/${subpath}`.replace(/\\/g, '/'),
      filename,
      status: res.status,
      size: res.size
    });
  }

  fs.writeFileSync('download_map.json', JSON.stringify(downloadMap, null, 2));
  console.log(`Downloaded ${downloadMap.filter(d => d.status === 200 || d.status === 'EXISTS').length} files successfully!`);
}

run();
