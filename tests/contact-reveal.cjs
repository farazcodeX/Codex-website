/* Run with Playwright installed: node tests/premium-ui.cjs */
const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');
const assert = require('node:assert/strict');
const { chromium } = require('playwright');
const root = path.resolve(__dirname, '..');
assert.equal(require('node:crypto').createHash('sha256').update(fs.readFileSync(path.join(root,'images/academic/amirkabir-logo.png'))).digest('hex'),'69d7efe26e3e5c3a4539abed4a9c2bd3b0ae8ff881f719cceda45efcfbe49ead','Logo must remain byte-identical to the supplied PNG');
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
    await page.evaluate(()=>location.hash='contact');await page.waitForTimeout(1000);
    for(const width of [390,1440]){
      await page.setViewportSize({width,height:1000});await page.waitForTimeout(300);
      const stage=page.locator('.contact-stage');assert(Math.abs((await stage.boundingBox()).y)<1);
      const expected=width===390?[157.65625,178.734375]:[174.234375,194.515625];
      const tops=await page.locator('.contact-stage-copy').evaluateAll(es=>es.map(e=>e.getBoundingClientRect().top));
      tops.forEach((top,i)=>assert(Math.abs(top-expected[i])<1,'text position changed'));
      assert.equal(await stage.locator('button').count(),0);
      await page.mouse.move(100,110);await page.waitForTimeout(650);
      assert.notEqual(await page.locator('.tear-outline path').getAttribute('d'),'');
      assert(Math.abs((await page.locator('.contact-underneath').boundingBox()).y)<1);
      assert.equal(await page.locator('.contact-dock-link').count(),3);
      assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));
    }
    await page.emulateMedia({reducedMotion:'reduce'});await page.waitForTimeout(100);
    assert.equal(await page.locator('.tear-outline path').getAttribute('d'),'');
    assert.deepEqual(errors,[]);assert.deepEqual(failed,[]);console.log('PASS expanded reveal under navigation, unchanged text positions, no stage buttons, reduced motion and contact links');
  }finally{await browser.close();server.close();}
})().catch(e=>{console.error(e);server.close();process.exitCode=1;});
