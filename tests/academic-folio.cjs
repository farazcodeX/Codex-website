/* Run with Playwright installed: node tests/premium-ui.cjs */
const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');
const assert = require('node:assert/strict');
const { chromium } = require('playwright');
const root = path.resolve(__dirname, '..');
assert.equal(require('node:crypto').createHash('sha256').update(fs.readFileSync(path.join(root,'images/academic/amirkabir-logo.png'))).digest('hex'),'69d7efe26e3e5c3a4539abed4a9c2bd3b0ae8ff881f719cceda45efcfbe49ead','Logo must remain byte-identical to the supplied PNG');
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
    await page.evaluate(()=>location.hash='about');await page.evaluate(()=>document.fonts.ready);
    const section=page.locator('.about-academic');
    for(const width of [320,390,768,1440]){
      await page.setViewportSize({width,height:1000});await section.scrollIntoViewIfNeeded();await page.waitForTimeout(900);
      assert(await section.evaluate(e=>e.scrollWidth<=e.clientWidth+1));
      assert(await section.locator('img').evaluateAll(es=>es.every(e=>e.complete&&e.naturalWidth>0)));
      assert(await section.locator('.academic-watermark').evaluate(e=>{const s=getComputedStyle(e);return s.objectFit==='contain'&&parseFloat(s.opacity)<=.05&&s.pointerEvents==='none';}));
      assert(await section.locator('h3').evaluate(e=>getComputedStyle(e).fontFamily.includes('Geist')));
      await page.screenshot({path:'/tmp/academic-'+width+'.png'});
    }
    assert.equal(await section.locator('.about-gpa').count(),1);
    assert.deepEqual(errors,[]);assert.deepEqual(failed,[]);console.log('PASS academic folio at 320/390/768/1440px, asset decoding, typography and no errors');
  }finally{await browser.close();server.close();}
})().catch(e=>{console.error(e);server.close();process.exitCode=1;});
