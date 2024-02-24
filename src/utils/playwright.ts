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
    document.querySelectorAll('script').forEach(script => script.remove());

    document
      .querySelectorAll(
        '[href^="javascript:"], [src^="javascript:"], [action^="javascript:"]'
      )
      .forEach(el => {
        el.removeAttribute('href');
        el.removeAttribute('src');
        el.removeAttribute('action');
      });

    // Example of removing event handlers - this would need to be done for all possible event attributes
    document.querySelectorAll('[onclick], [onerror], [onload]').forEach(el => {
      el.removeAttribute('onclick');
      el.removeAttribute('onerror');
      el.removeAttribute('onload');
    });

    const aTags = document.querySelectorAll('a');

    aTags?.forEach(tag => {
      tag.addEventListener('click', event => {
        event.preventDefault();
      });
      tag.removeAttribute('href');
    });

    const allEles = document.querySelectorAll('*');
    const allElesArray = Array.from(allEles!);
    const textEles = allElesArray.filter(el => {
      const children = el.childNodes; // direct children(
      const childrenArray = Array.from(children);
      const hasTextChild = childrenArray.some(node => {
        if (node.nodeType === 3 && node.textContent?.trim() !== '') {
          return true;
        }
        return false;
      });
      return hasTextChild;
    });

    textEles?.forEach(ele => {
      // if (ele.childElementCount === 0) {
      ele.classList.add('hover:border-2', 'hover:border-orange-300');
      // }
    });

    // not display error images
    const imgEles = document.querySelectorAll('img');
    imgEles?.forEach(el => {
      el.setAttribute('onerror', 'this.style.diplay="none"');
    });
  });

  const content = await page.content();

  // console.log(typeof content, 'content type');

  await browser.close();
  return content;
}

export { scrape };
