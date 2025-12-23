"use client";
import React, { useEffect, useState } from "react";
import axios from "../lib/api";

type Match = {
  user: {
    id: string;
    username: string;
    fullName?: string;
    profilePictureUrl?: string;
  };
  score: number;
};

interface MatchListProps {
  userId: string;
}

const MatchList: React.FC<MatchListProps> = ({ userId }) => {
  const [matches, setMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get(`/users/${userId}/matches`).then(res => {
      setMatches(res.data);
      setLoading(false);
    });
  }, [userId]);

  if (loading) return <div>Loading matches...</div>;

  return (
    <div className="p-4">
      <h2 className="text-lg font-bold mb-2">Recommended Buddies</h2>
      <ul>
        {matches.map(({ user, score }) => (
          <li key={user.id} className="flex items-center gap-3 mb-2 p-2 border rounded">
            {user.profilePictureUrl && (
              <img src={user.profilePictureUrl} alt={user.username} className="w-8 h-8 rounded-full" />
            )}
            <div>
              <div className="font-semibold">{user.fullName || user.username}</div>
              <div className="text-xs text-gray-500">Score: {score}</div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default MatchList;
