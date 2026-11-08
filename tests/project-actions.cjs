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
    assert.equal(await page.locator('#page-home .exhibit-02 .exhibit-name').innerText(),'Cinento Watch');
    assert.equal(await page.locator('#page-home .codate-study').count(),0);
    await page.evaluate(()=>location.hash='work');await page.waitForTimeout(400);
    const story=page.locator('.project-secondary').first();await story.hover();await page.waitForTimeout(300);
    assert.equal(await story.evaluate(e=>getComputedStyle(e).textDecorationLine),'none');
    const a=await story.evaluate(e=>gsap.getProperty(e,'x'));await page.mouse.move((await story.boundingBox()).x+5,(await story.boundingBox()).y+10);await page.waitForTimeout(250);assert.equal(await story.evaluate(e=>gsap.getProperty(e,'x')),a);
    await story.click();await page.waitForTimeout(150);assert.equal(await page.evaluate(()=>location.hash),'#neonbook');
    await page.evaluate(()=>location.hash='work');await page.waitForTimeout(200);
    const capture=page.locator('.selected-project--tetris .capture-open');await capture.scrollIntoViewIfNeeded();
    assert(await capture.evaluate(e=>e.querySelector('.capture-affordance').getBoundingClientRect().top>=e.querySelector('img').getBoundingClientRect().bottom));
    await capture.focus();await capture.press('Enter');assert(await page.locator('#project-lightbox').evaluate(e=>e.open));await page.keyboard.press('Escape');await page.waitForTimeout(100);assert(await capture.evaluate(e=>document.activeElement===e));
    for(const email of await page.locator('a[href^="mailto:"]').all())assert.equal(await email.getAttribute('href'),'mailto:Farazn8564@gmail.com');
    assert.deepEqual(errors,[]);assert.deepEqual(failed,[]);console.log('PASS Cinento Home preview, consistent Project story action, stable hover, below-image capture action, dialog keyboard behavior and all email links');
  }finally{await browser.close();server.close();}
})().catch(e=>{console.error(e);server.close();process.exitCode=1;});
