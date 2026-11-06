/* Run with Playwright installed: node tests/premium-ui.cjs */
const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');
const assert = require('node:assert/strict');
const { chromium } = require('playwright');
const root = path.resolve(__dirname, '..');
const mime = {'.html':'text/html', '.css':'text/css', '.js':'application/javascript', '.woff2':'font/woff2', '.jpg':'image/jpeg', '.png':'image/png'};
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
    await page.evaluate(() => document.fonts.ready);
    assert(await page.evaluate(() => document.fonts.check('800 24px Nunito') && getComputedStyle(document.body).fontFamily.includes('Nunito')));
    for (const width of [1440,1024,768,390,320]) {
      await page.setViewportSize({width,height:900});
      for (const route of ['home','work','neonbook','about','contact']) {
        await page.evaluate(r => location.hash = r, route);
        await page.waitForTimeout(120);
        assert(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), `${route} overflow at ${width}`);
        assert.equal(await page.locator('.nav-link:visible').count(),5);
        for (const label of await page.locator('.nav-link-label').all()) assert(await label.isVisible());
      }
    }
    console.log('PASS all routes, 320–1440px, visible navigation, local fonts');
    await page.setViewportSize({width:1440,height:1000});
    for (let i=0;i<3;i++) {
      await page.evaluate(() => location.hash='home'); await page.waitForTimeout(150);
      await page.locator('#page-home .exhibit-01').scrollIntoViewIfNeeded(); await page.waitForTimeout(1000);
      assert.equal(await page.locator('#page-home .exhibit-01').evaluate(e=>getComputedStyle(e).opacity),'1');
      await page.evaluate(() => location.hash='contact'); await page.waitForTimeout(150);
      assert.equal(await page.evaluate(() => ScrollTrigger.getAll().filter(t=>(t.vars.id||'').startsWith('premium')).length),0);
    }
    console.log('PASS scroll completion and route cleanup without accumulating triggers');
    const toggle=page.locator('.contact-reveal-toggle');
    await toggle.click(); assert.match(await toggle.innerText(),/Back to the surface/);
    await toggle.press('Escape'); assert.match(await toggle.innerText(),/Reveal the other side/);
    await page.evaluate(()=>location.hash='about'); await page.waitForTimeout(150);
    const action=page.locator('.about-work-link'); await action.hover(); await page.waitForTimeout(500);
    assert(await action.locator('.action-fill').evaluate(e=>gsap.getProperty(e,'scaleY')>.99));
    assert(await page.locator('#page-about .about-hero h1 .split-word').count()>0);
    assert(await action.evaluate(e=>gsap.getProperty(e,'scaleX')>1));
    await page.mouse.down(); await page.waitForTimeout(220);
    assert(await action.evaluate(e=>gsap.getProperty(e,'scaleX')<1));
    await page.mouse.up(); await page.waitForTimeout(150); assert.equal(await page.evaluate(()=>location.hash),'#work');
    await page.evaluate(()=>location.hash='about'); await page.waitForTimeout(150);
    await action.focus(); await action.press('Enter'); await page.waitForTimeout(150); assert.equal(await page.evaluate(()=>location.hash),'#work');
    console.log('PASS hover, press, keyboard navigation and dynamic Contact labels');
    await page.emulateMedia({reducedMotion:'reduce'});
    await page.evaluate(()=>location.hash='home'); await page.waitForTimeout(150);
    assert.equal(await page.evaluate(()=>ScrollTrigger.getAll().filter(t=>(t.vars.id||'').startsWith('premium')).length),0);
    assert.equal(await page.locator('.ui-motion').count(),0);
    assert.equal(await page.locator('.split-word').count(),0);
    assert.equal(await page.locator('#page-about .about-hero h1').getAttribute('aria-label'),null);
    assert.equal(await page.locator('.hero-bg-img').evaluate(e=>getComputedStyle(e).animationName),'none');
    await page.emulateMedia({reducedMotion:'no-preference'}); await page.waitForTimeout(150);
    assert(await page.locator('.ui-motion').count()>0);
    const frame=page.locator('#page-home .exhibit-frame').first();
    const frameY=await frame.evaluate(e=>e.getBoundingClientRect().top+scrollY);
    await page.evaluate(y=>scrollTo(0,y-innerHeight*.92),frameY); await page.waitForTimeout(900);
    const initialClip=await frame.evaluate(e=>getComputedStyle(e).clipPath);
    await page.evaluate(y=>scrollTo(0,y-innerHeight*.3),frameY); await page.waitForTimeout(900);
    assert.notEqual(initialClip,await frame.evaluate(e=>getComputedStyle(e).clipPath));
    console.log('PASS visible fill sweep, SplitText restoration and scroll-driven image masks');
    assert.equal(await page.locator('.ui-action .ui-arrow-svg,.contact-dock-link .dock-arrow').count(),0);
    assert.equal(await page.locator('.mf-icon-link').first().evaluate(e=>getComputedStyle(e).width),'20px');
    assert.equal(await page.locator('.mf-statement').first().evaluate(e=>getComputedStyle(e).fontWeight),'800');
    const slow = await browser.newPage({viewport:{width:1440,height:1000},reducedMotion:'reduce'});
    let release;
    const gate = new Promise(resolve=>{release=resolve;});
    await slow.route('**/neonbook-platform.png',async route=>{await gate;await route.continue();});
    await slow.goto(`http://127.0.0.1:${server.address().port}/#home`,{waitUntil:'domcontentloaded'});
    await slow.locator('.exhibit-img--neonbook').scrollIntoViewIfNeeded();
    await slow.waitForSelector('.exhibit-img--neonbook[aria-busy="true"] .asset-veil');
    release();
    await slow.waitForFunction(()=>!document.querySelector('.exhibit-img--neonbook .asset-veil'));
    assert(await slow.locator('.exhibit-img--neonbook img').evaluate(e=>e.naturalWidth>0));
    await slow.close();
    const failedImage=await browser.newPage({reducedMotion:'reduce'});
    await failedImage.route('**/neonbook-platform.png',route=>route.abort());
    await failedImage.goto(`http://127.0.0.1:${server.address().port}/#home`,{waitUntil:'domcontentloaded'});
    await failedImage.locator('.exhibit-img--neonbook').scrollIntoViewIfNeeded();
    await failedImage.waitForFunction(()=>{const e=document.querySelector('.exhibit-img--neonbook img');return e.complete&&!e.parentElement.hasAttribute('aria-busy');});
    assert.equal(await failedImage.locator('.exhibit-img--neonbook .asset-veil').count(),0);
    await failedImage.close();
    console.log('PASS removed arrows, small footer icons, bold footer, delayed and failed image readiness');
    assert.deepEqual(errors,[]); assert.deepEqual(failed,[]);
    console.log('PASS reduced motion, reinitialization, no JavaScript errors or missing assets');
  } finally {await browser.close(); server.close();}
})().catch(e=>{console.error(e);server.close();process.exitCode=1;});
