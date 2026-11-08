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
      let over=false,down=false,lastOn=null,lastDown=null;
      const fill=el.querySelector('.action-fill'),style=getComputedStyle(el);
      const rest=style.color,active=style.getPropertyValue('--action-hover-ink').trim()||rest;
      function state(){
        const disabled=el.matches(':disabled,[aria-disabled="true"]');
        const on=!disabled&&(over||document.activeElement===el);
        if(on===lastOn&&down===lastDown)return;
        el.classList.toggle('ui-action--engaged',on);
        gsap.to(el,{y:on?-1.5:0,scale:disabled?1:down?.98:on?1.015:1,duration:.18,ease:'power2.out',overwrite:'auto'});
        if(on!==lastOn&&fill){
          gsap.to(fill,{scaleY:on?1:0,duration:.24,ease:'power2.out',overwrite:true});
          gsap.to(el,{color:on?active:rest,duration:.18,overwrite:'auto'});
        }
        lastOn=on;lastDown=down;
      }
      const reset=()=>{over=down=false;state();};
      const handlers={pointerenter:e=>{if(e.pointerType==='mouse'){over=true;state();}},pointerleave:reset,
        pointerdown:()=>{down=true;state();},pointerup:()=>{down=false;state();},pointercancel:reset,
        focus:state,blur:reset,keydown:e=>{if(['Enter',' '].includes(e.key)){down=true;state();}},keyup:()=>{down=false;state();}};
      Object.entries(handlers).forEach(([event,fn])=>el.addEventListener(event,fn));
      const routeReset=()=>{if(el.closest('.page')&&!el.closest('.page.active')){
        over=down=false;lastOn=lastDown=null;gsap.killTweensOf([el,fill].filter(Boolean));
        gsap.set(el,{clearProps:'transform,color'});if(fill)gsap.set(fill,{clearProps:'transform'});el.classList.remove('ui-action--engaged');
      }};
      window.addEventListener('hashchange',routeReset);
      cleanup.push(()=>{Object.entries(handlers).forEach(([event,fn])=>el.removeEventListener(event,fn));window.removeEventListener('hashchange',routeReset);
        gsap.killTweensOf([el,fill].filter(Boolean));gsap.set(el,{clearProps:'transform,color'});if(fill)gsap.set(fill,{clearProps:'transform'});el.classList.remove('ui-motion','ui-action--engaged');});
    });
    return ()=>cleanup.forEach(fn=>fn());
  });
})();
