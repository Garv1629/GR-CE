const fs = require('fs');
const path = require('path');
const https = require('https');

const videos = [
  { url: 'https://www.wordofgrece.com/wp-content/uploads/2026/07/07-2.mp4', dest: 'assets/remote/wp-content/uploads/2026/07/07-2.mp4' },
  { url: 'https://www.wordofgrece.com/wp-content/uploads/2025/12/banner.mp4', dest: 'assets/remote/wp-content/uploads/2025/12/banner.mp4' }
];

function download(item) {
  return new Promise((resolve) => {
    const fullDest = path.resolve(item.dest);
    fs.mkdirSync(path.dirname(fullDest), { recursive: true });
    if (fs.existsSync(fullDest) && fs.statSync(fullDest).size > 100000) {
      return resolve({ url: item.url, status: 'EXISTS', size: fs.statSync(fullDest).size });
    }
    const file = fs.createWriteStream(fullDest);
    https.get(item.url, { headers: { 'User-Agent': 'Mozilla/5.0' } }, (res) => {
      if (res.statusCode !== 200) {
        file.close();
        if (fs.existsSync(fullDest)) fs.unlinkSync(fullDest);
        return resolve({ url: item.url, status: res.statusCode });
      }
      res.pipe(file);
      file.on('finish', () => {
        file.close();
        resolve({ url: item.url, status: 200, size: fs.statSync(fullDest).size });
      });
    }).on('error', err => resolve({ url: item.url, error: err.message }));
  });
}

async function run() {
  for (const v of videos) {
    console.log(`Downloading ${v.url}...`);
    const res = await download(v);
    console.log(`Result: ${res.status} (${res.size} bytes)`);
  }
}

run();
