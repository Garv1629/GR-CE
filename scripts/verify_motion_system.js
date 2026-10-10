const fs = require('fs');
const path = require('path');

const rootDir = path.resolve(__dirname, '..');
const designSystemCss = fs.readFileSync(path.join(rootDir, 'css', 'design-system.css'), 'utf8');
const mainJs = fs.readFileSync(path.join(rootDir, 'js', 'main.js'), 'utf8');
const themeOverrideCss = fs.readFileSync(path.join(rootDir, 'css', 'theme-override.css'), 'utf8');

console.log('================================================================');
console.log('GRÈCE CINEMATIC MOTION & SCROLL ANIMATION AUDIT');
console.log('================================================================\n');

let errors = [];
let passed = 0;

function assert(condition, testName) {
  if (condition) {
    console.log(`[PASS] ${testName}`);
    passed++;
  } else {
    console.error(`[FAIL] ${testName}`);
    errors.push(testName);
  }
}

// 1. Tokens Audit
assert(designSystemCss.includes('--ease-cinematic'), 'design-system.css: --ease-cinematic token defined');
assert(designSystemCss.includes('--motion-duration-standard'), 'design-system.css: --motion-duration-standard token defined');
assert(designSystemCss.includes('--motion-stagger'), 'design-system.css: --motion-stagger token defined');
assert(designSystemCss.includes('--motion-reveal-distance'), 'design-system.css: --motion-reveal-distance token defined');

// 2. CSS Motion Rules Audit
assert(designSystemCss.includes('html.js-motion .reveal-on-scroll'), 'design-system.css: Progressive enhancement safety namespace html.js-motion');
assert(designSystemCss.includes('.reveal-on-scroll.is-revealed'), 'design-system.css: Latched .is-revealed state');
assert(designSystemCss.includes('html.js-motion .reveal-stagger'), 'design-system.css: Coordinated stagger sequences');
assert(designSystemCss.includes('html.js-motion .reveal-clip'), 'design-system.css: Restrained clip-path masked image reveals');
assert(designSystemCss.includes('html.js-motion .reveal-line'), 'design-system.css: Architectural hairline expansion');
assert(designSystemCss.includes('.hero-headline-italic'), 'design-system.css: Staggered hero headline choreography');
assert(designSystemCss.includes('.parallax-media-frame'), 'design-system.css: Dedicated parallax media frame container');

// 3. Accessibility / Reduced Motion Audit
assert(designSystemCss.includes('@media (prefers-reduced-motion: reduce)') && designSystemCss.includes('opacity: 1 !important'), 'design-system.css: prefers-reduced-motion full opacity fallback');

// 4. JavaScript Motion Controller Audit
assert(mainJs.includes("document.documentElement.classList.add('js-motion')"), 'main.js: Progressive enhancement js-motion activation');
assert(mainJs.includes("document.documentElement.classList.add('hero-entered')"), 'main.js: Hero entrance sequence trigger');
assert(mainJs.includes('IntersectionObserver'), 'main.js: Universal IntersectionObserver scroll reveal engine');
assert(mainJs.includes('obs.unobserve(entry.target)'), 'main.js: Latching unobserve prevents disappearing content on scroll up');
assert(mainJs.includes('requestAnimationFrame(onScrollParallax)'), 'main.js: Hardware-accelerated rAF scroll parallax');
assert(mainJs.includes('maxShift = 24'), 'main.js: Parallax strictly capped to low-amplitude (max 24px)');
assert(mainJs.includes('is-active-step'), 'main.js: Pinned/progressive storytelling step observer');

// 5. CSS Active Step Indicator Audit
assert(themeOverrideCss.includes('.discipline-row-item.is-active-step'), 'theme-override.css: Active storytelling step styling');

console.log('\n================================================================');
console.log(`TOTAL MOTION AUDITS PASSED: ${passed} / ${passed + errors.length}`);
console.log('================================================================\n');

if (errors.length > 0) {
  process.exit(1);
} else {
  console.log('ALL CINEMATIC MOTION & SCROLL REVEAL CHECKS CONFIRMED SUCCESSFUL!\n');
}
