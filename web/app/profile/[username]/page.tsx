"use client";

import { useParams } from "next/navigation";

export default function UserProfilePage() {
  //get url value
  const username = useParams().username;

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          <div className="bg-white shadow rounded-lg p-6">
            <div className="flex items-center space-x-6">
              <div className="w-24 h-24 bg-gray-300 rounded-full flex items-center justify-center">
                <span className="text-2xl font-bold text-gray-600">
                  {username && typeof username === 'string' ? username.charAt(0).toUpperCase() : 'U'}
                </span>
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900 capitalize">
                  {username || 'Unknown User'}
                </h1>
                <p className="text-gray-600">@{username || 'unknown'}</p>
                <p className="text-sm text-gray-500 mt-2">
                  This is a placeholder profile for {username}
                </p>
              </div>
            </div>
            <div className="mt-6 border-t pt-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">About</h2>
              <p className="text-gray-600">
                Welcome to {username}'s profile! This is a dynamically generated profile page.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
