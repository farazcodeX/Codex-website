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
    assert.equal(await page.locator('video,.poster-neonbook').count(),0);
    const capture=page.locator('img[src="images/projects/neonbook-fullsize.png"]');assert.equal(await capture.count(),3);
    for(const route of ['home','work','neonbook']){
      await page.evaluate(r=>location.hash=r,route);await page.waitForTimeout(250);
      const image=page.locator('.page.active img[src="images/projects/neonbook-fullsize.png"]');
      await image.scrollIntoViewIfNeeded();await image.evaluate(e=>e.decode());assert(await image.evaluate(e=>e.naturalWidth===1907&&e.naturalHeight===1077));
      for(const width of [320,390,768,1440]){await page.setViewportSize({width,height:1000});await page.waitForTimeout(100);assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));assert(await image.evaluate(e=>Math.abs(e.getBoundingClientRect().width/e.getBoundingClientRect().height-1907/1077)<.02));}
    }
    const button=page.locator('.nb-platform-showcase .capture-open');await button.focus();await button.press('Enter');assert(await page.locator('#project-lightbox').evaluate(e=>e.open));assert.equal(await page.locator('#project-lightbox img').getAttribute('src'),'images/projects/neonbook-fullsize.png');await page.keyboard.press('Escape');assert(await button.evaluate(e=>e===document.activeElement));
    assert.equal(await page.locator('.nb-platform-showcase h2,.nb-platform-showcase figcaption,.nb-platform-showcase .capture-affordance').count(),0);
    assert.deepEqual(errors,[]);assert.deepEqual(failed,[]);console.log('PASS new full-size image on Home/Work/NeonBook, responsive uncropped proportions, keyboard enlargement and no media errors');
  }finally{await browser.close();server.close();}
})().catch(e=>{console.error(e);server.close();process.exitCode=1;});
