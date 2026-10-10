const fs = require('fs');
const path = require('path');

const rootDir = path.resolve(__dirname, '..');

// 1. Update css/design-system.css tokens
const dsPath = path.join(rootDir, 'css', 'design-system.css');
let dsContent = fs.readFileSync(dsPath, 'utf8');

dsContent = dsContent.replace(
  /--glass-surface-base:\s*rgba\([^)]+\);/,
  '--glass-surface-base: rgba(255, 255, 255, 0.08);'
);
dsContent = dsContent.replace(
  /--glass-surface-scrolled:\s*rgba\([^)]+\);/,
  '--glass-surface-scrolled: rgba(255, 255, 255, 0.16);'
);
dsContent = dsContent.replace(
  /--glass-surface-fallback:\s*rgba\([^)]+\);/,
  '--glass-surface-fallback: rgba(255, 255, 255, 0.85);'
);
dsContent = dsContent.replace(
  /--glass-border:\s*1px solid rgba\([^)]+\);/,
  '--glass-border: 1px solid rgba(255, 255, 255, 0.28);'
);
dsContent = dsContent.replace(
  /--glass-border-scrolled:\s*1px solid rgba\([^)]+\);/,
  '--glass-border-scrolled: 1px solid rgba(255, 255, 255, 0.42);'
);
dsContent = dsContent.replace(
  /--glass-blur:\s*[^;]+;/,
  '--glass-blur: 28px;'
);
dsContent = dsContent.replace(
  /--glass-saturate:\s*[^;]+;/,
  '--glass-saturate: 200%;'
);

fs.writeFileSync(dsPath, dsContent, 'utf8');
console.log('[SUCCESS] Updated design-system.css glass tokens');

// 2. Update css/theme-override.css
const toPath = path.join(rootDir, 'css', 'theme-override.css');
let toContent = fs.readFileSync(toPath, 'utf8');

// Replace header styles
const headerBlockRegex = /\.header\s*\{[\s\S]*?overflow:\s*hidden;\s*isolation:\s*isolate;\s*\}/;
const newHeaderBlock = `.header {
  position: fixed;
  top: 1.25rem;
  left: 50%;
  transform: translateX(-50%);
  width: min(1280px, calc(100% - 2.5rem));
  margin: 0 auto;
  z-index: 1000;
  padding: 0.7rem 1.85rem;
  border-radius: var(--glass-radius-capsule, 9999px);
  background: var(--glass-surface-base, rgba(255, 255, 255, 0.08));
  backdrop-filter: blur(var(--glass-blur, 28px)) saturate(var(--glass-saturate, 200%)) contrast(105%);
  -webkit-backdrop-filter: blur(var(--glass-blur, 28px)) saturate(var(--glass-saturate, 200%)) contrast(105%);
  border: var(--glass-border, 1px solid rgba(255, 255, 255, 0.28));
  box-shadow: 
    inset 0 1px 1px 0 rgba(255, 255, 255, 0.55),
    inset 0 -1px 1px 0 rgba(255, 255, 255, 0.08),
    0 16px 36px -10px rgba(40, 48, 68, 0.12),
    0 4px 12px -2px rgba(0, 0, 0, 0.05);
  transition: 
    background-color 400ms cubic-bezier(0.16, 1, 0.3, 1),
    border-color 400ms cubic-bezier(0.16, 1, 0.3, 1),
    box-shadow 400ms cubic-bezier(0.16, 1, 0.3, 1),
    padding 400ms cubic-bezier(0.16, 1, 0.3, 1),
    top 400ms cubic-bezier(0.16, 1, 0.3, 1);
  overflow: hidden;
  isolation: isolate;
}`;

toContent = toContent.replace(headerBlockRegex, newHeaderBlock);

// Replace header::before specular rim
const headerBeforeRegex = /\.header::before\s*\{[\s\S]*?border-top:\s*1px solid rgba\([^)]+\);\s*\}/;
const newHeaderBefore = `.header::before {
  content: '';
  position: absolute;
  inset: 0;
  border-radius: inherit;
  pointer-events: none;
  z-index: 0;
  background: linear-gradient(
    180deg,
    rgba(255, 255, 255, 0.35) 0%,
    rgba(255, 255, 255, 0.05) 30%,
    rgba(255, 255, 255, 0) 100%
  );
  border-top: 1px solid rgba(255, 255, 255, 0.7);
}`;

toContent = toContent.replace(headerBeforeRegex, newHeaderBefore);

// Replace header.scrolled
const headerScrolledRegex = /\.header\.scrolled\s*\{[\s\S]*?padding:\s*0\.6rem 1\.85rem;\s*\}/;
const newHeaderScrolled = `.header.scrolled {
  background: var(--glass-surface-scrolled, rgba(255, 255, 255, 0.16));
  backdrop-filter: blur(32px) saturate(210%) contrast(108%);
  -webkit-backdrop-filter: blur(32px) saturate(210%) contrast(108%);
  border: var(--glass-border-scrolled, 1px solid rgba(255, 255, 255, 0.42));
  box-shadow: 
    inset 0 1px 1px 0 rgba(255, 255, 255, 0.7),
    inset 0 -1px 1px 0 rgba(255, 255, 255, 0.1),
    0 20px 44px -10px rgba(40, 48, 68, 0.16),
    0 6px 14px -2px rgba(0, 0, 0, 0.07);
  padding: 0.6rem 1.85rem;
}`;

toContent = toContent.replace(headerScrolledRegex, newHeaderScrolled);

// Update .inquiry-cta inside navbar to match crystalline glass
const inquiryCtaRegex = /\.inquiry-cta:not\(\.animated-button\)\s*\{[\s\S]*?transform 250ms cubic-bezier\(0\.16, 1, 0\.3, 1\);\s*\}/;
const newInquiryCta = `.inquiry-cta:not(.animated-button) {
  display: none;
  font-family: var(--font-sans);
  font-size: var(--text-micro);
  font-weight: 600;
  letter-spacing: var(--track-wider);
  text-transform: uppercase;
  color: var(--color-space-indigo);
  text-decoration: none;
  padding: 0.45rem 1.15rem;
  border-radius: 9999px;
  background: rgba(255, 255, 255, 0.18);
  border: 1px solid rgba(40, 48, 68, 0.18);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  box-shadow: 0 1px 0 0 rgba(255, 255, 255, 0.65) inset, 0 2px 8px rgba(40, 48, 68, 0.04);
  transition: 
    color 250ms ease,
    background-color 250ms ease,
    border-color 250ms ease,
    box-shadow 250ms ease,
    transform 250ms cubic-bezier(0.16, 1, 0.3, 1);
}`;

toContent = toContent.replace(inquiryCtaRegex, newInquiryCta);

fs.writeFileSync(toPath, toContent, 'utf8');
console.log('[SUCCESS] Updated theme-override.css to fully transparent liquid glass');
