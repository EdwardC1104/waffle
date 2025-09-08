"use client";

import { Post, User } from "@/types";
import { search } from "@/utils/api";
import { useCallback, useEffect, useState } from "react";

interface UseSearchReturn {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  users: User[];
  posts: Post[];
  error: string | null;
  showPlaceholder: boolean;
  showError: boolean;
  showLoading: boolean;
  showNoResults: boolean;
  clearSearch: () => void;
}

/** Performs a search for users and posts based on the provided query. */
export function useSearch(): UseSearchReturn {
  const [searchTerm, setSearchTerm] = useState("");
  const [users, setUsers] = useState<User[]>([]);
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const clearSearch = useCallback(() => {
    setSearchTerm("");
    setUsers([]);
    setPosts([]);
    setError(null);
    setIsLoading(false);
  }, []);

  const performSearch = useCallback(async (term: string) => {
    if (!term.trim()) {
      setUsers([]);
      setPosts([]);
      setError(null);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const results = await search(term.trim());

      if (results && typeof results === "object") {
        setUsers(results.users || []);
        setPosts(results.posts || []);
      } else {
        setUsers([]);
        setPosts([]);
      }
    } catch (err) {
      console.error("Search error:", err);
      setError("Failed to search. Please try again.");
      setUsers([]);
      setPosts([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    // Debounce the search to avoid excessive API calls
    const timeoutId = setTimeout(() => {
      performSearch(searchTerm);
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [searchTerm, performSearch]);

  // Computed state for UI display logic
  const hasResults = users.length > 0 || posts.length > 0;
  const trimmedSearchTerm = searchTerm.trim();
  const showPlaceholder = trimmedSearchTerm === "";
  const showError = error !== null;
  const showLoading = isLoading && trimmedSearchTerm !== "";
  const showNoResults =
    !showPlaceholder &&
    !showLoading &&
    !showError &&
    !hasResults &&
    trimmedSearchTerm !== "";

  return {
    searchTerm,
    setSearchTerm,
    users,
    posts,
    error,
    showPlaceholder,
    showError,
    showLoading,
    showNoResults,
    clearSearch,
  };
}
