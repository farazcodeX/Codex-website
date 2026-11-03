(() => {
  'use strict';
  const motion = matchMedia('(prefers-reduced-motion: reduce)');
  const dialog = document.getElementById('project-lightbox');
  let opener;
  document.querySelectorAll('[data-capture]').forEach(button => {
    button.addEventListener('click', () => {
      opener = button;
      const img = dialog.querySelector('img');
      img.src = button.dataset.capture;
      img.alt = button.querySelector('img').alt;
      dialog.querySelector('p').textContent = button.dataset.caption;
      dialog.showModal();
    });
  });
  dialog.querySelector('button').addEventListener('click', () => dialog.close());
  dialog.addEventListener('click', e => { if (e.target === dialog) { const r = dialog.getBoundingClientRect(); if(e.clientX < r.left || e.clientX > r.right || e.clientY < r.top || e.clientY > r.bottom) dialog.close(); } });
  dialog.addEventListener('close', () => { if(opener?.closest('.page.active')) opener.focus({preventScroll:true}); });
  window.addEventListener('hashchange', () => {if(dialog.open) dialog.close();});
  document.querySelector('.work-jump').addEventListener('click', e => {e.preventDefault();document.getElementById('selected-projects').scrollIntoView({behavior:motion.matches?'instant':'smooth',block:'start'});});

  // Native DOM screenshots stay readable; only the image plane responds to the pointer.
  if(window.gsap) {
    const mm = gsap.matchMedia();
    mm.add('(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)', () => {
      const cleanup = [];
      document.querySelectorAll('.capture-open').forEach(el => {
        const x = gsap.quickTo(el,'rotationX',{duration:.6,ease:'power3.out'});
        const y = gsap.quickTo(el,'rotationY',{duration:.6,ease:'power3.out'});
        const move = e => {const r=el.getBoundingClientRect();x((.5-(e.clientY-r.top)/r.height)*3);y(((e.clientX-r.left)/r.width-.5)*4);};
        const leave = () => {x(0);y(0);};
        el.addEventListener('pointermove',move);el.addEventListener('pointerleave',leave);
        cleanup.push(()=>{el.removeEventListener('pointermove',move);el.removeEventListener('pointerleave',leave);});
      });
      return ()=>cleanup.forEach(fn=>fn());
    });
  }
  // Original particle study, not a copied MotionSites component. It only runs in view.
  const canvas=document.querySelector('.work-particles'),ctx=canvas.getContext('2d');
  let width=0,height=0,raf=0,last=0,time=0,visible=false,pointer=null;
  function size(){const r=canvas.getBoundingClientRect();if(!r.width||!r.height)return;width=r.width;height=r.height;const dpr=Math.min(devicePixelRatio,2);canvas.width=width*dpr;canvas.height=height*dpr;ctx.setTransform(dpr,0,0,dpr,0,0);draw();}
  function draw(){ctx.clearRect(0,0,width,height);for(let i=0;i<280;i++){const a=i*2.39996, radius=Math.sqrt(i/280)*Math.min(width,height)*.43;let x=width*.53+Math.cos(a)*radius*1.12,y=height*.48+Math.sin(a)*radius*.67+Math.sin(a*2+time*.5)*12;if(pointer&&!motion.matches){const dx=x-pointer.x,dy=y-pointer.y,d=Math.hypot(dx,dy);if(d>0&&d<85){x+=dx/d*(85-d)*.18;y+=dy/d*(85-d)*.18;}}ctx.beginPath();ctx.fillStyle=i%7===0?'rgba(68,91,161,.6)':'rgba(125,139,175,.36)';ctx.arc(x,y,i%7===0?1.9:1.2,0,Math.PI*2);ctx.fill();}}
  function tick(now){time+=Math.min((now-last)/1000,.05);last=now;draw();raf=requestAnimationFrame(tick);}
  function sync(){cancelAnimationFrame(raf);raf=0;if(visible&&document.querySelector('#page-work.active')&&!document.hidden){size();if(!motion.matches){last=performance.now();raf=requestAnimationFrame(tick);}}}
  new IntersectionObserver(entries=>{visible=entries[0].isIntersecting;sync();},{threshold:.05}).observe(canvas);
  new ResizeObserver(size).observe(canvas);
  canvas.addEventListener('pointermove',e=>{const r=canvas.getBoundingClientRect();pointer={x:e.clientX-r.left,y:e.clientY-r.top};});
  canvas.addEventListener('pointerleave',()=>{pointer=null;});
  document.addEventListener('visibilitychange',sync);window.addEventListener('hashchange',()=>requestAnimationFrame(sync));motion.addEventListener('change',sync);
})();
