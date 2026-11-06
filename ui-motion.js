(() => {
  'use strict';
  document.querySelectorAll('.project-link,.project-secondary,.view-link,.work-jump,.about-work-link,.contact-reveal-toggle,.orbit-controls button,.nb-detail-copy a,.nb-detail-close').forEach(el => el.classList.add('ui-action'));
  document.querySelectorAll('.capture-close,.mf-icon-link').forEach(el => el.classList.add('ui-icon-action'));
  // SVG arrows render consistently without relying on optional font glyph ranges.
  document.querySelectorAll('span').forEach(el => {
    if (el.children.length || !['↗','↓','→'].includes(el.textContent.trim())) return;
    const direction = el.textContent.trim();
    const paths = {'↗':'M6 18 18 6M6 6h12v12','↓':'M12 4v16m-6-6 6 6 6-6','→':'M4 12h16m-6-6 6 6-6 6'};
    el.innerHTML = `<svg class="ui-arrow-svg" viewBox="0 0 24 24" aria-hidden="true"><path d="${paths[direction]}"/></svg>`;
    el.setAttribute('aria-hidden', 'true');
  });
  const controls = [...document.querySelectorAll('.ui-action,.ui-icon-action,.nav-link,.contact-dock-link')];
  controls.forEach(el => {
    if (el.matches('.nav-link,.orbit-controls button')) return;
    const sheen = document.createElement('span');
    sheen.className = 'action-sheen';
    sheen.setAttribute('aria-hidden', 'true');
    el.append(sheen);
  });
  if (!window.gsap) return;
  const media = gsap.matchMedia();
  media.add('(prefers-reduced-motion: no-preference)', () => {
    const cleanup = [];
    controls.forEach(el => {
      el.classList.add('ui-motion');
      let over = false, down = false;
      const sheen = el.querySelector('.action-sheen');
      const arrow = el.querySelector('.arrow,.dock-arrow') || el.querySelector(':scope > [aria-hidden="true"]:not(.action-sheen)');
      const x = gsap.quickTo(el, 'x', {duration: .24, ease: 'power3.out'});
      const y = gsap.quickTo(el, 'y', {duration: .24, ease: 'power3.out'});
      const disabled = () => el.matches(':disabled,[aria-disabled="true"]');
      function state() {
        const on = !disabled() && (over || document.activeElement === el);
        el.classList.toggle('ui-action--engaged', on);
        gsap.to(el, {scale: disabled() ? 1 : down ? .975 : on ? 1.015 : 1, duration: .2, ease: 'power3.out', overwrite: 'auto'});
        x(0); y(on ? -2 : 0);
        if (arrow) gsap.to(arrow, {x: on ? 2 : 0, y: on ? -2 : 0, rotation: on ? 6 : 0, duration: .24, ease: 'power3.out', overwrite: 'auto'});
        if (sheen) {
          gsap.killTweensOf(sheen);
          if (on) gsap.fromTo(sheen, {xPercent: -100, opacity: .8}, {xPercent: 100, opacity: 0, duration: .65, ease: 'power2.out'});
          else gsap.to(sheen, {opacity: 0, duration: .15});
        }
      }
      const reset = () => { over = down = false; state(); };
      const handlers = {
        pointerenter: e => {if (e.pointerType === 'mouse') {over = true; state();}},
        pointerleave: reset,
        pointermove: e => {
          if (!over || disabled() || e.pointerType !== 'mouse') return;
          const r = el.getBoundingClientRect();
          x(((e.clientX - r.left) / r.width - .5) * 5);
          y(-2 + ((e.clientY - r.top) / r.height - .5) * 3);
        },
        pointerdown: () => {down = true; state();},
        pointerup: () => {down = false; state();},
        pointercancel: reset,
        focus: state,
        blur: reset,
        keydown: e => {if (e.key === 'Enter' || e.key === ' ') {down = true; state();}},
        keyup: () => {down = false; state();}
      };
      Object.entries(handlers).forEach(([name, fn]) => el.addEventListener(name, fn));
      const routeReset = () => {
        if (!el.closest('.page.active') && !el.closest('.nav-holder') && !el.closest('dialog[open]')) {
          over = down = false;
          el.classList.remove('ui-action--engaged');
          gsap.killTweensOf([el, arrow, sheen].filter(Boolean));
          gsap.set(el, {clearProps: 'transform'});
          if (arrow) gsap.set(arrow, {clearProps: 'transform'});
        }
      };
      window.addEventListener('hashchange', routeReset);
      cleanup.push(() => {
        x.tween.kill(); y.tween.kill();
        gsap.killTweensOf([el, arrow, sheen].filter(Boolean));
        gsap.set(el, {clearProps: 'transform'});
        if (arrow) gsap.set(arrow, {clearProps: 'transform'});
        if (sheen) gsap.set(sheen, {clearProps: 'transform,opacity'});
        Object.entries(handlers).forEach(([name, fn]) => el.removeEventListener(name, fn));
        window.removeEventListener('hashchange', routeReset);
        el.classList.remove('ui-motion', 'ui-action--engaged');
      });
    });
    return () => cleanup.forEach(fn => fn());
  });
})();
