const http = require('http');

http.get('http://localhost:3000/wp-content/uploads/2026/02/DSC05623-scaled.jpg', (res) => {
  console.log('Status:', res.statusCode);
  console.log('Headers:', res.headers);
}).on('error', console.error);
