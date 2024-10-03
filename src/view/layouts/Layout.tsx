import React from 'react';
import { Outlet } from 'react-router-dom';
import NavBar from './NavBar';

export default function Layout() {
  return (
    <div>
      <NavBar />
      <main className="mt-12">
        <Outlet />
      </main>
    </div>
  );
}
