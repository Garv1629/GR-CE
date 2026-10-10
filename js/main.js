/**
 * ==========================================================================
 * GRÈCE — Cinematic Media & Motion Orchestration
 * ==========================================================================
 */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Header Scroll Detection
  const header = document.getElementById('mainHeader') || document.querySelector('.header');
  if (header) {
    const handleScroll = () => {
      if (window.scrollY > 40) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
  }

  // 2. Reduced Motion Query
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // 3. Hero Video Setup with Fallback, Interactive Toggle & Scroll Cue
  const heroVideo = document.getElementById('player');
  const heroMediaToggle = document.getElementById('heroMediaToggle');
  const mediaToggleIcon = document.getElementById('mediaToggleIcon');
  const mediaToggleText = document.getElementById('mediaToggleText');

  const updateMediaButtonState = (isPlaying) => {
    if (!heroMediaToggle) return;
    heroMediaToggle.setAttribute('aria-label', isPlaying ? 'Pause background video' : 'Play background video');
    if (mediaToggleText) {
      mediaToggleText.textContent = isPlaying ? 'Pause Film' : 'Play Film';
    }
    if (mediaToggleIcon) {
      mediaToggleIcon.innerHTML = isPlaying
        ? '<svg width="12" height="12" viewBox="0 0 12 12" fill="none"><rect x="2" y="1.5" width="2.5" height="9" fill="currentColor" rx="0.5"/><rect x="7.5" y="1.5" width="2.5" height="9" fill="currentColor" rx="0.5"/></svg>'
        : '<svg width="12" height="12" viewBox="0 0 12 12" fill="none"><polygon points="3,1.5 10,6 3,10.5" fill="currentColor"/></svg>';
    }
  };

  if (heroVideo) {
    heroVideo.muted = true;
    heroVideo.playsInline = true;

    if (!prefersReducedMotion) {
      const playPromise = heroVideo.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => updateMediaButtonState(true))
          .catch(() => {
            console.info('Hero video autoplay fallback engaged; poster active.');
            updateMediaButtonState(false);
          });
      }
    } else {
      heroVideo.pause();
      updateMediaButtonState(false);
    }

    if (heroMediaToggle) {
      heroMediaToggle.addEventListener('click', () => {
        if (heroVideo.paused) {
          heroVideo.play().then(() => updateMediaButtonState(true)).catch(() => {});
        } else {
          heroVideo.pause();
          updateMediaButtonState(false);
        }
      });
    }
  }

  // 3b. About / Studio Masterplate Video Setup
  const aboutVideo = document.getElementById('aboutPlayer');
  const aboutMediaToggle = document.getElementById('aboutMediaToggle');
  const aboutToggleText = document.getElementById('aboutToggleText');

  if (aboutVideo) {
    aboutVideo.muted = true;
    aboutVideo.playsInline = true;

    if (!prefersReducedMotion) {
      const playPromise = aboutVideo.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            if (aboutToggleText) aboutToggleText.textContent = 'Pause Film';
          })
          .catch(() => {
            if (aboutToggleText) aboutToggleText.textContent = 'Play Film';
          });
      }
    } else {
      aboutVideo.pause();
      if (aboutToggleText) aboutToggleText.textContent = 'Play Film';
    }

    if (aboutMediaToggle) {
      aboutMediaToggle.addEventListener('click', () => {
        if (aboutVideo.paused) {
          aboutVideo.play().then(() => {
            if (aboutToggleText) aboutToggleText.textContent = 'Pause Film';
          }).catch(() => {});
        } else {
          aboutVideo.pause();
          if (aboutToggleText) aboutToggleText.textContent = 'Play Film';
        }
      });
    }
  }

  // Hero Scroll Cue
  const heroScrollCue = document.getElementById('heroScrollCue');
  if (heroScrollCue) {
    heroScrollCue.addEventListener('click', (e) => {
      const target = document.getElementById('Witness');
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: prefersReducedMotion ? 'auto' : 'smooth' });
      }
    });
  }

  // 4. Deferred / Lazy Video Loading for Below-the-fold Video (Brand Design)
  const brandSection = document.getElementById('branDedign');
  const brandVideo = brandSection ? brandSection.querySelector('video') : null;

  if (brandVideo && 'IntersectionObserver' in window) {
    const videoObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          if (!prefersReducedMotion) {
            brandVideo.play().catch(() => {});
          }
        } else {
          brandVideo.pause();
        }
      });
    }, { rootMargin: '200px 0px' });

    videoObserver.observe(brandSection);
  }

  // 5. Global Mobile Navigation Overlay Orchestration
  const menuToggleBtn = document.getElementById('menuToggleBtn');
  const mobileNavModal = document.getElementById('mobileNavModal');
  const mobileNavCloseBtn = document.getElementById('mobileNavCloseBtn');

  const openMobileNav = () => {
    if (!mobileNavModal) return;
    mobileNavModal.style.visibility = 'visible';
    mobileNavModal.classList.add('active');
    if (menuToggleBtn) menuToggleBtn.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden'; // Prevent background scrolling
  };

  const closeMobileNav = () => {
    if (!mobileNavModal) return;
    mobileNavModal.classList.remove('active');
    if (menuToggleBtn) menuToggleBtn.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = ''; // Restore background scrolling
    setTimeout(() => {
      if (!mobileNavModal.classList.contains('active')) {
        mobileNavModal.style.visibility = 'hidden';
      }
    }, 350);
  };

  if (menuToggleBtn) {
    menuToggleBtn.addEventListener('click', (e) => {
      e.preventDefault();
      openMobileNav();
    });
  }

  if (mobileNavCloseBtn) {
    mobileNavCloseBtn.addEventListener('click', (e) => {
      e.preventDefault();
      closeMobileNav();
    });
  }

  // Close on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      if (mobileNavModal && mobileNavModal.classList.contains('active')) {
        closeMobileNav();
      }
      if (modalContainer && modalContainer.style.visibility === 'visible') {
        modalContainer.style.visibility = 'hidden';
      }
    }
  });

  // Close mobile nav when clicking any destination link inside it
  if (mobileNavModal) {
    const mobileLinks = mobileNavModal.querySelectorAll('a');
    mobileLinks.forEach(link => {
      link.addEventListener('click', () => {
        closeMobileNav();
      });
    });
  }

  // 6. Editorial Work Dropdown Dynamic Preview Switcher
  const previewImg = document.getElementById('navWorkPreviewImg');
  const previewTitle = document.getElementById('navWorkPreviewTitle');
  const previewLinks = document.querySelectorAll('.dropdown-links a[data-preview]');

  const PREVIEW_DATA = {
    hospitality: {
      src: 'assets/generated/hospitality/hospitality-editorial.jpg',
      title: 'Hospitality Architecture'
    },
    business: {
      src: 'https://www.wordofgrece.com/wp-content/uploads/2026/02/Business-Premises.jpg',
      title: 'Corporate Spatial Design'
    },
    photography: {
      src: 'https://www.wordofgrece.com/wp-content/uploads/2025/12/photography-pix1.webp',
      title: 'Editorial Interior Photography'
    },
    all: {
      src: 'assets/generated/interiors/interior-sculptural-living.jpg',
      title: 'Curated Architectural Portfolio'
    }
  };

  if (previewImg && previewTitle && previewLinks.length) {
    previewLinks.forEach(link => {
      link.addEventListener('mouseenter', () => {
        const key = link.getAttribute('data-preview');
        const data = PREVIEW_DATA[key];
        if (data) {
          previewImg.src = data.src;
          previewTitle.textContent = data.title;
        }
      });
    });
  }

  // 7. Swiper Architecture (Cinematic Smooth Transition Curves)
  if (typeof Swiper !== 'undefined') {
    // Interior Design Gallery
    new Swiper('.iconicSlider', {
      slidesPerView: 1.15,
      spaceBetween: 24,
      speed: 850,
      grabCursor: true,
      navigation: {
        nextEl: '.iconicSlider-button-next',
        prevEl: '.iconicSlider-button-prev',
      },
      pagination: {
        el: '.iconicSlider-pagination',
        clickable: true,
      },
      breakpoints: {
        640: {
          slidesPerView: 1.5,
          spaceBetween: 28,
        },
        1024: {
          slidesPerView: 2.2,
          spaceBetween: 36,
        },
        1440: {
          slidesPerView: 2.6,
          spaceBetween: 44,
        },
      },
    });

    // Photography Gallery
    new Swiper('.PhotographSlider', {
      slidesPerView: 1.15,
      spaceBetween: 24,
      speed: 850,
      grabCursor: true,
      navigation: {
        nextEl: '.PhotographSlider-button-next',
        prevEl: '.PhotographSlider-button-prev',
      },
      pagination: {
        el: '.PhotographSlider-pagination',
        clickable: true,
      },
      breakpoints: {
        640: {
          slidesPerView: 1.5,
          spaceBetween: 28,
        },
        1024: {
          slidesPerView: 2.2,
          spaceBetween: 36,
        },
        1440: {
          slidesPerView: 2.6,
          spaceBetween: 44,
        },
      },
    });

    // Featured Products Plinth Gallery (if swiper layout is present)
    if (document.querySelector('.PhotographSlider2')) {
      new Swiper('.PhotographSlider2', {
        slidesPerView: 1.15,
        spaceBetween: 24,
        speed: 850,
        grabCursor: true,
        navigation: {
          nextEl: '.PhotographSlider2-button-next',
          prevEl: '.PhotographSlider2-button-prev',
        },
        pagination: {
          el: '.PhotographSlider2-pagination',
          clickable: true,
        },
        breakpoints: {
          640: {
            slidesPerView: 1.5,
            spaceBetween: 28,
          },
          1024: {
            slidesPerView: 2.5,
            spaceBetween: 36,
          },
          1440: {
            slidesPerView: 3,
            spaceBetween: 44,
          },
        },
      });
    }
  }

  // 8. Client Portal Modal Interactivity
  const accountBtns = document.querySelectorAll('.accountBt');
  const modalContainer = document.querySelector('.xoo-el-container');
  const modalClose = document.querySelector('.xoo-el-close');
  const modalOverlay = document.querySelector('.xoo-el-opac');

  if (accountBtns.length && modalContainer) {
    accountBtns.forEach(btn => {
      // Only intercept explicit javascript modal triggers or utility account buttons, allowing direct booking links to navigate
      if (btn.getAttribute('href') === 'javascript:void(0)' || btn.classList.contains('utility-link')) {
        btn.addEventListener('click', (e) => {
          e.preventDefault();
          modalContainer.style.visibility = 'visible';
        });
      }
    });
  }

  if (modalClose && modalContainer) {
    modalClose.addEventListener('click', () => {
      modalContainer.style.visibility = 'hidden';
    });
  }

  if (modalOverlay && modalContainer) {
    modalOverlay.addEventListener('click', () => {
      modalContainer.style.visibility = 'hidden';
    });
  }

  // 9. Architectural Commission Inquiry Form Universal Handler
  const inquiryForms = document.querySelectorAll('form[action="/api/inquiry"], #greceInquiryForm, #homepageInquiryForm');
  inquiryForms.forEach(form => {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const statusBanner = form.parentElement.querySelector('.form-status-banner') || form.querySelector('.form-status-banner');
      const submitBtn = form.querySelector('button[type="submit"]');
      const originalBtnText = submitBtn ? submitBtn.innerHTML : '';

      // Clear previous banner
      if (statusBanner) {
        statusBanner.className = 'form-status-banner';
        statusBanner.style.display = 'none';
        statusBanner.textContent = '';
      }

      // Collect values
      const formData = new FormData(form);
      const payload = {};
      formData.forEach((value, key) => { payload[key] = value; });

      // Client validation
      const name = (payload.fullName || payload.name || '').trim();
      const email = (payload.email || '').trim();
      const discipline = (payload.discipline || payload.projectType || '').trim();
      const message = (payload.message || '').trim();

      if (name.length < 2) {
        if (statusBanner) {
          statusBanner.className = 'form-status-banner status-error';
          statusBanner.style.display = 'block';
          statusBanner.textContent = 'Please enter your full name (minimum 2 characters).';
        }
        return;
      }

      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        if (statusBanner) {
          statusBanner.className = 'form-status-banner status-error';
          statusBanner.style.display = 'block';
          statusBanner.textContent = 'Please provide a valid email address.';
        }
        return;
      }

      if (!discipline) {
        if (statusBanner) {
          statusBanner.className = 'form-status-banner status-error';
          statusBanner.style.display = 'block';
          statusBanner.textContent = 'Please select a discipline or inquiry type.';
        }
        return;
      }

      if (message.length < 10) {
        if (statusBanner) {
          statusBanner.className = 'form-status-banner status-error';
          statusBanner.style.display = 'block';
          statusBanner.textContent = 'Please share more detail about your project (minimum 10 characters).';
        }
        return;
      }

      // Button loading state
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<span>Transmitting Inquiry...</span>';
      }

      try {
        const response = await fetch('/api/inquiry', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
        const result = await response.json();

        if (response.ok && result.success) {
          if (statusBanner) {
            statusBanner.className = 'form-status-banner status-success';
            statusBanner.style.display = 'block';
            statusBanner.innerHTML = `<strong>Inquiry Received.</strong> Reference #${result.referenceId || 'GRECE-REQ'}. Our architectural team will review your brief promptly.`;
          }
          form.reset();
        } else {
          if (statusBanner) {
            statusBanner.className = 'form-status-banner status-error';
            statusBanner.style.display = 'block';
            statusBanner.textContent = result.message || 'Error transmitting inquiry. Please reach out directly.';
          }
        }
      } catch (err) {
        if (statusBanner) {
          statusBanner.className = 'form-status-banner status-error';
          statusBanner.style.display = 'block';
          statusBanner.textContent = 'Network error while transmitting. Please verify connection.';
        }
      } finally {
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.innerHTML = originalBtnText;
        }
      }
    });
  });
});
