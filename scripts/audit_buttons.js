const fs = require('fs');
const path = require('path');

const rootDir = path.resolve(__dirname, '..');
const htmlFiles = fs.readdirSync(rootDir).filter(f => f.endsWith('.html'));

const buttonElements = [];

htmlFiles.forEach(file => {
  const content = fs.readFileSync(path.join(rootDir, file), 'utf8');

  // Match all <button ...>...</button>
  const buttonRegex = /<button\b[^>]*>([\s\S]*?)<\/button>/gi;
  let match;
  while ((match = buttonRegex.exec(content)) !== null) {
    buttonElements.push({
      file,
      tag: 'button',
      full: match[0],
      inner: match[1].trim(),
      classes: (match[0].match(/class=["']([^"']*)["']/i) || [])[1] || '',
      id: (match[0].match(/id=["']([^"']*)["']/i) || [])[1] || '',
      type: (match[0].match(/type=["']([^"']*)["']/i) || [])[1] || ''
    });
  }

  // Match all <a ...class="...btn..."...>...</a> or class="...button..."
  const linkRegex = /<a\b[^>]*class=["'][^"']*\b(?:btn|button|action-link|cta|inquiry-cta|about-btn|hero-cta|contact-btn)\b[^"']*["'][^>]*>([\s\S]*?)<\/a>/gi;
  while ((match = linkRegex.exec(content)) !== null) {
    buttonElements.push({
      file,
      tag: 'a',
      full: match[0],
      inner: match[1].trim(),
      classes: (match[0].match(/class=["']([^"']*)["']/i) || [])[1] || '',
      id: (match[0].match(/id=["']([^"']*)["']/i) || [])[1] || '',
      href: (match[0].match(/href=["']([^"']*)["']/i) || [])[1] || ''
    });
  }
});

fs.writeFileSync('button_audit.json', JSON.stringify(buttonElements, null, 2), 'utf8');
console.log(`Saved ${buttonElements.length} button-like elements to button_audit.json.`);
