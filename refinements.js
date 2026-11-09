/* One reusable orbit, suspended on inactive routes. All wrapping happens offscreen. */
(function () {
  'use strict';
  const slider = document.getElementById('aboutSlider');
  const cards = Array.from(slider.querySelectorAll('.about-card'));
  const pause = document.getElementById('orbitPause');
  const mobile = matchMedia('(max-width:700px), (max-width:1000px) and (pointer:coarse)');
  const hint = document.querySelector('.orbit-hint');
  const desktopHint = hint.textContent;
  const media = matchMedia('(prefers-reduced-motion: reduce)');
  let phase = 0, velocity = 0, width = 0, cardWidth = 350, spacing = 410;
  let active = false, hovered = false, paused = false, drag = null, frame = 0, last = 0;
  const wrap = (n, span) => ((n + span / 2) % span + span) % span - span / 2;
  function measure() {
    if (!active || mobile.matches) return;
    width = slider.clientWidth; cardWidth = cards[0].offsetWidth;
    spacing = Math.max(cardWidth + 48, (width + cardWidth * 2) / (cards.length - 2));
    render();
  }
  function render() {
    if (mobile.matches) return;
    const span = spacing * cards.length;
    phase = wrap(phase, span);
    cards.forEach((card, i) => {
      const x = wrap(i * spacing + phase, span);
      const distance = Math.min(1, Math.abs(x) / (width * .65 + cardWidth));
      const scale = 1 - distance * .24;
      const angle = -Math.sign(x) * distance * (width < 700 ? 14 : 28);
      card.style.transform = `translate3d(${x-cardWidth/2}px,${distance*42 + Math.sin(i*1.7)*5}px,${-distance*140}px) rotateY(${angle}deg) scale(${scale})`;
      card.style.opacity = 1 - distance * .25;
      card.style.zIndex = Math.round((1-distance)*100);
    });
  }
  function tick(now) {
    const dt = Math.min((now-last)/1000 || 0, .05); last = now;
    if (!drag) {
      velocity *= Math.exp(-dt*4);
      if (!media.matches) phase += velocity * dt;
      if (!paused && !hovered && !media.matches) phase -= 22 * dt;
      render();
    }
    frame = requestAnimationFrame(tick);
  }
  function sync() {
    active = document.getElementById('page-about').classList.contains('active') && !document.hidden;
    cancelAnimationFrame(frame); frame = 0; drag = null;
    if (mobile.matches) {
      cards.forEach(card => {card.style.removeProperty('transform');card.style.removeProperty('opacity');card.style.removeProperty('z-index');});
      hint.textContent = 'Swipe to explore four perspectives.';
    } else hint.textContent = desktopHint;
    if (active && !mobile.matches) { measure(); last = performance.now(); frame = requestAnimationFrame(tick); }
  }
  slider.addEventListener('pointerdown', e => {
    if (mobile.matches || e.button !== 0) return;
    drag = {x:e.clientX,t:performance.now(),id:e.pointerId}; velocity = 0;
    slider.setPointerCapture(e.pointerId);
  });
  slider.addEventListener('pointermove', e => {
    if (!drag || e.pointerId !== drag.id) return;
    const now = performance.now(), dx = e.clientX-drag.x;
    velocity = Math.max(-1300,Math.min(1300,dx/Math.max(.016,(now-drag.t)/1000)));
    phase += dx; drag.x=e.clientX; drag.t=now; render();
  });
  function end(e) { if (!drag || e.pointerId !== drag.id) return; if (e.type==='pointercancel' || performance.now()-drag.t>100) velocity=0; drag=null; }
  slider.addEventListener('pointerup',end); slider.addEventListener('pointercancel',end); slider.addEventListener('lostpointercapture',end);
  slider.addEventListener('mouseenter',()=>{hovered=true}); slider.addEventListener('mouseleave',()=>{hovered=false});
  slider.addEventListener('keydown',e=>{if(e.key==='ArrowRight'||e.key==='ArrowLeft'){e.preventDefault();if(mobile.matches){slider.scrollBy({left:(e.key==='ArrowRight'?1:-1)*cards[0].offsetWidth,behavior:media.matches?'instant':'smooth'});return;}phase+=(e.key==='ArrowRight'?-1:1)*spacing;velocity=0;render();}});
  pause.addEventListener('click',()=>{paused=!paused;pause.setAttribute('aria-pressed',String(paused));pause.textContent=paused?'Resume motion':'Pause motion'});
  mobile.addEventListener('change',sync);
  media.addEventListener('change',()=>{velocity=0;render()});
  new ResizeObserver(measure).observe(slider);
  document.addEventListener('visibilitychange',sync);
  const previous = window.__onRouteChange;
  window.__onRouteChange = function(route) {if(previous) previous(route);sync()};
})();
