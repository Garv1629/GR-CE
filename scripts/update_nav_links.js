const fs = require('fs');
const path = require('path');

const htmlFiles = [
  'about.html',
  'contact.html',
  'contact-us.html',
  'interior-design-business-premises.html',
  'interior-design-home.html',
  'interior-design-hospitality.html',
  'lifestyle.html',
  'project-aahii.html',
  'project-all-saints.html',
  'project-rasoi.html',
  'word-by-grece.html'
];

let totalReplacements = 0;

for (const file of htmlFiles) {
  const filePath = path.join(__dirname, '..', file);
  if (!fs.existsSync(filePath)) {
    console.log(`Skipping missing file: ${file}`);
    continue;
  }
  let content = fs.readFileSync(filePath, 'utf8');
  const original = content;

  // Replace external links with local references
  content = content.replace(/https:\/\/www\.wordofgrece\.com\/products\/?/g, 'index.html#products');
  content = content.replace(/https:\/\/www\.wordofgrece\.com\/brand-design\/?/g, 'index.html#brand-design');
  content = content.replace(/https:\/\/www\.wordofgrece\.com\/gallery\/products\/?/g, 'index.html#photography');

  if (content !== original) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Updated links in ${file}`);
    totalReplacements++;
  } else {
    console.log(`No changes needed in ${file}`);
  }
}

console.log(`Finished updating ${totalReplacements} files.`);
