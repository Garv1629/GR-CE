const fs = require('fs');
const https = require('https');
const http = require('http');

const contentFile = 'C:\\Users\\GARV\\.gemini\\antigravity-ide\\brain\\683551a6-258f-4d7c-be75-b85787952254\\.system_generated\\steps\\51\\content.md';
const content = fs.readFileSync(contentFile, 'utf8');

// Extract all img src
const imgMatches = [...content.matchAll(/<img[^>]+src=["']([^"']+)["'][^>]*>/gi)];
const videoMatches = [...content.matchAll(/<video[^>]*>([\s\S]*?)<\/video>/gi)];
const videoSrcMatches = [...content.matchAll(/<source[^>]+src=["']([^"']+)["']/gi)];
const videoDirectSrc = [...content.matchAll(/<video[^>]+src=["']([^"']+)["']/gi)];
const bgMatches = [...content.matchAll(/url\(['"]?([^'"\)]+)['"]?\)/gi)];

const images = imgMatches.map(m => {
  const src = m[1];
  const altMatch = m[0].match(/alt=["']([^"']*)["']/i);
  return { tag: m[0], src, alt: altMatch ? altMatch[1] : '' };
});

const videos = [
  ...videoSrcMatches.map(m => m[1]),
  ...videoDirectSrc.map(m => m[1])
];

console.log('--- IMAGES FOUND (' + images.length + ') ---');
images.forEach(img => console.log(`ALT: "${img.alt}" | SRC: ${img.src}`));

console.log('\n--- VIDEOS FOUND (' + videos.length + ') ---');
videos.forEach(v => console.log(`VIDEO SRC: ${v}`));
