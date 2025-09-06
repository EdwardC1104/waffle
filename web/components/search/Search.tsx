"use client";

import { useSearch } from "@/hooks/useSearch";
import { useState } from "react";
import { SearchIcon } from "../general/Icons";
import SearchInput from "./SearchInput";
import SearchResults from "./SearchResults";

interface SearchProps {
  className?: string;
}

export default function Search({ className = "" }: SearchProps) {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const {
    searchTerm,
    setSearchTerm,
    users,
    posts,
    showPlaceholder,
    showLoading,
    showError,
    showNoResults,
    error,
    clearSearch,
  } = useSearch();

  const handleSearchOpen = () => {
    setIsSearchOpen(true);
  };

  const handleSearchClose = () => {
    setIsSearchOpen(false);
    clearSearch();
  };

  return (
    <div className={`relative ${className}`}>
      {/* Mobile button - only visible on small screens */}
      <button
        onClick={handleSearchOpen}
        className="lg:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors"
        aria-label="Open search"
      >
        <SearchIcon size={24} className="text-gray-600" />
      </button>

      {/* Desktop search input - only visible on large screens */}
      <div className="hidden lg:block">
        <SearchInput
          value={searchTerm}
          onChange={setSearchTerm}
          onFocus={handleSearchOpen}
        />
      </div>

      <SearchResults
        isOpen={isSearchOpen}
        onClose={handleSearchClose}
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        users={users}
        posts={posts}
        showPlaceholder={showPlaceholder}
        showLoading={showLoading}
        showError={showError}
        showNoResults={showNoResults}
        error={error}
      />
    </div>
  );
}
