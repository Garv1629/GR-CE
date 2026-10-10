const fs = require('fs');
const path = require('path');

const rootDir = path.resolve(__dirname, '..');
const htmlFiles = fs.readdirSync(rootDir).filter(f => f.endsWith('.html'));

const results = [];
let errorCount = 0;
let warningCount = 0;

htmlFiles.forEach(file => {
  const content = fs.readFileSync(path.join(rootDir, file), 'utf8');

  // Match all <a> and <button> elements
  const tagRegex = /<(a|button)\b([^>]*)>([\s\S]*?)<\/\1>/gi;
  let match;

  while ((match = tagRegex.exec(content)) !== null) {
    const [fullMatch, tag, attrs, innerHtml] = match;

    const classMatch = attrs.match(/class=["']([^"']*)["']/i);
    const className = classMatch ? classMatch[1] : '';

    const hrefMatch = attrs.match(/href=["']([^"']*)["']/i);
    const href = hrefMatch ? hrefMatch[1] : null;

    const idMatch = attrs.match(/id=["']([^"']*)["']/i);
    const id = idMatch ? idMatch[1] : null;

    const typeMatch = attrs.match(/type=["']([^"']*)["']/i);
    const type = typeMatch ? typeMatch[1] : null;

    const ariaLabelMatch = attrs.match(/aria-label=["']([^"']*)["']/i);
    const ariaLabel = ariaLabelMatch ? ariaLabelMatch[1] : null;

    const isAnimatedButton = className.includes('animated-button');
    const isButtonTag = tag.toLowerCase() === 'button';
    const isCtaLink = /(?:btn|cta|button|whiteBt|signIn|accountBt|readmore)/i.test(className);

    // Only inspect items that are buttons or styled CTAs
    if (!isAnimatedButton && !isButtonTag && !isCtaLink) {
      continue;
    }

    const issues = [];

    // 1. Raw code or template leakage
    if (/add_action|wp_footer|echo|function\s*\(|\$\{|\bundefined\b|\bnull\b|\[object\s+Object\]/i.test(innerHtml)) {
      issues.push('LEAKED_CODE_OR_UNDEFINED');
    }

    // 2. Nested interactive elements
    if (/<(a|button)\b/i.test(innerHtml)) {
      issues.push('NESTED_INTERACTIVE_TAG');
    }

    // 3. Dummy href="#"
    if (tag === 'a' && href === '#') {
      issues.push('DUMMY_HREF_HASH');
    }

    // 4. Missing accessible label
    const textOnly = innerHtml.replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim();
    if (!textOnly && !ariaLabel) {
      issues.push('MISSING_ACCESSIBLE_LABEL');
    }

    // 5. Animated button structure check
    if (isAnimatedButton) {
      const hasArr1 = /class=["'][^"']*\barr-1\b[^"']*["']/i.test(innerHtml);
      const hasArr2 = /class=["'][^"']*\barr-2\b[^"']*["']/i.test(innerHtml);
      const hasCircle = /class=["'][^"']*\bcircle\b[^"']*["']/i.test(innerHtml);
      const hasText = /class=["'][^"']*\btext\b[^"']*["']/i.test(innerHtml);

      if (!hasArr1) issues.push('ANIMATED_MISSING_ARR1');
      if (!hasArr2) issues.push('ANIMATED_MISSING_ARR2');
      if (!hasCircle) issues.push('ANIMATED_MISSING_CIRCLE');
      if (!hasText) issues.push('ANIMATED_MISSING_TEXT');
    }

    // 6. Button without type attribute
    if (isButtonTag && !type) {
      issues.push('BUTTON_MISSING_TYPE');
    }

    if (issues.length > 0) {
      if (issues.includes('LEAKED_CODE_OR_UNDEFINED') || issues.includes('NESTED_INTERACTIVE_TAG') || issues.includes('DUMMY_HREF_HASH')) {
        errorCount++;
      } else {
        warningCount++;
      }
    }

    results.push({
      file,
      tag,
      id,
      className,
      href,
      type,
      ariaLabel,
      textOnly,
      isAnimatedButton,
      issues
    });
  }
});

console.log(`\n=== AUDIT COMPLETE ===`);
console.log(`Total Buttons / Action CTAs audited: ${results.length}`);
console.log(`Total Animated Buttons: ${results.filter(r => r.isAnimatedButton).length}`);
console.log(`Critical Errors: ${errorCount}`);
console.log(`Warnings: ${warningCount}`);

const issuesList = results.filter(r => r.issues.length > 0);
if (issuesList.length > 0) {
  console.log(`\n--- ISSUES DETECTED ---`);
  issuesList.forEach(item => {
    console.log(`[${item.file}] <${item.tag}> id="${item.id || ''}" class="${item.className}"`);
    console.log(`   Text: "${item.textOnly}" | Issues: ${item.issues.join(', ')}`);
  });
} else {
  console.log(`\nAll buttons passed the structural, label, and code leakage tests!`);
}
