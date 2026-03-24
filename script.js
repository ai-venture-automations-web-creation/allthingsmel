/**
 * AllThingsMel — script.js
 * Handles: sticky header, mobile menu, scroll animations, smooth scroll
 */

'use strict';

/* =====================================================
   DOM REFERENCES
   ===================================================== */
const header      = document.getElementById('site-header');
const hamburger   = document.getElementById('hamburger');
const mobileMenu  = document.getElementById('mobile-menu');
const mobileLinks = document.querySelectorAll('.mobile-nav-link, .mobile-cta');

/* =====================================================
   STICKY HEADER
   ===================================================== */
function handleHeaderScroll() {
  header.classList.toggle('scrolled', window.scrollY > 10);
}

window.addEventListener('scroll', handleHeaderScroll, { passive: true });
handleHeaderScroll();

/* =====================================================
   MOBILE MENU
   ===================================================== */
let menuOpen = false;

function toggleMenu(open) {
  menuOpen = open;
  hamburger.classList.toggle('open', open);
  mobileMenu.classList.toggle('open', open);
  hamburger.setAttribute('aria-expanded', String(open));
  mobileMenu.setAttribute('aria-hidden', String(!open));
  document.body.style.overflow = open ? 'hidden' : '';
}

hamburger.addEventListener('click', () => toggleMenu(!menuOpen));

mobileLinks.forEach(link => {
  link.addEventListener('click', () => toggleMenu(false));
});

document.addEventListener('click', (e) => {
  if (menuOpen && !mobileMenu.contains(e.target) && !hamburger.contains(e.target)) {
    toggleMenu(false);
  }
});

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && menuOpen) toggleMenu(false);
});

/* =====================================================
   SMOOTH SCROLL
   ===================================================== */
document.querySelectorAll('a[href^="#"]').forEach(link => {
  link.addEventListener('click', function (e) {
    const targetId = this.getAttribute('href');
    if (targetId === '#') return;
    const target = document.querySelector(targetId);
    if (!target) return;

    e.preventDefault();
    const top = target.getBoundingClientRect().top + window.scrollY - 80;
    window.scrollTo({ top, behavior: 'smooth' });
  });
});

/* =====================================================
   SCROLL REVEAL (fade-in / fade-up → .visible)
   ===================================================== */
const revealEls = document.querySelectorAll('.fade-in, .fade-up');

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  },
  {
    rootMargin: '0px 0px -60px 0px',
    threshold: 0.08
  }
);

revealEls.forEach(el => revealObserver.observe(el));

/* =====================================================
   ACTIVE NAV HIGHLIGHT
   ===================================================== */
const navLinks = document.querySelectorAll('.nav-desktop .nav-link');
const sections = document.querySelectorAll('main section[id]');

const activeSectionObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.id;
        navLinks.forEach(link => {
          link.classList.toggle('active', link.getAttribute('href') === `#${id}`);
        });
      }
    });
  },
  {
    rootMargin: '-20% 0px -60% 0px',
    threshold: 0
  }
);

sections.forEach(section => activeSectionObserver.observe(section));

/* =====================================================
   LAZY IMAGE FADE-IN
   ===================================================== */
document.querySelectorAll('img[loading="lazy"]').forEach(img => {
  img.style.opacity = '0';
  img.style.transition = 'opacity 0.5s ease';

  if (img.complete) {
    img.style.opacity = '1';
  } else {
    img.addEventListener('load', () => { img.style.opacity = '1'; });
    img.addEventListener('error', () => { img.style.opacity = '0.3'; });
  }
});

/* =====================================================
   GALLERY KEYBOARD ACCESSIBILITY
   ===================================================== */
document.querySelectorAll('.gallery-item').forEach(item => {
  item.setAttribute('tabindex', '0');
  item.setAttribute('role', 'img');
});
