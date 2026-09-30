// Veritas — main.js
// Interactions will be added here as sections are built.

// Selected Projects accordion
document.addEventListener('DOMContentLoaded', () => {
  const items = document.querySelectorAll('.accordion-item');
  items.forEach((item) => {
    const trigger = item.querySelector('.accordion-trigger');
    if (!trigger) return;
    trigger.addEventListener('click', () => {
      const wasActive = item.classList.contains('is-active');
      items.forEach((i) => i.classList.remove('is-active'));
      if (!wasActive) item.classList.add('is-active');
    });
  });
});

// Testimonials carousel
document.addEventListener('DOMContentLoaded', () => {
  const track = document.getElementById('testimonialsTrack');
  const prevBtn = document.getElementById('testimonialPrev');
  const nextBtn = document.getElementById('testimonialNext');
  if (!track || !prevBtn || !nextBtn) return;

  const scrollByCard = (direction) => {
    const card = track.querySelector('.testimonial-card');
    if (!card) return;
    const gap = 24;
    const distance = card.getBoundingClientRect().width + gap;
    track.scrollBy({ left: direction * distance, behavior: 'smooth' });
  };

  prevBtn.addEventListener('click', () => scrollByCard(-1));
  nextBtn.addEventListener('click', () => scrollByCard(1));
});

// FAQ accordion (independent toggles, not exclusive)
document.addEventListener('DOMContentLoaded', () => {
  const items = document.querySelectorAll('.faq-item');
  items.forEach((item) => {
    const trigger = item.querySelector('.faq-trigger');
    if (!trigger) return;
    trigger.addEventListener('click', () => {
      item.classList.toggle('is-open');
    });
  });
});

// Respect the user's motion preference throughout
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// Scroll-reveal: fade/slide elements in as they enter the viewport.
// Each element is observed once, then released — cheap on long pages.
document.addEventListener('DOMContentLoaded', () => {
  const revealEls = document.querySelectorAll('.reveal, .reveal-scale');
  if (!revealEls.length) return;

  if (prefersReducedMotion || !('IntersectionObserver' in window)) {
    revealEls.forEach((el) => el.classList.add('in-view'));
    return;
  }

  const observer = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
          obs.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15, rootMargin: '0px 0px -60px 0px' }
  );

  revealEls.forEach((el) => observer.observe(el));
});

// Animated stat counters — counts up from 0 once each stat scrolls into view.
// Parses the leading number out of text like "$1.2B+" or "10+ Years" and
// animates just that portion, keeping prefix/suffix and decimal precision intact.
document.addEventListener('DOMContentLoaded', () => {
  const counters = document.querySelectorAll('[data-count]');
  if (!counters.length) return;

  const animateCounter = (el) => {
    const raw = el.textContent.trim();
    const match = raw.match(/^(\D*)([\d,]+(?:\.\d+)?)(.*)$/);
    if (!match) return;

    const [, prefix, numberStr, suffix] = match;
    const target = parseFloat(numberStr.replace(/,/g, ''));
    const decimals = numberStr.includes('.') ? numberStr.split('.')[1].length : 0;
    const hasComma = numberStr.includes(',');

    if (prefersReducedMotion) {
      el.textContent = raw;
      return;
    }

    const duration = 1400;
    const start = performance.now();

    const formatNumber = (n) => {
      let str = n.toFixed(decimals);
      if (hasComma) str = Number(str).toLocaleString('en-US', { minimumFractionDigits: decimals, maximumFractionDigits: decimals });
      return str;
    };

    const tick = (now) => {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
      const current = target * eased;
      el.textContent = `${prefix}${formatNumber(current)}${suffix}`;
      if (progress < 1) requestAnimationFrame(tick);
    };

    requestAnimationFrame(tick);
  };

  if (!('IntersectionObserver' in window)) {
    counters.forEach(animateCounter);
    return;
  }

  const counterObserver = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          obs.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.5 }
  );

  counters.forEach((el) => counterObserver.observe(el));
});

// Scroll progress bar — passive listener + rAF throttling so it never
// blocks or janks the main scroll thread.
document.addEventListener('DOMContentLoaded', () => {
  const bar = document.getElementById('scrollProgress');
  if (!bar) return;

  let ticking = false;

  const updateProgress = () => {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    bar.style.width = `${progress}%`;
    ticking = false;
  };

  window.addEventListener(
    'scroll',
    () => {
      if (!ticking) {
        requestAnimationFrame(updateProgress);
        ticking = true;
      }
    },
    { passive: true }
  );

  updateProgress();
});