import React, { useState, useEffect } from 'react';
// import getXPath from 'get-xpath';
import { CssSelector } from 'css-selector-generator/types/types';
import getCssSelector from 'css-selector-generator';
// import { test } from '../utils/scraper';

export default function App() {
  const [html, setHtml] = useState('');

  useEffect(() => {
    fetch('/api/scrape')
      .then(response => response.text())
      .then(data => {
        setHtml(data);
      });
  }, []);

  useEffect(() => {
    const div = document.querySelector('#shoppingsite');
    const aTags = div?.querySelectorAll('a');
    aTags?.forEach(tag => {
      tag.addEventListener('click', event => {
        event.preventDefault();
      });
      tag.removeAttribute('href');
    });
    div?.addEventListener('click', event => {
      const element = event.target;
      console.log(element);
      //   const xpath = getXPath(element);
      const selectedCss = getCssSelector(element);
      console.log(selectedCss);
    });
  }, [html]);

  return (
    <div>
      <div className="text-2xl">Price Monitor</div>
      <div id="shoppingsite" dangerouslySetInnerHTML={{ __html: html }}></div>
    </div>
  );
}
