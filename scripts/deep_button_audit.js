const fs = require('fs');
const path = require('path');

const rootDir = path.resolve(__dirname, '..');
const htmlFiles = fs.readdirSync(rootDir).filter(f => f.endsWith('.html'));

const buttonInventory = [];

htmlFiles.forEach(file => {
  const content = fs.readFileSync(path.join(rootDir, file), 'utf8');

  // Match all <a> and <button> tags that are buttons or CTAs
  const elementRegex = /<(a|button)\b([^>]*)>([\s\S]*?)<\/\1>/gi;
  let match;

  while ((match = elementRegex.exec(content)) !== null) {
    const [fullTag, tagType, attrStr, innerHtml] = match;

    // Check if it looks like a button/action
    const isButtonTag = tagType === 'button';
    const isAnimatedBtn = /animated-button/i.test(attrStr);
    const isCtaOrBtnClass = /(?:btn|cta|button|readmore|whiteBt|signIn|accountBt)/i.test(attrStr);

    if (isButtonTag || isAnimatedBtn || isCtaOrBtnClass) {
      // Extract class
      const classMatch = attrStr.match(/class=["']([^"']*)["']/i);
      const className = classMatch ? classMatch[1] : '';

      // Extract href / type
      const hrefMatch = attrStr.match(/href=["']([^"']*)["']/i);
      const href = hrefMatch ? hrefMatch[1] : null;

      const typeMatch = attrStr.match(/type=["']([^"']*)["']/i);
      const btnType = typeMatch ? typeMatch[1] : null;

      const idMatch = attrStr.match(/id=["']([^"']*)["']/i);
      const id = idMatch ? idMatch[1] : null;

      // Extract clean text
      const textSpanMatch = innerHtml.match(/<span\b[^>]*class=["'][^"']*\btext\b[^"']*["'][^>]*>([\s\S]*?)<\/span>/i);
      const rawText = textSpanMatch ? textSpanMatch[1] : innerHtml.replace(/<[^>]+>/g, ' ');
      const cleanText = rawText.replace(/\s+/g, ' ').trim();

      // Check structure if animated
      const hasArr1 = /class=["'][^"']*\barr-1\b[^"']*["']/i.test(innerHtml);
      const hasArr2 = /class=["'][^"']*\barr-2\b[^"']*["']/i.test(innerHtml);
      const hasCircle = /class=["'][^"']*\bcircle\b[^"']*["']/i.test(innerHtml);
      const hasTextSpan = textSpanMatch !== null;

      // Detect anomalies
      const hasRawCode = /add_action|function|wp_footer|\$\{/i.test(innerHtml);
      const hasNestedInteractive = /<(?:a|button)\b/i.test(innerHtml);

      buttonInventory.push({
        file,
        tagType,
        id,
        className,
        href,
        btnType,
        cleanText,
        isAnimated: isAnimatedBtn,
        hasArr1,
        hasArr2,
        hasCircle,
        hasTextSpan,
        hasRawCode,
        hasNestedInteractive
      });
    }
  }
});

fs.writeFileSync(path.join(rootDir, 'button_audit_inventory.json'), JSON.stringify(buttonInventory, null, 2), 'utf8');

console.log(`Audited total actions/buttons: ${buttonInventory.length}`);
const animated = buttonInventory.filter(b => b.isAnimated);
console.log(`Animated buttons: ${animated.length}`);
const withErrors = buttonInventory.filter(b => b.hasRawCode || b.hasNestedInteractive);
console.log(`Buttons with suspicious code or nested tags: ${withErrors.length}`);

// Group by files
const byFile = {};
buttonInventory.forEach(b => {
  byFile[b.file] = byFile[b.file] || { total: 0, animated: 0, utility: 0 };
  byFile[b.file].total++;
  if (b.isAnimated) byFile[b.file].animated++;
  else byFile[b.file].utility++;
});
console.table(byFile);
