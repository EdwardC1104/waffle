"use client";

import { Post, User } from "@/types";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { SearchIcon } from "./Icons";
import TextInput from "./TextInput";

interface SearchBoxProps {
  isOpen: boolean;
  onClose: () => void;
  searchTerm: string;
  onSearchChange: (term: string) => void;
}

// Dummy data for testing
const dummyUsers: User[] = [
  {
    id: "1",
    name: "John Doe",
    username: "johndoe",
    email: "john@example.com",
    profilePictureUrl:
      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
    followerCount: 120,
    followingCount: 89,
  },
  {
    id: "2",
    name: "Jane Smith",
    username: "janesmith",
    email: "jane@example.com",
    profilePictureUrl:
      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
    followerCount: 340,
    followingCount: 156,
  },
  {
    id: "3",
    name: "Mike Johnson",
    username: "mikej",
    email: "mike@example.com",
    profilePictureUrl:
      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
    followerCount: 89,
    followingCount: 67,
  },
];

const dummyPosts: Post[] = [
  {
    id: 1,
    title: "Getting Started with React",
    content: "Learn the basics of React development...",
    coverImageUrl:
      "https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=600&h=300&fit=crop",
    author: dummyUsers[0],
    createdAt: "2024-01-15T10:30:00Z",
    likeCount: 0,
    likedByAuthenticatedUser: false,
  },
  {
    id: 2,
    title: "JavaScript Best Practices",
    content: "Tips and tricks for writing better JavaScript...",
    coverImageUrl:
      "https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=600&h=300&fit=crop",
    author: dummyUsers[1],
    createdAt: "2024-01-14T15:45:00Z",
    likeCount: 0,
    likedByAuthenticatedUser: false,
  },
  {
    id: 3,
    title: "CSS Grid vs Flexbox",
    content: "Understanding when to use each layout method...",
    coverImageUrl:
      "https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=600&h=300&fit=crop",
    author: dummyUsers[2],
    createdAt: "2024-01-13T09:20:00Z",
    likeCount: 0,
    likedByAuthenticatedUser: false,
  },
];

export default function SearchBox({
  isOpen,
  onClose,
  searchTerm,
  onSearchChange,
}: SearchBoxProps) {
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [filteredPosts, setFilteredPosts] = useState<Post[]>([]);
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
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();

      // Filter users
      const users = dummyUsers.filter(
        (user) =>
          user.name.toLowerCase().includes(term) ||
          user.username.toLowerCase().includes(term)
      );

      // Filter posts
      const posts = dummyPosts.filter(
        (post) =>
          post.title.toLowerCase().includes(term) ||
          post.content.toLowerCase().includes(term)
      );

      setFilteredUsers(users);
      setFilteredPosts(posts);
    } else {
      setFilteredUsers([]);
      setFilteredPosts([]);
    }
  }, [searchTerm]);

  if (!isOpen) return null;

  const hasResults = filteredUsers.length > 0 || filteredPosts.length > 0;
  const showPlaceholder = searchTerm.trim() === "";

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
            onTextChange={onSearchChange}
            autoFocus={true}
          />
        </div>

        {/* Search Results */}
        <div className="max-h-96 overflow-y-auto">
          {showPlaceholder ? (
            <div className="p-4 text-[#1C1C19]/50 text-center">
              Start typing to search for users and posts
            </div>
          ) : !hasResults ? (
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
