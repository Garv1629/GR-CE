const https = require('https');

function check(url) {
  return new Promise((resolve) => {
    https.get(url, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        resolve({
          url,
          status: res.statusCode,
          headers: res.headers,
          length: data.length,
          preview: data.slice(0, 200)
        });
      });
    }).on('error', err => resolve({ url, error: err.message }));
  });
}

async function run() {
  const urls = [
    'https://grce.vercel.app/',
    'https://grce.vercel.app/css/design-system.css',
    'https://grce.vercel.app/css/theme-override.css',
    'https://grce.vercel.app/js/main.js',
    'https://grce.vercel.app/data/inquiries.json',
    'https://grce.vercel.app/assets/generated/hero/hero-architecture-desktop.jpg',
    'https://grce.vercel.app/assets/remote/wp-content/themes/grece/images/grece-logo.webp',
    'https://grce.vercel.app/wp-content/themes/grece/images/grece-logo.webp'
  ];

  for (const u of urls) {
    const r = await check(u);
    console.log(`[${r.status}] ${u} (len: ${r.length}, age: ${r.headers ? r.headers['age'] : 'N/A'}, date: ${r.headers ? r.headers['date'] : 'N/A'}, etag: ${r.headers ? r.headers['etag'] : 'N/A'}, x-vercel-id: ${r.headers ? r.headers['x-vercel-id'] : 'N/A'})`);
  }
}

run();
