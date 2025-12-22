'use client';

import { useQuery } from '@tanstack/react-query';
import { postsAPI } from '../../src/lib/api';
import { useAuthStore } from '../../src/store/authStore';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function FeedPage() {
  const router = useRouter();
  const { user, logout, isAuthenticated } = useAuthStore();
  const [showCreatePost, setShowCreatePost] = useState(false);

  // Fetch posts
  const { data: posts, isLoading, refetch } = useQuery({
    queryKey: ['posts'],
    queryFn: postsAPI.getPosts,
    enabled: isAuthenticated,
  });

  useEffect(() => {
  if (!isAuthenticated) {
    router.push('/login');
  }
}, [isAuthenticated, router]);

if (!isAuthenticated) {
  return null;
}

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation Bar */}
      <nav className="bg-black border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-4 py-3 flex justify-between items-center">
          <h1 className="text-2xl font-bold">Buddy Finder</h1>
          
          <div className="flex items-center gap-4">
            <button
              onClick={() => setShowCreatePost(true)}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
            >
              Create Post
            </button>
            
            <div className="flex items-center gap-3">
              <span className="text-sm font-medium">{user?.username}</span>
              <button
                onClick={handleLogout}
                className="text-sm text-gray-600 hover:text-gray-900"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Feed Content */}
      <div className="max-w-2xl mx-auto py-8 px-4">
        {isLoading ? (
          <div className="text-center py-8">
            <p className="text-gray-600">Loading posts...</p>
          </div>
        ) : posts && posts.length > 0 ? (
          <div className="space-y-6">
            {posts.map((post) => (
              <PostCard key={post.id} post={post} onUpdate={refetch} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-600 text-lg">No posts yet.</p>
            <p className="text-gray-500 mt-2">Be the first to create one!</p>
          </div>
        )}
      </div>

      {/* Create Post Modal */}
      {showCreatePost && (
        <CreatePostModal
          onClose={() => setShowCreatePost(false)}
          onSuccess={() => {
            setShowCreatePost(false);
            refetch();
          }}
        />
      )}
    </div>
  );
}

// Post Card Component
function PostCard({ post, onUpdate }: { post: any; onUpdate: () => void }) {
  const { user } = useAuthStore();
  const [showComments, setShowComments] = useState(false);
  const [comment, setComment] = useState('');
  const [isLiking, setIsLiking] = useState(false);

  const handleLike = async () => {
    setIsLiking(true);
    try {
      await postsAPI.likePost(post.id);
      onUpdate();
    } catch (error) {
      console.error('Like error:', error);
    } finally {
      setIsLiking(false);
    }
  };

  const handleComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!comment.trim()) return;

    try {
      await postsAPI.commentOnPost(post.id, comment);
      setComment('');
      onUpdate();
    } catch (error) {
      console.error('Comment error:', error);
    }
  };

  const handleDelete = async () => {
    if (confirm('Are you sure you want to delete this post?')) {
      try {
        await postsAPI.deletePost(post.id);
        onUpdate();
      } catch (error) {
        console.error('Delete error:', error);
      }
    }
  };

  return (
    <div className="bg-white rounded-lg shadow border border-gray-200">
      {/* Post Header */}
      <div className="p-4 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
            <span className="text-white font-semibold">
              {post.user.username[0].toUpperCase()}
            </span>
          </div>
          <span className="font-semibold">{post.user.username}</span>
        </div>
        
        {post.userId === user?.id && (
          <button
            onClick={handleDelete}
            className="text-red-600 hover:text-red-700 text-sm"
          >
            Delete
          </button>
        )}
      </div>

      {/* Post Image */}
      <img
        src={post.imageUrl}
        alt={post.caption || 'Post image'}
        className="w-full object-cover max-h-96"
      />

      {/* Post Actions */}
      <div className="p-4">
        <div className="flex gap-4 mb-3">
          <button
            onClick={handleLike}
            disabled={isLiking}
            className="hover:text-gray-600"
          >
              ❤️ {post._count?.likes ?? 0}
          </button>
          <button
            onClick={() => setShowComments(!showComments)}
            className="hover:text-gray-600"
          >
              💬 {post._count?.comments ?? 0}
          </button>
        </div>

        {/* Caption */}
        {post.caption && (
          <p className="mb-2">
            <span className="font-semibold">{post.user.username}</span>{' '}
            {post.caption}
          </p>
        )}

        {/* Comments Section */}
        {showComments && (
          <div className="mt-4 space-y-3">
            <CommentsSection postId={post.id} />
            
            {/* Add Comment */}
            <form onSubmit={handleComment} className="flex gap-2">
              <input
                type="text"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Add a comment..."
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Post
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}

// Comments Section Component
function CommentsSection({ postId }: { postId: string }) {
  const { data: comments } = useQuery({
    queryKey: ['comments', postId],
    queryFn: () => postsAPI.getComments(postId),
  });

  if (!comments || comments.length === 0) {
    return <p className="text-gray-500 text-sm">No comments yet.</p>;
  }

  return (
    <div className="space-y-2">
      {comments.map((comment) => (
        <div key={comment.id} className="text-sm">
          <span className="font-semibold">{comment.user.username}</span>{' '}
          {comment.content}
        </div>
      ))}
    </div>
  );
}

// Create Post Modal Component
function CreatePostModal({
  onClose,
  onSuccess,
}: {
  onClose: () => void;
  onSuccess: () => void;
}) {
  const [imageUrl, setImageUrl] = useState('');
  const [caption, setCaption] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!imageUrl.trim()) {
      setError('Image URL is required');
      return;
    }

    setLoading(true);
    setError('');

    try {
      await postsAPI.createPost({ imageUrl, caption });
      onSuccess();
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to create post');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-md w-full p-6">
        <h2 className="text-2xl font-bold mb-4">Create New Post</h2>
        
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">
              Image URL
            </label>
            <input
              type="url"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              placeholder="https://example.com/image.jpg"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
            <p className="text-xs text-gray-500 mt-1">
              Try: https://images.unsplash.com/photo-1506748686214-e9df14d4d9d0
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Caption (optional)
            </label>
            <textarea
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              placeholder="Write a caption..."
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
            >
              {loading ? 'Creating...' : 'Create Post'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}