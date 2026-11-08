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
    await page.evaluate(()=>location.hash='contact');await page.waitForTimeout(900);
    const trigger=page.locator('.contact-dock-link[data-unavailable]');const toast=page.locator('.construction-notice');
    await trigger.focus();await trigger.press('Enter');await toast.waitFor({state:'visible'});assert(await toast.isVisible());
    assert.equal(await page.locator('.construction-status strong').innerText(),'Under Construction');
    assert.match(await page.locator('.construction-announcer[role=status]').innerText(),/Under Construction/);
    assert.equal(await page.evaluate(()=>location.hash),'#contact');
    assert(await trigger.evaluate(e=>document.activeElement===e));
    assert.equal(await trigger.getAttribute('href'),null);
    assert.equal(await trigger.locator('.brand-linkedin').getAttribute('viewBox'),'0 0 24 24');
    assert.equal(await trigger.locator('.brand-linkedin').evaluate(e=>getComputedStyle(e).stroke),'none');
    await page.locator('.construction-dismiss').focus();await page.waitForTimeout(4700);assert(await toast.isVisible());
    await page.locator('.construction-dismiss').press('Enter');await page.waitForTimeout(300);assert(!(await toast.isVisible()));assert(await trigger.evaluate(e=>document.activeElement===e));
    await trigger.press('Space');await toast.waitFor({state:'visible'});assert(await toast.isVisible());await page.keyboard.press('Escape');await page.waitForTimeout(250);assert(!(await toast.isVisible()));
    await page.mouse.move(50,100);await page.evaluate(()=>{document.activeElement.blur();CODEX.notifyUnavailable('Test feature');});await page.waitForTimeout(4850);assert(!(await toast.isVisible()));
    assert.equal(await page.locator('.contact-dock-link[href="mailto:Farazn8564@gmail.com"]').count(),1);
    assert.equal(await page.locator('.contact-dock-link[href="https://github.com/farazcodeX"]').count(),1);
    assert.equal(await page.locator('a[href="#"],a[href="https://linkedin.com/"],a[href="https://t.me/"],a[href="https://instagram.com/"]').count(),0);
    for(const width of [320,390,768,1440]){await page.setViewportSize({width,height:1000});await page.evaluate(()=>CODEX.notifyUnavailable('Feature'));await page.waitForTimeout(300);assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));const bounds=await toast.boundingBox();assert(bounds.x>=0&&bounds.x+bounds.width<=width+1);}
    await page.emulateMedia({reducedMotion:'reduce'});assert(await toast.evaluate(e=>parseFloat(getComputedStyle(e).transitionDuration)<.001));
    await page.evaluate(()=>location.hash='home');await page.waitForTimeout(100);assert(!(await toast.isVisible()));
    assert.deepEqual(errors,[]);assert.deepEqual(failed,[]);console.log('PASS construction notifications, Enter/Space/Escape, focus return, timeout/pause, brand SVG, working links and responsive reduced-motion states');
  }finally{await browser.close();server.close();}
})().catch(e=>{console.error(e);server.close();process.exitCode=1;});
