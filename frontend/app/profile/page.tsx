
"use client";
import { useEffect, useState } from 'react';
import EditProfileForm from '../../src/components/EditProfileForm';

import { useParams } from 'next/navigation';
import axios from '../../src/lib/api';

import InterestSelector from '../../src/components/InterestSelector';
import MatchList from '../../src/components/MatchList';
import InterestFeed from '../../src/components/InterestFeed';


type User = {
  id: string;
  username: string;
  bio?: string;
  profilePictureUrl?: string;
};

type Post = {
  id: string;
  imageUrl: string;
  caption?: string;
};

export default function ProfilePage() {
  const params = useParams();
  // Support /profile/[username] dynamic route
  const username = Array.isArray(params.username) ? params.username[0] : params.username;
  const [user, setUser] = useState<User | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [isFollowing, setIsFollowing] = useState(false);
  const [counts, setCounts] = useState({ followers: 0, following: 0 });
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [editing, setEditing] = useState(false);


  // Fetch current user info (for auth)
  useEffect(() => {
    axios.get('/auth/me').then(res => setCurrentUser(res.data)).catch(() => setCurrentUser(null));
  }, []);

  useEffect(() => {
    if (!username) return;
    // Fetch user info and posts by username
    axios.get(`/users/by-username/${username}`).then(res => {
      setUser(res.data.user);
      setPosts(res.data.posts);
      setCounts({
        followers: res.data.followersCount,
        following: res.data.followingCount,
      });
      setIsFollowing(res.data.isFollowing);
    });
  }, [username]);

  const handleFollow = async () => {
    if (!user) return;
    await axios.post(`/api/users/${user.id}/follow`);
    setIsFollowing(true);
    setCounts(c => ({ ...c, followers: c.followers + 1 }));
  };

  const handleUnfollow = async () => {
    if (!user) return;
    await axios.post(`/api/users/${user.id}/unfollow`);
    setIsFollowing(false);
    setCounts(c => ({ ...c, followers: c.followers - 1 }));
  };


  if (!user) return <div>Loading...</div>;
  const isCurrentUser = currentUser && user && currentUser.id === user.id;

  return (
    <div className="max-w-2xl mx-auto py-8">
      <div className="flex items-center gap-4 mb-6">
        <img src={user.profilePictureUrl || '/default-avatar.png'} alt="avatar" className="w-16 h-16 rounded-full" />
        <div>
          <h2 className="text-2xl font-bold">{user.username}</h2>
          <p>{user.bio}</p>
          <div className="flex gap-4 mt-2">
            <span>{counts.followers} followers</span>
            <span>{counts.following} following</span>
          </div>
        </div>
        {/* Show follow/unfollow button if not current user */}
        {!isCurrentUser && (
          isFollowing ? (
            <button onClick={handleUnfollow} className="px-4 py-2 bg-gray-200 rounded">Unfollow</button>
          ) : (
            <button onClick={handleFollow} className="px-4 py-2 bg-blue-600 text-white rounded">Follow</button>
          )
        )}
        {/* Edit profile button for current user */}
        {isCurrentUser && !editing && (
          <button onClick={() => setEditing(true)} className="ml-4 px-4 py-2 bg-green-600 text-white rounded">Edit Profile</button>
        )}
      </div>

      {/* Edit profile form */}
      {isCurrentUser && editing && (
        <EditProfileForm
          user={user}
          onSave={updated => {
            setUser(updated);
            setEditing(false);
          }}
          onCancel={() => setEditing(false)}
        />
      )}

      {/* Interest Selector for current user */}
      {isCurrentUser && !editing && (
        <InterestSelector userId={user.id} />
      )}

      {/* Match List for current user */}
      {isCurrentUser && !editing && (
        <MatchList userId={user.id} />
      )}

      {/* Interest Feed for current user */}
      {isCurrentUser && !editing && (
        <InterestFeed userId={user.id} />
      )}

      {/* User's posts grid */}
      <div className="grid grid-cols-3 gap-4 mt-8">
        {posts.map(post => (
          <img key={post.id} src={post.imageUrl} alt={post.caption} className="w-full h-40 object-cover rounded" />
        ))}
      </div>
    </div>
  );
}