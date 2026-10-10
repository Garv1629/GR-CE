const http = require('http');
const fs = require('fs');
const path = require('path');

const ASSETS = [
  'assets/generated/hero/hero-architecture-desktop.jpg',
  'assets/generated/hero/hero-architecture-mobile.jpg',
  'assets/generated/architecture/architecture-exterior-editorial.jpg',
  'assets/generated/interiors/interior-sculptural-living.jpg',
  'assets/generated/hospitality/hospitality-editorial.jpg',
  'assets/generated/materials/material-stone-texture.jpg',
  'assets/generated/studio/studio-atmosphere-concept.jpg',
  'assets/generated/architecture/architecture-light-staircase.jpg'
];

async function checkUrl(relPath) {
  return new Promise((resolve) => {
    const fullPath = path.join(__dirname, '..', relPath);
    const diskExists = fs.existsSync(fullPath);
    const diskSize = diskExists ? fs.statSync(fullPath).size : 0;

    http.get(`http://localhost:3000/${relPath}`, (res) => {
      let dataLen = 0;
      res.on('data', chunk => { dataLen += chunk.length; });
      res.on('end', () => {
        resolve({
          path: relPath,
          diskExists,
          diskSize,
          httpStatus: res.statusCode,
          contentType: res.headers['content-type'],
          receivedBytes: dataLen,
          ok: diskExists && diskSize > 0 && res.statusCode === 200 && dataLen > 0
        });
      });
    }).on('error', (err) => {
      resolve({
        path: relPath,
        diskExists,
        diskSize,
        error: err.message,
        ok: false
      });
    });
  });
}

async function run() {
  console.log('--- VERIFYING GENERATED ASSETS ---');
  let allOk = true;
  for (const asset of ASSETS) {
    const result = await checkUrl(asset);
    console.log(JSON.stringify(result));
    if (!result.ok) allOk = false;
  }
  console.log('ALL ASSETS OK:', allOk);
  fs.writeFileSync(path.join(__dirname, 'verification_report.json'), JSON.stringify({ allOk, timestamp: new Date().toISOString() }, null, 2));
}

run();
