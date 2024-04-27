import React from 'react';

import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from 'react-router-dom';
import NewProductTracker from './components/NewProductTracker';
import Register from './components/Register';
import Login from './components/UserLogin';
import Layout from './layouts/Layout';

import Home from './Home';

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<Layout />}>
      <Route index element={<Home />} />
      <Route path="login" element={<Login />} />
      <Route path="register" element={<Register />} />
      <Route path="newproduct" element={<NewProductTracker />} />
    </Route>
  )
);

export default function App() {
  return <RouterProvider router={router} />;
}
