const https = require('https');

https.get('https://vercel.com/garvchauhan0161-gmailcoms-projects/grce/EzuAXaiYNhWozr5ESri2nJx7caEJ', {
  headers: {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36'
  }
}, res => {
  let d = ''; res.on('data', c => d += c);
  res.on('end', () => {
    // Look for error messages or log lines in script tags
    const matches = d.match(/("error"[^,}]+|"errorMessage"[^,}]+|"text":"[^"]*error[^"]*")/gi);
    console.log('Matches:', matches);
    const buildMatches = d.match(/(Command "[^"]*" exited with [0-9]+|Error:[^<"]+)/gi);
    console.log('Build matches:', buildMatches);
  });
});
