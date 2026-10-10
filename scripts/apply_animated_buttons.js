const fs = require('fs');
const path = require('path');

const rootDir = path.resolve(__dirname, '..');
const htmlFiles = fs.readdirSync(rootDir).filter(f => f.endsWith('.html'));

const ARROW_SVG_ARR2 = `<svg viewBox="0 0 24 24" class="arr-2" aria-hidden="true"><path d="M16.1716 10.9999L10.8076 5.63589L12.2218 4.22168L20 11.9999L12.2218 19.778L10.8076 18.3638L16.1716 12.9999H4V10.9999H16.1716Z"></path></svg>`;
const ARROW_SVG_ARR1 = `<svg viewBox="0 0 24 24" class="arr-1" aria-hidden="true"><path d="M16.1716 10.9999L10.8076 5.63589L12.2218 4.22168L20 11.9999L12.2218 19.778L10.8076 18.3638L16.1716 12.9999H4V10.9999H16.1716Z"></path></svg>`;

// Button classes to transform
const TARGET_SELECTORS = [
  'inquiry-cta',
  'mobile-cta-link',
  'hero-cta-primary',
  'hero-cta-secondary',
  'brand-editorial-btn',
  'btn-editorial-hollow',
  'btn-editorial-solid',
  'btn-editorial-submit',
  'manifesto-action-link',
  'atelier-btn-secondary',
  'btn-secondary-reset'
];

let totalConverted = 0;

htmlFiles.forEach(file => {
  const filePath = path.join(rootDir, file);
  let content = fs.readFileSync(filePath, 'utf8');
  let fileChanges = 0;

  // 1. Transform <a> tags
  TARGET_SELECTORS.forEach(targetClass => {
    // Regex for <a> with class containing targetClass, but NOT animated-button
    const aRegex = new RegExp(`<a\\b([^>]*class=["'][^"']*\\b${targetClass}\\b[^"']*["'][^>]*)>([\\s\\S]*?)<\\/a>`, 'gi');
    content = content.replace(aRegex, (fullMatch, attrStr, innerHtml) => {
      if (attrStr.includes('animated-button')) return fullMatch;

      // Determine variant
      let variantClass = 'animated-button--outline';
      if (targetClass.includes('solid') || targetClass.includes('primary') || targetClass === 'mobile-cta-link' || targetClass === 'brand-editorial-btn') {
        variantClass = 'animated-button--dark';
      }

      // Add animated-button and variant to class attribute
      const newAttrStr = attrStr.replace(/class=["']([^"']*)["']/i, (cMatch, classNames) => {
        return `class="animated-button ${variantClass} ${classNames.trim()}"`;
      });

      // Extract clean text (strip old svg/span arrows)
      let cleanText = innerHtml
        .replace(/<svg[\s\S]*?<\/svg>/gi, '')
        .replace(/<span\b[^>]*class=["'][^"']*(?:btn-arrow|btn-arrow-icon|arrow)[\s\S]*?<\/span>/gi, '')
        .replace(/<span\b[^>]*aria-hidden=["']true["']>[\s\S]*?<\/span>/gi, '')
        .replace(/&rarr;|→|↗/g, '')
        .replace(/<[^>]+>/g, ' ')
        .replace(/\s+/g, ' ')
        .trim();

      if (!cleanText) cleanText = 'Explore';

      fileChanges++;
      totalConverted++;
      return `<a ${newAttrStr.trim()}>\n          ${ARROW_SVG_ARR2}\n          <span class="text">${cleanText}</span>\n          <span class="circle" aria-hidden="true"></span>\n          ${ARROW_SVG_ARR1}\n        </a>`;
    });
  });

  // 2. Transform <button> submit / action tags
  const btnRegex = /<button\b([^>]*class=["'][^"']*\b(btn-editorial-submit|btn-editorial-primary|btn-secondary-reset)\b[^"']*["'][^>]*)>([\s\S]*?)<\/button>/gi;
  content = content.replace(btnRegex, (fullMatch, attrStr, innerHtml) => {
    if (attrStr.includes('animated-button')) return fullMatch;

    let variantClass = 'animated-button--dark';
    if (attrStr.includes('btn-secondary-reset')) {
      variantClass = 'animated-button--outline';
    }

    const newAttrStr = attrStr.replace(/class=["']([^"']*)["']/i, (cMatch, classNames) => {
      return `class="animated-button ${variantClass} ${classNames.trim()}"`;
    });

    let cleanText = innerHtml
      .replace(/<svg[\s\S]*?<\/svg>/gi, '')
      .replace(/<span\b[^>]*class=["'][^"']*(?:btn-spinner|btn-arrow)[\s\S]*?<\/span>/gi, '')
      .replace(/&rarr;|→|↗/g, '')
      .replace(/<[^>]+>/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();

    if (!cleanText) cleanText = 'Submit';

    fileChanges++;
    totalConverted++;
    return `<button ${newAttrStr.trim()}>\n          ${ARROW_SVG_ARR2}\n          <span class="text btn-label-text">${cleanText}</span>\n          <span class="circle" aria-hidden="true"></span>\n          ${ARROW_SVG_ARR1}\n        </button>`;
  });

  // 3. Footer signIn accountBt button
  const footerBtRegex = /<a\b([^>]*class=["'][^"']*\baccountBt\b[^"']*["'][^>]*)>([\s\S]*?)<\/a>/gi;
  content = content.replace(footerBtRegex, (fullMatch, attrStr, innerHtml) => {
    if (attrStr.includes('animated-button') || attrStr.includes('utility-link')) return fullMatch;

    let cleanText = innerHtml.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
    if (!cleanText || cleanText.length < 3) return fullMatch;

    const newAttrStr = attrStr.replace(/class=["']([^"']*)["']/i, (cMatch, classNames) => {
      return `class="animated-button animated-button--on-dark ${classNames.trim()}"`;
    });

    fileChanges++;
    totalConverted++;
    return `<a ${newAttrStr.trim()}>\n          ${ARROW_SVG_ARR2}\n          <span class="text">${cleanText}</span>\n          <span class="circle" aria-hidden="true"></span>\n          ${ARROW_SVG_ARR1}\n        </a>`;
  });

  if (fileChanges > 0) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`[UPDATED] ${file} (${fileChanges} buttons transformed)`);
  }
});

console.log(`\nTransformation complete: ${totalConverted} buttons converted to .animated-button system!`);
