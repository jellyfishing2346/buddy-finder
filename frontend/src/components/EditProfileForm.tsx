"use client";
import React, { useState } from 'react';
import axios from '../lib/api';

type Props = {
  user: {
    id: string;
    username: string;
    fullName?: string;
    bio?: string;
    profilePictureUrl?: string;
    email?: string;
  };
  onSave: (user: any) => void;
  onCancel: () => void;
};

export default function EditProfileForm({ user, onSave, onCancel }: Props) {
  const [form, setForm] = useState({
    fullName: user.fullName || '',
    bio: user.bio || '',
    profilePictureUrl: user.profilePictureUrl || '',
    email: user.email || '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await axios.put(`/api/users/${user.id}`, form);
      onSave(res.data);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-4 border rounded bg-white">
      <div>
        <label className="block font-semibold">Full Name</label>
        <input name="fullName" value={form.fullName} onChange={handleChange} className="w-full border rounded px-2 py-1" />
      </div>
      <div>
        <label className="block font-semibold">Bio</label>
        <textarea name="bio" value={form.bio} onChange={handleChange} className="w-full border rounded px-2 py-1" />
      </div>
      <div>
        <label className="block font-semibold">Profile Picture URL</label>
        <input name="profilePictureUrl" value={form.profilePictureUrl} onChange={handleChange} className="w-full border rounded px-2 py-1" />
      </div>
      <div>
        <label className="block font-semibold">Email</label>
        <input name="email" value={form.email} onChange={handleChange} className="w-full border rounded px-2 py-1" />
      </div>
      {error && <div className="text-red-500">{error}</div>}
      <div className="flex gap-2">
        <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded" disabled={loading}>{loading ? 'Saving...' : 'Save'}</button>
        <button type="button" className="px-4 py-2 bg-gray-200 rounded" onClick={onCancel}>Cancel</button>
      </div>
    </form>
  );
}
