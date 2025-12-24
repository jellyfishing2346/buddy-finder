"use client";

import { useQuery } from '@tanstack/react-query';
import { getSavedPosts } from '../../src/lib/savedPosts';
import { useAuthStore } from '../../src/store/authStore';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { HashtagText } from '../../src/components/HashtagText';
import { MentionText } from '../../src/components/MentionText';

export default function SavedPostsPage() {
  const router = useRouter();
  const { user, isAuthenticated } = useAuthStore();

  const { data: posts, isLoading } = useQuery({
    queryKey: ['savedPosts'],
    queryFn: getSavedPosts,
    enabled: isAuthenticated,
  });

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, router]);

  if (!isAuthenticated) return null;

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-black border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-4 py-3 flex justify-between items-center">
          <h1 className="text-2xl font-bold">Saved Posts</h1>
          <button
            onClick={() => router.push('/feed')}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            Back to Feed
          </button>
        </div>
      </nav>
      <div className="max-w-2xl mx-auto py-8 px-4">
        {isLoading ? (
          <div className="text-center py-8">
            <p className="text-gray-600">Loading saved posts...</p>
          </div>
        ) : posts && posts.length > 0 ? (
          <div className="space-y-6">
            {posts.map((post) => (
              <SavedPostCard key={post.id} post={post} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-600 text-lg">No saved posts yet.</p>
            <p className="text-gray-500 mt-2">Save posts to see them here!</p>
          </div>
        )}
      </div>
    </div>
  );
}

function SavedPostCard({ post }: { post: any }) {
  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-100">
      <div className="p-4 flex items-center gap-3">
        <div className="w-10 h-10 bg-blue-200 rounded-full flex items-center justify-center shadow-inner">
          <span className="text-blue-700 font-bold text-lg">
            {post.user.username[0].toUpperCase()}
          </span>
        </div>
        <span className="font-semibold text-gray-800">{post.user.username}</span>
      </div>
      <img
        src={post.imageUrl}
        alt={post.caption || 'Post image'}
        className="w-full object-cover aspect-video rounded-t-xl"
      />
      <div className="p-4">
        {post.caption && (
          <p className="mb-2">
            <span className="font-semibold text-gray-700">{post.user.username}</span>{' '}
            <span className="text-gray-600">
              <MentionText text={post.caption} />
            </span>
          </p>
        )}
      </div>
    </div>
  );
}
