(() => {
  'use strict';
  if (!window.gsap || !window.ScrollTrigger) return;
  gsap.registerPlugin(ScrollTrigger);
  if(window.SplitText) gsap.registerPlugin(SplitText);
  // One owner per transform: do not select books, orbit cards, captures or flip faces.
  const selector = '#page-home .exhibit-item, .selected-project, .about-academic, .about-work-pointer, .page .mf-statement-wrap';
  document.querySelectorAll(selector).forEach(el => el.classList.add('motion-owned'));
  let media;
  function mount() {
    media?.revert();
    media = gsap.matchMedia();
    media.add('(prefers-reduced-motion: no-preference)', () => {
      const page = document.querySelector('.page.active');
      if (!page) return;
      const splits = [];
      // Word masks preserve readable phrases and the original accessible heading name.
      if (window.SplitText) page.querySelectorAll('.section-head:not(.hero-next-heading) h2,.selected-work-heading h1,.about-hero h1,.about-academic h2,.nb-section-head h2').forEach(heading => {
        heading.classList.add('motion-words');
        const split = SplitText.create(heading, {
          type:'words', mask:'words', wordsClass:'split-word', aria:'auto',
          onSplit(self) {
            self.masks.forEach(mask => mask.classList.add('motion-word-mask'));
            return gsap.fromTo(self.words,{yPercent:65,opacity:0},{
              yPercent:0,opacity:1,duration:1.05,stagger:.035,ease:'power3.out',
              scrollTrigger:{id:'premium-type',trigger:heading,start:'top 92%',once:true}
            });
          }
        });
        splits.push(split);
      });
      page.querySelectorAll('.motion-owned').forEach((el, index) => {
        gsap.fromTo(el, {y: 18, opacity: .35}, {
          y: 0, opacity: 1, duration: 1.05, ease: 'power3.out',
          scrollTrigger: {id: `premium-${index}`, trigger: el, start: 'top 94%', once: true},
          onComplete: () => gsap.set(el, {clearProps: 'transform,opacity'})
        });
      });
      // Framing is tied to real scroll distance; image tilt and hover keep their own child.
      page.querySelectorAll('.exhibit-frame').forEach(frame => {
        gsap.fromTo(frame,{clipPath:'inset(4% 2% 4% 2% round 28px)'},{clipPath:'inset(0% 0% 0% 0% round 28px)',ease:'none',
          scrollTrigger:{id:'premium-frame',trigger:frame,start:'top 96%',end:'top 35%',scrub:1}});
      });
      page.querySelectorAll('.selected-project').forEach(project => {
        const parts=project.querySelectorAll('.project-kicker,h2,.project-tagline,.project-description,.project-actions');
        gsap.from(parts,{y:14,opacity:0,stagger:.06,duration:.9,ease:'power3.out',
          scrollTrigger:{id:'premium-project',trigger:project,start:'top 85%',once:true}});
      });
      return () => {splits.forEach(split=>split.revert());document.querySelectorAll('.motion-words').forEach(el=>el.classList.remove('motion-words'));};
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
