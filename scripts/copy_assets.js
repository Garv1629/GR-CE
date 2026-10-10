const fs = require('fs');
const path = require('path');

const brainDir = 'C:\\Users\\GARV\\.gemini\\antigravity-ide\\brain\\c8a9fa04-2f39-4040-b587-65d310435ebe';
const targetBase = path.join(__dirname, '..', 'assets', 'generated');

const assetMap = [
  { src: 'hero_architecture_1791609980723.jpg', sub: 'hero', name: 'hero-architecture-desktop.jpg' },
  { src: 'hero_arch_mobile_1791609998743.jpg', sub: 'hero', name: 'hero-architecture-mobile.jpg' },
  { src: 'arch_exterior_geom_1791610019337.jpg', sub: 'architecture', name: 'architecture-exterior-editorial.jpg' },
  { src: 'interior_living_sculpt_1791610041702.jpg', sub: 'interiors', name: 'interior-sculptural-living.jpg' },
  { src: 'hosp_lounge_sanctuary_1791610063496.jpg', sub: 'hospitality', name: 'hospitality-editorial.jpg' },
  { src: 'material_stone_timber_1791610085935.jpg', sub: 'materials', name: 'material-stone-texture.jpg' },
  { src: 'studio_atelier_atmosphere_1791610109599.jpg', sub: 'studio', name: 'studio-atmosphere-concept.jpg' },
  { src: 'arch_light_staircase_1791610133490.jpg', sub: 'architecture', name: 'architecture-light-staircase.jpg' }
];

console.log('--- Starting Asset Transfer ---');
for (const item of assetMap) {
  const srcPath = path.join(brainDir, item.src);
  const destDir = path.join(targetBase, item.sub);
  fs.mkdirSync(destDir, { recursive: true });
  const destPath = path.join(destDir, item.name);
  if (fs.existsSync(srcPath)) {
    fs.copyFileSync(srcPath, destPath);
    console.log(`[SUCCESS] ${item.name} copied to ${destPath} (${fs.statSync(destPath).size} bytes)`);
  } else {
    console.warn(`[WARN] Not found: ${srcPath}`);
  }
}
console.log('--- Transfer Complete ---');
