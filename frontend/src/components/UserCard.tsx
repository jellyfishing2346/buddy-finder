import type { User } from '../types';

interface UserCardProps {
  user: User;
  compatibility?: number;
  sharedInterests?: string[];
  onConnect?: () => void;
}

export default function UserCard({ user, compatibility, sharedInterests, onConnect }: UserCardProps) {
  return (
    <div className="flex items-center gap-4 bg-white rounded-lg shadow p-4 mb-4 border border-gray-100">
      <div className="w-14 h-14 rounded-full bg-gray-200 overflow-hidden border border-gray-300 flex items-center justify-center">
        {user.profilePictureUrl ? (
          <img src={user.profilePictureUrl} alt={user.username} className="w-full h-full object-cover" />
        ) : (
          <span className="text-2xl text-gray-400 font-bold">{user.username[0]?.toUpperCase()}</span>
        )}
      </div>
      <div className="flex-1">
        <div className="font-semibold text-lg text-gray-800">{user.fullName || user.username}</div>
        <div className="text-gray-500 text-sm">@{user.username}</div>
        {sharedInterests && sharedInterests.length > 0 && (
          <div className="mt-1 flex flex-wrap gap-1">
            {sharedInterests.map((interest) => (
              <span key={interest} className="bg-blue-50 text-blue-700 px-2 py-0.5 rounded text-xs font-medium border border-blue-100">
                {interest}
              </span>
            ))}
          </div>
        )}
      </div>
      {compatibility !== undefined && (
        <div className="flex flex-col items-center">
          <span className="text-blue-600 font-bold text-lg">{compatibility}%</span>
          <span className="text-xs text-gray-400">Match</span>
        </div>
      )}
      {onConnect && (
        <button
          onClick={onConnect}
          className="ml-4 px-4 py-1.5 rounded bg-blue-600 text-white font-semibold shadow hover:bg-blue-700 transition"
        >
          Connect
        </button>
      )}
    </div>
  );
}
