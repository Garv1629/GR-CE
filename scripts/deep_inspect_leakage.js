const fs = require('fs');
const path = require('path');

const rootDir = path.resolve(__dirname, '..');
const htmlFiles = fs.readdirSync(rootDir).filter(f => f.endsWith('.html'));

console.log('--- Checking HTML files for template literals or leaked code ---');
const codeLeakPatterns = [
  /\$\{[^}]+\}/,           // ${...} template literal left in raw HTML
  /\{\{[^}]+\}\}/,         // {{...}} unparsed handlebars/mustache
  /<script[^>]*>[\s\S]*?(?:<\/script>|$)/gi, // scripts
  /<style[^>]*>[\s\S]*?(?:<\/style>|$)/gi,   // styles
  /function\s*\(/,
  /=>/,
  /console\./,
  /\[object\s+Object\]/i,
  /undefined/i,
  /\bnull\b/i,
  /NaN/
];

htmlFiles.forEach(file => {
  const content = fs.readFileSync(path.join(rootDir, file), 'utf8');

  // Check for ${...}
  const tmpl = content.match(/\$\{[^}]+\}/g);
  if (tmpl) {
    console.log(`[FOUND TEMPLATE LITERAL in ${file}]:`, tmpl);
  }

  // Check for {{...}}
  const mustache = content.match(/\{\{[^}]+\}\}/g);
  if (mustache) {
    console.log(`[FOUND MUSTACHE in ${file}]:`, mustache);
  }

  // Check button contents specifically
  const btnRegex = /<button\b[^>]*>([\s\S]*?)<\/button>/gi;
  let m;
  while ((m = btnRegex.exec(content)) !== null) {
    if (/\$\{/.test(m[1]) || /undefined/.test(m[1]) || /\[object/i.test(m[1])) {
      console.log(`[SUSPICIOUS BUTTON in ${file}]:`, m[0]);
    }
  }

  // Check <a> buttons
  const aRegex = /<a\b[^>]*>([\s\S]*?)<\/a>/gi;
  while ((m = aRegex.exec(content)) !== null) {
    if (/\$\{/.test(m[1]) || /undefined/.test(m[1]) || /\[object/i.test(m[1])) {
      console.log(`[SUSPICIOUS LINK in ${file}]:`, m[0]);
    }
  }

  // Check for raw text that might be JavaScript error or unclosed script tag
  const noScript = content.replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, '').replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi, '');
  if (/(?:function\s*\(|=>\s*\{|const\s+\w+\s*=|var\s+\w+\s*=)/.test(noScript)) {
    console.log(`[POSSIBLE RAW SCRIPT LEAK IN HTML ${file}]`);
  }
});

console.log('\n--- Checking JS files for innerHTML / textContent assignments ---');
const jsFiles = fs.readdirSync(path.join(rootDir, 'js')).filter(f => f.endsWith('.js'));
jsFiles.forEach(file => {
  const content = fs.readFileSync(path.join(rootDir, 'js', file), 'utf8');
  const lines = content.split('\n');
  lines.forEach((line, idx) => {
    if (/(\.innerHTML|\.textContent|\.innerText)\s*=/i.test(line)) {
      console.log(`[${file}:${idx+1}]: ${line.trim()}`);
    }
  });
});
