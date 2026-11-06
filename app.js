const SITE_LINKS = Object.freeze({github:'https://github.com/farazcodeX',linkedin:'',telegram:'',instagram:'',email:''});
(() => {
'use strict';
const routes=['home','work','neonbook','about','contact'];
const menu=document.getElementById('mobile-menu'),toggle=document.querySelector('.menu-toggle');
document.querySelectorAll('[data-site-link]').forEach(original=>{let a=original;const value=SITE_LINKS[a.dataset.siteLink];if(value){if(a.tagName!=='A'){const link=document.createElement('a');for(const attr of a.attributes)link.setAttribute(attr.name,attr.value);link.innerHTML=a.innerHTML;a.replaceWith(link);a=link;}a.href=a.dataset.siteLink==='email'?'mailto:'+value:value;}else{a.removeAttribute('href');a.setAttribute('aria-disabled','true');a.setAttribute('tabindex','0');a.classList.add('is-disabled');a.title='Link coming soon';a.addEventListener('click',e=>e.preventDefault());}});
toggle.addEventListener('click',()=>{menu.showModal();toggle.setAttribute('aria-expanded','true');});
document.querySelector('.menu-close').addEventListener('click',()=>menu.close());
menu.addEventListener('close',()=>{toggle.setAttribute('aria-expanded','false');toggle.focus({preventScroll:true});});
menu.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>menu.close()));
let context;
function navigate(){
const route=location.hash.slice(1).split('/')[0]||'home',current=routes.includes(route)?route:'home';
context?.revert();
document.querySelectorAll('.page').forEach(p=>p.classList.toggle('active',p.id==='page-'+current));
document.querySelectorAll('a[href^="#"]').forEach(a=>{if(a.getAttribute('href')==='#'+current)a.setAttribute('aria-current','page');else a.removeAttribute('aria-current');});
document.title=current==='home'?'CODEX — Faraz Nourinia':current[0].toUpperCase()+current.slice(1)+' — CODEX';
scrollTo(0,0);const page=document.getElementById('page-'+current),heading=page.querySelector('h1');heading.tabIndex=-1;heading.focus({preventScroll:true});
window.__onRouteChange?.(current);
if(window.gsap&&window.ScrollTrigger){gsap.registerPlugin(ScrollTrigger);context=gsap.matchMedia();context.add('(prefers-reduced-motion: no-preference)',()=>{page.querySelectorAll('.home-card,.work-card,.about-grid article').forEach(el=>{gsap.from(el,{y:16,duration:.7,ease:'power2.out',scrollTrigger:{trigger:el,start:'top 96%',once:true}});});});ScrollTrigger.refresh();}
}
window.addEventListener('hashchange',navigate);navigate();
document.querySelector('.skip-link').addEventListener('click',e=>{e.preventDefault();document.getElementById('main').focus();});
})();
