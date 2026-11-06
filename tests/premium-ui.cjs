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
    await page.evaluate(()=>document.fonts.ready);
    for (const width of [360,390,768,1024,1440]) {
      await page.setViewportSize({width,height:1000});
      for(const route of ['home','work','neonbook','about','contact']){
        await page.evaluate(r=>location.hash=r,route);await page.waitForTimeout(150);
        assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),route+' overflow '+width);
        assert.equal(await page.locator('.page.active h1').count(),1);
        const tiny=await page.locator('.page.active').evaluate(p=>[...p.querySelectorAll('*')].filter(e=>e.textContent.trim()&&e.getClientRects().length&&parseFloat(getComputedStyle(e).fontSize)<12).map(e=>e.className));
        assert.deepEqual(tiny,[],route+' small text');
        await page.locator('.page.active img').evaluateAll(es=>es.forEach(e=>e.loading='eager'));await page.waitForTimeout(350);
        if([360,768,1440].includes(width))await page.screenshot({path:`/tmp/audit-${route}-${width}.png`,fullPage:true});
      }
    }
    await page.setViewportSize({width:390,height:900});await page.locator('.menu-toggle').click();
    assert(await page.locator('#mobile-menu').evaluate(e=>e.open));await page.keyboard.press('Escape');assert(!await page.locator('#mobile-menu').evaluate(e=>e.open));
    await page.evaluate(()=>location.hash='neonbook');await page.waitForTimeout(250);assert.equal(await page.locator('.nb-shelf-book').count(),5);
    await page.locator('.nb-shelf-book').nth(2).focus();await page.locator('.nb-shelf-book').nth(2).click();assert(await page.locator('.nb-book-detail').evaluate(e=>e.open));await page.locator('.nb-detail-close').click();await page.waitForTimeout(750);
    assert.deepEqual(errors,[]);assert.deepEqual(failed,[]);console.log('PASS routes, responsive, 12px minimum, menu, five books, dialog, no missing assets/errors');
  } finally {await browser.close();server.close();}
})().catch(e=>{console.error(e);server.close();process.exitCode=1;});
