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
    const page = await browser.newPage({viewport:{width:1440,height:1000}});
    const errors = [], failed = [];
    page.on('pageerror', e => errors.push(e.message));
    page.on('response', r => {if (r.status() >= 400) failed.push(r.url());});
    await page.goto(`http://127.0.0.1:${server.address().port}/#home`);
    await page.evaluate(()=>document.fonts.ready);await page.waitForFunction(()=>!!ScrollTrigger.getById('home-space-to-light'));
    await page.waitForTimeout(700);
    assert.equal(await page.locator('.home-hero .id-card,.home-hero .caption').count(),0);
    assert.equal(await page.locator('.cosmic-copy a').count(),2);
    assert.equal(await page.locator('.cosmic-copy h1').innerText(),'CODEX');
    const sample=async p=>{await page.evaluate(progress=>{const st=ScrollTrigger.getById('home-space-to-light');codexScroll.instance.scrollTo(st.start+(st.end-st.start)*progress,{immediate:true,force:true});ScrollTrigger.update();},p);await page.waitForTimeout(100);return await page.evaluate(()=>({day:+getComputedStyle(document.querySelector('.hero-daylight')).opacity,space:+getComputedStyle(document.querySelector('.hero-bg-layer')).opacity,copy:+getComputedStyle(document.querySelector('.cosmic-copy')).opacity,top:document.querySelector('.cosmic-stage').getBoundingClientRect().top}));};
    const snapshots=[];
    for(const progress of [0,.2,.4,.6,.8,1]){snapshots.push(await sample(progress));await page.screenshot({path:'/tmp/cosmic-'+Math.round(progress*100)+'.png'});}
    console.log('scroll states',snapshots);
    assert(snapshots[0].day<.01&&snapshots[5].day>.99);
    assert(snapshots[0].space>.99&&snapshots[5].space<.01);
    for(let i=1;i<snapshots.length;i++){assert(snapshots[i].day>=snapshots[i-1].day);assert(Math.abs(snapshots[i].top)<2,'sticky scene moved');}
    await sample(.4);const reverse=await sample(0);assert(reverse.day<.01&&reverse.copy>.99);
    for(const width of [320,390,768,1024,1440]){
      await page.setViewportSize({width,height:900});await page.waitForTimeout(300);await page.evaluate(()=>ScrollTrigger.refresh());await sample(0);
      assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),'overflow '+width);
      const copy=page.locator('.cosmic-copy');assert(await copy.evaluate(e=>e.scrollWidth<=e.clientWidth+1));
      await page.screenshot({path:'/tmp/cosmic-width-'+width+'.png'});
    }
    await page.locator('.hero-actions a[href="#work"]').focus();await page.keyboard.press('Enter');await page.waitForTimeout(150);assert.equal(await page.evaluate(()=>location.hash),'#work');assert.equal(await page.evaluate(()=>ScrollTrigger.getById('home-space-to-light')),undefined);
    for(let i=0;i<3;i++){await page.evaluate(()=>location.hash='home');await page.waitForTimeout(150);assert.equal(await page.evaluate(()=>ScrollTrigger.getAll().filter(t=>t.vars.id==='home-space-to-light').length),1);await page.evaluate(()=>location.hash='contact');await page.waitForTimeout(150);assert.equal(await page.evaluate(()=>ScrollTrigger.getAll().filter(t=>t.vars.id==='home-space-to-light').length),0);}
    await page.emulateMedia({reducedMotion:'reduce'});await page.evaluate(()=>location.hash='home');await page.waitForTimeout(150);assert.equal(await page.locator('.hero-journey.is-scroll-scene').count(),0);assert(await page.locator('.cosmic-copy').isVisible());
    assert.equal(await page.evaluate(()=>ScrollTrigger.getById('home-space-to-light')),undefined);
    await page.emulateMedia({reducedMotion:'no-preference'});await page.waitForTimeout(200);assert(await page.evaluate(()=>!!ScrollTrigger.getById('home-space-to-light')));
    await page.setViewportSize({width:1440,height:900});await page.waitForTimeout(300);await sample(0);
    await page.mouse.move(100,400);let progress=0;
    for(let i=0;i<6;i++){await page.mouse.wheel(0,18);await page.waitForTimeout(40);const next=await page.evaluate(()=>ScrollTrigger.getById('home-space-to-light').progress);assert(next>=progress);progress=next;}
    assert(progress>0,'small wheel/trackpad-like deltas did not advance the scene');
    await page.mouse.wheel(0,2200);await page.waitForTimeout(1300);assert(await page.locator('.hero-daylight').evaluate(e=>+getComputedStyle(e).opacity>.99));
    await page.mouse.wheel(0,-5000);await page.waitForTimeout(1300);assert(await page.locator('.hero-daylight').evaluate(e=>+getComputedStyle(e).opacity<.01));
    for(const viewport of [{width:844,height:390},{width:390,height:844}]){await page.setViewportSize(viewport);await page.waitForTimeout(300);await sample(0);assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));const title=await page.locator('.cosmic-copy').boundingBox();assert(title.y>=70&&title.y+title.height<=viewport.height);}
    const touch=await browser.newContext({viewport:{width:390,height:844},isMobile:true,hasTouch:true});const mobile=await touch.newPage();
    mobile.on('pageerror',e=>errors.push(e.message));await mobile.goto(`http://127.0.0.1:${server.address().port}/#home`);await mobile.waitForTimeout(300);
    const cdp=await touch.newCDPSession(mobile);await cdp.send('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[{x:25,y:730}]});
    for(const y of [680,610,540,470,400,330]){await cdp.send('Input.dispatchTouchEvent',{type:'touchMove',touchPoints:[{x:25,y}]});await mobile.waitForTimeout(35);}
    await cdp.send('Input.dispatchTouchEvent',{type:'touchEnd',touchPoints:[]});await mobile.waitForTimeout(250);
    assert(await mobile.evaluate(()=>scrollY>200),'native touch gesture did not scroll');assert.equal(await mobile.evaluate(()=>codexScroll.instance.options.syncTouch),false);await touch.close();
    assert.deepEqual(errors,[]);assert.deepEqual(failed,[]);console.log('PASS slow/fast wheel, reverse, landscape/portrait and native mobile touch gesture');
    assert.deepEqual(errors,[]);assert.deepEqual(failed,[]);console.log('PASS minimal hero, monotonic scroll-linked light, reverse, sticky/responsive layout, keyboard destinations, lifecycle and reduced-motion fallback');
  }finally{await browser.close();server.close();}
})().catch(e=>{console.error(e);server.close();process.exitCode=1;});
