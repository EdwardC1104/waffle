"use client";

import useAuth from "@/hooks/useAuth";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import FeedTabs from "./feed/FeedTabs";
import Search from "./search/Search";

export function Navbar() {
  const pathname = usePathname();
  const isFeedPage = pathname?.startsWith("/feed");
  const { user, isAuthenticated, isLoading } = useAuth();

  return (
    <nav className="bg-white border-b border-gray-100 sticky top-0 z-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center h-16">
          <div className="flex-shrink-0 flex-1">
            <Link href="/" className="flex items-center space-x-2 flex-1">
              <Image
                src="/logo.svg"
                alt="Waffle logo"
                height={39}
                width={130}
                className="h-8 w-auto sm:h-10"
              />
            </Link>
          </div>

          {isFeedPage && (
            <div className="hidden lg:flex flex-1 justify-center">
              <FeedTabs />
            </div>
          )}

          <div className="hidden lg:flex flex-shrink-0 flex-1 justify-end items-center space-x-4">
            {isAuthenticated && <Search />}

            {!isLoading && !isAuthenticated && (
              <div className="flex items-center space-x-4">
                <Link
                  href="/login"
                  className="text-sm font-medium text-gray-700 hover:text-gray-900"
                >
                  Login
                </Link>
                <Link
                  href="/signup"
                  className="bg-stone-900 text-white px-4 py-2 rounded-full text-sm font-medium hover:bg-stone-800"
                >
                  Sign Up
                </Link>
                <div />
              </div>
            )}
          </div>

          <div className="flex lg:hidden flex-1 justify-end items-center space-x-3 sm:space-x-4">
            {isAuthenticated && (
              <>
                <Link
                  href={`/profile/${user?.username || ""}`}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    className="text-gray-600"
                  >
                    <path
                      d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <circle
                      cx="12"
                      cy="7"
                      r="4"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </Link>
                <Search />
              </>
            )}

            {!isAuthenticated && !isLoading && (
              <div className="flex items-center space-x-2">
                <Link
                  href="/login"
                  className="text-sm font-medium text-gray-700 hover:text-gray-900"
                >
                  Login
                </Link>
                <Link
                  href="/signup"
                  className="bg-stone-900 text-white px-3 py-1.5 rounded-full text-sm font-medium hover:bg-stone-800"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>

      {isFeedPage && (
        <div className="lg:hidden border-t border-gray-100 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3">
            <FeedTabs />
          </div>
        </div>
      )}
    </nav>
  );
}
