const fs = require('fs');
const path = require('path');
const file = path.join(__dirname, 'api', 'inquiry.js');
if (fs.existsSync(file)) fs.unlinkSync(file);
const dir = path.join(__dirname, 'api');
if (fs.existsSync(dir)) fs.rmdirSync(dir);
console.log('API deleted');
