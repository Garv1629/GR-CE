const fs = require('fs');
const lines = fs.readFileSync('index.html', 'utf8').split('\n');

lines.forEach((line, idx) => {
  if (line.includes('btn-editorial-submit') || line.includes('btn-editorial-primary')) {
    console.log(`Line ${idx + 1}: ${line}`);
  }
});
