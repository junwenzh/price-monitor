import React, { useState } from 'react';

export default function App() {
  const [url, setUrl] = useState(
    'https://www.amazon.com/Spicy-Chili-Crisp-Family-Restaurant/dp/B06XYTSGDP'
  );
  const [html, setHtml] = useState('');
  const [cssSelector, setCssSelector] = useState('');

  // useEffect(() => {
  //   const div = document.querySelector('#shoppingsite');

  //   div?.addEventListener('click', event => {
  //     const element = event.target;
  //     const selectedCss = getCssSelector(element);
  //     setCssSelector(selectedCss);
  //   });

  //   const shoppingSite = document.querySelector('#shoppingsite')!;
  //   const allEles = shoppingSite.querySelectorAll('*');
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

  //   textEles.forEach(ele => {
  //     // requires tailwind on the front end
  //     ele.classList.add('hover:border-2', 'hover:border-orange-300');
  //   });
  // }, [html]);

  const handleUrlChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setUrl(event.target.value);
  };

  const handleUrlSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    const loadingEle = document.querySelector('#loadingSpin');

    loadingEle?.classList.remove('hidden');

    event.preventDefault();
    fetch(`/api/scrape?url=${url}`)
      .then(response => response.text())
      .then(data => {
        setHtml(data);
        loadingEle?.classList.add('hidden');
      });
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="text-3xl my-4">Price Monitor</div>
      <form
        className="flex flex-col items-center gap-4 w-full"
        onSubmit={handleUrlSubmit}
      >
        <input
          type="text"
          id="inputUrl"
          name="inputUrl"
          value={url}
          onChange={handleUrlChange}
          className="ring-2 ring-slate-200 rounded p-2 w-full max-w-2xl text-center"
        />
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded transition duration-150 ease-in-out active:bg-blue-600 active:scale-95"
        >
          Submit
        </button>
      </form>
      <div id="loadingSpin" className="flex flex-row items-center hidden">
        <svg
          className="animate-spin size-5 text-gray-500 mr-4"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            stroke-width="4"
          ></circle>
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          ></path>
        </svg>
        <span>Loading...</span>
      </div>
      {/* <div
        id="shoppingsite"
        dangerouslySetInnerHTML={{ __html: html }}
        // className="w-iphone h-iphone"
      ></div> */}
      <img src={`data:image/jpeg;base64,${html}`} className="w-iphone" />
    </div>
  );
}
