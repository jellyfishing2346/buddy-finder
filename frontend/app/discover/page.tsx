"use client";
import { useEffect, useState } from 'react';
import UserCard from '../../src/components/UserCard';
import RequireAuth from '../../src/components/RequireAuth';
import { usersAPI } from '../../src/lib/api';

export default function DiscoverPage() {
  const [users, setUsers] = useState<Array<any>>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [connecting, setConnecting] = useState<string | null>(null);

  useEffect(() => {
    usersAPI.discover()
      .then(setUsers)
      .catch(() => setError('Failed to load users'))
      .finally(() => setLoading(false));
  }, []);

  const handleConnect = async (userId: string) => {
    setConnecting(userId);
    try {
      await usersAPI.connect(userId);
      setUsers((prev) => prev.map(u => u.id === userId ? { ...u, connected: true } : u));
    } catch {
      alert('Failed to send connection request');
    } finally {
      setConnecting(null);
    }
  };

  return (
    <RequireAuth>
      <div className="max-w-3xl mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-4 text-blue-700">Discover People</h1>
      <p className="text-gray-600 mb-8">Find new connections based on your interests and compatibility.</p>
      {loading ? (
        <div className="text-center text-gray-400">Loading...</div>
      ) : error ? (
        <div className="text-center text-red-500">{error}</div>
      ) : users.length === 0 ? (
        <div className="text-center text-gray-400">No users found.</div>
      ) : (
        users.map((user) => (
          <UserCard
            key={user.id}
            user={user}
            compatibility={user.compatibility}
            sharedInterests={user.sharedInterests}
            onConnect={user.connected ? undefined : () => handleConnect(user.id)}
          />
        ))
      )}
      </div>
    </RequireAuth>
  );
}
