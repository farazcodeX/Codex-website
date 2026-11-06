(() => {
  'use strict';
  document.querySelectorAll('.project-link,.project-secondary,.view-link,.work-jump,.about-work-link,.contact-reveal-toggle,.orbit-controls button,.nb-detail-copy a,.nb-detail-close').forEach(el => el.classList.add('ui-action'));
  document.querySelectorAll('.capture-close').forEach(el => el.classList.add('ui-icon-action'));
  // SVG arrows render consistently without relying on optional font glyph ranges.
  document.querySelectorAll('span').forEach(el => {
    if (el.children.length || !['↗','↓','→'].includes(el.textContent.trim())) return;
    const direction = el.textContent.trim();
    const paths = {'↗':'M6 18 18 6M6 6h12v12','↓':'M12 4v16m-6-6 6 6 6-6','→':'M4 12h16m-6-6 6 6-6 6'};
    el.innerHTML = `<svg class="ui-arrow-svg" viewBox="0 0 24 24" aria-hidden="true"><path d="${paths[direction]}"/></svg>`;
    el.setAttribute('aria-hidden', 'true');
  });
  if (window.gsap && window.CustomEase) {gsap.registerPlugin(CustomEase); CustomEase.create('codexFlow', '.22,1,.36,1');}
  document.querySelectorAll('.ui-action .arrow,.ui-action .dock-arrow,.ui-action > span[aria-hidden="true"],.contact-dock-link .dock-arrow,.exhibit-open,.nb-explore-arrow').forEach(el => {
    if (el.querySelector('.ui-arrow-svg') || el.matches('.exhibit-open,.nb-explore-arrow')) el.remove();
  });
  const controls = [...document.querySelectorAll('.ui-action,.ui-icon-action,.nav-link,.contact-dock-link')];
  controls.forEach(el => {
    if (el.matches('.nav-link,.orbit-controls button')) return;
    const fill = document.createElement('span'); fill.className = 'action-fill'; fill.setAttribute('aria-hidden','true'); el.append(fill);
  });
  if (!window.gsap) return;
  const media = gsap.matchMedia();
  media.add('(prefers-reduced-motion: no-preference)', () => {
    const cleanup = [];
    controls.forEach(el => {
      el.classList.add('ui-motion');
      let over = false, down = false, engaged = false;
      const fill = el.querySelector('.action-fill');
      const colors = getComputedStyle(el);
      const restColor = colors.color;
      const activeColor = colors.getPropertyValue('--action-hover-ink').trim() || restColor;
      const arrow = el.querySelector('.arrow,.dock-arrow') || el.querySelector(':scope > [aria-hidden="true"]:not(.action-sheen):not(.action-fill)');
      const x = gsap.quickTo(el, 'x', {duration: .24, ease: 'power3.out'});
      const y = gsap.quickTo(el, 'y', {duration: .24, ease: 'power3.out'});
      const disabled = () => el.matches(':disabled,[aria-disabled="true"]');
      function state() {
        const on = !disabled() && (over || document.activeElement === el);
        el.classList.toggle('ui-action--engaged', on);
        gsap.to(el, {scale: disabled() ? 1 : down ? .975 : on ? 1.015 : 1, duration: .2, ease: 'power3.out', overwrite: 'auto'});
        x(0); y(on ? -2 : 0);
        if (fill) {
          gsap.to(fill, {scaleY:on?1:0, duration:.38, ease:'codexFlow', overwrite:true});
          gsap.to(el, {color:on?activeColor:restColor, duration:.24, overwrite:'auto'});
        }
        if (arrow && on !== engaged) {
          gsap.killTweensOf(arrow);
          if (on) gsap.timeline().to(arrow,{x:12,y:-12,opacity:0,duration:.14,ease:'power2.in'})
            .set(arrow,{x:-10,y:10}).to(arrow,{x:0,y:0,opacity:1,duration:.25,ease:'codexFlow'});
          else gsap.to(arrow,{x:0,y:0,opacity:1,duration:.2,overwrite:true});
        }
        engaged = on;

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
          over = down = engaged = false;
          el.classList.remove('ui-action--engaged');
          gsap.killTweensOf([el, arrow, fill].filter(Boolean));
          gsap.set(el, {clearProps: 'transform,color'});
          if (arrow) gsap.set(arrow, {clearProps: 'transform,opacity'});
          if (fill) gsap.set(fill, {clearProps: 'transform'});
        }
      };
      window.addEventListener('hashchange', routeReset);
      cleanup.push(() => {
        x.tween.kill(); y.tween.kill();
        gsap.killTweensOf([el, arrow, fill].filter(Boolean));
        gsap.set(el, {clearProps: 'transform'});
        if (arrow) gsap.set(arrow, {clearProps: 'transform'});
        Object.entries(handlers).forEach(([name, fn]) => el.removeEventListener(name, fn));
        window.removeEventListener('hashchange', routeReset);
        if (fill) gsap.set(fill,{clearProps:'transform'});
        gsap.set(el,{clearProps:'color'});
        if(arrow) gsap.set(arrow,{clearProps:'opacity'});
        el.classList.remove('ui-motion', 'ui-action--engaged');
      });
    });
    return () => cleanup.forEach(fn => fn());
  });
})();
