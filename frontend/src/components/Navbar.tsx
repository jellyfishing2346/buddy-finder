"use client";
import Link from 'next/link';
import { useAuthStore } from '../store/authStore';

export default function Navbar() {
  const user = useAuthStore((state) => state.user);
  return (
    <nav className="w-full bg-white/80 backdrop-blur border-b border-gray-200 shadow-sm px-6 py-3 flex items-center justify-between sticky top-0 z-40">
      <Link href="/" className="flex items-center gap-2">
        <span className="text-blue-600 font-extrabold text-2xl tracking-tight">Buddy Finder</span>
      </Link>
      <div className="flex items-center gap-6 text-gray-700 font-medium">
        <Link href="/feed" className="hover:text-blue-600 transition-colors">Feed</Link>
        <Link href="/discover" className="hover:text-blue-600 transition-colors">Discover</Link>
        <Link href="/interests" className="hover:text-blue-600 transition-colors">Interests</Link>
        <Link href="/explore/hashtags" className="hover:text-blue-600 transition-colors">Hashtags</Link>
        {user ? (
          <Link href={`/profile/${user.username}`} className="hover:text-blue-600 transition-colors flex items-center gap-2">
            <span className="inline-block w-8 h-8 rounded-full bg-gray-200 overflow-hidden border border-gray-300">
              {user.profilePictureUrl ? (
                <img src={user.profilePictureUrl} alt="Profile" className="w-full h-full object-cover" />
              ) : (
                <span className="w-full h-full flex items-center justify-center text-gray-400 text-lg font-bold">{user.username[0]?.toUpperCase()}</span>
              )}
            </span>
            <span className="hidden sm:inline">Profile</span>
          </Link>
        ) : (
          <Link href="/login" className="px-4 py-1.5 rounded bg-blue-600 text-white font-semibold shadow hover:bg-blue-700 transition">Login</Link>
        )}
      </div>
    </nav>
  );
}
