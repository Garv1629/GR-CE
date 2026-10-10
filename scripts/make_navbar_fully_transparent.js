const fs = require('fs');
const path = require('path');

const rootDir = path.resolve(__dirname, '..');

// 1. Update css/design-system.css
const dsPath = path.join(rootDir, 'css', 'design-system.css');
let dsContent = fs.readFileSync(dsPath, 'utf8');

dsContent = dsContent.replace(/--glass-surface-base:\s*[^;]+;/, '--glass-surface-base: transparent;');
dsContent = dsContent.replace(/--glass-surface-scrolled:\s*[^;]+;/, '--glass-surface-scrolled: rgba(255, 255, 255, 0.12);');
dsContent = dsContent.replace(/--glass-border:\s*[^;]+;/, '--glass-border: 1px solid rgba(255, 255, 255, 0.35);');
dsContent = dsContent.replace(/--glass-border-scrolled:\s*[^;]+;/, '--glass-border-scrolled: 1px solid rgba(255, 255, 255, 0.45);');
dsContent = dsContent.replace(/--glass-blur:\s*[^;]+;/, '--glass-blur: 0px;');
dsContent = dsContent.replace(/--glass-saturate:\s*[^;]+;/, '--glass-saturate: 100%;');

fs.writeFileSync(dsPath, dsContent, 'utf8');

// 2. Update css/theme-override.css
const toPath = path.join(rootDir, 'css', 'theme-override.css');
let toContent = fs.readFileSync(toPath, 'utf8');

// Replace header block
const headerRegex = /\.header\s*\{[\s\S]*?overflow:\s*hidden;\s*isolation:\s*isolate;\s*\}/;
const newHeader = `.header {
  position: fixed;
  top: 1.25rem;
  left: 50%;
  transform: translateX(-50%);
  width: min(1280px, calc(100% - 2.5rem));
  margin: 0 auto;
  z-index: 1000;
  padding: 0.7rem 1.85rem;
  border-radius: var(--glass-radius-capsule, 9999px);
  background: transparent;
  backdrop-filter: none;
  -webkit-backdrop-filter: none;
  border: 1px solid rgba(255, 255, 255, 0.35);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
  transition: 
    background 350ms ease,
    backdrop-filter 350ms ease,
    border-color 350ms ease,
    box-shadow 350ms ease,
    padding 350ms ease,
    top 350ms ease;
  overflow: hidden;
  isolation: isolate;
}`;
toContent = toContent.replace(headerRegex, newHeader);

// Remove the cloudy gradient from .header::before
const headerBeforeRegex = /\.header::before\s*\{[\s\S]*?border-top:\s*1px solid rgba\([^)]+\);\s*\}/;
const newHeaderBefore = `.header::before {
  content: '';
  position: absolute;
  inset: 0;
  border-radius: inherit;
  pointer-events: none;
  z-index: 0;
  background: transparent;
  border-top: 1px solid rgba(255, 255, 255, 0.55);
}`;
toContent = toContent.replace(headerBeforeRegex, newHeaderBefore);

// Disable cloudy hover sheen on desktop
toContent = toContent.replace(
  /\.header::after\s*\{[\s\S]*?transition:\s*opacity 350ms ease;\s*\}/,
  `.header::after {
  content: '';
  position: absolute;
  inset: 0;
  border-radius: inherit;
  pointer-events: none;
  z-index: 0;
  opacity: 0;
  display: none;
}`
);

// Scrolled state: sheer minimal glass
const headerScrolledRegex = /\.header\.scrolled\s*\{[\s\S]*?padding:\s*0\.6rem 1\.85rem;\s*\}/;
const newHeaderScrolled = `.header.scrolled {
  background: rgba(255, 255, 255, 0.12);
  backdrop-filter: blur(8px) saturate(140%);
  -webkit-backdrop-filter: blur(8px) saturate(140%);
  border: 1px solid rgba(255, 255, 255, 0.45);
  box-shadow: 0 8px 24px -6px rgba(40, 48, 68, 0.12);
  padding: 0.6rem 1.85rem;
}`;
toContent = toContent.replace(headerScrolledRegex, newHeaderScrolled);

// Update .inquiry-cta to be transparent outline
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
  background: transparent;
  border: 1px solid rgba(40, 48, 68, 0.25);
  box-shadow: none;
  transition: 
    color 250ms ease,
    background-color 250ms ease,
    border-color 250ms ease,
    transform 250ms cubic-bezier(0.16, 1, 0.3, 1);
}`;
toContent = toContent.replace(inquiryCtaRegex, newInquiryCta);

fs.writeFileSync(toPath, toContent, 'utf8');
console.log('Successfully applied FULLY TRANSPARENT navbar styles to design-system.css and theme-override.css');
