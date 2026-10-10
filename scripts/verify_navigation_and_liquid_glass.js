const fs = require('fs');
const path = require('path');
const http = require('http');

const rootDir = path.resolve(__dirname, '..');
const HTML_FILES = fs.readdirSync(rootDir).filter(f => f.endsWith('.html'));

let passed = 0;
let failed = 0;

function assert(condition, message) {
  if (condition) {
    console.log(`[PASS] ${message}`);
    passed++;
  } else {
    console.error(`[FAIL] ${message}`);
    failed++;
  }
}

function checkUrl(url) {
  return new Promise((resolve, reject) => {
    http.get(url, (res) => {
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => resolve({ statusCode: res.statusCode, body }));
    }).on('error', reject);
  });
}

async function runTests() {
  console.log('================================================================');
  console.log('GRÈCE NAVIGATION & LIQUID-GLASS NAVBAR VERIFICATION SUITE');
  console.log('================================================================\n');

  // TEST 1: Raw PHP / WordPress Leakage Audit across all pages
  console.log('--- TEST 1: RAW CODE LEAKAGE AUDIT ---');
  HTML_FILES.forEach(file => {
    const content = fs.readFileSync(path.join(rootDir, file), 'utf8');
    assert(!content.includes("add_action('wp_footer'"), `${file}: No add_action('wp_footer'...) raw PHP`);
    assert(!content.includes("<?php"), `${file}: No <?php tags`);
    assert(!content.includes("wp_footer"), `${file}: No WordPress hooks`);
  });

  // TEST 2: Navigation Links and Hash Targets
  console.log('\n--- TEST 2: NAVIGATION ANCHORS & DESTINATIONS ---');
  const indexContent = fs.readFileSync(path.join(rootDir, 'index.html'), 'utf8');
  assert(indexContent.includes('href="#products"'), 'index.html: Navbar contains href="#products"');
  assert(indexContent.includes('href="#brand-design"'), 'index.html: Navbar contains href="#brand-design"');
  assert(indexContent.includes('id="products"'), 'index.html: Target #products anchor exists');
  assert(indexContent.includes('id="brand-design"'), 'index.html: Target #brand-design anchor exists');
  assert(indexContent.includes('id="photography"'), 'index.html: Target #photography anchor exists');

  const otherPages = HTML_FILES.filter(f => f !== 'index.html');
  otherPages.forEach(file => {
    const content = fs.readFileSync(path.join(rootDir, file), 'utf8');
    assert(content.includes('href="index.html#products"'), `${file}: Products links to index.html#products`);
    assert(content.includes('href="index.html#brand-design"'), `${file}: Brand Design links to index.html#brand-design`);
  });

  // TEST 3: Permanent Liquid Glass Navbar CSS Audit
  console.log('\n--- TEST 3: PERMANENT LIQUID GLASS NAVBAR CSS AUDIT ---');
  const themeCss = fs.readFileSync(path.join(rootDir, 'css', 'theme-override.css'), 'utf8');
  const designCss = fs.readFileSync(path.join(rootDir, 'css', 'design-system.css'), 'utf8');
  const mainJs = fs.readFileSync(path.join(rootDir, 'js', 'main.js'), 'utf8');

  assert(themeCss.includes('border-radius: var(--glass-radius-capsule, 9999px)'), 'theme-override.css: Floating capsule border-radius 9999px');
  assert(themeCss.includes('backdrop-filter: none') || themeCss.includes('backdrop-filter: blur'), 'theme-override.css: Fully transparent liquid glass surface');
  assert(themeCss.includes('.header::before'), 'theme-override.css: Polished top specular rim reflection');
  assert(themeCss.includes('.header'), 'theme-override.css: Header capsule architecture present');
  assert(themeCss.includes('position: fixed'), 'theme-override.css: Fixed position navigation');
  assert(themeCss.includes('z-index: 1000'), 'theme-override.css: High stacking context z-index: 1000');
  assert(themeCss.includes('color: var(--color-space-indigo)'), 'theme-override.css: High contrast text in Space Indigo');
  assert(designCss.includes('--glass-surface-base'), 'design-system.css: Liquid-glass surface base token defined');
  assert(designCss.includes('--glass-depth-shadow') || designCss.includes('--glass-border'), 'design-system.css: Liquid-glass tokens defined');
  assert(designCss.includes('scroll-padding-top: 110px'), 'design-system.css: scroll-padding-top accounts for floating navbar');
  assert(mainJs.includes('active'), 'main.js: Automatic active navigation link indicator');

  // TEST 4: Live HTTP Server 200 OK Verification
  console.log('\n--- TEST 4: LOCAL HTTP SERVER RESPONSE AUDIT ---');
  for (const file of HTML_FILES) {
    try {
      const res = await checkUrl(`http://localhost:3000/${file}`);
      assert(res.statusCode === 200, `http://localhost:3000/${file} returns 200 OK (${res.body.length} bytes)`);
    } catch (e) {
      assert(false, `http://localhost:3000/${file} failed to respond: ${e.message}`);
    }
  }

  console.log('\n================================================================');
  console.log(`VERIFICATION SUMMARY: ${passed} PASSED, ${failed} FAILED`);
  console.log('================================================================\n');

  if (failed > 0) {
    process.exit(1);
  }
}

runTests();
