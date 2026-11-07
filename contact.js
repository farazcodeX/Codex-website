(() => {
 'use strict';
 const stage=document.querySelector('.contact-stage'),layer=stage.querySelector('.contact-underneath'),outline=stage.querySelector('.tear-outline path');
 const reduce=matchMedia('(prefers-reduced-motion: reduce)'),fine=matchMedia('(hover: hover) and (pointer: fine)');
 const state={x:0,y:0,r:0};let width=0,height=0,tween=null;
 function paint(){
  if(state.r<.5){layer.style.clipPath='polygon(0 0,0 0,0 0)';outline.setAttribute('d','');return;}
  const points=[];for(let i=0;i<64;i++){const a=i/64*Math.PI*2;const rough=1+Math.sin(i*2.7)*.035+Math.cos(i*1.3)*.025;points.push([state.x+Math.cos(a)*state.r*rough,state.y+Math.sin(a)*state.r*.78*rough]);}
  layer.style.clipPath='polygon('+points.map(p=>p.map(n=>n.toFixed(1)+'px').join(' ')).join(',')+')';outline.setAttribute('d','M'+points.map(p=>p.map(n=>n.toFixed(1)).join(',')).join('L')+'Z');
 }
 function animate(vars){if(tween)tween.kill();if(reduce.matches||!window.gsap){Object.assign(state,vars);paint();return;}tween=gsap.to(state,{...vars,duration:.55,ease:'power3.out',onUpdate:paint});}
 function size(){const r=stage.getBoundingClientRect();width=r.width;height=r.height;if(!state.x){state.x=width/2;state.y=height/2;}paint();}
 stage.addEventListener('pointermove',e=>{if(!fine.matches||reduce.matches)return;const r=stage.getBoundingClientRect();animate({x:e.clientX-r.left,y:e.clientY-r.top,r:Math.min(width*.29,300)});});
 stage.addEventListener('pointerleave',e=>{if(e.pointerType==='mouse')animate({r:0});});
 stage.addEventListener('pointerdown',e=>{if(!fine.matches&&!reduce.matches){const r=stage.getBoundingClientRect();animate({x:e.clientX-r.left,y:e.clientY-r.top,r:Math.min(width*.6,300)});}});
 window.addEventListener('hashchange',()=>{if(!document.querySelector('#page-contact.active')){if(tween)tween.kill();state.r=0;paint();}});
 reduce.addEventListener('change',()=>{if(tween)tween.kill();state.r=0;paint();});
 new ResizeObserver(size).observe(stage);
})();
