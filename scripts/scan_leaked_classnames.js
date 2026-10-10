const fs = require('fs');
const path = require('path');

const rootDir = path.resolve(__dirname, '..');
const htmlFiles = fs.readdirSync(rootDir).filter(f => f.endsWith('.html'));

const leaks = [];

htmlFiles.forEach(file => {
  const content = fs.readFileSync(path.join(rootDir, file), 'utf8');
  const lines = content.split('\n');

  lines.forEach((line, idx) => {
    const m = line.match(/<span\b[^>]*class=["'][^"']*\btext\b[^"']*["'][^>]*>([\s\S]*?)<\/span>/i);
    if (m && /(?:btn-|hero-cta|animated-button|atelier-|inquiry-|manifesto-)/i.test(m[1])) {
      leaks.push({ file, lineNum: idx + 1, text: m[1].trim() });
    }
  });
});

leaks.forEach(l => {
  console.log(`[LEAK] ${l.file}:${l.lineNum} -> "${l.text}"`);
});
