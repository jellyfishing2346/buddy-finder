"use client";
import React, { useEffect, useState } from 'react';
import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export default function ExplorePage() {
  const [posts, setPosts] = useState([]);
  const [users, setUsers] = useState([]);
  const [userId, setUserId] = useState(''); // TODO: get from auth

  useEffect(() => {
    setUserId(localStorage.getItem('userId') || '');
    axios.get(`${API_URL}/explore`, { params: { userId } })
      .then(res => {
        setPosts(res.data.posts);
        setUsers(res.data.users);
      });
  }, [userId]);

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-6 text-blue-700">Explore</h1>
      <h2 className="text-xl font-semibold mb-2">Suggested Users</h2>
      <div className="flex flex-wrap gap-4 mb-8">
        {users.map((user: any) => (
          <div key={user.id} className="bg-white shadow rounded p-4 w-48 text-center">
            <img src={user.profilePictureUrl || '/default-avatar.png'} alt={user.username} className="w-16 h-16 rounded-full mx-auto mb-2" />
            <div className="font-bold">{user.username}</div>
            <div className="text-xs text-gray-500">{user.bio}</div>
          </div>
        ))}
      </div>
      <h2 className="text-xl font-semibold mb-2">Trending Posts</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {posts.map((post: any) => (
          <div key={post.id} className="bg-white shadow rounded p-4">
            <div className="flex items-center mb-2">
              <img src={post.user.profilePictureUrl || '/default-avatar.png'} alt={post.user.username} className="w-8 h-8 rounded-full mr-2" />
              <span className="font-bold">{post.user.username}</span>
            </div>
            <img src={post.imageUrl} alt="post" className="w-full h-48 object-cover rounded mb-2" />
            <div>{post.caption}</div>
            <div className="text-xs text-gray-500 mt-2">{post.likes.length} likes • {post.comments.length} comments</div>
          </div>
        ))}
      </div>
    </div>
  );
}
