const fs = require('fs');
const path = require('path');

const toPath = path.join(__dirname, '..', 'css', 'theme-override.css');
let toContent = fs.readFileSync(toPath, 'utf8');

toContent = toContent.replace(
  /backdrop-filter: blur\(var\(--glass-blur, 28px\)\) saturate\(var\(--glass-saturate, 200%\)\) contrast\(105%\);/g,
  'backdrop-filter: blur(var(--glass-blur, 24px)) saturate(var(--glass-saturate, 160%));'
);
toContent = toContent.replace(
  /-webkit-backdrop-filter: blur\(var\(--glass-blur, 28px\)\) saturate\(var\(--glass-saturate, 200%\)\) contrast\(105%\);/g,
  '-webkit-backdrop-filter: blur(var(--glass-blur, 24px)) saturate(var(--glass-saturate, 160%));'
);

fs.writeFileSync(toPath, toContent, 'utf8');
console.log('Synchronized backdrop-filter in theme-override.css');
