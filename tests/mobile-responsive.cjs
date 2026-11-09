/* Run with Playwright installed: node tests/premium-ui.cjs */
const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');
const assert = require('node:assert/strict');
const { chromium } = require('playwright');
const root = path.resolve(__dirname, '..');
const mime = {'.mp4':'video/mp4','.svg':'image/svg+xml','.html':'text/html', '.css':'text/css', '.js':'application/javascript', '.woff2':'font/woff2', '.jpg':'image/jpeg', '.png':'image/png'};
const server = http.createServer((req, res) => {
  const name = new URL(req.url, 'http://localhost').pathname;
  const file = path.join(root, name === '/' ? 'index.html' : name);
  fs.readFile(file, (error, data) => {
    res.writeHead(error ? 404 : 200, {'Content-Type': mime[path.extname(file)] || 'application/octet-stream'});
    res.end(error ? '' : data);
  });
});
(async () => {
  await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
  const browser = await chromium.launch({executablePath: process.env.CHROMIUM_PATH || '/usr/bin/chromium', args:['--no-sandbox']});
  try {
    const base = `http://127.0.0.1:${server.address().port}/`;
    // Mobile Chromium emulation, including Samsung's UA; this is not a native Samsung run.
    const profiles = [
      {width:320,height:640}, {width:360,height:800}, {width:390,height:844},
      {width:412,height:915}, {width:480,height:960}, {width:844,height:390},
      {width:412,height:915,userAgent:'Mozilla/5.0 (Linux; Android 14; SAMSUNG SM-S918B) AppleWebKit/537.36 (KHTML, like Gecko) SamsungBrowser/26.0 Chrome/122.0.0.0 Mobile Safari/537.36'}
    ];
    for(const profile of profiles){
      const {userAgent,...viewport}=profile;
      const page=await browser.newPage({viewport,isMobile:true,hasTouch:true,userAgent,reducedMotion:'reduce'});
      const errors=[];page.on('pageerror',e=>errors.push(e.message));
      await page.goto(base);await page.evaluate(()=>document.fonts.ready);
      for(const route of ['home','work','neonbook','about','contact']){
        await page.evaluate(r=>location.hash=r,route);await page.waitForTimeout(100);
        assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),`${route}: root overflow at ${viewport.width}`);
        for(const link of await page.locator('#nav .nav-link').all()){
          const r=await link.boundingBox();assert(r.x>=0 && r.x+r.width<=viewport.width+1 && r.height>=44,JSON.stringify({viewport,r,text:await link.textContent()}));
        }
        // Visit the complete page rather than just its first screen.
        await page.locator('.page.active').evaluate(async el=>{
          for(let y=0;y<el.offsetHeight;y+=innerHeight*.8){scrollTo(0,y);await new Promise(requestAnimationFrame);}
        });
        assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));
      }
      await page.evaluate(()=>location.hash='about');await page.waitForTimeout(100);
      assert.equal(await page.locator('.about-card:visible').count(),4);
      const slider=page.locator('#aboutSlider');await slider.scrollIntoViewIfNeeded();
      await slider.evaluate(e=>e.scrollLeft=e.scrollWidth);
      assert(await slider.evaluate(e=>e.scrollLeft>0));
      for(const card of await page.locator('.about-card-inner:visible').all()) assert(await card.evaluate(e=>e.scrollHeight<=e.clientHeight+1),'clipped About copy');
      await page.evaluate(()=>location.hash='neonbook');await page.waitForTimeout(100);
      assert.equal(await page.locator('.nb-shelf-book').count(),5);
      for(let i=0;i<5;i++){
        const book=page.locator('.nb-shelf-book').nth(i);
        await book.scrollIntoViewIfNeeded();
        const rect=await book.boundingBox();assert(rect.width>=44&&rect.height>=44);
        await book.tap();await page.waitForTimeout(50);
        assert(await page.locator('.nb-book-detail').evaluate(e=>e.open));
        await page.locator('.nb-book-detail').evaluate(e=>e.scrollTop=e.scrollHeight);
        const close=page.locator('.nb-detail-close');const r=await close.boundingBox();
        assert(r.y>=0&&r.y+r.height<=viewport.height,'close button remains reachable');
        await close.tap();await page.waitForTimeout(50);
        assert.equal(await page.locator('.nb-book-detail').evaluate(e=>e.open),false);
      }
      // Cross the breakpoint and return: no stale orbit transforms or 3D cover state.
      await page.setViewportSize({width:1100,height:800});await page.waitForTimeout(100);
      await page.setViewportSize(viewport);await page.waitForTimeout(100);
      assert(await page.locator('.nb-shelf-book').first().evaluate(e=>e.offsetWidth>=44));
      assert.deepEqual(errors,[]);await page.close();
      console.log('PASS mobile routes, swipe containers, five touch-open books, reachable close, orientation/breakpoint lifecycle',viewport);
    }

    const touch=await browser.newContext({viewport:{width:390,height:844},isMobile:true,hasTouch:true});
    const phone=await touch.newPage();await phone.goto(base+'#about');await phone.evaluate(()=>document.fonts.ready);
    const cdp=await touch.newCDPSession(phone);
    async function swipe(selector,horizontal){
      const el=phone.locator(selector);await el.scrollIntoViewIfNeeded();await phone.waitForTimeout(1100);
      const r=await el.boundingBox(),x=310,y=Math.max(120,Math.min(650,r.y+r.height/2));
      const before=await el.evaluate(e=>({x:e.scrollLeft,y:scrollY}));
      await cdp.send('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[{x,y}]});
      for(let i=1;i<=6;i++){
        await cdp.send('Input.dispatchTouchEvent',{type:'touchMove',touchPoints:[{x:x-(horizontal?i*35:0),y:y-(horizontal?0:i*35)}]});await phone.waitForTimeout(35);
      }
      await cdp.send('Input.dispatchTouchEvent',{type:'touchEnd',touchPoints:[]});await phone.waitForTimeout(700);
      const after=await el.evaluate(e=>({x:e.scrollLeft,y:scrollY}));
      assert(horizontal?after.x>before.x:after.y>before.y,`native ${horizontal?'horizontal':'vertical'} gesture on ${selector}`);
    }
    await swipe('#aboutSlider',true);await swipe('#aboutSlider',false);
    await phone.evaluate(()=>location.hash='neonbook');await phone.waitForTimeout(250);
    await swipe('.nb-shelf',true);await swipe('.nb-shelf',false);
    assert.equal(await phone.evaluate(()=>codexScroll.instance.isStopped),false);
    await touch.close();console.log('PASS native CDP horizontal/vertical touch gestures with animations enabled; no scroll locking');

  }finally{await browser.close();server.close();}
})().catch(e=>{console.error(e);server.close();process.exitCode=1;});
