import React from 'react';
import { Outlet } from 'react-router-dom';
import NavBar from './NavBar';
import { Toaster } from '../components/ui/toaster';

export default function Layout() {
  return (
    <div>
      <NavBar />
      <main className="mt-12">
        <Outlet />
        <Toaster />
      </main>
    </div>
  );
}
