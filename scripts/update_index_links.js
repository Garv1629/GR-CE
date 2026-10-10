const fs = require('fs');
const path = require('path');

const indexPath = path.join(__dirname, '..', 'index.html');
let content = fs.readFileSync(indexPath, 'utf8');

// Replace external products, brand-design, and gallery/products with anchors
content = content.replace(/https:\/\/www\.wordofgrece\.com\/products\/?/g, '#products');
content = content.replace(/https:\/\/www\.wordofgrece\.com\/brand-design\/?/g, '#brand-design');
content = content.replace(/https:\/\/www\.wordofgrece\.com\/gallery\/products\/?/g, '#photography');

// Ensure anchor markers exist for #products and #brand-design
if (!content.includes('id="brand-design"')) {
  content = content.replace(
    /(<section[^>]*id="branDedign"[^>]*>)/i,
    `$1\n      <a id="brand-design" class="section-anchor-marker" aria-hidden="true" style="position: relative; top: -100px; display: block; visibility: hidden;"></a>`
  );
}

if (!content.includes('id="products"')) {
  content = content.replace(
    /(<section[^>]*id="services"[^>]*>)/i,
    `$1\n      <a id="products" class="section-anchor-marker" aria-hidden="true" style="position: relative; top: -100px; display: block; visibility: hidden;"></a>`
  );
}

fs.writeFileSync(indexPath, content, 'utf8');
console.log('Successfully updated index.html anchors and markers!');
