/* Run with Playwright installed: node tests/premium-ui.cjs */
const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');
const assert = require('node:assert/strict');
const { chromium } = require('playwright');
const root = path.resolve(__dirname, '..');
const mime = {'.svg':'image/svg+xml','.html':'text/html', '.css':'text/css', '.js':'application/javascript', '.woff2':'font/woff2', '.jpg':'image/jpeg', '.png':'image/png'};
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
    await page.evaluate(()=>document.fonts.ready);
    assert(await page.evaluate(()=>!!codexScroll.instance));
    for(const lerp of [.1,.14,.18]){
      await page.evaluate(v=>{codexScroll.instance.options.lerp=v;codexScroll.reset();},lerp);
      await page.mouse.move(700,700);await page.mouse.wheel(0,720);
      await page.waitForTimeout(80);const early=await page.evaluate(()=>scrollY);
      await page.waitForTimeout(180);const middle=await page.evaluate(()=>scrollY);
      await page.waitForTimeout(850);const end=await page.evaluate(()=>scrollY);
      assert(early>0&&early<middle&&middle<=end&&end<=725);
      console.log('lerp',lerp,'80/260/1110ms',early,middle,end);
    }
    await page.evaluate(()=>codexScroll.instance.options.lerp=.14);
    await page.evaluate(()=>location.hash='work');await page.waitForTimeout(180);
    assert.equal(await page.evaluate(()=>Math.round(scrollY)),0);
    await page.locator('.work-jump').click();await page.waitForTimeout(1100);
    assert(await page.locator('#selected-projects').evaluate(e=>Math.abs(e.getBoundingClientRect().top-95)<5));
    await page.evaluate(()=>location.hash='neonbook');await page.waitForTimeout(200);
    await page.setViewportSize({width:390,height:700});
    await page.locator('[data-book="2"]').focus();await page.locator('[data-book="2"]').press('Enter');await page.waitForTimeout(1000);
    assert(await page.evaluate(()=>codexScroll.instance.isStopped));
    const before=await page.evaluate(()=>scrollY);await page.mouse.move(200,500);await page.mouse.wheel(0,400);await page.waitForTimeout(350);
    assert.equal(await page.evaluate(()=>scrollY),before);
    assert(await page.locator('.nb-book-detail').evaluate(e=>e.scrollTop>0));
    await page.keyboard.press('Escape');await page.waitForTimeout(800);assert(!(await page.evaluate(()=>codexScroll.instance.isStopped)));
    await page.emulateMedia({reducedMotion:'reduce'});await page.waitForTimeout(100);assert.equal(await page.evaluate(()=>codexScroll.instance),null);
    await page.emulateMedia({reducedMotion:'no-preference'});await page.waitForTimeout(100);assert(await page.evaluate(()=>!!codexScroll.instance));
    for(const route of ['home','about','work','contact','neonbook']){await page.evaluate(r=>location.hash=r,route);await page.waitForTimeout(100);assert.equal(await page.evaluate(()=>ScrollTrigger.getAll().filter(x=>x.vars.id==='atmosphere-scroll').length),1);}
    assert.equal(await page.evaluate(()=>codexScroll.instance.options.syncTouch),false);
    assert.deepEqual(errors,[]);assert.deepEqual(failed,[]);
    console.log('PASS Lenis wheel tuning, route reset, anchor offset, native modal scroll, reduced motion, touch and atmosphere lifecycle');
  }finally{await browser.close();server.close();}
})().catch(e=>{console.error(e);server.close();process.exitCode=1;});
