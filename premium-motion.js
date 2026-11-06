(() => {
  'use strict';
  if (!window.gsap || !window.ScrollTrigger) return;
  gsap.registerPlugin(ScrollTrigger);
  // One owner per transform: do not select books, orbit cards, captures or flip faces.
  const selector = '#page-home .section-head, #page-home .exhibit-item, .selected-project, .about-academic, .about-work-pointer, .page .mf-statement-wrap';
  document.querySelectorAll(selector).forEach(el => el.classList.add('motion-owned'));
  const section = document.querySelector('#page-home > .section');
  const field = document.createElement('div');
  field.className = 'ambient-field'; field.setAttribute('aria-hidden', 'true');
  field.innerHTML = '<div class="ambient-light"></div>';
  section.prepend(field);
  let media;
  function mount() {
    media?.revert();
    media = gsap.matchMedia();
    media.add('(prefers-reduced-motion: no-preference)', () => {
      const page = document.querySelector('.page.active');
      if (!page) return;
      page.querySelectorAll('.motion-owned').forEach((el, index) => {
        gsap.fromTo(el, {y: 32, opacity: .15}, {
          y: 0, opacity: 1, duration: .85, ease: 'power3.out',
          scrollTrigger: {id: `premium-${index}`, trigger: el, start: 'top 94%', once: true},
          onComplete: () => gsap.set(el, {clearProps: 'transform,opacity'})
        });
      });
      if (page.id === 'page-home') {
        gsap.fromTo(field.firstElementChild, {xPercent: -12, yPercent: -8}, {
          xPercent: 16, yPercent: 12, ease: 'none',
          scrollTrigger: {id: 'premium-ambient', trigger: section, start: 'top bottom', end: 'bottom top', scrub: 1}
        });
      }
    });
    ScrollTrigger.refresh();
  }
  // Existing route hooks keep their lifecycle; this listener runs after the SPA has switched.
  let frame;
  function schedule() {cancelAnimationFrame(frame); frame = requestAnimationFrame(mount);}
  window.addEventListener('hashchange', schedule);
  document.fonts.ready.then(schedule);
  window.addEventListener('load', () => ScrollTrigger.refresh(), {once: true});
  schedule();
})();
