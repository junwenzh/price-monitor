import React from 'react';

export default function Home() {
  return <div>Home</div>;
}

// import React, { useEffect, useState } from 'react';

// export default function App() {
//   const [url, setUrl] = useState(
//     'https://www.fragrancenet.com/perfume/dolce-and-gabbana/d-and-g-light-blue/edt#118661'
//   );
//   const [img, setImg] = useState('');
//   const [coordinates, setCoordinates] = useState({ x: 0, y: 0 });
//   const [offsetCoords, setOffsetCoords] = useState({ x: 0, y: 0 });
//   // const [rect, setRect] = useState({ x: 0, y: 0 });
//   //const imageRef = useRef<HTMLImageElement>(null);

//   const handleUrlChange = (event: React.ChangeEvent<HTMLInputElement>) => {
//     setUrl(event.target.value);
//   };

//   const handleUrlSubmit = (event: React.FormEvent<HTMLFormElement>) => {
//     const loadingEle = document.querySelector('#loadingSpin');

//     loadingEle?.classList.remove('hidden');

//     event.preventDefault();
//     fetch(`/api/scrape/screenshot`, {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json',
//       },
//       body: JSON.stringify({ url }),
//     })
//       .then(response => response.json())
//       .then(data => {
//         setImg(data.screenshot);
//         loadingEle?.classList.add('hidden');
//       });
//   };

//   // useEffect(() => {
//   //   const imageEle = document.querySelector('#screenshot')!;
//   //   const clientRect = imageEle.getBoundingClientRect()!;

//   //   setRect(() => ({
//   //     x: clientRect.x,
//   //     y: clientRect.y,
//   //   }));

//   //   console.log(clientRect.x, clientRect.y);
//   // }, [img]);

//   const handleCoordinatesSubmit = (event: React.FormEvent<HTMLFormElement>) => {
//     event.preventDefault();

//     // post coordinates to api
//     // console.log('sending coordinates', offsetCoords);

//     console.log(url);

//     fetch('/api/scrape/coordinates', {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json',
//       },
//       body: JSON.stringify({ url, coordinates: offsetCoords }),
//     })
//       .then(response => response.json())
//       .then(data => {
//         console.log(data);
//       });
//   };

//   const handleClick = (event: MouseEvent) => {
//     const imageEle = document.querySelector('#screenshot')!;
//     const rect = imageEle.getBoundingClientRect()!;

//     console.log('rect', rect);
//     console.log('x', event.clientX);
//     console.log('y', event.clientY);
//     console.log('window scroll Y', window.scrollY);
//     console.log('rect y', rect.y);

//     const coords = {
//       x: event.clientX,
//       y: event.clientY + window.scrollY,
//     };
//     setCoordinates({ ...coords });

//     const offsetC = {
//       x: event.clientX - rect.x,
//       y: event.clientY + window.scrollY - (rect.y + window.scrollY),
//     };

//     setOffsetCoords({ ...offsetC });

//     console.log('coords', coords);
//     console.log('offset coords', offsetC);
//   };

//   useEffect(() => {
//     const shoppingSite = document.querySelector('#shoppingsite') as HTMLElement;

//     shoppingSite.addEventListener('click', handleClick);
//   }, []);

//   return (
//     <div className="flex flex-col items-center gap-4">
//       <div className="text-3xl my-4">Price Monitor</div>
//       <form
//         className="flex flex-col items-center gap-4 w-full"
//         onSubmit={handleUrlSubmit}
//       >
//         <input
//           type="text"
//           id="inputUrl"
//           name="inputUrl"
//           value={url}
//           onChange={handleUrlChange}
//           className="ring-2 ring-slate-200 rounded p-2 w-full max-w-2xl text-center"
//         />
//         <button
//           type="submit"
//           className="bg-blue-500 text-white px-4 py-2 rounded transition duration-150 ease-in-out active:bg-blue-600 active:scale-95"
//         >
//           Submit
//         </button>
//       </form>
//       <form
//         className="flex flex-col items-center gap-4 w-full"
//         onSubmit={handleCoordinatesSubmit}
//       >
//         <button
//           type="submit"
//           className="bg-blue-500 text-white px-4 py-2 rounded transition duration-150 ease-in-out active:bg-blue-600 active:scale-95"
//         >
//           Send Coordinates
//         </button>
//       </form>
//       <div id="loadingSpin" className="flex flex-row items-center hidden">
//         <svg
//           className="animate-spin size-5 text-gray-500 mr-4"
//           viewBox="0 0 24 24"
//           xmlns="http://www.w3.org/2000/svg"
//           fill="none"
//         >
//           <circle
//             className="opacity-25"
//             cx="12"
//             cy="12"
//             r="10"
//             stroke="currentColor"
//             stroke-width="4"
//           ></circle>
//           <path
//             className="opacity-75"
//             fill="currentColor"
//             d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
//           ></path>
//         </svg>
//         <span>Loading...</span>
//       </div>
//       <div id="shoppingsite" className={img ? '' : 'hidden'}>
//         <div
//           className="absolute w-4 h-4 rounded bg-blue-500 opacity-50"
//           style={{ left: `${coordinates.x}px`, top: `${coordinates.y}px` }}
//         ></div>
//         <img
//           id="screenshot"
//           src={`data:image/jpeg;base64,${img}`}
//           className="w-desktop h-desktop min-w-desktop"
//         />
//       </div>
//     </div>
//   );
// }
