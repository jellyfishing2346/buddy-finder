
"use client";
import RequireAuth from '../../src/components/RequireAuth';

export default function MessagesPage() {
  return (
    <RequireAuth>
      <div className="max-w-3xl mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-4 text-blue-700">Messages</h1>
      <p className="text-gray-600 mb-8">Chat with your connections in real time.</p>
      {/* TODO: Add conversation list and chat UI here */}
      <div className="rounded-lg bg-white shadow p-8 text-center text-gray-400 border border-dashed border-gray-200">
        Messaging features coming soon.
      </div>
      </div>
    </RequireAuth>
  );
}
