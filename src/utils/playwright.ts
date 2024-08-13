import { PlaywrightBlocker } from '@cliqz/adblocker-playwright';
import fetch from 'cross-fetch';
import { Browser, BrowserContext, Page } from 'playwright';
import { chromium } from 'playwright-extra';
import stealth from 'puppeteer-extra-plugin-stealth';

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
    console.log(`Finding playwright page for ${url}`);

    const context = await this.getContext();

    if (!(url in this.pages)) {
      console.log('Starting a new empty page in playwright');
      const page = await context.newPage();

      console.log('Adding adblock to page');
      PlaywrightBlocker.fromPrebuiltAdsAndTracking(fetch).then(blocker => {
        blocker.enableBlockingInPage(page);
      });

      try {
        console.log(`Accessing url ${url}`);
        await page.goto(url);
        console.log('Adding css selector generator script');
        await page.addScriptTag({
          url: 'https://cdnjs.cloudflare.com/ajax/libs/css-selector-generator/3.6.8/index.min.js',
        });
        console.log('Waiting for page to finish loading');
        await page.waitForLoadState('networkidle'); // waits until 0.5 seconds of no network traffic
        await page.waitForLoadState('domcontentloaded'); // this doesn't work on its own
        console.log('Page finished loading');
        this.pages[url] = page;
      } catch (error) {
        console.error('Playwright failed to open URL', error);
        //TODO: determine flow if Playwright encounters a connection error
      }
    }
    return this.pages[url] || 'Connection error';
  }

  async getScreenshot(url: string): Promise<string> {
    const page = await this.getPage(url);
    console.log(page);
    console.log('Taking a screenshot');
    const screenshotBuffer = await page.screenshot({ fullPage: false });
    console.log(screenshotBuffer);
    console.log('Converting screenshot to string');
    const screenshotString = screenshotBuffer.toString('base64');
    return screenshotString;
  }

  async getElementAtCoordinates(
    url: string,
    coordinates: { x: number; y: number }
  ) {
    const page = await this.getPage(url);
    const priceElement = await page.evaluate(getNumberElement, coordinates);
    return priceElement;
  }

  async getPrice(url: string, selector: string) {
    const page = await this.getPage(url);

    if (typeof page === 'string') {
      return 'Connection error';
    }

    const element = page.locator(selector);

    if (!element) {
      return 'Element not found';
    }

    const price = (await element.textContent()) || '';

    const re = /\d+(\.\d+)?/;
    const matches = price.match(re);

    if (!matches) {
      return 'Element does not contain price';
    }

    return matches[0];
  }

  async closeBrowser() {
    if (this.browser) {
      this.browser.close();
    }
  }
}

const playwrightConnection = new PlaywrightConnection();

function getNumberElement({ x, y }: { x: number; y: number }) {
  const elements = document.elementsFromPoint(x, y); // array
  const numberElement = elements.find((element: Element) => {
    const children = Array.from(element.childNodes);
    const textNodes = children.filter(node => node.nodeType === Node.TEXT_NODE);
    const texts = textNodes.map(node => node.textContent?.trim());
    const text = texts.join(' ');
    const regex = /^\$?\d+(?:\.\d{1,2})?$/;
    return regex.test(text);
  });

  if (numberElement) {
    // @ts-expect-error CssSelectorGenerator will come from script tag
    const selector = CssSelectorGenerator.getCssSelector(numberElement);
    const price = (numberElement as HTMLElement).innerText;

    return {
      price,
      selector,
    };
  }
}

export { playwrightConnection };
