(() => {
  'use strict';
  const reduce = matchMedia('(prefers-reduced-motion: reduce)');
  let lenis = null;
  const update = () => window.ScrollTrigger?.update();
  const tick = time => lenis?.raf(time * 1000);
  function resize() {lenis?.resize(); window.ScrollTrigger?.refresh();}
  function reset() {
    if (lenis) {lenis.resize();lenis.scrollTo(0,{immediate:true,force:true});}
    else window.scrollTo({top:0,behavior:'instant'});
  }
  function to(target, options = {}) {
    if (lenis) lenis.scrollTo(target,{offset:-95,duration:.85,easing:t=>1-Math.pow(1-t,3),...options});
    else {
      const element=typeof target==='string'?document.querySelector(target):target;
      if (element instanceof Element) window.scrollTo({top:element.getBoundingClientRect().top+scrollY-95,behavior:reduce.matches?'instant':'smooth'});
      else window.scrollTo({top:Number(target)||0,behavior:'instant'});
    }
  }
  function syncDialog() {
    if(!lenis)return;
    if(document.hidden||document.querySelector('dialog[open]'))lenis.stop();else lenis.start();
  }
  function configure() {
    if(lenis){gsap.ticker.remove(tick);lenis.off('scroll',update);lenis.destroy();lenis=null;}
    if(reduce.matches||!window.Lenis||!window.gsap)return;
    // A quicker response than the default 0.10; do not mix wheel lerp with duration.
    lenis=new Lenis({autoRaf:false,lerp:.14,smoothWheel:true,syncTouch:false,wheelMultiplier:1,anchors:false,
      prevent:node=>!!node.closest?.('dialog,[data-lenis-prevent]')});
    lenis.on('scroll',update);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);
    syncDialog();
  }
  window.codexScroll={to,reset,resize,get instance(){return lenis;}};
  function bindDialogs(){document.querySelectorAll('dialog').forEach(dialog=>{
    dialog.setAttribute('data-lenis-prevent','');
    new MutationObserver(syncDialog).observe(dialog,{attributes:true,attributeFilter:['open']});
  });syncDialog();}
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',bindDialogs,{once:true});else bindDialogs();
  reduce.addEventListener('change',configure);
  configure();
  window.addEventListener('hashchange',()=>requestAnimationFrame(resize));
  document.addEventListener('visibilitychange',()=>{if(document.hidden)lenis?.stop();else{syncDialog();resize();}});
  document.fonts.ready.then(resize);
  window.addEventListener('load',resize,{once:true});
})();
