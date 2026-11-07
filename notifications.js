(() => {
  'use strict';
  const notice=document.createElement('aside');notice.className='construction-notice';notice.setAttribute('aria-label','Site notification');
  notice.innerHTML='<span class="construction-symbol" aria-hidden="true"><svg viewBox="0 0 24 24"><path d="M4 17h16M6 17l3-11h6l3 11M8 11h8M9 6l6 5M7 14l4 3M4 21v-4m16 4v-4"/></svg></span><div class="construction-status"></div><button class="construction-dismiss" type="button" aria-label="Dismiss notification" tabindex="-1"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="m6 6 12 12M18 6 6 18"/></svg></button>';
  document.body.append(notice);
  const announcer=document.createElement('div');announcer.className='construction-announcer';announcer.setAttribute('role','status');announcer.setAttribute('aria-live','polite');announcer.setAttribute('aria-atomic','true');document.body.append(announcer);
  const status=notice.querySelector('.construction-status'),close=notice.querySelector('button');
  let timer=0,remaining=4500,started=0,opener=null,visible=false;
  const paused=()=>notice.matches(':hover')||notice.contains(document.activeElement)||document.hidden;
  function pause(){if(timer){clearTimeout(timer);timer=0;remaining=Math.max(0,remaining-(performance.now()-started));}}
  function resume(){if(!visible||paused()||timer)return;started=performance.now();timer=setTimeout(()=>dismiss(false),remaining);}
  function dismiss(restore=true){pause();visible=false;notice.classList.remove('is-visible');close.tabIndex=-1;
    announcer.textContent='';
    if((restore&&notice.contains(document.activeElement))||document.activeElement===close){if(opener?.isConnected&&opener.getClientRects().length)opener.focus({preventScroll:true});else close.blur();}
  }
  function show(label='',trigger=document.activeElement){pause();opener=trigger;remaining=4500;visible=true;
    const title=document.createElement('strong');title.textContent='Under Construction';
    const copy=document.createElement('p');copy.textContent=label?label+' isn’t available yet. Please check back soon.':'This feature isn’t available yet. Please check back soon.';
    announcer.textContent=title.textContent+'. '+copy.textContent;
    status.replaceChildren(title,copy);close.tabIndex=0;notice.classList.add('is-visible');resume();
  }
  document.addEventListener('click',e=>{const target=e.target.closest('[data-unavailable]');if(!target)return;e.preventDefault();show(target.dataset.unavailable||target.textContent.trim(),target);});
  document.addEventListener('keydown',e=>{const target=e.target.closest('[data-unavailable]');if(target&&target.tagName!=='BUTTON'&&['Enter',' '].includes(e.key)){e.preventDefault();target.click();}else if(e.key==='Escape'&&visible){dismiss();}});
  close.addEventListener('click',()=>dismiss());
  notice.addEventListener('pointerenter',pause);notice.addEventListener('pointerleave',resume);
  notice.addEventListener('focusin',pause);notice.addEventListener('focusout',()=>requestAnimationFrame(resume));
  document.addEventListener('visibilitychange',()=>document.hidden?pause():resume());
  window.addEventListener('hashchange',()=>dismiss(false));
  window.CODEX=Object.assign(window.CODEX||{},{notifyUnavailable:show});
})();
