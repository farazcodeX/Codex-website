(() => {
 'use strict';
 const stage=document.querySelector('.nb-book-stage'),books=[...stage.querySelectorAll('.nb-display-book')],label=document.querySelector('.nb-selected-book');
 const reduce=matchMedia('(prefers-reduced-motion: reduce)');let selected=1,context=null;
 function layout(animate=false){
  if(!document.querySelector('#page-neonbook.active'))return;
  const mobile=stage.clientWidth<700,spread=mobile?155:290;
  const render=()=>books.forEach((book,i)=>{
   const slot=((i-selected+4)%3)-1; // center chosen book; other two form the fan.
   const center=slot===0;
   book.style.zIndex=center?'3':'1';
   const vars={x:slot*spread,y:center?0:mobile?20:26,rotation:slot*(mobile?12:14),rotationY:slot*-9,scale:center?1:.84,duration:animate&&!reduce.matches?.75:0,ease:'power3.inOut',overwrite:true};
   if(window.gsap)gsap.to(book,vars);else book.style.transform=`translate(${vars.x}px,${vars.y}px) rotate(${vars.rotation}deg) scale(${vars.scale})`;
  });
  if(window.gsap){if(!context)context=gsap.context(()=>{},stage);context.add(render);}else render();
  label.textContent=books[selected].dataset.bookTitle;
 }
 function select(delta){selected=(selected+delta+books.length)%books.length;layout(true);}
 document.querySelector('.nb-book-prev').addEventListener('click',()=>select(-1));document.querySelector('.nb-book-next').addEventListener('click',()=>select(1));
 document.querySelector('.nb-library-controls').addEventListener('keydown',e=>{if(e.key==='ArrowLeft'||e.key==='ArrowRight'){e.preventDefault();select(e.key==='ArrowLeft'?-1:1);}});
 const old=window.__onRouteChange;
 window.__onRouteChange=function(route){if(old)old(route);if(context){context.revert();context=null;}if(route==='neonbook')requestAnimationFrame(()=>layout());};
 new ResizeObserver(()=>layout()).observe(stage);reduce.addEventListener('change',()=>layout());layout();
})();
