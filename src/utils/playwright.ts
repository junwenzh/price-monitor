import { PlaywrightBlocker } from '@cliqz/adblocker-playwright';
import fetch from 'cross-fetch';
import { devices } from 'playwright';
import { chromium } from 'playwright-extra';
import stealth from 'puppeteer-extra-plugin-stealth';

async function scrape(url: string) {
  const iphone = devices['iPhone 13'];
  chromium.use(stealth());
  const browser = await chromium.launch();
  const context = await browser.newContext({ ...iphone });
  await context.addInitScript(
    "Object.defineProperty(navigator, 'webdriver', {get: () => undefined})"
  );
  const page = await context.newPage();
  PlaywrightBlocker.fromPrebuiltAdsAndTracking(fetch).then(blocker => {
    blocker.enableBlockingInPage(page);
  });
  await page.goto(url);
  // await page.waitForLoadState('networkidle'); // waits until 0.5 seconds of no network traffic
  await page.waitForLoadState('domcontentloaded'); // this doesn't work on its own

  const screenshotBuffer = await page.screenshot({ fullPage: true });
  const screenshotString = screenshotBuffer.toString('base64');

  await page.evaluate(disableJS);
  await page.evaluate(disableLinks);
  await page.evaluate(disableImages);
  await page.evaluate(disablePictures);
  await page.evaluate(disableSvgs);
  await page.evaluate(disableInputsAndButtons);
  await page.evaluate(disableHeaderFooterNav);

  const html = await page.content();
  const htmlWithoutComments = removeComments(html);

  await context.close();
  await browser.close();
  // return htmlWithoutComments;
  return screenshotString;
}

function disableJS() {
  const scriptEles = document.querySelectorAll('script');
  scriptEles.forEach(script => script.remove());

  const javascriptEles = document.querySelectorAll(
    '[href^="javascript:"], [src^="javascript:"], [action^="javascript:"]'
  );
  javascriptEles.forEach(el => {
    el.removeAttribute('href');
    el.removeAttribute('src');
    el.removeAttribute('action');
  });

  const activeEles = document.querySelectorAll(
    '[onclick], [onload], [onerror]'
  );
  activeEles.forEach(el => {
    el.removeAttribute('onclick');
    el.removeAttribute('onload');
    el.removeAttribute('onerror');
  });
}

function disableLinks() {
  const aTags = document.querySelectorAll('a');
  aTags.forEach(tag => {
    tag.addEventListener('click', event => {
      event.preventDefault();
    });
    tag.removeAttribute('href');
  });
}

function disableImages() {
  const imgEles = document.querySelectorAll('img');
  imgEles.forEach(el => {
    el.setAttribute('onerror', 'this.style.diplay="none"');
    const width = el.offsetWidth;
    const height = el.offsetHeight;
    el.style.width = `${width}px`;
    el.style.height = `${height}px`;
    el.src = '';
    el.srcset = '';
    el.style.display = 'none';
  });
}

function disableSvgs() {
  const svgEles = document.querySelectorAll('svg');
  svgEles.forEach(svg => {
    svg.style.display = 'none';
  });
}

function disablePictures() {
  const picEles = document.querySelectorAll('picture');
  picEles.forEach(pic => {
    const width = pic.offsetWidth;
    const height = pic.offsetHeight;
    pic.style.width = `${width}px`;
    pic.style.height = `${height}px`;
    pic.style.display = 'none';
  });
}

function disableInputsAndButtons() {
  const eles = document.querySelectorAll('input, button');
  eles.forEach(el => {
    if (el instanceof HTMLInputElement || el instanceof HTMLButtonElement) {
      el.disabled = true;
    }
  });
}

function disableHeaderFooterNav() {
  const eles = document.querySelectorAll('header, footer, nav');
  eles.forEach(el => {
    el.innerHTML = '';
  });
}

function removeComments(html: string) {
  return html.replace(/<!--[\s\S]*?-->/g, '');
}

export { scrape };
