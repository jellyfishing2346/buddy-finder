"use client";
import Link from 'next/link';
import { useAuthStore } from '../store/authStore';

export default function Navbar() {
  const user = useAuthStore((state) => state.user);
  return (
    <nav className="navbar" style={{ position: 'sticky', top: 0, zIndex: 40, background: 'rgba(255,255,255,0.92)', backdropFilter: 'blur(8px)' }}>
      <div style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '2.5em' }}>
        <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '0.5em', textDecoration: 'none' }}>
          <span style={{ color: 'var(--color-primary-600, #6366f1)', fontWeight: 800, fontSize: '2rem', letterSpacing: '-1px', fontFamily: 'General Sans, Inter, Segoe UI, Arial, sans-serif' }}>
            Buddy Finder
          </span>
        </Link>
        <div style={{ display: 'flex', alignItems: 'center', gap: '2em', fontWeight: 500 }}>
          <Link href="/feed" className="nav-link">Feed</Link>
          <Link href="/discover" className="nav-link">Discover</Link>
          <Link href="/interests" className="nav-link">Interests</Link>
          <Link href="/explore/hashtags" className="nav-link">Hashtags</Link>
          {user ? (
            <Link href={`/profile/${user.username}`} className="nav-link" style={{ display: 'flex', alignItems: 'center', gap: '0.5em' }}>
              <span style={{ display: 'inline-block', width: 32, height: 32, borderRadius: '50%', background: 'var(--color-neutral-200, #e7e5e4)', overflow: 'hidden', border: '2px solid var(--color-primary-200, #c7cfff)' }}>
                {user.profilePictureUrl ? (
                  <img src={user.profilePictureUrl} alt="Profile" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                ) : (
                  <span style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-primary-600, #6366f1)', fontSize: '1.1rem', fontWeight: 700 }}>
                    {user.username[0]?.toUpperCase()}
                  </span>
                )}
              </span>
              <span style={{ display: 'inline' }}>Profile</span>
            </Link>
          ) : (
            <Link href="/login" className="btn" style={{ padding: '0.5em 1.2em', fontSize: '1rem', fontWeight: 600 }}>Login</Link>
          )}
        </div>
      </div>
    </nav>
  );
}
