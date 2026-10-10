const http = require('http');
const fs = require('fs');
const path = require('path');

const rootDir = path.resolve(__dirname, '..');

const PAGES = [
  '/',
  '/index.html',
  '/about.html',
  '/contact.html',
  '/contact-us.html',
  '/lifestyle.html',
  '/interior-design-home.html',
  '/interior-design-hospitality.html',
  '/interior-design-business-premises.html',
  '/project-all-saints.html',
  '/project-aahii.html',
  '/project-rasoi.html',
  '/word-by-grece.html'
];

function fetchUrl(urlPath, options = {}) {
  return new Promise((resolve) => {
    const opts = {
      hostname: 'localhost',
      port: 3000,
      path: urlPath,
      method: options.method || 'GET',
      headers: options.headers || { 'User-Agent': 'RecoveryTester/1.0' },
      timeout: 5000
    };

    const req = http.request(opts, (res) => {
      let body = '';
      res.on('data', chunk => {
        if (body.length < 500000) body += chunk;
      });
      res.on('end', () => {
        resolve({
          path: urlPath,
          statusCode: res.statusCode,
          headers: res.headers,
          bodyLength: body.length
        });
      });
    });

    req.on('error', (err) => resolve({ path: urlPath, error: err.message, statusCode: 0 }));
    req.on('timeout', () => { req.destroy(); resolve({ path: urlPath, error: 'Timeout', statusCode: 0 }); });

    if (options.body) {
      req.write(options.body);
    }
    req.end();
  });
}

async function runTests() {
  console.log('====================================================');
  console.log('GRÈCE WEBSITE FULL RECOVERY VERIFICATION SUITE');
  console.log('====================================================\n');

  // 1. Test All Pages
  console.log('--- 1. Testing Page Routes ---');
  let pagesOk = 0;
  for (const page of PAGES) {
    const res = await fetchUrl(page);
    const ok = res.statusCode === 200 && res.bodyLength > 1000;
    if (ok) pagesOk++;
    console.log(`[${ok ? 'PASS' : 'FAIL'}] ${page} -> ${res.statusCode} (${res.bodyLength} bytes)`);
  }
  console.log(`Pages Result: ${pagesOk}/${PAGES.length} passed.\n`);

  // 2. Collect and Test All Image References in HTML files
  console.log('--- 2. Testing All HTML Image & Asset References ---');
  const htmlFiles = fs.readdirSync(rootDir).filter(f => f.endsWith('.html'));
  const assetPaths = new Set();

  for (const f of htmlFiles) {
    const content = fs.readFileSync(path.join(rootDir, f), 'utf8');

    // img src
    const imgMatches = content.match(/<img[^>]+src=["']([^"']+)["']/gi) || [];
    imgMatches.forEach(tag => {
      const src = tag.match(/src=["']([^"']+)["']/i)[1];
      if (!src.startsWith('data:') && !src.startsWith('http://') && !src.startsWith('https://')) {
        assetPaths.add(src);
      }
    });

    // video src & poster
    const posterMatches = content.match(/poster=["']([^"']+)["']/gi) || [];
    posterMatches.forEach(tag => {
      const src = tag.match(/poster=["']([^"']+)["']/i)[1];
      if (!src.startsWith('data:') && !src.startsWith('http://') && !src.startsWith('https://')) {
        assetPaths.add(src);
      }
    });

    const videoSrcMatches = content.match(/<source[^>]+src=["']([^"']+)["']/gi) || [];
    videoSrcMatches.forEach(tag => {
      const src = tag.match(/src=["']([^"']+)["']/i)[1];
      if (!src.startsWith('data:') && !src.startsWith('http://') && !src.startsWith('https://')) {
        assetPaths.add(src);
      }
    });
  }

  console.log(`Extracted ${assetPaths.size} unique local assets across HTML files.`);

  let assetsOk = 0;
  let failedAssets = [];
  for (const aPath of assetPaths) {
    const cleanPath = aPath.startsWith('/') ? aPath : '/' + aPath;
    const res = await fetchUrl(cleanPath);
    const ok = res.statusCode === 200 && (parseInt(res.headers['content-length'] || res.bodyLength) > 0);
    if (ok) {
      assetsOk++;
    } else {
      failedAssets.push({ path: aPath, status: res.statusCode, error: res.error });
      console.error(`[FAIL] ${aPath} -> ${res.statusCode} ${res.error || ''}`);
    }
  }

  console.log(`Assets Result: ${assetsOk}/${assetPaths.size} passed.`);
  if (failedAssets.length > 0) {
    console.error(`Failed assets:`, failedAssets);
  } else {
    console.log(`ALL ${assetPaths.size} LOCAL ASSETS SERVED WITH HTTP 200!\n`);
  }

  // 3. Test Video Streaming (Range 206)
  console.log('--- 3. Testing Video Streaming (Range Requests) ---');
  const videoTest1 = await fetchUrl('/assets/remote/wp-content/uploads/2026/07/07-2.mp4', {
    headers: { Range: 'bytes=0-1024' }
  });
  console.log(`Hero video range 0-1024: [${videoTest1.statusCode === 206 ? 'PASS' : 'FAIL'}] ${videoTest1.statusCode} (Accept-Ranges: ${videoTest1.headers['accept-ranges']}, Content-Range: ${videoTest1.headers['content-range']})`);

  const videoTest2 = await fetchUrl('/assets/remote/wp-content/uploads/2025/12/banner.mp4', {
    headers: { Range: 'bytes=0-2048' }
  });
  console.log(`Banner video range 0-2048: [${videoTest2.statusCode === 206 ? 'PASS' : 'FAIL'}] ${videoTest2.statusCode} (Accept-Ranges: ${videoTest2.headers['accept-ranges']}, Content-Range: ${videoTest2.headers['content-range']})\n`);

  // 4. Test API Endpoints
  console.log('--- 4. Testing API Endpoints ---');
  const genAudit = await fetchUrl('/api/audit-generated');
  console.log(`Audit Generated: [${genAudit.statusCode === 200 ? 'PASS' : 'FAIL'}] ${genAudit.statusCode}`);

  const inquiryRes = await fetchUrl('/api/inquiry', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      fullName: 'Verification Suite Client',
      email: 'client@example.com',
      phone: '+1 555-0199',
      discipline: 'Architecture & Spatial Design',
      location: 'Milan / Zurich',
      stage: 'Concept',
      message: 'Comprehensive project recovery verification inquiry.'
    })
  });
  console.log(`Inquiry Submission: [${inquiryRes.statusCode === 200 ? 'PASS' : 'FAIL'}] ${inquiryRes.statusCode}\n`);

  // Summary
  const allPassed = pagesOk === PAGES.length && assetsOk === assetPaths.size && videoTest1.statusCode === 206 && inquiryRes.statusCode === 200;
  console.log('====================================================');
  console.log(`OVERALL RECOVERY STATUS: ${allPassed ? '100% RECOVERED & VERIFIED' : 'ISSUES DETECTED'}`);
  console.log('====================================================');

  fs.writeFileSync('verification_results.json', JSON.stringify({
    timestamp: new Date().toISOString(),
    pagesTested: PAGES.length,
    pagesPassed: pagesOk,
    assetsTested: assetPaths.size,
    assetsPassed: assetsOk,
    failedAssets,
    videoStreaming: videoTest1.statusCode === 206 && videoTest2.statusCode === 206,
    inquiryApi: inquiryRes.statusCode === 200,
    allPassed
  }, null, 2));
}

runTests();
