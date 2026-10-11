const http = require('http');
const https = require('https');
const fs = require('fs');
const path = require('path');

const PORT = 3000;

const MIME_TYPES = {
  '.html': 'text/html',
  '.css': 'text/css',
  '.js': 'text/javascript',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.svg': 'image/svg+xml',
  '.mp4': 'video/mp4',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.ttf': 'font/ttf',
};

const ASSETS_TO_AUDIT = [
  { id: 'logo', type: 'image/identity', url: 'assets/remote/wp-content/themes/grece/images/grece-logo.webp' },
  { id: 'hero-video', type: 'video/footage', url: 'assets/remote/wp-content/uploads/2026/07/07-2.mp4' },
  { id: 'hero-poster', type: 'image/poster', url: 'assets/remote/wp-content/uploads/2026/09/Screenshot-2026-09-27-at-6.46.04-AM-1024x495.png' },
  { id: 'hero-poster-scaled', type: 'image/poster-scaled', url: 'assets/remote/wp-content/uploads/2026/09/Screenshot-2026-09-27-at-6.46.04-AM-scaled.png' },
  { id: 'brand-video', type: 'video/footage', url: 'assets/remote/wp-content/uploads/2025/12/banner.mp4' },
  { id: 'witness-products', type: 'image/architecture-furniture', url: 'assets/remote/wp-content/uploads/2025/12/product-pic1.webp' },
  { id: 'witness-collections', type: 'image/interior-environment', url: 'assets/remote/wp-content/uploads/2025/12/collections-pic2.webp' },
  { id: 'hospitality', type: 'image/hospitality', url: 'assets/remote/wp-content/uploads/2026/02/Hospitality.jpg' },
  { id: 'home', type: 'image/residential', url: 'assets/remote/wp-content/uploads/2026/02/Home.jpg' },
  { id: 'business-premises', type: 'image/commercial', url: 'assets/remote/wp-content/uploads/2026/02/Business-Premises.jpg' },
  { id: 'photography-interiors', type: 'image/editorial-interior', url: 'assets/remote/wp-content/uploads/2025/12/photography-pix1.webp' },
  { id: 'photography-food', type: 'image/culinary-detail', url: 'assets/remote/wp-content/uploads/2025/12/photography-pix2.webp' },
  { id: 'photography-products', type: 'image/product-luxury', url: 'assets/remote/wp-content/uploads/2026/02/Hertz-Perfume.jpg' },
  { id: 'product-torii-armchair', type: 'image/furniture-piece', url: 'assets/remote/wp-content/uploads/2025/12/torii-nest-armchair.webp' },
  { id: 'product-wall-lamp', type: 'image/lighting-piece', url: 'assets/remote/wp-content/uploads/2025/12/wall-lamp.webp' },
  { id: 'product-garden-cabinet', type: 'image/craftsmanship-piece', url: 'assets/remote/wp-content/uploads/2025/12/garden-blossom-cabinet.webp' },
  { id: 'all-saints-hero', type: 'image/project-all-saints', url: 'assets/remote/wp-content/uploads/2026/02/DSC05623-scaled.jpg' },
  { id: 'all-saints-arches', type: 'image/project-all-saints', url: 'assets/remote/wp-content/uploads/2026/02/DSC05615-scaled.jpg' },
  { id: 'all-saints-detail', type: 'image/project-all-saints', url: 'assets/remote/wp-content/uploads/2026/02/DSC05625-scaled.jpg' },
  { id: 'aahii-hero', type: 'image/project-aahii', url: 'assets/remote/wp-content/uploads/2026/02/IMG_0924-scaled.jpg' },
  { id: 'aahii-lattice', type: 'image/project-aahii', url: 'assets/remote/wp-content/uploads/2026/02/YnotUS_aahii-17-2.jpg' },
  { id: 'aahii-banquette', type: 'image/project-aahii', url: 'assets/remote/wp-content/uploads/2026/02/YnotUS_aahii-18-2.jpg' },
  { id: 'rasoi-hero', type: 'image/project-rasoi', url: 'assets/remote/wp-content/uploads/2026/02/Piyushmacrography-30-scaled.jpg' },
  { id: 'rasoi-vault', type: 'image/project-rasoi', url: 'assets/remote/wp-content/uploads/2026/02/Piyushmacrography-27-scaled.jpg' },
  { id: 'rasoi-lighting', type: 'image/project-rasoi', url: 'assets/remote/wp-content/uploads/2026/02/Piyushmacrography-22-scaled.jpg' },
  { id: 'residential-pavilion', type: 'image/project-residential', url: 'assets/remote/wp-content/uploads/2024/12/home-pic-1.webp' }
];

