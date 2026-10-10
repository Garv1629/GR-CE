const https = require('https');

function testReferer(referer) {
  return new Promise((resolve) => {
    const options = {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
        'Referer': referer
      }
    };
    https.get('https://www.wordofgrece.com/wp-content/uploads/2026/02/DSC05623-scaled.jpg', options, (res) => {
      resolve({ referer, status: res.statusCode, headers: res.headers });
    }).on('error', err => resolve({ referer, error: err.message }));
  });
}

async function run() {
  console.log('Testing hotlink / referer policies:');
  console.log(await testReferer('http://localhost:3000/'));
  console.log(await testReferer('https://preview.domain.com/'));
  console.log(await testReferer(''));
}

run();
