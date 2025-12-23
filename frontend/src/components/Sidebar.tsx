"use client";
import Link from 'next/link';

const links = [
  { href: '/feed', label: 'Feed', icon: '🏠' },
  { href: '/discover', label: 'Discover', icon: '🔍' },
  { href: '/interests', label: 'Interests', icon: '⭐' },
  { href: '/messages', label: 'Messages', icon: '💬' },
  { href: '/notifications', label: 'Notifications', icon: '🔔' },
  { href: '/settings', label: 'Settings', icon: '⚙️' },
];

export default function Sidebar() {
  return (
    <aside className="hidden md:flex flex-col w-64 h-[calc(100vh-64px)] bg-gradient-to-b from-white via-blue-50 to-blue-100 border-r border-gray-200 px-6 py-8 space-y-2 shadow-sm sticky top-[64px]">
      {links.map((link) => (
        <Link
          key={link.href}
          href={link.href}
          className="flex items-center gap-3 px-4 py-2 rounded-lg text-gray-700 font-semibold text-lg hover:bg-blue-100 hover:text-blue-700 transition"
        >
          <span className="text-xl">{link.icon}</span>
          {link.label}
        </Link>
      ))}
    </aside>
  );
}