function checkRemoteAsset(item) {
  return new Promise((resolve) => {
    try {
      const u = new URL(item.url);
      const req = https.request({
        method: 'HEAD',
        hostname: u.hostname,
        path: u.pathname,
        headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' },
        timeout: 6000
      }, (res) => {
        resolve({
          id: item.id,
          type: item.type,
          url: item.url,
          status: res.statusCode,
          contentType: res.headers['content-type'] || 'unknown',
          contentLength: res.headers['content-length'] || 'unknown',
          reachable: res.statusCode === 200 || res.statusCode === 301 || res.statusCode === 302
        });
      });
      req.on('error', (err) => {
        resolve({ id: item.id, type: item.type, url: item.url, error: err.message, reachable: false });
      });
      req.on('timeout', () => {
        req.destroy();
        resolve({ id: item.id, type: item.type, url: item.url, error: 'Timeout', reachable: false });
      });
      req.end();
    } catch (e) {
      resolve({ id: item.id, type: item.type, url: item.url, error: e.message, reachable: false });
    }
  });
}

const server = http.createServer(async (req, res) => {
  let reqPath = req.url.split('?')[0];

  if (reqPath === '/api/copy-assets') {
    const brainDir = 'C:\\Users\\GARV\\.gemini\\antigravity-ide\\brain\\c8a9fa04-2f39-4040-b587-65d310435ebe';
    const targetBase = path.join(__dirname, 'assets', 'generated');
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

    const copied = [];
    for (const item of assetMap) {
      const srcPath = path.join(brainDir, item.src);
      const destDir = path.join(targetBase, item.sub);
      fs.mkdirSync(destDir, { recursive: true });
      const destPath = path.join(destDir, item.name);
      if (fs.existsSync(srcPath)) {
        fs.copyFileSync(srcPath, destPath);
        copied.push({ name: item.name, dest: destPath, exists: true });
      } else {
        copied.push({ name: item.name, src: srcPath, exists: false });
      }
    }

    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ success: true, copied }, null, 2));
    return;
  }

  if (reqPath === '/api/audit-media') {
    const results = await Promise.all(ASSETS_TO_AUDIT.map(checkRemoteAsset));
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(results, null, 2));
    return;
  }

  if (reqPath === '/api/audit-generated') {
    const list = [
      'assets/generated/hero/hero-architecture-desktop.jpg',
      'assets/generated/hero/hero-architecture-mobile.jpg',
      'assets/generated/architecture/architecture-exterior-editorial.jpg',
      'assets/generated/interiors/interior-sculptural-living.jpg',
      'assets/generated/hospitality/hospitality-editorial.jpg',
      'assets/generated/materials/material-stone-texture.jpg',
      'assets/generated/studio/studio-atmosphere-concept.jpg',
      'assets/generated/architecture/architecture-light-staircase.jpg'
    ];
    const results = list.map(item => {
      const fullPath = path.join(__dirname, item);
      const exists = fs.existsSync(fullPath);
      const stats = exists ? fs.statSync(fullPath) : null;
      return {
        path: item,
        fullPath,
        exists,
        size: stats ? stats.size : 0,
        url: `http://localhost:${PORT}/${item}`,
        status: exists ? 200 : 404
      };
    });
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ success: true, dirname: __dirname, count: results.length, assets: results }, null, 2));
    return;
  }

  if (reqPath === '/api/inquiry') {
    if (req.method === 'OPTIONS') {
      res.writeHead(204, {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type'
      });
      res.end();
      return;
    }

    if (req.method === 'POST') {
      let bodyData = '';
      req.on('data', chunk => {
        bodyData += chunk;
        if (bodyData.length > 1e6) {
          req.destroy();
        }
      });

      req.on('end', () => {
        let payload = {};
        const contentType = req.headers['content-type'] || '';
        try {
          if (contentType.includes('application/json')) {
            payload = JSON.parse(bodyData || '{}');
          } else {
            const params = new URLSearchParams(bodyData);
            for (const [key, value] of params.entries()) {
              payload[key] = value;
            }
          }
        } catch (e) {
          res.writeHead(400, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ success: false, message: 'Invalid payload format.' }));
          return;
        }

        // Honeypot spam trap
        if (payload.website && payload.website.trim() !== '') {
          res.writeHead(400, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ success: false, message: 'Spam detected. Submission rejected.' }));
          return;
        }

        const errors = {};
        const fullName = (payload.fullName || payload.name || '').trim();
        const email = (payload.email || '').trim();
        const phone = (payload.phone || '').trim();
        const discipline = (payload.discipline || payload.projectType || '').trim();
        const location = (payload.location || '').trim();
        const stage = (payload.stage || '').trim();
        const message = (payload.message || '').trim();

        if (!fullName || fullName.length < 2) {
          errors.fullName = 'Full name is required (minimum 2 characters).';
        } else if (fullName.length > 100) {
          errors.fullName = 'Name cannot exceed 100 characters.';
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!email) {
          errors.email = 'A valid email address is required.';
        } else if (!emailRegex.test(email)) {
          errors.email = 'Please provide a valid email format (e.g., name@domain.com).';
        }

        if (!discipline) {
          errors.discipline = 'Please select an architectural or design discipline.';
        }

        if (!message || message.length < 10) {
          errors.message = 'Please provide inquiry details (minimum 10 characters).';
        } else if (message.length > 3000) {
          errors.message = 'Message must be under 3000 characters.';
        }

        if (Object.keys(errors).length > 0) {
          res.writeHead(400, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({
            success: false,
            message: 'Please resolve the highlighted validation errors.',
            errors
          }));
          return;
        }

        const randomNum = Math.floor(1000 + Math.random() * 9000);
        const referenceId = `GRECE-2026-${randomNum}`;

        const inquiryEntry = {
          referenceId,
          timestamp: new Date().toISOString(),
          fullName,
          email,
          phone: phone || null,
          discipline,
          location: location || null,
          stage: stage || null,
          message
        };

        const dataDir = path.join(__dirname, 'data');
        const dataFile = path.join(dataDir, 'inquiries.json');

        try {
          if (!fs.existsSync(dataDir)) {
            fs.mkdirSync(dataDir, { recursive: true });
          }
          let existing = [];
          if (fs.existsSync(dataFile)) {
            const raw = fs.readFileSync(dataFile, 'utf-8');
            existing = JSON.parse(raw || '[]');
          }
          existing.push(inquiryEntry);
          fs.writeFileSync(dataFile, JSON.stringify(existing, null, 2), 'utf-8');
        } catch (err) {
          console.error('Failed to persist inquiry:', err);
          res.writeHead(500, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({
            success: false,
            message: 'Internal server error while saving inquiry.'
          }));
          return;
        }

        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({
          success: true,
          referenceId,
          message: 'Thank you for contacting GRÈCE. Your architectural inquiry has been safely received.'
        }));
      });
      return;
    }

    res.writeHead(405, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ success: false, message: 'Method Not Allowed' }));
    return;
  }

  if (reqPath === '/' || reqPath === '') {
    reqPath = '/index.html';
  }

  let filePath = path.join(__dirname, reqPath);

  // If requesting /wp-content/..., alias to assets/remote/wp-content/...
  if (reqPath.startsWith('/wp-content/')) {
    const remotePath = path.join(__dirname, 'assets', 'remote', reqPath);
    if (fs.existsSync(remotePath)) {
      filePath = remotePath;
    }
  }

  let ext = path.extname(filePath).toLowerCase();

  // If no extension, check if an html file exists
  if (!ext && fs.existsSync(filePath + '.html')) {
    filePath = filePath + '.html';
    ext = '.html';
  }

  const contentType = MIME_TYPES[ext] || 'application/octet-stream';

  // Video Streaming with HTTP 206 Partial Content
  if (ext === '.mp4') {
    fs.stat(filePath, (err, stats) => {
      if (err) {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        return res.end('404 Video Not Found');
      }

      const range = req.headers.range;
      if (!range) {
        res.writeHead(200, {
          'Content-Length': stats.size,
          'Content-Type': 'video/mp4',
          'Accept-Ranges': 'bytes',
          'Access-Control-Allow-Origin': '*',
          'Cross-Origin-Resource-Policy': 'cross-origin'
        });
        fs.createReadStream(filePath).pipe(res);
        return;
      }

      const parts = range.replace(/bytes=/, "").split("-");
      const start = parseInt(parts[0], 10);
      const end = parts[1] ? parseInt(parts[1], 10) : stats.size - 1;
      const chunksize = (end - start) + 1;

      res.writeHead(206, {
        'Content-Range': `bytes ${start}-${end}/${stats.size}`,
        'Accept-Ranges': 'bytes',
        'Content-Length': chunksize,
        'Content-Type': 'video/mp4',
        'Access-Control-Allow-Origin': '*',
        'Cross-Origin-Resource-Policy': 'cross-origin'
      });
      fs.createReadStream(filePath, { start, end }).pipe(res);
    });
    return;
  }

  fs.readFile(filePath, (err, content) => {
    if (err) {
      if (err.code === 'ENOENT') {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('404 Not Found');
      } else {
        res.writeHead(500, { 'Content-Type': 'text/plain' });
        res.end(`Server Error: ${err.code}`);
      }
    } else {
      res.writeHead(200, {
        'Content-Type': contentType,
        'Cache-Control': 'no-cache',
        'Access-Control-Allow-Origin': '*',
        'Cross-Origin-Resource-Policy': 'cross-origin'
      });
      res.end(content, 'utf-8');
    }
  });
});

server.listen(PORT, () => {
  console.log(`GRÈCE Design System server running at http://localhost:${PORT}`);
});
