import { chromium } from 'playwright-extra';
import stealth from 'puppeteer-extra-plugin-stealth';

async function scrape(url: string) {
  chromium.use(stealth());
  const browser = await chromium.launch();
  const context = await browser.newContext();
  await context.addInitScript(
    "Object.defineProperty(navigator, 'webdriver', {get: () => undefined})"
  );
  const page = await context.newPage();
  await page.goto(url);
  // await page.waitForLoadState('networkidle'); // waits until 0.5 seconds of no network traffic
  await page.waitForLoadState('domcontentloaded'); // this doesn't work on its own

  await page.evaluate(() => {
    // remove scripts
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

    // remove links
    const aTags = document.querySelectorAll('a');
    aTags.forEach(tag => {
      tag.addEventListener('click', event => {
        event.preventDefault();
      });
      tag.removeAttribute('href');
    });

    // hide errored images
    const imgEles = document.querySelectorAll('img');
    imgEles.forEach(el => {
      el.setAttribute('onerror', 'this.style.diplay="none"');
    });

    // disable events
    const eventTypes = ['click', 'submit', 'change', 'input', 'form'];

    eventTypes.forEach(type => {
      document.addEventListener(
        type,
        function (event) {
          event.stopPropagation();
          event.preventDefault();
        },
        true
      );
    });

    // disable all form submits
    const formEles = document.querySelectorAll('form');
    formEles.forEach(form => {
      form.onsubmit = null;
      form.addEventListener('submit', function (event) {
        event.preventDefault();
      });
    });
  });

  const content = await page.content();

  await browser.close();
  return content;
}

export { scrape };
