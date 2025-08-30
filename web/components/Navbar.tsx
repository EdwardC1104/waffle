"use client";

import { useAuth } from "@/hooks/useAuth";
import { useUser } from "@/hooks/useUser";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export function Navbar() {
  const { user, loading } = useUser();
  const { signOut } = useAuth();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleSignOut = async () => {
    await signOut();
    router.push("/");
  };

  // Prevent hydration mismatch by not rendering user-dependent content until mounted
  if (!mounted) {
    return (
      <nav className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              <div className="flex-shrink-0 flex items-center">
                <Link href="/" className="flex items-center space-x-2">
                  <Image
                    src="/logo.svg"
                    alt="Waffle logo"
                    height={39}
                    width={130}
                  />
                </Link>
              </div>
            </div>
            <div className="flex items-center">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-gray-900"></div>
            </div>
          </div>
        </div>
      </nav>
    );
  }

  return (
    <nav className="bg-white shadow">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <Link href="/" className="flex items-center space-x-2">
                <Image
                  src="/logo.svg"
                  alt="Waffle logo"
                  height={39}
                  width={130}
                />
              </Link>
            </div>
            <div className="ml-6 flex space-x-8">
              {user && (
                <Link
                  href="/profile"
                  className="border-transparent text-gray-500 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium transition-colors"
                >
                  Profile
                </Link>
              )}
            </div>
          </div>
          <div className="flex items-center">
            {loading ? (
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-gray-900"></div>
            ) : user ? (
              <div className="flex items-center space-x-4">
                <span className="text-sm text-gray-700">
                  {user.user_metadata?.full_name ||
                    user.user_metadata?.name ||
                    user.email}
                </span>
                <button
                  onClick={handleSignOut}
                  className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Link
                  href="/login"
                  className="text-gray-700 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  href="/signup"
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
