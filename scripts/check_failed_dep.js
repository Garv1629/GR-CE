const https = require('https');

https.get('https://api.github.com/repos/Garv1629/GR-CE/deployments', {
  headers: { 'User-Agent': 'Node' }
}, res => {
  let d = ''; res.on('data', c => d += c);
  res.on('end', () => {
    const deps = JSON.parse(d);
    console.log('Latest dep:', deps[0]);
    https.get(`https://api.github.com/repos/Garv1629/GR-CE/deployments/${deps[0].id}/statuses`, {
      headers: { 'User-Agent': 'Node' }
    }, sRes => {
      let sd = ''; sRes.on('data', sc => sd += sc);
      sRes.on('end', () => {
        console.log('Statuses:', JSON.parse(sd));
      });
    });
  });
});
