
"use client";

import { useState } from 'react';
import RequireAuth from '../../src/components/RequireAuth';
import { useAuthStore } from '../../src/store/authStore';
import { usersAPI } from '../../src/lib/api';

export default function SettingsPage() {
  const user = useAuthStore((state) => state.user);
  const setAuth = useAuthStore((state) => state.setAuth);
  const [fullName, setFullName] = useState(user?.fullName || '');
  const [email, setEmail] = useState(user?.email || '');
  const [bio, setBio] = useState(user?.bio || '');
  const [profilePictureUrl, setProfilePictureUrl] = useState(user?.profilePictureUrl || '');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');
    try {
      if (!user) throw new Error('Not authenticated');
      const updated = await usersAPI.updateProfile(user.id, {
        fullName,
        email,
        bio,
        profilePictureUrl,
      });
      setAuth(updated, localStorage.getItem('token') || '');
      setSuccess('Profile updated successfully!');
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  return (
    <RequireAuth>
      <div className="max-w-3xl mx-auto py-8 px-4">
        <h1 className="text-3xl font-bold mb-4 text-blue-700">Settings</h1>
        <p className="text-gray-600 mb-8">Manage your account, privacy, and preferences.</p>
        <form className="bg-white rounded-lg shadow p-8 mb-8" onSubmit={handleSubmit}>
          <h2 className="text-xl font-semibold mb-4 text-black">Profile Information</h2>
          {success && <div className="mb-4 text-green-600">{success}</div>}
          {error && <div className="mb-4 text-red-600">{error}</div>}
          <div className="mb-4">
            <label className="block text-gray-700 mb-1">Full Name</label>
            <input
              type="text"
              className="w-full border rounded px-3 py-2"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="Full Name"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 mb-1">Email</label>
            <input
              type="email"
              className="w-full border rounded px-3 py-2"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 mb-1">Bio</label>
            <textarea
              className="w-full border rounded px-3 py-2"
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="Tell us about yourself"
              rows={3}
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 mb-1">Profile Picture URL</label>
            <input
              type="url"
              className="w-full border rounded px-3 py-2"
              value={profilePictureUrl}
              onChange={(e) => setProfilePictureUrl(e.target.value)}
              placeholder="https://..."
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? 'Saving...' : 'Save Changes'}
          </button>
        </form>
      </div>
    </RequireAuth>
  );
}
