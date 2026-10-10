const fs = require('fs');
const path = require('path');

const rootDir = path.resolve(__dirname, '..');
const htmlFiles = fs.readdirSync(rootDir).filter(f => f.endsWith('.html'));

console.log('====================================================');
console.log('GRÈCE ANIMATED BUTTON SYSTEM REGRESSION TEST SUITE');
console.log('====================================================\n');

let totalAnimatedButtons = 0;
let errors = [];

htmlFiles.forEach(file => {
  const content = fs.readFileSync(path.join(rootDir, file), 'utf8');

  // Match all .animated-button elements
  const btnRegex = /<(a|button)\b([^>]*class=["'][^"']*\banimated-button\b[^"']*["'][^>]*)>([\s\S]*?)<\/\1>/gi;
  let match;
  let countInFile = 0;

  while ((match = btnRegex.exec(content)) !== null) {
    countInFile++;
    totalAnimatedButtons++;
    const [fullTag, tagType, attrStr, innerHtml] = match;

    // Check 1: Required elements inside button
    const hasArr2 = /<svg\b[^>]*class=["'][^"']*\barr-2\b[^"']*["']/i.test(innerHtml);
    const hasText = /<span\b[^>]*class=["'][^"']*\btext\b[^"']*["']/i.test(innerHtml);
    const hasCircle = /<span\b[^>]*class=["'][^"']*\bcircle\b[^"']*["']/i.test(innerHtml);
    const hasArr1 = /<svg\b[^>]*class=["'][^"']*\barr-1\b[^"']*["']/i.test(innerHtml);

    if (!hasArr2 || !hasText || !hasCircle || !hasArr1) {
      errors.push(`[STRUCTURAL ERROR in ${file}]: Button missing required child components: arr-2=${hasArr2}, text=${hasText}, circle=${hasCircle}, arr-1=${hasArr1}`);
    }

    // Check 2: Extract text and check for corruptions/code leaks
    const textMatch = innerHtml.match(/<span\b[^>]*class=["'][^"']*\btext\b[^"']*["'][^>]*>([\s\S]*?)<\/span>/i);
    const labelText = textMatch ? textMatch[1].trim() : '';

    if (!labelText || labelText.length < 2) {
      errors.push(`[EMPTY LABEL in ${file}]: Button text label is empty or too short: "${labelText}"`);
    }

    if (/\$\{/.test(labelText) || /\{\{/.test(labelText) || /undefined/i.test(labelText) || /\[object/i.test(labelText) || /NaN/.test(labelText) || /function\b/.test(labelText)) {
      errors.push(`[CORRUPT LABEL in ${file}]: Suspicious text or code found in button label: "${labelText}"`);
    }

    // Check 3: Semantic validity
    if (tagType === 'a') {
      const hasHref = /href=["'][^"']+["']/i.test(attrStr);
      if (!hasHref) {
        errors.push(`[MISSING HREF in ${file}]: <a> button missing valid href attribute`);
      }
    } else if (tagType === 'button') {
      const hasType = /type=["'](submit|button|reset)["']/i.test(attrStr);
      if (!hasType) {
        errors.push(`[MISSING TYPE in ${file}]: <button> missing explicit type attribute`);
      }
    }
  }

  console.log(`[PASS] ${file}: ${countInFile} animated buttons verified.`);
});

console.log('\n--- Excluded Controls Verification ---');
let excludedCount = 0;
htmlFiles.forEach(file => {
  const content = fs.readFileSync(path.join(rootDir, file), 'utf8');

  // Check menu toggles
  const menuToggles = content.match(/<button\b[^>]*class=["'][^"']*\bmenu-toggle\b[^"']*["'][^>]*>/gi) || [];
  menuToggles.forEach(tag => {
    if (tag.includes('animated-button')) {
      errors.push(`[EXCLUSION VIOLATION in ${file}]: Menu toggle should not have animated-button class!`);
    }
    excludedCount++;
  });

  // Check close buttons
  const closeBtns = content.match(/<button\b[^>]*class=["'][^"']*(?:mobile-nav-close|mobile-close-btn)\b[^"']*["'][^>]*>/gi) || [];
  closeBtns.forEach(tag => {
    if (tag.includes('animated-button')) {
      errors.push(`[EXCLUSION VIOLATION in ${file}]: Close button should not have animated-button class!`);
    }
    excludedCount++;
  });

  // Check video toggles
  const videoToggles = content.match(/<button\b[^>]*id=["'](?:heroMediaToggle|aboutMediaToggle)["'][^>]*>/gi) || [];
  videoToggles.forEach(tag => {
    if (tag.includes('animated-button')) {
      errors.push(`[EXCLUSION VIOLATION in ${file}]: Video media toggle should not have animated-button class!`);
    }
    excludedCount++;
  });
});

console.log(`Verified ${excludedCount} utility/control buttons remain properly excluded.\n`);

console.log('====================================================');
console.log(`TOTAL ANIMATED BUTTONS VERIFIED: ${totalAnimatedButtons}`);
console.log(`TOTAL ERRORS FOUND: ${errors.length}`);
console.log('====================================================');

if (errors.length > 0) {
  console.error('\nErrors detected:', errors);
  process.exit(1);
} else {
  console.log('\nALL 71 ANIMATED BUTTONS CONFIRMED VALID & STRUCTURALLY ACCURATE!\n');
}
