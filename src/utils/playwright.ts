import { PlaywrightBlocker } from '@cliqz/adblocker-playwright';
import fetch from 'cross-fetch';
import { Browser, BrowserContext, Page } from 'playwright';
import { chromium } from 'playwright-extra';
import stealth from 'puppeteer-extra-plugin-stealth';
// import { CssSelector } from 'css-selector-generator/types/types';
// import { getCssSelector } from 'css-selector-generator';

class PlaywrightConnection {
  private browser?: Browser;
  private context?: BrowserContext;
  private pages: Record<string, Page> = {};

  async getBrowser(): Promise<Browser> {
    if (!this.browser) {
      chromium.use(stealth());
      this.browser = await chromium.launch();
    }
    return this.browser;
  }

  async getContext(): Promise<BrowserContext> {
    if (!this.context) {
      const browser = await this.getBrowser();
      this.context = await browser.newContext({
        viewport: {
          width: 1000,
          height: 1000,
        },
        userAgent:
          'Mozilla/5.0 (iPhone; CPU iPhone OS 17_3_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) CriOS/122.0.6261.62 Mobile/15E148 Safari/604.1',
      });
      await this.context.addInitScript(
        "Object.defineProperty(navigator, 'webdriver', {get: () => undefined})"
      );
    }
    return this.context;
  }

  async getPage(url: string): Promise<Page> {
    const context = await this.getContext();
    if (!(url in this.pages)) {
      console.log('Loading new page');
      const page = await context.newPage();
      PlaywrightBlocker.fromPrebuiltAdsAndTracking(fetch).then(blocker => {
        blocker.enableBlockingInPage(page);
      });
      await page.goto(url);
      await page.addScriptTag({
        url: 'https://cdnjs.cloudflare.com/ajax/libs/css-selector-generator/3.6.6/index.min.js',
      });
      await page.waitForLoadState('networkidle'); // waits until 0.5 seconds of no network traffic
      await page.waitForLoadState('domcontentloaded'); // this doesn't work on its own
      this.pages[url] = page;
    }
    return this.pages[url];
  }

  async closeBrowser() {
    if (this.browser) {
      this.browser.close();
    }
  }
}

const playwrightConnection = new PlaywrightConnection();

function getPriceElements({ x, y }: { x: number; y: number }) {
  const elems = document.elementsFromPoint(x, y); // array
  // ##.##, $##.##
  const priceEle = elems.find((element: Element) => {
    // const text = (element as HTMLElement).innerText;
    const children = Array.from(element.childNodes);
    const textNodes = children.filter(node => node.nodeType === Node.TEXT_NODE);
    const texts = textNodes.map(node => node.textContent?.trim());
    const text = texts.join(' ');
    const regex = /^\$?\d+(?:\.\d{1,2})?$/;
    return regex.test(text);
  });

  if (priceEle) {
    // @ts-expect-error asdf
    const selectedEle = CssSelectorGenerator.getCssSelector(priceEle);
    const price = (priceEle as HTMLElement).innerText;

    return {
      price: price,
      selector: selectedEle,
    };
  } else {
    return {
      price: 'Not found',
      x: x,
      y: y,
      elements: elems,
    };
  }
}

export { playwrightConnection, getPriceElements };
