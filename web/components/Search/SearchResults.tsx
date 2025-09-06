"use client";

import { Post, User } from "@/types";
import { useEffect, useRef } from "react";
import PostResult from "./PostResult";
import SearchInput from "./SearchInput";
import UserResult from "./UserResult";

interface SearchResultsProps {
  isOpen: boolean;
  onClose: () => void;
  searchTerm: string;
  onSearchChange: (term: string) => void;
  users: User[];
  posts: Post[];
  showPlaceholder: boolean;
  showLoading: boolean;
  showError: boolean;
  showNoResults: boolean;
  error: string | null;
}

/** Overlay box that contains search results. */
export default function SearchResults({
  isOpen,
  onClose,
  searchTerm,
  onSearchChange,
  users,
  posts,
  showPlaceholder,
  showLoading,
  showError,
  showNoResults,
  error,
}: SearchResultsProps) {
  const searchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        searchRef.current &&
        !searchRef.current.contains(event.target as Node)
      ) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <>
      {/* Mobile overlay backdrop */}
      <div
        className="fixed inset-0 bg-black/60 z-40 lg:hidden"
        onClick={onClose}
      />

      <div
        ref={searchRef}
        className="fixed top-16 left-4 right-4 bg-white border border-gray-100 rounded-2xl shadow-lg z-50 lg:absolute lg:top-full lg:right-0 lg:left-auto lg:mt-1 lg:min-w-[400px] lg:max-w-[500px]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Input - only show for mobile */}
        <div className="p-4 border-b border-gray-100 lg:hidden">
          <SearchInput
            value={searchTerm}
            onChange={onSearchChange}
            placeholder="Search users and posts..."
            autoFocus={true}
            className="w-full"
          />
        </div>

        {/* Search Results */}
        <div className="max-h-96 overflow-y-auto">
          {showPlaceholder && (
            <div className="p-4 text-[#1C1C19]/50 text-center">
              Start typing to search for users and posts
            </div>
          )}

          {showLoading && (
            <div className="p-4 text-[#1C1C19]/50 text-center">
              <div className="flex items-center justify-center space-x-2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-[#1C1C19]"></div>
                <span>Searching...</span>
              </div>
            </div>
          )}

          {showError && (
            <div className="p-4 text-red-500 text-center">{error}</div>
          )}

          {showNoResults && (
            <div className="p-4 text-[#1C1C19]/50 text-center">
              No results found for &quot;{searchTerm}&quot;
            </div>
          )}

          <div>
            {/* Users Section */}
            {users.length > 0 && (
              <div>
                <div className="px-4 py-2 text-sm font-semibold text-[#1C1C19] bg-gray-50">
                  Users
                </div>
                {users.map((user) => (
                  <UserResult
                    key={user.id}
                    user={user}
                    onResultClick={onClose}
                  />
                ))}
              </div>
            )}

            {/* Posts Section */}
            {posts.length > 0 && (
              <div>
                <div className="px-4 py-2 text-sm font-semibold text-[#1C1C19] bg-gray-50">
                  Posts
                </div>
                {posts.map((post) => (
                  <PostResult
                    key={post.id}
                    post={post}
                    onResultClick={onClose}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
