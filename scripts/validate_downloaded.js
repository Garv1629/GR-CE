const fs = require('fs');
const path = require('path');

const map = JSON.parse(fs.readFileSync('download_map.json', 'utf8'));

let allValid = true;
console.log(`Checking ${map.length} downloaded assets:`);
map.forEach((item, idx) => {
  const fullPath = path.resolve(item.localRel);
  if (!fs.existsSync(fullPath)) {
    console.error(`[MISSING] ${item.localRel}`);
    allValid = false;
  } else {
    const size = fs.statSync(fullPath).size;
    if (size === 0) {
      console.error(`[ZERO BYTES] ${item.localRel}`);
      allValid = false;
    }
  }
});

if (allValid) {
  console.log('ALL DOWNLOADED ASSETS PHYSICALLY EXIST AND HAVE VALID NON-ZERO SIZES!');
}
