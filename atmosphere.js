(() => {
  'use strict';
  if(!window.gsap||!window.ScrollTrigger)return;
  const pages=[...document.querySelectorAll('.page')];
  pages.forEach(page=>{
    const field=document.createElement('div');field.className='living-atmosphere';field.setAttribute('aria-hidden','true');
    field.innerHTML='<div class="atmosphere-light"></div><div class="atmosphere-light atmosphere-light--lower"></div>';
    page.prepend(field);
  });
  let media,ambient=[];
  function sync(){ambient.forEach(t=>document.hidden?t.pause():t.resume());}
  function mount(){
    media?.revert();ambient=[];media=gsap.matchMedia();
    media.add('(prefers-reduced-motion: no-preference) and (prefers-reduced-transparency: no-preference)',()=>{
      const page=document.querySelector('.page.active');if(!page)return;
      page.querySelectorAll('.atmosphere-light').forEach((light,i)=>{
        ambient.push(gsap.fromTo(light,{xPercent:i?3:-3,yPercent:-3},{xPercent:i?-3:3,yPercent:3,duration:20+i*5,ease:'sine.inOut',repeat:-1,yoyo:true}));
      });
      // Animate the atmosphere wrapper, not text, the orbit, covers or existing capture planes.
      gsap.fromTo(page.querySelector('.living-atmosphere'),{y:0},{y:32,ease:'none',scrollTrigger:{id:'atmosphere-scroll',trigger:page,start:'top top',end:'bottom bottom',scrub:.6}});
      sync();
    });
  }
  window.addEventListener('hashchange',()=>requestAnimationFrame(mount));
  document.addEventListener('visibilitychange',sync);
  mount();
})();
