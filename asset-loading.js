(() => {
  'use strict';
  const reduce = matchMedia('(prefers-reduced-motion: reduce)');
  const queue = new Set();
  let frame;
  function flush() {
    frame = 0;
    const images = [...queue]; queue.clear();
    if (window.gsap && !reduce.matches) {
      gsap.to(images, {opacity:1,duration:.65,stagger:.07,ease:'power2.out',clearProps:'opacity'});
    } else images.forEach(img => {img.style.removeProperty('opacity');});
    window.ScrollTrigger?.refresh();
  }
  // Only actual image requests get placeholders. Text stays available immediately.
  document.querySelectorAll('.page img[src]').forEach(img => {
    if (img.complete && img.naturalWidth) return;
    const host = img.parentElement;
    const veil = document.createElement('span');
    veil.className = 'asset-veil'; veil.setAttribute('aria-hidden','true');
    host.classList.add('asset-pending'); host.setAttribute('aria-busy','true');
    host.append(veil); img.style.opacity = '0';
    let settled = false;
    async function finish() {
      if (settled) return; settled = true;
      // Decode before showing the pixels; a failed request still exposes native alt text.
      if (img.naturalWidth) {try {await img.decode();} catch { /* Browser fallback. */ }}
      veil.remove(); host.classList.remove('asset-pending'); host.removeAttribute('aria-busy');
      queue.add(img); if (!frame) frame = requestAnimationFrame(flush);
    }
    img.addEventListener('load',finish,{once:true});
    img.addEventListener('error',finish,{once:true});
    if (img.complete) finish();
  });
})();
