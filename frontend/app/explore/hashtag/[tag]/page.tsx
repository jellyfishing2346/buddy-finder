"use client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import axios from "@/src/lib/api";
import { HashtagText } from "../../../../src/components/HashtagText";

export default function HashtagExplorePage({ params }: { params: { tag: string } }) {
  const router = useRouter();
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const tag = params.tag;

  useEffect(() => {
    if (!tag) return;
    setLoading(true);
    axios
      .get(`/explore/hashtags/${tag}/posts`)
      .then((res) => setPosts(res.data))
      .finally(() => setLoading(false));
  }, [tag]);

  return (
    <div className="max-w-2xl mx-auto py-8 px-4">
      <h1 className="text-2xl font-bold mb-4">#{tag}</h1>
      {loading ? (
        <div>Loading...</div>
      ) : posts.length === 0 ? (
        <div>No posts found for this hashtag.</div>
      ) : (
        <div className="space-y-6">
          {posts.map((post) => (
            <div key={post.id} className="bg-white rounded-xl shadow p-4">
              <div className="flex items-center gap-2 mb-2">
                <img src={post.user.profilePictureUrl || "/default-avatar.png"} className="w-8 h-8 rounded-full" />
                <span className="font-semibold">{post.user.username}</span>
              </div>
              <img src={post.imageUrl} className="w-full rounded mb-2" />
              <HashtagText text={post.caption} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
