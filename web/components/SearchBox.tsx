"use client";

import { Post, User } from "@/types";
import { search } from "@/utils/api";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { SearchIcon } from "./General/Icons";
import TextInput from "./General/TextInput";

interface SearchBoxProps {
  isOpen: boolean;
  onClose: () => void;
  searchTerm: string;
  onSearchChange: (term: string) => void;
}

export default function SearchBox({
  isOpen,
  onClose,
  searchTerm,
  onSearchChange,
}: SearchBoxProps) {
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [filteredPosts, setFilteredPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
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

  useEffect(() => {
    const performSearch = async () => {
      if (searchTerm.trim()) {
        setIsLoading(true);
        setError(null);

        try {
          const results = await search(searchTerm.trim());
          // The API returns SearchResult[], but based on the types it should return SearchResult
          // Let's handle both cases for safety
          if (Array.isArray(results) && results.length > 0) {
            setFilteredUsers(results[0].users || []);
            setFilteredPosts(results[0].posts || []);
          } else if (
            results &&
            typeof results === "object" &&
            "users" in results &&
            "posts" in results
          ) {
            const searchResult = results as { users: User[]; posts: Post[] };
            setFilteredUsers(searchResult.users || []);
            setFilteredPosts(searchResult.posts || []);
          } else {
            setFilteredUsers([]);
            setFilteredPosts([]);
          }
        } catch (err) {
          console.error("Search error:", err);
          setError("Failed to search. Please try again.");
          setFilteredUsers([]);
          setFilteredPosts([]);
        } finally {
          setIsLoading(false);
        }
      } else {
        setFilteredUsers([]);
        setFilteredPosts([]);
        setError(null);
        setIsLoading(false);
      }
    };

    // Debounce the search to avoid too many API calls
    const timeoutId = setTimeout(performSearch, 300);
    return () => clearTimeout(timeoutId);
  }, [searchTerm]);

  if (!isOpen) return null;

  const hasResults = filteredUsers.length > 0 || filteredPosts.length > 0;
  const showPlaceholder = searchTerm.trim() === "";
  const showError = error !== null;
  const showLoading = isLoading && searchTerm.trim() !== "";
  const showNoResults =
    !showPlaceholder &&
    !showLoading &&
    !showError &&
    !hasResults &&
    searchTerm.trim() !== "";

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
          <TextInput
            icon={<SearchIcon className="text-gray-400" size={20} />}
            placeholder="Search users and posts..."
            value={searchTerm}
            onChange={onSearchChange}
            autoFocus={true}
            containerClassName="w-full"
          />
        </div>

        {/* Search Results */}
        <div className="max-h-96 overflow-y-auto">
          {showPlaceholder ? (
            <div className="p-4 text-[#1C1C19]/50 text-center">
              Start typing to search for users and posts
            </div>
          ) : showLoading ? (
            <div className="p-4 text-[#1C1C19]/50 text-center">
              <div className="flex items-center justify-center space-x-2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-[#1C1C19]"></div>
                <span>Searching...</span>
              </div>
            </div>
          ) : showError ? (
            <div className="p-4 text-red-500 text-center">{error}</div>
          ) : showNoResults ? (
            <div className="p-4 text-[#1C1C19]/50 text-center">
              No results found for &quot;{searchTerm}&quot;
            </div>
          ) : (
            <div>
              {/* Users Section */}
              {filteredUsers.length > 0 && (
                <div>
                  <div className="px-4 py-2 text-sm font-semibold text-[#1C1C19] bg-gray-50">
                    Users
                  </div>
                  {filteredUsers.map((user) => (
                    <Link
                      key={user.id}
                      href={`/profile/${user.username}`}
                      onClick={onClose}
                      className="flex items-center px-4 py-3 hover:bg-gray-50 border-b border-gray-100 last:border-b-0 transition-colors"
                    >
                      <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center mr-3 overflow-hidden">
                        {user.profilePictureUrl ? (
                          <Image
                            src={user.profilePictureUrl}
                            alt={user.name}
                            width={40}
                            height={40}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <span className="text-[#1C1C19] font-medium">
                            {user.name.charAt(0).toUpperCase()}
                          </span>
                        )}
                      </div>
                      <div className="flex-1">
                        <div className="font-medium text-[#1C1C19]">
                          {user.name}
                        </div>
                        <div className="text-sm text-[#1C1C19]/50">
                          @{user.username}
                        </div>
                      </div>
                      <div className="text-sm text-[#1C1C19]/50">
                        {user.followerCount} followers
                      </div>
                    </Link>
                  ))}
                </div>
              )}

              {/* Posts Section */}
              {filteredPosts.length > 0 && (
                <div>
                  <div className="px-4 py-2 text-sm font-semibold text-[#1C1C19] bg-gray-50">
                    Posts
                  </div>
                  {filteredPosts.map((post) => (
                    <Link
                      key={post.id}
                      href={`/post/${post.id}`}
                      onClick={onClose}
                      className="block px-4 py-3 hover:bg-gray-50 border-b border-gray-100 last:border-b-0 transition-colors"
                    >
                      <div className="font-medium text-[#1C1C19] mb-1">
                        {post.title}
                      </div>
                      <div className="text-sm text-[#1C1C19]/70 mb-2 line-clamp-2">
                        {post.content}
                      </div>
                      <div className="flex items-center text-xs text-[#1C1C19]/50">
                        <span>by @{post.author.username}</span>
                        <span className="mx-2">•</span>
                        <span>
                          {new Date(post.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
