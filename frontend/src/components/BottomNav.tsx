"use client";
import Link from 'next/link';
import { useAuthStore } from '../store/authStore';

const navLinks = [
  { href: '/feed', label: 'Feed', icon: '🏠' },
  { href: '/discover', label: 'Discover', icon: '🔍' },
  { href: '/interests', label: 'Interests', icon: '⭐' },
];

export default function BottomNav() {
  const user = useAuthStore((state) => state.user);
  return (
    <nav className="fixed bottom-0 left-0 w-full bg-white/90 backdrop-blur border-t border-gray-200 shadow-lg flex justify-around items-center py-2 md:hidden z-50">
      {navLinks.map((link) => (
        <Link
          key={link.href}
          href={link.href}
          className="flex flex-col items-center text-xs text-gray-700 hover:text-blue-600 transition"
        >
          <span className="text-lg">{link.icon}</span>
          {link.label}
        </Link>
      ))}
      <Link
        href={user ? `/profile/${user.username}` : '/login'}
        className="flex flex-col items-center text-xs text-gray-700 hover:text-blue-600 transition"
      >
        <span className="text-lg">👤</span>
        Profile
      </Link>
    </nav>
  );
}
