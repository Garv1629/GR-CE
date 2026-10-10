const fs = require('fs');

['contact.html', 'contact-us.html', 'index.html'].forEach(f => {
  const lines = fs.readFileSync(f, 'utf8').split('\n');
  console.log(`\n=== ${f} ===`);
  lines.forEach((line, idx) => {
    if (line.includes('btn-editorial-submit') || line.includes('btn-secondary-reset') || line.includes('btn-editorial-primary')) {
      console.log(`[Line ${idx+1}]: ${line}`);
      if (lines[idx-1]) console.log(`  prev: ${lines[idx-1]}`);
      if (lines[idx+1]) console.log(`  next: ${lines[idx+1]}`);
    }
  });
});
