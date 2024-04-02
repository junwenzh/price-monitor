import React from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App';
import { store } from './store.ts';
import { Provider } from 'react-redux';

import Register from './Register';

const container = document.getElementById('root') as HTMLDivElement;
const root = createRoot(container);

root.render(
  <Provider store={store}>
    <Register></Register>
    {/* <App></App> */}
  </Provider>
);
//root.render(<Register></Register>);
