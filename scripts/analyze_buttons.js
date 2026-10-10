const fs = require('fs');
const buttons = JSON.parse(fs.readFileSync('button_audit.json', 'utf8'));

console.log(`Total button elements found: ${buttons.length}`);

// Group by file
const byFile = {};
buttons.forEach(b => {
  byFile[b.file] = byFile[b.file] || [];
  byFile[b.file].push(b);
});

for (const [file, list] of Object.entries(byFile)) {
  console.log(`\n--- ${file} (${list.length} buttons) ---`);
  list.forEach((b, i) => {
    // Check if inner content has suspicious text: code, css, html tags leaked, undefined, null, etc.
    const isSuspicious = /[{}]|function\b|var\b|let\b|const\b|undefined|null|\[object|\bNaN\b|<\/?[a-z]+[^>]*>.*\{/i.test(b.inner);
    console.log(`  [${i+1}] <${b.tag} class="${b.classes}" id="${b.id}"> ${isSuspicious ? '⚠️ [SUSPICIOUS]' : ''}`);
    console.log(`       text: "${b.inner.replace(/\s+/g, ' ').substring(0, 80)}"`);
  });
}
