const fs = require('fs');
const path = require('path');

const cssPath = path.join(__dirname, '..', 'css', 'design-system.css');
let content = fs.readFileSync(cssPath, 'utf8');

// Replace the animated-button base and sizing sections with refined geometry
const startMarker = '/* ==========================================================================\n   GRÈCE — ANIMATED BUTTON SYSTEM';
const endMarker = '/* ==========================================================================\n   CINEMATIC SCROLL REVEALS';

const startIndex = content.indexOf(startMarker);
const endIndex = content.indexOf(endMarker);

if (startIndex === -1 || endIndex === -1) {
  console.error('Markers not found in design-system.css');
  process.exit(1);
}

const replacement = `/* ==========================================================================
   GRÈCE — ANIMATED BUTTON SYSTEM (COMPACT & REFINED MOTION SPECIFICATION)
   Selectors: .animated-button, .arr-1, .arr-2, .circle, .text
   ========================================================================== */
.animated-button {
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.45rem;
  padding: 0 2.25rem; /* Symmetric padding ensures 6px clean clearance from both left and right arrow slots */
  min-height: 42px;
  height: 42px;
  font-family: var(--font-sans, "Plus Jakarta Sans", sans-serif);
  font-size: 0.8125rem;
  font-weight: 600;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  border-radius: 9999px; /* Refined compact pill */
  overflow: hidden;
  cursor: pointer;
  text-decoration: none;
  isolation: isolate;
  border: 1px solid currentColor;
  background-color: transparent;
  color: var(--color-space-indigo, #283044);
  transition: all 0.4s cubic-bezier(0.23, 1, 0.32, 1);
  -webkit-tap-highlight-color: transparent;
  user-select: none;
  box-sizing: border-box;
  vertical-align: middle;
}

.animated-button:active {
  transform: scale(0.96);
}

.animated-button:focus-visible {
  outline: 2px solid var(--color-pale-sky, #BAD7F2);
  outline-offset: 3px;
}

/* Arrow 1 (on the right by default) */
.animated-button .arr-1 {
  position: absolute;
  right: 1.05rem;
  width: 15px;
  height: 15px;
  fill: currentColor;
  z-index: 2;
  transform: translateX(0);
  opacity: 1;
  transition: transform 0.45s cubic-bezier(0.23, 1, 0.32, 1),
              opacity 0.35s ease,
              fill 0.4s ease;
  pointer-events: none;
  flex-shrink: 0;
}

/* Arrow 2 (hidden off-canvas left by default) */
.animated-button .arr-2 {
  position: absolute;
  left: 1.05rem;
  width: 15px;
  height: 15px;
  fill: currentColor;
  z-index: 2;
  transform: translateX(-24px);
  opacity: 0;
  transition: transform 0.45s cubic-bezier(0.23, 1, 0.32, 1),
              opacity 0.35s ease,
              fill 0.4s ease;
  pointer-events: none;
  flex-shrink: 0;
}

/* Text label */
.animated-button .text {
  position: relative;
  z-index: 2;
  transform: translateX(-6px);
  transition: transform 0.45s cubic-bezier(0.23, 1, 0.32, 1),
              color 0.4s ease;
  white-space: nowrap;
  display: inline-block;
}

/* Expanding Circular Fill (Uiverse.io Architecture with GPU acceleration) */
.animated-button .circle {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%) scale(0.08);
  width: 320px;
  height: 320px;
  border-radius: 50%;
  background-color: var(--color-space-indigo, #283044);
  opacity: 0;
  z-index: 1;
  transition: transform 0.65s cubic-bezier(0.23, 1, 0.32, 1),
              opacity 0.35s ease;
  pointer-events: none;
}

/* Hover & Focus States: Kinetic Arrow Swap & Circular Expansion */
.animated-button:hover .arr-1,
.animated-button:focus-visible .arr-1 {
  transform: translateX(24px);
  opacity: 0;
}

.animated-button:hover .arr-2,
.animated-button:focus-visible .arr-2 {
  transform: translateX(0);
  opacity: 1;
}

.animated-button:hover .text,
.animated-button:focus-visible .text {
  transform: translateX(6px);
}

.animated-button:hover .circle,
.animated-button:focus-visible .circle {
  transform: translate(-50%, -50%) scale(1);
  opacity: 1;
}

/* --------------------------------------------------------------------------
   SIZING VARIANTS
   -------------------------------------------------------------------------- */
/* Compact button height: 34-38px */
.animated-button--compact,
.animated-button--sm,
.animated-button.inquiry-cta {
  min-height: 36px;
  height: 36px;
  padding: 0 1.85rem;
  font-size: 0.75rem;
  gap: 0.35rem;
}

.animated-button--compact .arr-1,
.animated-button--sm .arr-1,
.animated-button.inquiry-cta .arr-1 {
  right: 0.85rem;
  width: 13px;
  height: 13px;
}

.animated-button--compact .arr-2,
.animated-button--sm .arr-2,
.animated-button.inquiry-cta .arr-2 {
  left: 0.85rem;
  width: 13px;
  height: 13px;
  transform: translateX(-20px);
}

.animated-button--compact .text,
.animated-button--sm .text,
.animated-button.inquiry-cta .text {
  transform: translateX(-5px);
}

.animated-button--compact:hover .arr-1,
.animated-button--sm:hover .arr-1,
.animated-button.inquiry-cta:hover .arr-1,
.animated-button--compact:focus-visible .arr-1,
.animated-button--sm:focus-visible .arr-1,
.animated-button.inquiry-cta:focus-visible .arr-1 {
  transform: translateX(20px);
  opacity: 0;
}

.animated-button--compact:hover .arr-2,
.animated-button--sm:hover .arr-2,
.animated-button.inquiry-cta:hover .arr-2,
.animated-button--compact:focus-visible .arr-2,
.animated-button--sm:focus-visible .arr-2,
.animated-button.inquiry-cta:focus-visible .arr-2 {
  transform: translateX(0);
  opacity: 1;
}

.animated-button--compact:hover .text,
.animated-button--sm:hover .text,
.animated-button.inquiry-cta:hover .text,
.animated-button--compact:focus-visible .text,
.animated-button--sm:focus-visible .text,
.animated-button.inquiry-cta:focus-visible .text {
  transform: translateX(5px);
}

/* Hero CTA button height: 44px */
.animated-button--hero,
.animated-button--lg {
  min-height: 44px;
  height: 44px;
  padding: 0 2.45rem;
  font-size: 0.8125rem;
}

.animated-button--hero .arr-1,
.animated-button--lg .arr-1 {
  right: 1.15rem;
  width: 15px;
  height: 15px;
}

.animated-button--hero .arr-2,
.animated-button--lg .arr-2 {
  left: 1.15rem;
  width: 15px;
  height: 15px;
}

.animated-button--hero .text,
.animated-button--lg .text {
  transform: translateX(-7px);
}

.animated-button--hero:hover .text,
.animated-button--lg:hover .text,
.animated-button--hero:focus-visible .text,
.animated-button--lg:focus-visible .text {
  transform: translateX(7px);
}

/* --------------------------------------------------------------------------
   GRÈCE COLOR VARIANTS WITH CLEAN CONTRAST TRANSITIONS
   -------------------------------------------------------------------------- */

/* Variant 1: Solid Dark / Primary Space Indigo */
.animated-button--dark,
.animated-button--primary {
  background-color: var(--color-space-indigo, #283044);
  border-color: var(--color-space-indigo, #283044);
  color: var(--color-bg-primary, #F3F0E8);
}

.animated-button--dark .circle,
.animated-button--primary .circle {
  background-color: var(--color-bg-primary, #F3F0E8);
}

.animated-button--dark:hover,
.animated-button--primary:hover,
.animated-button--dark:focus-visible,
.animated-button--primary:focus-visible {
  color: var(--color-space-indigo, #283044);
  border-color: var(--color-space-indigo, #283044);
  box-shadow: 0 8px 24px -6px rgba(40, 48, 68, 0.35);
}

/* Variant 2: Outline / Hollow (Warm Ivory Surface) */
.animated-button--outline,
.animated-button--hollow {
  background-color: transparent;
  border-color: var(--color-space-indigo, #283044);
  color: var(--color-space-indigo, #283044);
}

.animated-button--outline .circle,
.animated-button--hollow .circle {
  background-color: var(--color-space-indigo, #283044);
}

.animated-button--outline:hover,
.animated-button--hollow:hover,
.animated-button--outline:focus-visible,
.animated-button--hollow:focus-visible {
  color: var(--color-bg-primary, #F3F0E8);
  border-color: var(--color-space-indigo, #283044);
  box-shadow: 0 8px 24px -6px rgba(40, 48, 68, 0.25);
}

/* Variant 3: On Dark Surfaces (Banners, Dark Footers, Overlays) */
.animated-button--on-dark {
  background-color: transparent;
  border-color: rgba(243, 240, 232, 0.45);
  color: var(--color-bg-primary, #F3F0E8);
}

.animated-button--on-dark .circle {
  background-color: var(--color-bg-primary, #F3F0E8);
}

.animated-button--on-dark:hover,
.animated-button--on-dark:focus-visible {
  color: var(--color-space-indigo, #283044);
  border-color: var(--color-bg-primary, #F3F0E8);
  box-shadow: 0 8px 24px -6px rgba(0, 0, 0, 0.45);
}

/* Variant 4: Liquid Glass Button Surface */
.animated-button--glass {
  background: rgba(243, 240, 232, 0.55);
  backdrop-filter: blur(14px) saturate(160%);
  -webkit-backdrop-filter: blur(14px) saturate(160%);
  border-color: rgba(255, 255, 255, 0.65);
  color: var(--color-space-indigo, #283044);
  box-shadow: 0 4px 16px rgba(40, 48, 68, 0.08), 0 1px 0 rgba(255, 255, 255, 0.75) inset;
}

.animated-button--glass .circle {
  background-color: var(--color-space-indigo, #283044);
}

.animated-button--glass:hover,
.animated-button--glass:focus-visible {
  color: var(--color-bg-primary, #F3F0E8);
  border-color: var(--color-space-indigo, #283044);
  box-shadow: 0 8px 24px -6px rgba(40, 48, 68, 0.25);
}

/* Variant 5: Disabled / Submitting State */
.animated-button:disabled,
.animated-button.is-disabled {
  opacity: 0.6;
  cursor: not-allowed;
  pointer-events: none;
  transform: none !important;
}

`;

content = content.substring(0, startIndex) + replacement + content.substring(endIndex);
fs.writeFileSync(cssPath, content, 'utf8');
console.log('Successfully upgraded animated button system in design-system.css');
