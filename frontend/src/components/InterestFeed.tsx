"use client";
import React, { useEffect, useState } from "react";
import axios from "../lib/api";

type Post = {
  id: string;
  imageUrl: string;
  caption?: string;
  user: { username: string; profilePictureUrl?: string };
  createdAt: string;
  likes: any[];
  comments: any[];
};

interface InterestFeedProps {
  userId: string;
}

const InterestFeed: React.FC<InterestFeedProps> = ({ userId }) => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get(`/users/${userId}/interest-feed`).then(res => {
      setPosts(res.data);
      setLoading(false);
    });
  }, [userId]);

  if (loading) return <div>Loading feed...</div>;

  return (
    <div className="p-4">
      <h2 className="text-lg font-bold mb-2">Your Interest Feed</h2>
      <div className="space-y-4">
        {posts.map(post => (
          <div key={post.id} className="border rounded p-3">
            <div className="flex items-center gap-2 mb-2">
              {post.user.profilePictureUrl && (
                <img src={post.user.profilePictureUrl} alt={post.user.username} className="w-7 h-7 rounded-full" />
              )}
              <span className="font-semibold">{post.user.username}</span>
              <span className="text-xs text-gray-400 ml-auto">{new Date(post.createdAt).toLocaleString()}</span>
            </div>
            <img src={post.imageUrl} alt="post" className="w-full rounded mb-2" />
            {post.caption && <div className="mb-1">{post.caption}</div>}
            <div className="text-xs text-gray-500">{post.likes.length} likes • {post.comments.length} comments</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default InterestFeed;
