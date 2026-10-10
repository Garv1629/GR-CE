const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '..', 'css', 'theme-override.css');
let content = fs.readFileSync(filePath, 'utf8');

// 1. Ensure hero-cta rules don't fight animated-button
content = content.replace(
  /\.hero-cta-primary\s*\{/g,
  '.hero-cta-primary:not(.animated-button) {'
);
content = content.replace(
  /\.hero-cta-primary:hover\s*\{/g,
  '.hero-cta-primary:not(.animated-button):hover {'
);
content = content.replace(
  /\.hero-cta-secondary\s*\{/g,
  '.hero-cta-secondary:not(.animated-button) {'
);
content = content.replace(
  /\.hero-cta-secondary:hover\s*\{/g,
  '.hero-cta-secondary:not(.animated-button):hover {'
);

// 2. Ensure btn-editorial-submit rules don't override animated-button layout
content = content.replace(
  /\.btn-editorial-submit\s*\{/g,
  '.btn-editorial-submit:not(.animated-button) {'
);
content = content.replace(
  /\.btn-editorial-submit:hover:not\(:disabled\)\s*\{/g,
  '.btn-editorial-submit:not(.animated-button):hover:not(:disabled) {'
);

// 3. Ensure inquiry-cta doesn't override animated-button layout when both are present
content = content.replace(
  /\.inquiry-cta\s*\{/g,
  '.inquiry-cta:not(.animated-button) {'
);

fs.writeFileSync(filePath, content, 'utf8');
console.log('Successfully scoped legacy button rules in theme-override.css with :not(.animated-button)');
