const fs = require('fs');
const https = require('https');
const http = require('http');

const contentFile = 'C:\\Users\\GARV\\.gemini\\antigravity-ide\\brain\\683551a6-258f-4d7c-be75-b85787952254\\.system_generated\\steps\\51\\content.md';
const content = fs.readFileSync(contentFile, 'utf8');

// Extract all img src
const imgMatches = [...content.matchAll(/<img[^>]+src=["']([^"']+)["'][^>]*>/gi)];
const videoSrcMatches = [...content.matchAll(/<source[^>]+src=["']([^"']+)["']/gi)];
const videoDirectSrc = [...content.matchAll(/<video[^>]+src=["']([^"']+)["']/gi)];

const images = imgMatches.map(m => {
  const src = m[1];
  const altMatch = m[0].match(/alt=["']([^"']*)["']/i);
  return { tag: m[0], src, alt: altMatch ? altMatch[1] : '' };
});

const videos = [
  ...videoSrcMatches.map(m => m[1]),
  ...videoDirectSrc.map(m => m[1])
];

const auditResults = {
  totalImages: images.length,
  images: images,
  totalVideos: videos.length,
  videos: videos
};

fs.writeFileSync('audit_results.json', JSON.stringify(auditResults, null, 2));
console.log(`Audit saved to audit_results.json: ${images.length} images, ${videos.length} videos`);
