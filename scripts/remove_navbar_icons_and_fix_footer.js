const fs = require('fs');
const path = require('path');

const rootDir = path.resolve(__dirname, '..');
const htmlFiles = fs.readdirSync(rootDir).filter(f => f.endsWith('.html'));

// 1. Remove Account and Bag buttons from navbar in index.html
const indexPath = path.join(rootDir, 'index.html');
let indexContent = fs.readFileSync(indexPath, 'utf8');

// Regex to remove the account and bag links from header-actions
const navIconsRegex = /<!-- Account Link -->[\s\S]*?<!-- Bag Link -->[\s\S]*?<\/a>\s*/gi;
if (navIconsRegex.test(indexContent)) {
  indexContent = indexContent.replace(navIconsRegex, '');
  console.log('[SUCCESS] Removed Account and Shopping Bag buttons from index.html navbar');
} else {
  // Fallback: match individually
  indexContent = indexContent.replace(/<a\b[^>]*class=["'][^"']*\baccountBt\b[^"']*utility-link[^"']*["'][^>]*>[\s\S]*?<\/a>\s*/gi, '');
  indexContent = indexContent.replace(/<a\b[^>]*class=["'][^"']*\bbag-link\b[^"']*["'][^>]*>[\s\S]*?<\/a>\s*/gi, '');
  console.log('[FALLBACK] Removed Account and Bag links individually from index.html navbar');
}

fs.writeFileSync(indexPath, indexContent, 'utf8');

// 2. Fix footer signIn accountBt across all HTML files so it's not a distorted 42px pill over giant serif text
htmlFiles.forEach(file => {
  const filePath = path.join(rootDir, file);
  let content = fs.readFileSync(filePath, 'utf8');

  // Match the footer animated button with signIn accountBt
  const footerBtnRegex = /<a\b[^>]*class=["'][^"']*\banimated-button\b[^"']*\bsignIn\b[^"']*["'][^>]*>[\s\S]*?<\/a>/gi;
  if (footerBtnRegex.test(content)) {
    content = content.replace(footerBtnRegex, '<a href="https://www.wordofgrece.com/book-an-appointment" class="signIn accountBt">Book an Appointment</a>');
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`[FIXED FOOTER] ${file}: Restored clean editorial link`);
  }
});

console.log('\nAll updates applied successfully.');
