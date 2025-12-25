"use client";
import { useState } from "react";
import axios from "@/src/lib/api";
import Link from "next/link";
import RequireAuth from "@/src/components/RequireAuth";

export default function HashtagSearchPage() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    setLoading(true);
    const res = await axios.get(`/explore/hashtags/search?q=${encodeURIComponent(query)}`);
    setResults(res.data);
    setLoading(false);
  };

  return (
    <RequireAuth>
      <div className="max-w-xl mx-auto py-8 px-4">
        <h1 className="text-2xl font-bold mb-4">Search Hashtags</h1>
        <form onSubmit={handleSearch} className="flex gap-2 mb-4">
          <input
            type="text"
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Search hashtags..."
            className="flex-1 px-3 py-2 border rounded"
          />
          <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded" disabled={loading}>
            {loading ? "Searching..." : "Search"}
          </button>
        </form>
        <ul className="divide-y divide-gray-200">
          {results.map((hashtag) => (
            <li key={hashtag.id} className="py-2">
              <Link href={`/explore/hashtag/${hashtag.tag}`} className="text-blue-600 hover:underline">
                #{hashtag.tag}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </RequireAuth>
  );
}
