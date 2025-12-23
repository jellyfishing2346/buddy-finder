"use client";
import React, { useEffect, useState } from 'react';
import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

function UserList({ users, onUnfollow }: { users: any[]; onUnfollow?: (id: string) => void }) {
  return (
    <ul className="divide-y divide-gray-200">
      {users.map(user => (
        <li key={user.id} className="flex items-center py-2">
          <img src={user.profilePictureUrl || '/default-avatar.png'} alt={user.username} className="w-8 h-8 rounded-full mr-2" />
          <span className="font-bold mr-2">{user.username}</span>
          {onUnfollow && (
            <button className="ml-auto px-2 py-1 bg-red-500 text-white rounded" onClick={() => onUnfollow(user.id)}>
              Unfollow
            </button>
          )}
        </li>
      ))}
    </ul>
  );
}

export default function FollowersFollowingPage() {
  const [followers, setFollowers] = useState([]);
  const [following, setFollowing] = useState([]);
  const [userId, setUserId] = useState('');

  useEffect(() => {
    const uid = localStorage.getItem('userId') || '';
    setUserId(uid);
    if (uid) {
      axios.get(`${API_URL}/users/${uid}/followers`).then(res => setFollowers(res.data));
      axios.get(`${API_URL}/users/${uid}/following`).then(res => setFollowing(res.data));
    }
  }, []);

  const handleUnfollow = async (id: string) => {
    await axios.post(`${API_URL}/users/${id}/unfollow`, {}, { withCredentials: true });
    setFollowing(following.filter((u: any) => u.id !== id));
  };

  return (
    <div className="max-w-2xl mx-auto py-8 px-4">
      <h1 className="text-2xl font-bold mb-4">Followers &amp; Following</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <h2 className="text-lg font-semibold mb-2">Followers</h2>
          <UserList users={followers} />
        </div>
        <div>
          <h2 className="text-lg font-semibold mb-2">Following</h2>
          <UserList users={following} onUnfollow={handleUnfollow} />
        </div>
      </div>
    </div>
  );
}
