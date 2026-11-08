(() => {
  'use strict';
  const journey=document.querySelector('.hero-journey');
  if(!journey||!window.gsap||!window.ScrollTrigger)return;
  gsap.registerPlugin(ScrollTrigger);
  const stage=journey.querySelector('.cosmic-stage'),copy=journey.querySelector('.cosmic-copy');
  const space=journey.querySelector('.hero-bg-layer'),haze=journey.querySelector('.hero-space-haze');
  const dawn=journey.querySelector('.hero-dawn'),day=journey.querySelector('.hero-daylight');
  const nextHeading=document.querySelector('#page-home .hero-next-heading');
  let media=null,ambient=null,transition=null;
  function syncAmbient(){
    if(!ambient)return;
    const inScene=transition&&transition.scrollTrigger.progress<1;
    if(document.hidden||!inScene)ambient.pause();else ambient.resume();
  }
  function mount(){
    media?.revert();ambient=transition=null;
    journey.classList.remove('is-scroll-scene');copy.inert=false;
    if(!journey.closest('.page.active'))return;
    media=gsap.matchMedia();
    media.add('(prefers-reduced-motion: no-preference)',()=>{
      journey.classList.add('is-scroll-scene');
      // One scroll-driven timeline owns the transition layers and copy wrapper.
      transition=gsap.timeline({defaults:{ease:'none'},scrollTrigger:{
        id:'home-space-to-light',trigger:journey,start:'top top',
        end:()=>'+='+Math.max(1,journey.offsetHeight-stage.offsetHeight),
        scrub:true,invalidateOnRefresh:true,
        onUpdate:self=>{copy.inert=self.progress>=.5;syncAmbient();},
        onRefresh:self=>{copy.inert=self.progress>=.5;}
      }});
      transition.addLabel('space',0)
        .to(copy,{autoAlpha:0,y:-18,duration:.28,ease:'power1.in'},.12)
        .to(space,{opacity:0,scale:1.035,duration:.72},.18)
        .fromTo(dawn,{opacity:0,yPercent:12},{opacity:.85,yPercent:0,duration:.55},.18)
        .to(day,{opacity:1,duration:.68,ease:'sine.inOut'},.3)
        .to(dawn,{opacity:0,duration:.16},.84)
        .addLabel('daylight',1);
      if(nextHeading)transition.fromTo(nextHeading,{autoAlpha:0,y:20},{autoAlpha:1,y:0,duration:.22,ease:'power1.out'},.78);
      ambient=gsap.fromTo(haze,{xPercent:-2,scale:1},{xPercent:2,scale:1.04,duration:24,ease:'sine.inOut',repeat:-1,yoyo:true});
      syncAmbient();
      return ()=>{journey.classList.remove('is-scroll-scene');copy.inert=false;};
    });
    window.codexScroll?.resize();
  }
  let frame;
  function schedule(){cancelAnimationFrame(frame);frame=requestAnimationFrame(mount);}
  window.addEventListener('hashchange',schedule);
  document.addEventListener('visibilitychange',syncAmbient);
  document.fonts.ready.then(schedule);
  window.addEventListener('load',()=>ScrollTrigger.refresh(),{once:true});
  schedule();
})();
