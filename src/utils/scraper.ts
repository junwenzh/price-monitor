import { chromium } from 'playwright-extra';
import stealth from 'puppeteer-extra-plugin-stealth';

async function test() {
  chromium.use(stealth());
  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.goto('https://fragrancenet.com');

  const content = await page.content();
  // const bodyHtml = await page.locator('xpath=//html/body');
  // await page.waitForTimeout(1000);
  //   const content = await page.locator('body').innerHTML(); // html string
  //   const dom = cheerio.load(content);
  //dom('script').remove();
  //console.log(dom.html());
  await browser.close();
  return content;
  //   return dom.html();
}

export { test };
