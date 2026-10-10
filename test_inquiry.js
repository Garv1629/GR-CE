const http = require('http');

function postInquiry(payload) {
  return new Promise((resolve, reject) => {
    const data = JSON.stringify(payload);
    const req = http.request({
      hostname: 'localhost',
      port: 3000,
      path: '/api/inquiry',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(data)
      }
    }, res => {
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => {
        try {
          resolve({ status: res.statusCode, data: JSON.parse(body) });
        } catch(e) {
          resolve({ status: res.statusCode, raw: body });
        }
      });
    });

    req.on('error', reject);
    req.write(data);
    req.end();
  });
}

async function runTests() {
  console.log('--- TEST 1: Valid Submission ---');
  const validRes = await postInquiry({
    fullName: 'Elena Rostova',
    email: 'elena@rostovastudio.com',
    phone: '+91 98100 12345',
    discipline: 'Hospitality',
    location: 'Goa',
    stage: 'Design Planning',
    message: 'We are developing a 24-suite heritage boutique hotel and require comprehensive interior architecture and bespoke furniture.'
  });
  console.log('Result 1:', JSON.stringify(validRes, null, 2));

  console.log('--- TEST 2: Invalid Fields ---');
  const invalidRes = await postInquiry({
    fullName: 'E',
    email: 'not-an-email',
    discipline: '',
    message: 'short'
  });
  console.log('Result 2:', JSON.stringify(invalidRes, null, 2));

  console.log('--- TEST 3: Honeypot Spam Trap ---');
  const spamRes = await postInquiry({
    fullName: 'Spam Bot',
    email: 'spammer@bot.net',
    discipline: 'Hospitality',
    message: 'Buy cheap watches now!',
    website: 'https://spamlink.com'
  });
  console.log('Result 3:', JSON.stringify(spamRes, null, 2));
}

runTests().catch(console.error);
