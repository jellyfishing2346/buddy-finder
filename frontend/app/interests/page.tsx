
"use client";
import RequireAuth from '../../src/components/RequireAuth';

export default function InterestsPage() {
  return (
    <RequireAuth>
      <div className="max-w-3xl mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-4 text-blue-700">Browse Interests</h1>
      <p className="text-gray-600 mb-8">Explore all available interests and join communities.</p>
      {/* TODO: Add interest taxonomy, search, and trending interests here */}
      <div className="rounded-lg bg-white shadow p-8 text-center text-gray-400 border border-dashed border-gray-200">
        Interest browsing coming soon.
      </div>
      </div>
    </RequireAuth>
  );
}
