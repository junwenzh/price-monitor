import React, { useState, useEffect } from 'react';
// import getXPath from 'get-xpath';
// import { CssSelector } from 'css-selector-generator/types/types';
import getCssSelector from 'css-selector-generator';
// import { test } from '../utils/scraper';

export default function App() {
  const [html, setHtml] = useState('');

  const url =
    'https://www.amazon.com/Spicy-Chili-Crisp-Family-Restaurant/dp/B06XYTSGDP';

  useEffect(() => {
    fetch(`/api/scrape?url=${url}`)
      .then(response => response.text())
      .then(data => {
        setHtml(data);
      });
  }, []);

  // useEffect(() => {
  //   // remove all javascript
  //   const scripts = document.querySelectorAll('script');
  //   scripts.forEach(script => script.remove());

  //   const div = document.querySelector('#shoppingsite');

  //   const aTags = div?.querySelectorAll('a');

  //   aTags?.forEach(tag => {
  //     tag.addEventListener('click', event => {
  //       event.preventDefault();
  //     });
  //     tag.removeAttribute('href');
  //   });

  //   div?.addEventListener('click', event => {
  //     const element = event.target;
  //     console.log(element);
  //     //   const xpath = getXPath(element);
  //     const selectedCss = getCssSelector(element);
  //     console.log(selectedCss);
  //   });

  //   const allEles = div?.querySelectorAll('*');
  //   const allElesArray = Array.from(allEles!);
  //   const textEles = allElesArray.filter(el => {
  //     const children = el.childNodes; // direct children(
  //     const childrenArray = Array.from(children);
  //     const hasTextChild = childrenArray.some(node => {
  //       if (node.nodeType === 3 && node.textContent?.trim() !== '') {
  //         return true;
  //       }
  //       return false;
  //     });
  //     return hasTextChild;
  //   });

  //   textEles?.forEach(ele => {
  //     // if (ele.childElementCount === 0) {
  //     ele.classList.add('hover:border-2', 'hover:border-orange-300');
  //     // }
  //   });

  //   // not display error images
  //   const imgEles = div?.querySelectorAll('img');
  //   imgEles?.forEach(el => {
  //     el.setAttribute('onerror', 'this.style.diplay="none"');
  //   });
  // }, [html]);

  return (
    <div>
      <div className="text-2xl">Price Monitor</div>
      <div id="shoppingsite" dangerouslySetInnerHTML={{ __html: html }}></div>
    </div>
  );
}
