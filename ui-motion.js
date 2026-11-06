(() => {
 'use strict';
 const actions=document.querySelectorAll('.project-link,.project-secondary,.view-link,.work-jump,.about-work-link,.contact-reveal-toggle,.orbit-controls button,.nb-detail-copy a,.nb-detail-close');
 actions.forEach(el=>el.classList.add('ui-action'));
 document.querySelectorAll('.capture-close,.mf-icon-link').forEach(el=>el.classList.add('ui-icon-action'));
 const controls=[...document.querySelectorAll('.ui-action,.ui-icon-action,.nav-link,.contact-dock-link')];
 if(!window.gsap)return;
 const media=gsap.matchMedia();
 media.add('(prefers-reduced-motion: no-preference)',()=>{
  const cleanup=[];
  controls.forEach(el=>{
   el.classList.add('ui-motion');gsap.set(el,{x:0,y:0,scale:1});let over=false,down=false;
   const x=gsap.quickTo(el,'x',{duration:.22,ease:'power2.out'}),y=gsap.quickTo(el,'y',{duration:.22,ease:'power2.out'});
   const arrow=el.querySelector('.arrow,.dock-arrow') || (el.lastElementChild?.getAttribute('aria-hidden')==='true'?el.lastElementChild:null);
   function state(){const on=over||document.activeElement===el;gsap.to(el,{scale:down?.98:on?1.012:1,duration:.18,ease:'power2.out',overwrite:'auto'});if(!on){x(0);y(0);}else y(-2);if(arrow)gsap.to(arrow,{x:on?2:0,y:on?-2:0,duration:.18,ease:'power2.out',overwrite:'auto'});}
   const handlers={pointerenter:e=>{if(e.pointerType==='mouse'){over=true;state();}},pointerleave:()=>{over=false;down=false;state();},pointermove:e=>{if(!over||e.pointerType!=='mouse')return;const r=el.getBoundingClientRect();x(((e.clientX-r.left)/r.width-.5)*4);y(-2+((e.clientY-r.top)/r.height-.5)*2);},pointerdown:()=>{down=true;state();},pointerup:()=>{down=false;state();},pointercancel:()=>{down=false;over=false;state();},focus:state,blur:()=>{down=false;over=false;state();}};
   Object.entries(handlers).forEach(([name,fn])=>el.addEventListener(name,fn));
   const reset=()=>{if(!el.closest('.page.active')&&!el.closest('.nav-holder')&&!el.closest('dialog[open]')){over=down=false;gsap.killTweensOf(el);gsap.set(el,{x:0,y:0,scale:1});if(arrow){gsap.killTweensOf(arrow);gsap.set(arrow,{x:0,y:0});}}};
   window.addEventListener('hashchange',reset);
   cleanup.push(()=>{gsap.killTweensOf(el);if(arrow)gsap.killTweensOf(arrow);gsap.set(el,{clearProps:'transform'});if(arrow)gsap.set(arrow,{clearProps:'transform'});Object.entries(handlers).forEach(([name,fn])=>el.removeEventListener(name,fn));window.removeEventListener('hashchange',reset);el.classList.remove('ui-motion');});
  });
  return ()=>cleanup.forEach(fn=>fn());
 });
})();
