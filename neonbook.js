(() => {
 'use strict';
 const data=[
  {title:'Hands-On Machine Learning with Scikit-Learn, Keras & TensorFlow',subject:'learning',label:'MACHINE LEARNING',file:'hands-on-machine-learning.png',color:'#f4f1e9',ink:'#343430',description:'Aurélien Géron’s practical introduction to machine learning with Scikit-Learn, Keras, and TensorFlow.'},
  {title:'Let’s Go!',subject:'development',label:'WEB DEVELOPMENT',file:'lets-go.jpg',color:'#233e47',ink:'#f5eee1',description:'Alex Edwards’s step-by-step guide to building web applications with Go.'},
  {title:'Eloquent JavaScript',subject:'development',label:'JAVASCRIPT',file:'eloquent-javascript.jpg',color:'#f3d32b',ink:'#24271d',description:'Marijn Haverbeke’s introduction to JavaScript, programming, and working with the web.'},
  {title:'Mastering Bug Bounty',subject:'security',label:'SECURITY',file:'mastering-bug-bounty.png',color:'#342b4f',ink:'#fff2e3',description:'A book selection focused on bug bounty research and discovering security vulnerabilities.'},
  {title:'Mathematics for Machine Learning',subject:'learning',label:'MATHEMATICS',file:'mathematics-for-machine-learning.png',color:'#e3e5e1',ink:'#282d31',description:'The mathematical foundations behind machine learning, from linear algebra to probability and optimization.'}
 ];
 const shelf=document.querySelector('.nb-shelf'),stage=shelf.querySelector('.nb-shelf-stage'),title=document.querySelector('.nb-selected-book'),subject=document.querySelector('.nb-selected-subject'),dialog=document.querySelector('.nb-book-detail'),image=dialog.querySelector('image'),circles=[...dialog.querySelectorAll('circle')];
 const reduce=matchMedia('(prefers-reduced-motion: reduce)'),fine=matchMedia('(pointer:fine)');
 let s=1,target=1,H=340,ws=44,d=236,gap=12,width=0,copies=0,nodes=[],raf=0,last=0,active=-1,route=false,inView=false,drag=null,suppressClick=false,hover=null,mx=0,my=0,tiltX=0,tiltY=0,wheelTimer=0,detailAnimations=[],inkFrame=0,opener=null,closing=false;
 const mod=(x,n)=>(x%n+n)%n,wrap=(x,n)=>mod(x+n/2,n)-n/2,smooth=x=>x*x*(3-2*x),pathFor=i=>'images/books/'+data[i].file;
 data.forEach((b,i)=>{const im=new Image();im.src=pathFor(i);});
 function build(){
  if(!route)return; width=shelf.clientWidth;H=width<700?Math.min(310,width*.68):Math.min(370,width*.29);ws=H*.14;d=H*.704;gap=H*.034;
  shelf.style.setProperty('--book-h',H+'px');shelf.style.setProperty('--book-w',d+'px');shelf.style.setProperty('--spine-w',ws+'px');
  const next=Math.max(5,Math.ceil((width+d*4)/(data.length*(ws+gap)))+2);
  if(next!==copies){copies=next;stage.replaceChildren();nodes=[];for(let v=0;v<copies*data.length;v++){
   const i=v%data.length,b=data[i],node=document.createElement('div');node.className='nb-shelf-book';node.dataset.virtual=v;node.style.setProperty('--spine-color',b.color);node.style.setProperty('--spine-ink',b.ink);
   const spine=document.createElement('div');spine.className='nb-face-spine';const small=document.createElement('small');small.textContent='NEONBOOK';const name=document.createElement('span');name.textContent=b.title;const category=document.createElement('small');category.textContent=b.label;spine.append(small,name,category);
   const cover=document.createElement('div');cover.className='nb-face-cover';const img=document.createElement('img');img.src=pathFor(i);img.alt='';img.draggable=false;if(i===0)cover.classList.add('nb-cover-ml');cover.append(img);node.append(spine,cover);stage.append(node);nodes.push({node,spine,cover,v,lift:0});
  }}render(0);sync();
 }
 function setCaption(i,dir){
  active=i;title.textContent=data[i].title;subject.textContent=data[i].label;
  if(!reduce.matches)title.animate([{transform:`translateY(${dir*110}%)`},{transform:'translateY(0)'}],{duration:600,easing:'cubic-bezier(.2,.8,.2,1)'});
  document.querySelectorAll('[data-subject]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.subject===data[i].subject)));
 }
 function render(dt){
  const total=nodes.length;if(!total)return;
  const ease=reduce.matches?1:1-Math.exp(-7*dt);tiltX+=(my-tiltX)*ease;tiltY+=(mx-tiltY)*ease;
  for(const item of nodes){const r=wrap(item.v-s,total),abs=Math.abs(r),o=smooth(Math.max(0,1-abs));const B=abs<1?(r+Math.sin(Math.PI*r)/Math.PI)/2:Math.sign(r)*.5;const x=r*(ws+gap)+(d-ws+1.6*gap)*B;
   if(Math.abs(x)>width/2+d*1.5){item.node.style.visibility='hidden';continue;}item.node.style.visibility='visible';const lift=hover===item.v&&abs>.5?1:0;item.lift+=(lift-item.lift)*(reduce.matches?1:1-Math.exp(-12*dt));
   item.node.style.transform=`translate3d(${x}px,${-o*H*.025-item.lift*H*.045}px,${o*H*.2}px) rotateZ(${-4.5*o}deg) rotateX(${tiltX*o}deg) rotateY(${-90*o+tiltY*o}deg)`;item.node.style.zIndex=Math.round(100-abs*4);item.spine.style.setProperty('--shade',o*.55);item.cover.style.setProperty('--shade',(1-o)*.5);
  }
  const i=mod(Math.round(s),data.length);if(i!==active)setCaption(i,Math.sign(target-s)||1);
 }
 function frame(now){const dt=Math.min((now-last)/1000||.016,.05);last=now;s+=(target-s)*(reduce.matches?1:1-Math.exp(-(drag?18:5.2)*dt));if(Math.abs(target-s)<.0001)s=target;if(Math.abs(s)>nodes.length*4){const shift=Math.floor(s/data.length)*data.length;s-=shift;target-=shift;}render(dt);raf=requestAnimationFrame(frame);}
 function sync(){cancelAnimationFrame(raf);raf=0;if(route&&inView&&!document.hidden&&!dialog.open){if(reduce.matches){s=target;render(0);}else{last=performance.now();raf=requestAnimationFrame(frame);}}}
 function move(delta){target=Math.round(target)+delta;if(reduce.matches){s=target;render(0);}sync();}
 document.querySelector('.nb-book-prev').addEventListener('click',()=>move(-1));document.querySelector('.nb-book-next').addEventListener('click',()=>move(1));
 document.querySelector('.nb-library-controls').addEventListener('keydown',e=>{if(e.key==='ArrowLeft'||e.key==='ArrowRight'){e.preventDefault();move(e.key==='ArrowLeft'?-1:1);}});
 document.querySelectorAll('[data-subject]').forEach(button=>button.addEventListener('click',()=>{const wanted=button.dataset.subject;let candidates=data.map((b,i)=>({b,i})).filter(x=>wanted==='all'?x.i===0:x.b.subject===wanted);candidates.sort((a,b)=>Math.abs(wrap(a.i-target,data.length))-Math.abs(wrap(b.i-target,data.length)));target+=wrap(candidates[0].i-target,data.length);target=Math.round(target);sync();}));
 shelf.addEventListener('pointerdown',e=>{if(e.button!==0)return;drag={id:e.pointerId,x:e.clientX,y:e.clientY,start:target,moved:false};shelf.setPointerCapture(e.pointerId);});
 shelf.addEventListener('pointermove',e=>{const r=shelf.getBoundingClientRect();const x=e.clientX-r.left-width/2,y=e.clientY-r.top-r.height/2;mx=fine.matches&&!reduce.matches?Math.max(-9,Math.min(9,x/(d*.55)*9)):0;my=fine.matches&&!reduce.matches?Math.max(-6,Math.min(6,-y/(H/2)*6)):0;const node=e.target.closest('[data-virtual]');hover=node?Number(node.dataset.virtual):null;if(drag&&e.pointerId===drag.id){const dx=e.clientX-drag.x;if(Math.abs(dx)>5)drag.moved=true;if(drag.moved){target=drag.start-dx/(ws+gap);if(reduce.matches){s=target;render(0);}}}});
 function end(e){if(!drag||e.pointerId!==drag.id)return;suppressClick=drag.moved;drag=null;target=Math.round(target);sync();}
 shelf.addEventListener('pointerup',end);shelf.addEventListener('pointercancel',end);shelf.addEventListener('lostpointercapture',end);shelf.addEventListener('pointerleave',()=>{hover=null;mx=my=0;});
 shelf.addEventListener('click',e=>{if(suppressClick){suppressClick=false;return;}const node=e.target.closest('[data-virtual]');if(!node)return;const r=wrap(Number(node.dataset.virtual)-s,nodes.length);if(Math.abs(r)<.5){openDetail(document.querySelector('.nb-book-open'));}else{target=Math.round(s+r);sync();}});
 // Preserve normal vertical page scrolling; horizontal wheel gestures scrub the shelf.
 shelf.addEventListener('wheel',e=>{if(dialog.open||Math.abs(e.deltaX)<=Math.abs(e.deltaY))return;e.preventDefault();target+=Math.max(-120,Math.min(120,e.deltaX))/(ws+gap)*.5;clearTimeout(wheelTimer);wheelTimer=setTimeout(()=>{target=Math.round(target);sync();},160);sync();},{passive:false});
 function cancelDetailAnimations(){detailAnimations.forEach(a=>a.cancel());detailAnimations=[];cancelAnimationFrame(inkFrame);}
 function openDetail(button){if(dialog.open)return;opener=button;target=Math.round(s);s=target;render(0);const i=mod(Math.round(s),data.length),book=data[i];dialog.querySelector('h2').textContent=book.title;dialog.querySelector('.nb-detail-subject').textContent=book.label;dialog.querySelector('.nb-detail-description').textContent=book.description;image.setAttribute('href',pathFor(i));circles.forEach(c=>c.setAttribute('r',reduce.matches?'1200':'0'));const chosen=nodes.reduce((best,x)=>Math.abs(wrap(x.v-s,nodes.length))<Math.abs(wrap(best.v-s,nodes.length))?x:best,nodes[0]);const r=chosen.cover.getBoundingClientRect();cancelDetailAnimations();dialog.showModal();sync();
  if(!reduce.matches){const inset=`inset(${Math.max(0,r.top)}px ${Math.max(0,innerWidth-r.right)}px ${Math.max(0,innerHeight-r.bottom)}px ${Math.max(0,r.left)}px round 4px)`;detailAnimations.push(dialog.animate([{clipPath:inset,transform:'rotate(-4.5deg)'},{clipPath:'inset(0px 0px 0px 0px)',transform:'rotate(0deg)'}],{duration:850,easing:'cubic-bezier(.76,0,.18,1)'}));dialog.querySelectorAll('.nb-detail-copy>*').forEach((el,j)=>detailAnimations.push(el.animate([{transform:'translateY(30px)',clipPath:'inset(100% 0 0)'},{transform:'translateY(0)',clipPath:'inset(0 0 0)'}],{duration:700,delay:400+j*65,easing:'cubic-bezier(.2,.8,.2,1)',fill:'backwards'})));const start=performance.now()+350;const ink=now=>{circles.forEach((c,j)=>{const p=Math.max(0,Math.min(1,(now-start-j*90)/1100));c.setAttribute('r',String(1200*(1-(1-p)**3)));});if(now<start+1700)inkFrame=requestAnimationFrame(ink);};inkFrame=requestAnimationFrame(ink);}
 }
 function closeDetail(){
  if(!dialog.open||closing)return;
  if(reduce.matches){dialog.close();return;}
  closing=true;cancelDetailAnimations();const chosen=nodes.reduce((best,x)=>Math.abs(wrap(x.v-s,nodes.length))<Math.abs(wrap(best.v-s,nodes.length))?x:best,nodes[0]);const r=chosen.cover.getBoundingClientRect();const a=dialog.animate([{clipPath:'inset(0px 0px 0px 0px)',transform:'rotate(0deg)'},{clipPath:`inset(${Math.max(0,r.top)}px ${Math.max(0,innerWidth-r.right)}px ${Math.max(0,innerHeight-r.bottom)}px ${Math.max(0,r.left)}px round 4px)`,transform:'rotate(-4.5deg)'}],{duration:650,easing:'cubic-bezier(.76,0,.18,1)'});detailAnimations.push(a);a.finished.then(()=>{if(dialog.open)dialog.close();}).catch(()=>{});
 }
 dialog.addEventListener('cancel',e=>{e.preventDefault();closeDetail();});
 document.querySelector('.nb-book-open').addEventListener('click',e=>openDetail(e.currentTarget));dialog.querySelector('.nb-detail-close').addEventListener('click',closeDetail);dialog.addEventListener('close',()=>{closing=false;cancelDetailAnimations();if(opener&&route)opener.focus({preventScroll:true});sync();});
 const old=window.__onRouteChange;window.__onRouteChange=function(next){if(old)old(next);route=next==='neonbook';drag=null;if(!route){clearTimeout(wheelTimer);if(dialog.open)dialog.close();mx=my=0;}if(route)requestAnimationFrame(build);sync();};
 new ResizeObserver(()=>{if(route)build();}).observe(shelf);new IntersectionObserver(es=>{inView=es[0].isIntersecting;sync();},{threshold:.05}).observe(shelf);document.addEventListener('visibilitychange',sync);reduce.addEventListener('change',()=>{mx=my=tiltX=tiltY=0;cancelDetailAnimations();if(dialog.open)circles.forEach(c=>c.setAttribute('r','1200'));sync();});route=!!document.querySelector('#page-neonbook.active');if(route)build();
})();
