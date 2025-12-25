'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { authAPI } from '../../src/lib/api';
import { useAuthStore } from '../../src/store/authStore';

export default function LoginPage() {
  const router = useRouter();
  const setAuth = useAuthStore((state: { setAuth: (user: any, token: string) => void }) => state.setAuth);
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const data = await authAPI.login({ email, password });
      setAuth(data.user, data.token);
      router.push('/');
    } catch (err: any) {
      setError(err.response?.data?.error || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'none' }}>
      <div style={{ width: '100%', maxWidth: 410, background: 'rgba(24,24,28,0.82)', boxShadow: '0 8px 32px rgba(99,102,241,0.13)', borderRadius: '1.5rem', padding: '2.5rem 2rem', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2.2rem' }}>
        <div style={{ width: '100%', textAlign: 'center' }}>
          <h1 style={{ fontSize: '2.3rem', fontWeight: 700, marginBottom: '0.5em', textAlign: 'center', color: 'var(--foreground-inverted)' }}>Buddy Finder</h1>
          <h2 style={{ fontSize: '1.3rem', fontWeight: 500, marginBottom: '1.5em', textAlign: 'center', color: 'var(--foreground-secondary)' }}>Log in to your account</h2>
        </div>
        <form onSubmit={handleLogin} style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.7rem' }}>
          {error && (
            <div style={{ background: 'var(--color-accent-50, #fff1f2)', border: '1px solid var(--color-accent-200, #fecdd3)', color: 'var(--color-accent-700, #be123c)', padding: '0.75em 1em', borderRadius: '8px', marginBottom: '1em', textAlign: 'center', width: '100%' }}>
              {error}
            </div>
          )}
          <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '1.1rem' }}>
            <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <label htmlFor="email" style={{ fontWeight: 600, marginBottom: '0.2em', textAlign: 'left', fontSize: '1.08rem', color: 'var(--foreground-inverted)' }}>Email</label>
              <input
                id="email"
                name="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email address"
                style={{ maxWidth: 320, width: '100%', background: 'rgba(255,255,255,0.09)', border: '1.5px solid var(--color-primary-400)', color: 'var(--foreground-inverted)', fontSize: '1.04rem', fontWeight: 500, letterSpacing: '0.01em' }}
              />
            </div>
            <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <label htmlFor="password" style={{ fontWeight: 600, marginBottom: '0.2em', textAlign: 'left', fontSize: '1.08rem', color: 'var(--foreground-inverted)' }}>Password</label>
              <input
                id="password"
                name="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                style={{ maxWidth: 320, width: '100%', background: 'rgba(255,255,255,0.09)', border: '1.5px solid var(--color-primary-400)', color: 'var(--foreground-inverted)', fontSize: '1.04rem', fontWeight: 500, letterSpacing: '0.01em' }}
              />
            </div>
          </div>
          <button
            type="submit"
            disabled={loading}
            className="btn"
            style={{ width: 210, alignSelf: 'center', marginTop: '0.7em', marginBottom: '0.7em', fontSize: '1.08rem' }}
          >
            {loading ? 'Logging in...' : 'Log in'}
          </button>
          <div style={{ textAlign: 'center', width: '100%' }}>
            <span style={{ color: 'var(--foreground-secondary)', fontSize: '1.01em' }}>
              Don't have an account?{' '}
              <Link href="/signup" style={{ color: 'var(--color-primary-400)', fontWeight: 600 }}>Sign up</Link>
            </span>
          </div>
        </form>
      </div>
    </div>
  );
  }