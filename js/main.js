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