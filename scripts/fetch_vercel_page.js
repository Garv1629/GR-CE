const https = require('https');

https.get('https://vercel.com/garvchauhan0161-gmailcoms-projects/grce/EzuAXaiYNhWozr5ESri2nJx7caEJ', {
  headers: {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36'
  }
}, res => {
  console.log('STATUS:', res.statusCode);
  console.log('LOCATION:', res.headers['location']);
  let d = ''; res.on('data', c => d += c);
  res.on('end', () => console.log('BODY:', d.slice(0, 1000)));
});
