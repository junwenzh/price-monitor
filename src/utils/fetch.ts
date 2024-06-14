import jsdom from 'jsdom';

async function fetchPriceFromSelector(
  url: string,
  selector: string
): Promise<string> {
  try {
    const response = await fetch(url);

    if (!response.ok) {
      return 'Connection error';
    }

    const { JSDOM } = jsdom;
    const html = await response.text();

    const dom = new JSDOM(html);
    const element = dom.window.document.querySelector(selector);

    if (element?.textContent) {
      const price = extractPriceFromText(element.textContent);
      if (price !== 'No match') {
        return price;
      } else {
        return 'Element does not contain price';
      }
    }

    return 'Element not found';
  } catch (error) {
    console.error(error);
    return 'Connection error';
  }
}

function extractPriceFromText(text: string): string {
  const regex = /^\$?\d+(?:\.\d{1,2})?$/;
  const match = text.match(regex);

  if (!match) {
    return 'No match';
  }

  const price = match[0];
  return price;
}

export default fetchPriceFromSelector;
