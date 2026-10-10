const https = require('https');

function check(url) {
  return new Promise((resolve) => {
    https.request(url, { method: 'HEAD', headers: { 'User-Agent': 'Mozilla/5.0' } }, (res) => {
      resolve({ url, status: res.statusCode, size: res.headers['content-length'] });
    }).on('error', e => resolve({ url, error: e.message })).end();
  });
}

async function run() {
  console.log(await check('https://www.wordofgrece.com/wp-content/uploads/2026/07/07-2.mp4'));
  console.log(await check('https://www.wordofgrece.com/wp-content/uploads/2025/12/banner.mp4'));
}

run();
