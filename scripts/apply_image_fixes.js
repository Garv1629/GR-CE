const fs = require('fs');
const path = require('path');

const URL_REPLACEMENTS = [
  // All Saints DSC
  {
    from: 'https://www.wordofgrece.com/wp-content/uploads/2026/02/DSC05615-scaled.jpg',
    to: 'https://www.wordofgrece.com/wp-content/uploads/2025/06/DSC05614-1-scaled.jpg'
  },
  {
    from: 'https://www.wordofgrece.com/wp-content/uploads/2026/02/DSC05616-scaled.jpg',
    to: 'https://www.wordofgrece.com/wp-content/uploads/2025/06/DSC05626-1-scaled.jpg'
  },
  {
    from: 'https://www.wordofgrece.com/wp-content/uploads/2026/02/DSC05620-scaled.jpg',
    to: 'https://www.wordofgrece.com/wp-content/uploads/2025/06/DSC05631-1-scaled.jpg'
  },
  {
    from: 'https://www.wordofgrece.com/wp-content/uploads/2026/02/DSC05625-scaled.jpg',
    to: 'https://www.wordofgrece.com/wp-content/uploads/2025/06/DSC05635-1-scaled.jpg'
  },
  {
    from: 'https://www.wordofgrece.com/wp-content/uploads/2026/02/DSC05634-scaled.jpg',
    to: 'https://www.wordofgrece.com/wp-content/uploads/2025/06/DSC05610-1-scaled.jpg'
  },

  // Aahii
  {
    from: 'https://www.wordofgrece.com/wp-content/uploads/2026/02/YnotUS_aahii-5.jpg',
    to: 'https://www.wordofgrece.com/wp-content/uploads/2026/02/YnotUS_aahii-05-2.jpg'
  },

  // Rasoi
  {
    from: 'https://www.wordofgrece.com/wp-content/uploads/2026/02/Piyushmacrography-22-scaled.jpg',
    to: 'https://www.wordofgrece.com/wp-content/uploads/2026/02/Piyushmacrography-22.jpg'
  },

  // 2024/12 to 2025/12
  {
    from: 'https://www.wordofgrece.com/wp-content/uploads/2024/12/business-pic3.webp',
    to: 'https://www.wordofgrece.com/wp-content/uploads/2025/12/business-pic3.webp'
  },
  {
    from: 'https://www.wordofgrece.com/wp-content/uploads/2024/12/hospitality-pic2.webp',
    to: 'https://www.wordofgrece.com/wp-content/uploads/2025/12/hospitality-pic2.webp'
  },
  {
    from: 'https://www.wordofgrece.com/wp-content/uploads/2024/12/product-pic1.webp',
    to: 'https://www.wordofgrece.com/wp-content/uploads/2025/12/product-pic1.webp'
  },
  {
    from: 'https://www.wordofgrece.com/wp-content/uploads/2024/12/home-pic-1.webp',
    to: 'https://www.wordofgrece.com/wp-content/uploads/2025/12/home-pic-1.webp'
  },

  // 2024/12 to 2026/05
  {
    from: 'https://www.wordofgrece.com/wp-content/uploads/2024/12/3-2.png',
    to: 'https://www.wordofgrece.com/wp-content/uploads/2026/05/3-2.png'
  },
  {
    from: 'https://www.wordofgrece.com/wp-content/uploads/2024/12/6-1.png',
    to: 'https://www.wordofgrece.com/wp-content/uploads/2026/05/6-1.png'
  },
  {
    from: 'https://www.wordofgrece.com/wp-content/uploads/2024/12/10-1.png',
    to: 'https://www.wordofgrece.com/wp-content/uploads/2026/05/10-1.png'
  },
  {
    from: 'https://www.wordofgrece.com/wp-content/uploads/2024/12/14-1.png',
    to: 'https://www.wordofgrece.com/wp-content/uploads/2026/05/14-1.png'
  },
  {
    from: 'https://www.wordofgrece.com/wp-content/uploads/2024/12/19-1.png',
    to: 'https://www.wordofgrece.com/wp-content/uploads/2026/05/19-1.png'
  },
  {
    from: 'https://www.wordofgrece.com/wp-content/uploads/2024/12/22-1.png',
    to: 'https://www.wordofgrece.com/wp-content/uploads/2026/05/22-1.png'
  },
  {
    from: 'https://www.wordofgrece.com/wp-content/uploads/2024/12/28.jpg-1.jpeg',
    to: 'https://www.wordofgrece.com/wp-content/uploads/2026/05/28.jpg-1.jpeg'
  }
];

const filesToScan = [
  'index.html',
  'about.html',
  'contact.html',
  'contact-us.html',
  'lifestyle.html',
  'interior-design-home.html',
  'interior-design-hospitality.html',
  'interior-design-business-premises.html',
  'project-all-saints.html',
  'project-aahii.html',
  'project-rasoi.html',
  'word-by-grece.html',
  'css/design-system.css',
  'css/theme-override.css',
  'js/main.js'
];

let totalReplaced = 0;
const results = [];

filesToScan.forEach(relPath => {
  const fullPath = path.resolve(relPath);
  if (!fs.existsSync(fullPath)) return;

  let content = fs.readFileSync(fullPath, 'utf8');
  let fileChanges = 0;

  URL_REPLACEMENTS.forEach(rep => {
    if (content.includes(rep.from)) {
      const occurrences = content.split(rep.from).length - 1;
      content = content.replaceAll(rep.from, rep.to);
      fileChanges += occurrences;
      totalReplaced += occurrences;
      results.push({
        file: relPath,
        from: rep.from,
        to: rep.to,
        count: occurrences
      });
    }
  });

  if (fileChanges > 0) {
    fs.writeFileSync(fullPath, content, 'utf8');
    console.log(`[UPDATED] ${relPath} (${fileChanges} replacements)`);
  }
});

console.log(`\nDONE. Total replacements applied: ${totalReplaced}`);
fs.writeFileSync('replacement_summary.json', JSON.stringify(results, null, 2));
