(() => {
 'use strict';
 const data=[
  {title:'Hands-On Machine Learning with Scikit-Learn, Keras & TensorFlow',subject:'learning',label:'MACHINE LEARNING',file:'hands-on-machine-learning.png',color:'#f4f1e9',ink:'#343430',description:'Aurélien Géron’s practical introduction to machine learning with Scikit-Learn, Keras, and TensorFlow.'},
  {title:'Let’s Go!',subject:'development',label:'WEB DEVELOPMENT',file:'lets-go.jpg',color:'#233e47',ink:'#f5eee1',description:'Alex Edwards’s step-by-step guide to building web applications with Go.'},
  {title:'Eloquent JavaScript',subject:'development',label:'JAVASCRIPT',file:'eloquent-javascript.jpg',color:'#f3d32b',ink:'#24271d',description:'Marijn Haverbeke’s introduction to JavaScript, programming, and working with the web.'},
  {title:'Mastering Bug Bounty',subject:'security',label:'SECURITY',file:'mastering-bug-bounty.png',color:'#342b4f',ink:'#fff2e3',description:'A book selection focused on bug bounty research and discovering security vulnerabilities.'},
  {title:'Mathematics for Machine Learning',subject:'learning',label:'MATHEMATICS',file:'mathematics-for-machine-learning.png',color:'#e3e5e1',ink:'#282d31',description:'The mathematical foundations behind machine learning, from linear algebra to probability and optimization.'}
 ];
 const shelf=document.querySelector('.nb-shelf'),stage=shelf.querySelector('.nb-shelf-stage'),dialog=document.querySelector('.nb-book-detail'),image=dialog.querySelector('image'),circles=[...dialog.querySelectorAll('circle')];
 const reduce=matchMedia('(prefers-reduced-motion: reduce)'),fine=matchMedia('(pointer:fine)');
 const gradients=[['#e6d5bd','#f8f2e9'],['#bad5d3','#eff5f2'],['#f3df8b','#fff9e9'],['#cfc0e5','#f4f0f8'],['#a8d6d6','#edf5f2']];
 let s=2,target=2,H=340,ws=44,d=236,gap=24,width=0,nodes=[],raf=0,last=0,route=false,inView=false,hover=null,mx=0,my=0,tiltX=0,tiltY=0,drift=0,detailAnimations=[],inkFrame=0,opener=null,closing=false;
 const smooth=x=>x*x*(3-2*x),pathFor=i=>'images/books/'+data[i].file,clamp=x=>Math.max(0,Math.min(data.length-1,x));
 function build(){
  if(!route)return;width=shelf.clientWidth;H=width<700?Math.min(290,width*.52):Math.min(390,width*.31);ws=H*.14;d=H*.704;gap=H*(width<700?.065:.08);
  shelf.style.setProperty('--book-h',H+'px');shelf.style.setProperty('--book-w',d+'px');shelf.style.setProperty('--spine-w',ws+'px');
  if(!nodes.length)data.forEach((b,i)=>{
   const node=document.createElement('button');node.type='button';node.className='nb-shelf-book';node.dataset.book=i;node.setAttribute('aria-label','Explore '+b.title);node.style.setProperty('--spine-color',b.color);node.style.setProperty('--spine-ink',b.ink);
   const spine=document.createElement('div');spine.className='nb-face-spine';spine.setAttribute('aria-hidden','true');const small=document.createElement('small');small.textContent='NEONBOOK';const name=document.createElement('span');name.textContent=b.title;const category=document.createElement('small');category.textContent=b.label;spine.append(small,name,category);
   const cover=document.createElement('div');cover.className='nb-face-cover';cover.setAttribute('aria-hidden','true');const img=document.createElement('img');img.src=pathFor(i);img.alt='';img.draggable=false;if(i===0)cover.classList.add('nb-cover-ml');cover.append(img);node.append(spine,cover);stage.append(node);nodes.push({node,spine,cover,i,lift:0});
   node.addEventListener('pointerenter',()=>{hover=i;sync();});node.addEventListener('pointerleave',()=>{hover=null;});
   node.addEventListener('focus',()=>{target=i;if(reduce.matches)s=target;render(0);sync();});
   node.addEventListener('click',()=>{if(Math.abs(s-i)<.2)openDetail(node,i);else{target=i;if(reduce.matches)s=target;render(0);sync();}});
  });render(0);sync();
 }
 function render(dt){
  const ease=reduce.matches?1:1-Math.exp(-7*dt);tiltX+=(my-tiltX)*ease;tiltY+=(mx-tiltY)*ease;drift+=((fine.matches&&!reduce.matches?mx*2:0)-drift)*ease;
  for(const item of nodes){const r=item.i-s,abs=Math.abs(r),o=smooth(Math.max(0,1-abs)),B=abs<1?(r+Math.sin(Math.PI*r)/Math.PI)/2:Math.sign(r)*.5;const x=(item.i-2)*(ws+gap)+(d-ws+gap)*B+drift;
   item.lift+=((hover===item.i?1:0)-item.lift)*(reduce.matches?1:1-Math.exp(-12*dt));
   item.node.style.transform=`translate3d(${x}px,${-o*H*.025-item.lift*H*.035}px,${o*H*.15}px) rotateZ(${-3*o}deg) rotateX(${tiltX*(.2+.8*o)}deg) rotateY(${-90*o+tiltY*o}deg)`;item.node.style.zIndex=Math.round(100-abs*4);item.spine.style.setProperty('--shade',o*.45);item.cover.style.setProperty('--shade',(1-o)*.35);
  }
 }
 function frame(now){const dt=Math.min((now-last)/1000||.016,.05);last=now;s+=(target-s)*(1-Math.exp(-6*dt));if(Math.abs(target-s)<.0001)s=target;render(dt);raf=requestAnimationFrame(frame);}
 function sync(){cancelAnimationFrame(raf);raf=0;if(route&&inView&&!document.hidden&&!dialog.open){if(reduce.matches){s=target;render(0);}else{last=performance.now();raf=requestAnimationFrame(frame);}}}
 stage.addEventListener('keydown',e=>{if(!['ArrowLeft','ArrowRight','Home','End'].includes(e.key))return;e.preventDefault();const index=e.key==='Home'?0:e.key==='End'?4:clamp(target+(e.key==='ArrowLeft'?-1:1));nodes[index].node.focus();});
 shelf.addEventListener('pointermove',e=>{if(!fine.matches||reduce.matches)return;const r=shelf.getBoundingClientRect(),x=(e.clientX-r.left)/width-.5,y=(e.clientY-r.top)/r.height-.5;mx=x*12;my=-y*8;sync();});
 shelf.addEventListener('pointerleave',()=>{mx=my=0;hover=null;sync();});
 function cancelDetailAnimations(){detailAnimations.forEach(a=>a.cancel());detailAnimations=[];cancelAnimationFrame(inkFrame);}
 function openDetail(button,i){if(dialog.open)return;opener=button;target=i;s=i;render(0);const book=data[i];dialog.querySelector('h2').textContent=book.title;dialog.querySelector('.nb-detail-subject').textContent=book.label;dialog.querySelector('.nb-detail-description').textContent=book.description;dialog.style.setProperty('--book-glow',gradients[i][0]);dialog.style.setProperty('--book-paper',gradients[i][1]);dialog.dataset.book=i;image.setAttribute('href',pathFor(i));circles.forEach(c=>c.setAttribute('r',reduce.matches?'1200':'0'));const r=nodes[i].cover.getBoundingClientRect();cancelDetailAnimations();dialog.showModal();sync();
  if(!reduce.matches){const inset=`inset(${Math.max(0,r.top)}px ${Math.max(0,innerWidth-r.right)}px ${Math.max(0,innerHeight-r.bottom)}px ${Math.max(0,r.left)}px round 4px)`;detailAnimations.push(dialog.animate([{clipPath:inset,transform:'rotate(-3deg)'},{clipPath:'inset(0px)',transform:'rotate(0deg)'}],{duration:850,easing:'cubic-bezier(.76,0,.18,1)'}));dialog.querySelectorAll('.nb-detail-copy>*').forEach((el,j)=>detailAnimations.push(el.animate([{transform:'translateY(30px)',clipPath:'inset(100% 0 0)'},{transform:'translateY(0)',clipPath:'inset(0)'}],{duration:700,delay:400+j*65,easing:'cubic-bezier(.2,.8,.2,1)',fill:'backwards'})));const start=performance.now()+350;const ink=now=>{circles.forEach((c,j)=>{const p=Math.max(0,Math.min(1,(now-start-j*90)/1100));c.setAttribute('r',String(1200*(1-(1-p)**3)));});if(now<start+1700)inkFrame=requestAnimationFrame(ink);};inkFrame=requestAnimationFrame(ink);}
 }
 function closeDetail(){if(!dialog.open||closing)return;if(reduce.matches){dialog.close();return;}closing=true;cancelDetailAnimations();const r=nodes[target].cover.getBoundingClientRect();const a=dialog.animate([{clipPath:'inset(0px)',transform:'rotate(0deg)'},{clipPath:`inset(${Math.max(0,r.top)}px ${Math.max(0,innerWidth-r.right)}px ${Math.max(0,innerHeight-r.bottom)}px ${Math.max(0,r.left)}px round 4px)`,transform:'rotate(-3deg)'}],{duration:650,easing:'cubic-bezier(.76,0,.18,1)'});detailAnimations.push(a);a.finished.then(()=>{if(dialog.open)dialog.close();}).catch(()=>{});}
 dialog.addEventListener('cancel',e=>{e.preventDefault();closeDetail();});dialog.querySelector('.nb-detail-close').addEventListener('click',closeDetail);dialog.addEventListener('close',()=>{closing=false;cancelDetailAnimations();if(opener&&route)opener.focus({preventScroll:true});sync();});
 const old=window.__onRouteChange;window.__onRouteChange=function(next){if(old)old(next);route=next==='neonbook';if(!route){if(dialog.open)dialog.close();mx=my=0;}if(route)requestAnimationFrame(build);sync();};
 new ResizeObserver(()=>{if(route)build();}).observe(shelf);new IntersectionObserver(es=>{inView=es[0].isIntersecting;sync();},{threshold:.05}).observe(shelf);document.addEventListener('visibilitychange',sync);reduce.addEventListener('change',()=>{mx=my=tiltX=tiltY=0;cancelDetailAnimations();if(dialog.open)circles.forEach(c=>c.setAttribute('r','1200'));sync();});route=!!document.querySelector('#page-neonbook.active');if(route)build();
})();

(() => {
 const video=document.querySelector('.nb-platform-video');
 if(!video)return;
 const pause=()=>{if(document.hidden||!video.closest('.page.active'))video.pause();};
 document.addEventListener('visibilitychange',pause);
 window.addEventListener('hashchange',pause);
 new IntersectionObserver(entries=>{if(!entries[0].isIntersecting)video.pause();},{threshold:0}).observe(video);
})();
