const fs = require('fs');
const path = require('path');

const rootDir = path.resolve(__dirname, '..');

// 1. Fix contact.html and contact-us.html
['contact.html', 'contact-us.html'].forEach(file => {
  const filePath = path.join(rootDir, file);
  let content = fs.readFileSync(filePath, 'utf8');

  content = content.replace(
    /<span class="text btn-label-text">btn-editorial-submit<\/span>/g,
    '<span class="text btn-label-text">Transmit Inquiry</span>'
  );

  content = content.replace(
    /<span class="text btn-label-text">btn-secondary-reset<\/span>/g,
    '<span class="text btn-label-text">Transmit Another Inquiry</span>'
  );

  fs.writeFileSync(filePath, content, 'utf8');
  console.log(`[FIXED] ${file}`);
});

// 2. Fix index.html
const indexPath = path.join(rootDir, 'index.html');
let indexContent = fs.readFileSync(indexPath, 'utf8');

indexContent = indexContent.replace(
  /<span class="text btn-label-text">btn-editorial-submit<\/span>/g,
  '<span class="text btn-label-text">Transmit Inquiry</span>'
);

indexContent = indexContent.replace(
  /<span class="text btn-label-text">btn-editorial-primary<\/span>/g,
  '<span class="text btn-label-text">Sign In to Atelier</span>'
);

fs.writeFileSync(indexPath, indexContent, 'utf8');
console.log(`[FIXED] index.html`);
