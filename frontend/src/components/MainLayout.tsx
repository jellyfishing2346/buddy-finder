"use client";
import { ReactNode } from 'react';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import BottomNav from './BottomNav';
import { useAuthStore } from '../store/authStore';

export default function MainLayout({ children }: { children: ReactNode }) {
  const user = useAuthStore((state) => state.user);
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      <div className="flex flex-1">
        {user && <Sidebar />}
        <main className="flex-1 p-4 max-w-3xl mx-auto w-full">
          {children}
        </main>
      </div>
      {user && <BottomNav />}
    </div>
  );
}
