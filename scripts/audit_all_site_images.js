const fs = require('fs');
const path = require('path');
const https = require('https');
const http = require('http');

const rootDir = path.resolve(__dirname, '..');
const htmlFiles = fs.readdirSync(rootDir).filter(f => f.endsWith('.html'));

const allImageRefs = [];

for (const file of htmlFiles) {
  const filePath = path.join(rootDir, file);
  const content = fs.readFileSync(filePath, 'utf8');

  // img tags
  const imgRegex = /<img[^>]+src=["']([^"']+)["'][^>]*>/gi;
  let match;
  while ((match = imgRegex.exec(content)) !== null) {
    const altMatch = match[0].match(/alt=["']([^"']*)["']/i);
    allImageRefs.push({
      file,
      tag: match[0],
      src: match[1],
      alt: altMatch ? altMatch[1] : '',
      type: 'img'
    });
  }

  // source srcset
  const sourceRegex = /<source[^>]+srcset=["']([^"']+)["'][^>]*>/gi;
  while ((match = sourceRegex.exec(content)) !== null) {
    allImageRefs.push({
      file,
      tag: match[0],
      src: match[1],
      alt: '',
      type: 'source'
    });
  }

  // video poster
  const posterRegex = /poster=["']([^"']+)["']/gi;
  while ((match = posterRegex.exec(content)) !== null) {
    allImageRefs.push({
      file,
      tag: match[0],
      src: match[1],
      alt: '',
      type: 'poster'
    });
  }

  // background-image
  const bgRegex = /url\(['"]?([^'"\)\s]+)['"]?\)/gi;
  while ((match = bgRegex.exec(content)) !== null) {
    if (!match[1].startsWith('data:')) {
      allImageRefs.push({
        file,
        tag: match[0],
        src: match[1],
        alt: '',
        type: 'css-bg'
      });
    }
  }
}

// Check CSS files too
const cssDir = path.join(rootDir, 'css');
if (fs.existsSync(cssDir)) {
  for (const cFile of fs.readdirSync(cssDir).filter(f => f.endsWith('.css'))) {
    const cContent = fs.readFileSync(path.join(cssDir, cFile), 'utf8');
    const bgRegex = /url\(['"]?([^'"\)\s]+)['"]?\)/gi;
    let match;
    while ((match = bgRegex.exec(cContent)) !== null) {
      if (!match[1].startsWith('data:') && !match[1].includes('fonts.gstatic.com')) {
        allImageRefs.push({
          file: `css/${cFile}`,
          tag: match[0],
          src: match[1],
          alt: '',
          type: 'css-file-bg'
        });
      }
    }
  }
}

// Distinct URLs
const distinctUrls = [...new Set(allImageRefs.map(r => r.src))];

function checkUrl(urlStr) {
  return new Promise((resolve) => {
    if (urlStr.startsWith('http://') || urlStr.startsWith('https://')) {
      const client = urlStr.startsWith('https') ? https : http;
      try {
        const u = new URL(urlStr);
        const req = client.request({
          method: 'HEAD',
          hostname: u.hostname,
          path: u.pathname + u.search,
          headers: { 'User-Agent': 'Mozilla/5.0' },
          timeout: 5000
        }, (res) => {
          resolve({
            url: urlStr,
            isRemote: true,
            status: res.statusCode,
            ok: res.statusCode >= 200 && res.statusCode < 400
          });
        });
        req.on('error', (e) => resolve({ url: urlStr, isRemote: true, status: 0, error: e.message, ok: false }));
        req.on('timeout', () => { req.destroy(); resolve({ url: urlStr, isRemote: true, status: 0, error: 'Timeout', ok: false }); });
        req.end();
      } catch (err) {
        resolve({ url: urlStr, isRemote: true, status: 0, error: err.message, ok: false });
      }
    } else {
      // Local relative URL
      let localPath = path.join(rootDir, urlStr);
      const exists = fs.existsSync(localPath);
      const size = exists ? fs.statSync(localPath).size : 0;
      resolve({
        url: urlStr,
        isRemote: false,
        status: exists ? 200 : 404,
        size,
        ok: exists && size > 0
      });
    }
  });
}

async function main() {
  console.log(`Found ${allImageRefs.length} image references, ${distinctUrls.length} distinct URLs.`);
  const results = {};
  for (const u of distinctUrls) {
    const res = await checkUrl(u);
    results[u] = res;
  }

  const report = {
    totalRefs: allImageRefs.length,
    distinctCount: distinctUrls.length,
    brokenUrls: Object.values(results).filter(r => !r.ok),
    workingUrls: Object.values(results).filter(r => r.ok),
    refsWithStatus: allImageRefs.map(r => ({
      ...r,
      check: results[r.src]
    }))
  };

  fs.writeFileSync(path.join(rootDir, 'audit_report.json'), JSON.stringify(report, null, 2));
  console.log('AUDIT COMPLETED. Broken count:', report.brokenUrls.length);
  report.brokenUrls.forEach(b => console.log('BROKEN:', b.url, b.status, b.error || ''));
}

main();
