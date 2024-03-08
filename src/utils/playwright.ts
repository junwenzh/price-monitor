import { PlaywrightBlocker } from '@cliqz/adblocker-playwright';
import fetch from 'cross-fetch';
import { devices } from 'playwright';
import { chromium } from 'playwright-extra';
import stealth from 'puppeteer-extra-plugin-stealth';

async function scrape(url: string) {
  const ipad = devices['iPad (gen 7)'];
  chromium.use(stealth());
  const browser = await chromium.launch();
  const context = await browser.newContext({
    ...ipad,
    userAgent:
      'Mozilla/5.0 (iPhone; CPU iPhone OS 17_3_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) CriOS/122.0.6261.62 Mobile/15E148 Safari/604.1',
  });
  await context.addInitScript(
    "Object.defineProperty(navigator, 'webdriver', {get: () => undefined})"
  );
  const page = await context.newPage();
  PlaywrightBlocker.fromPrebuiltAdsAndTracking(fetch).then(blocker => {
    blocker.enableBlockingInPage(page);
  });
  await page.goto(url);
  await page.waitForLoadState('networkidle'); // waits until 0.5 seconds of no network traffic
  await page.waitForLoadState('domcontentloaded'); // this doesn't work on its own

  const screenshotBuffer = await page.screenshot({ fullPage: true });
  const screenshotString = screenshotBuffer.toString('base64');

  const elements = await page.evaluate(getElementsFromPoint);

  console.log(elements);

  await context.close();
  await browser.close();

  return screenshotString;
}

function getAllElementsFromPoint(x: number, y: number) {
  const elements: HTMLElement[] = [];
  const previousPointerEvents = [];
  let currentElement = document.elementFromPoint(x, y) as HTMLElement;

  // Temporarily disable pointer events to all elements on the stack
  while (currentElement && !elements.includes(currentElement)) {
    // Push the element to the result list
    elements.push(currentElement);
    // Save current pointer-events style
    previousPointerEvents.push(currentElement.style.pointerEvents);
    // Disable pointer-events to "dig" through to lower elements
    currentElement.style.pointerEvents = 'none';
    currentElement = document.elementFromPoint(x, y) as HTMLElement;
  }

  return elements;
}

function getElementsFromPoint() {
  const x = 365;
  const y = 308;
  const elements: HTMLElement[] = [];
  const previousPointerEvents = [];
  let currentElement = document.elementFromPoint(x, y) as HTMLElement;

  // Temporarily disable pointer events to all elements on the stack
  while (currentElement && !elements.includes(currentElement)) {
    // Push the element to the result list
    elements.push(currentElement);
    // Save current pointer-events style
    previousPointerEvents.push(currentElement.style.pointerEvents);
    // Disable pointer-events to "dig" through to lower elements
    currentElement.style.pointerEvents = 'none';
    currentElement = document.elementFromPoint(x, y) as HTMLElement;
  }

  const textEles = elements.filter(el => {
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

  const texts: string[] = [];

  textEles.forEach(el => {
    const text = el.textContent;
    if (text) {
      texts.push(text);
    }
  });

  return JSON.stringify(texts);
}

export { scrape };
