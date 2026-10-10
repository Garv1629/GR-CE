const fs = require('fs');
const path = require('path');

const rootDir = path.resolve(__dirname, '..');
const htmlFiles = fs.readdirSync(rootDir).filter(f => f.endsWith('.html'));

const allButtons = [];

htmlFiles.forEach(file => {
  const content = fs.readFileSync(path.join(rootDir, file), 'utf8');
  const tagRegex = /<(a|button)\b([^>]*)>([\s\S]*?)<\/\1>/gi;
  let m;

  while ((m = tagRegex.exec(content)) !== null) {
    const [full, tag, attrs, inner] = m;
    const isCta = /(?:btn|cta|button|whiteBt|signIn|accountBt|readmore)/i.test(attrs) || tag === 'button';
    if (!isCta) continue;

    const classMatch = attrs.match(/class=["']([^"']*)["']/i);
    const className = classMatch ? classMatch[1] : '';

    const textMatch = inner.match(/<span\b[^>]*class=["'][^"']*\btext\b[^"']*["'][^>]*>([\s\S]*?)<\/span>/i);
    const cleanText = textMatch ? textMatch[1].trim() : inner.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();

    allButtons.push({
      file,
      tag,
      className,
      text: cleanText
    });
  }
});

console.log(`Total buttons found: ${allButtons.length}`);
allButtons.forEach((b, i) => {
  console.log(`[${i+1}] ${b.file} <${b.tag}> [${b.className}] -> "${b.text}"`);
});
