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
    await page.evaluate(()=>location.hash='neonbook');await page.waitForTimeout(200);
    const video=page.locator('.nb-platform-video');await video.scrollIntoViewIfNeeded();
    await page.waitForFunction(()=>document.querySelector('.nb-platform-video').readyState>=2);
    assert(await video.evaluate(e=>e.controls&&e.playsInline&&!e.autoplay&&e.videoWidth===852&&e.videoHeight===440));
    assert.equal(await page.locator('.nb-platform-showcase h2,.nb-platform-toolbar,.nb-platform-showcase .capture-affordance,.nb-platform-showcase figcaption').count(),0);
    await video.evaluate(e=>e.play());await page.waitForTimeout(250);assert(await video.evaluate(e=>e.currentTime>0));
    await page.evaluate(()=>location.hash='contact');await page.waitForTimeout(100);assert(await video.evaluate(e=>e.paused));
    await page.evaluate(()=>location.hash='neonbook');await page.waitForTimeout(100);
    for(const width of [320,390,768,1440]){await page.setViewportSize({width,height:1000});assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));assert(await video.evaluate(e=>Math.abs(e.getBoundingClientRect().width/e.getBoundingClientRect().height-852/440)<.02));}
    await page.emulateMedia({reducedMotion:'reduce'});assert(await video.evaluate(e=>e.paused));
    assert.deepEqual(errors,[]);assert.deepEqual(failed,[]);console.log('PASS supplied MP4 metadata/playback, no surrounding labels, route pause, responsive uncropped frame and reduced-motion default');
  }finally{await browser.close();server.close();}
})().catch(e=>{console.error(e);server.close();process.exitCode=1;});
