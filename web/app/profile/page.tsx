"use client";

import { useAuth } from "@/hooks/useAuth";
import { useUser } from "@/hooks/useUser";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function ProfilePage() {
  const { user, loading } = useUser();
  const { signOut } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!user && !loading) {
      router.push("/login");
    }
  }, [user, loading, router]);

  const handleSignOut = async () => {
    await signOut();
    router.push("/");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  if (!user) {
    return null; // Will redirect via useEffect
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          {/* Profile Header */}
          <div className="bg-white shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  {user.user_metadata?.avatar_url ? (
                    <Image
                      className="h-20 w-20 rounded-full"
                      src={user.user_metadata.avatar_url}
                      alt="Profile"
                      width={80}
                      height={80}
                    />
                  ) : (
                    <div className="h-20 w-20 rounded-full bg-gray-300 flex items-center justify-center">
                      <svg
                        className="h-12 w-12 text-gray-400"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M24 20.993V24H0v-2.996A14.977 14.977 0 0112.004 15c4.904 0 9.26 2.354 11.996 5.993zM16.002 8.999a4 4 0 11-8 0 4 4 0 018 0z" />
                      </svg>
                    </div>
                  )}
                </div>
                <div className="ml-5 flex-1">
                  <h1 className="text-2xl font-bold text-gray-900">
                    {user.user_metadata?.full_name ||
                      user.user_metadata?.name ||
                      "User"}
                  </h1>
                  <p className="text-sm text-gray-500">{user.email}</p>
                </div>
                <div className="ml-5">
                  <button
                    onClick={handleSignOut}
                    className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors"
                  >
                    Sign Out
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Profile Details */}
          <div className="mt-6 bg-white shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <h2 className="text-lg font-medium text-gray-900 mb-4">
                Profile Information
              </h2>
              <dl className="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2">
                <div>
                  <dt className="text-sm font-medium text-gray-500">User ID</dt>
                  <dd className="mt-1 text-sm text-gray-900">{user.id}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Email</dt>
                  <dd className="mt-1 text-sm text-gray-900">{user.email}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">
                    Provider
                  </dt>
                  <dd className="mt-1 text-sm text-gray-900">
                    {user.app_metadata?.provider || "Unknown"}
                  </dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">
                    Last Sign In
                  </dt>
                  <dd className="mt-1 text-sm text-gray-900">
                    {user.last_sign_in_at
                      ? new Date(user.last_sign_in_at).toLocaleDateString()
                      : "Never"}
                  </dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">
                    Account Created
                  </dt>
                  <dd className="mt-1 text-sm text-gray-900">
                    {new Date(user.created_at).toLocaleDateString()}
                  </dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">
                    Email Verified
                  </dt>
                  <dd className="mt-1 text-sm text-gray-900">
                    {user.email_confirmed_at ? (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        Verified
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                        Unverified
                      </span>
                    )}
                  </dd>
                </div>
              </dl>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
