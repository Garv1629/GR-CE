const fs = require('fs');
const path = require('path');

const targetPath = path.join(__dirname, '..', 'js', 'main.js');
let code = fs.readFileSync(targetPath, 'utf8');

// 1. Ensure prefersReducedMotion and js-motion at top
if (!code.includes('js-motion')) {
  if (code.includes('const prefersReducedMotion')) {
    code = code.replace(
      /(const prefersReducedMotion\s*=\s*window\.matchMedia\('\(prefers-reduced-motion: reduce\)'\)\.matches;)/,
      `$1\n  if (!prefersReducedMotion) {\n    document.documentElement.classList.add('js-motion');\n  }`
    );
  } else {
    code = code.replace(
      /document\.addEventListener\('DOMContentLoaded',\s*\(\)\s*=>\s*\{/,
      `document.addEventListener('DOMContentLoaded', () => {\n  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;\n  if (!prefersReducedMotion) {\n    document.documentElement.classList.add('js-motion');\n  }`
    );
  }
}

// 2. Ensure pointer tracking is present
if (!code.includes('mousemove')) {
  const pointerSnippet = `
    // 1c. Apple-Inspired Liquid Glass Dynamic Specular Sheen (Mouse Tracking)
    if (window.matchMedia('(pointer: fine)').matches && !prefersReducedMotion) {
      let rafId = null;
      header.addEventListener('mousemove', (e) => {
        if (rafId) return;
        rafId = requestAnimationFrame(() => {
          const rect = header.getBoundingClientRect();
          const x = e.clientX - rect.left;
          const y = e.clientY - rect.top;
          header.style.setProperty('--mouse-x', \`\${x}px\`);
          header.style.setProperty('--mouse-y', \`\${y}px\`);
          rafId = null;
        });
      }, { passive: true });

      header.addEventListener('mouseleave', () => {
        header.style.removeProperty('--mouse-x');
        header.style.removeProperty('--mouse-y');
      });
    }
  `;

  code = code.replace(
    /(handleScroll\(\);\s*})/,
    `$1\n${pointerSnippet}`
  );
}

// 3. Ensure active nav item logic is present
if (!code.includes('Automatic Active Navigation Indicator')) {
  const activeNavSnippet = `
  // 1d. Automatic Active Navigation Indicator
  const currentPath = window.location.pathname.split('/').pop() || 'index.html';
  const navItems = document.querySelectorAll('.nav-list .nav-item');
  navItems.forEach(item => {
    const link = item.querySelector('.nav-link');
    if (!link) return;
    const href = link.getAttribute('href');
    if (!href) return;

    const hrefPath = href.split('#')[0];
    if (hrefPath && hrefPath === currentPath) {
      item.classList.add('active');
    }
  });
  `;

  code = code.replace(
    /(const navAnchorLinks = document\.querySelectorAll\('a\[href\^="#"\]'\);)/,
    `${activeNavSnippet}\n  $1`
  );
}

// 4. Ensure Cinematic Motion logic is present
if (!code.includes('hero-entered')) {
  const motionLogic = `
  // 10. Hero Cinematic Entrance Sequence (Staggered Editorial Reveal)
  const heroBanner = document.getElementById('banner');
  if (heroBanner && !prefersReducedMotion) {
    setTimeout(() => {
      document.documentElement.classList.add('hero-entered');
    }, 60);
  } else {
    document.documentElement.classList.add('hero-entered');
  }

  // 11. Universal Cinematic Scroll Reveal Observer
  if ('IntersectionObserver' in window && !prefersReducedMotion) {
    const autoRevealSelectors = [
      '.witness-statement-headline',
      '.witness-lead-paragraph',
      '.witness-metrics-row',
      '.witness-card-wrapper',
      '.monograph-entry-header',
      '.monograph-visual-stage',
      '.monograph-spec-strip',
      '.services-editorial-header',
      '.services-capabilities-index',
      '.edition-hero-card',
      '.editions-editorial-diptych',
      '.studio-manifesto-grid',
      '.contact-form-col',
      '.contact-atelier-col',
      '.project-hero-header',
      '.project-meta-strip',
      '.project-master-artwork',
      '.editorial-story-grid',
      '.gallery-flow-item',
      '.about-manifesto-grid',
      '.about-triptych-section',
      '.disciplines-editorial-list'
    ];

    const elementsToObserve = new Set();

    document.querySelectorAll('.reveal-on-scroll, .reveal-clip, .reveal-media, .reveal-stagger').forEach(el => {
      elementsToObserve.add(el);
    });

    autoRevealSelectors.forEach(sel => {
      document.querySelectorAll(sel).forEach(el => {
        el.classList.add('reveal-on-scroll');
        elementsToObserve.add(el);
      });
    });

    document.querySelectorAll('.media-frame, .ProductImg, .monograph-hero-plate, .monograph-subplate').forEach(el => {
      el.classList.add('reveal-media');
      elementsToObserve.add(el);
    });

    const revealObserver = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-revealed');
          obs.unobserve(entry.target);
        }
      });
    }, {
      rootMargin: '0px 0px -40px 0px',
      threshold: 0.08
    });

    elementsToObserve.forEach(el => revealObserver.observe(el));
  } else {
    document.querySelectorAll('.reveal-on-scroll, .reveal-clip, .reveal-media, .reveal-stagger').forEach(el => {
      el.classList.add('is-revealed');
    });
  }

  // 12. Architectural Photography Subtle Parallax Engine (Performant & Low-Amplitude)
  if (!prefersReducedMotion && window.matchMedia('(pointer: fine)').matches) {
    const heroMedia = document.getElementById('heroMediaFrame');
    const parallaxImages = document.querySelectorAll(
      '.monograph-hero-plate img, .project-master-artwork img, .about-diptych-frame-wide img, .media-frame-horizon img'
    );

    parallaxImages.forEach(img => {
      const parent = img.parentElement;
      if (parent) {
        parent.classList.add('parallax-media-frame');
      }
    });

    let parallaxTicking = false;

    const onScrollParallax = () => {
      const scrollY = window.pageYOffset || document.documentElement.scrollTop;
      const vh = window.innerHeight;

      if (heroMedia && scrollY < vh * 1.3) {
        const heroOffset = scrollY * 0.15;
        heroMedia.style.transform = \`translate3d(0, \${heroOffset.toFixed(1)}px, 0)\`;
      }

      parallaxImages.forEach(img => {
        const rect = img.getBoundingClientRect();
        if (rect.bottom > -100 && rect.top < vh + 100) {
          const relativePos = (rect.top + rect.height / 2) - (vh / 2);
          const maxShift = 24;
          const shift = (relativePos / vh) * -maxShift;
          img.style.transform = \`translate3d(0, \${shift.toFixed(1)}px, 0) scale(1.045)\`;
        }
      });

      parallaxTicking = false;
    };

    window.addEventListener('scroll', () => {
      if (!parallaxTicking) {
        requestAnimationFrame(onScrollParallax);
        parallaxTicking = true;
      }
    }, { passive: true });

    onScrollParallax();
  }

  // 13. Process & Methodology Progressive Storytelling Indicator
  const disciplinesList = document.querySelector('.disciplines-editorial-list');
  if (disciplinesList) {
    const disciplineItems = disciplinesList.querySelectorAll('.discipline-row-item');
    if (disciplineItems.length && 'IntersectionObserver' in window && !prefersReducedMotion) {
      const stepObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            disciplineItems.forEach(item => item.classList.remove('is-active-step'));
            entry.target.classList.add('is-active-step');
          }
        });
      }, {
        rootMargin: '-25% 0px -25% 0px',
        threshold: 0.1
      });

      disciplineItems.forEach(item => stepObserver.observe(item));
    }
  }
`;

  code = code.replace(/\n\}\);\s*$/, `\n${motionLogic}\n});\n`);
}

fs.writeFileSync(targetPath, code, 'utf8');
console.log('Successfully patched js/main.js to disk! File size:', fs.statSync(targetPath).size);
