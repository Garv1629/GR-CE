const https = require('https');

function get(url) {
  return new Promise((resolve) => {
    https.get(url, { headers: { 'User-Agent': 'DeployWatcher' } }, res => {
      let d = '';
      res.on('data', c => d += c);
      res.on('end', () => {
        try { resolve(JSON.parse(d)); } catch (e) { resolve(d); }
      });
    }).on('error', e => resolve({ error: e.message }));
  });
}

function checkUrl(url) {
  return new Promise((resolve) => {
    https.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36'
      }
    }, res => {
      let len = 0;
      res.on('data', c => len += c.length);
      res.on('end', () => {
        resolve({
          status: res.statusCode,
          contentType: res.headers['content-type'],
          length: len,
          xVercelId: res.headers['x-vercel-id'],
          server: res.headers['server']
        });
      });
    }).on('error', e => resolve({ error: e.message }));
  });
}

async function run() {
  console.log('Checking status for commit d2b96ef...');
  const status = await get('https://api.github.com/repos/Garv1629/GR-CE/commits/d2b96ef/status');
  console.log('Commit Status State:', status.state);
  if (status.statuses) {
    status.statuses.forEach(s => console.log(' ->', s.context, s.state, s.description, s.target_url));
  }

  console.log('\nTesting live assets on grce.vercel.app:');
  const urls = [
    'https://grce.vercel.app/',
    'https://grce.vercel.app/css/design-system.css',
    'https://grce.vercel.app/css/theme-override.css',
    'https://grce.vercel.app/js/main.js',
    'https://grce.vercel.app/assets/remote/wp-content/themes/grece/images/grece-logo.webp',
    'https://grce.vercel.app/wp-content/themes/grece/images/grece-logo.webp',
    'https://grce.vercel.app/api/inquiry'
  ];

  for (const u of urls) {
    const res = await checkUrl(u);
    console.log(`${res.status} | ${res.contentType?.slice(0, 30)} | len: ${res.length} | id: ${res.xVercelId} | ${u}`);
  }
}

run();
