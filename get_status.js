const https = require('https');

https.get('https://api.github.com/repos/Garv1629/GR-CE/deployments', {
  headers: { 'User-Agent': 'Node-Fetch' }
}, (res) => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => {
    try {
      const arr = JSON.parse(data);
      console.log('DEPLOYMENTS COUNT:', arr.length);
      arr.forEach((d, i) => {
        console.log(`[${i}] ID: ${d.id}, SHA: ${d.sha.slice(0, 7)}, CREATED: ${d.created_at}, ENV: ${d.environment}`);
      });
    } catch(e) {
      console.log('PARSE ERR:', e.message);
    }
  });
}).on('error', err => console.log('REQ ERR:', err.message));
