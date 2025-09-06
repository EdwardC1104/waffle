"use client";

import { useState } from "react";
import { SearchIcon } from "./General/Icons";
import SearchBox from "./SearchBox";
import TextInput from "./TextInput";

interface SearchProps {
  className?: string;
}

export default function Search({ className = "" }: SearchProps) {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const handleSearchOpen = () => {
    setIsSearchOpen(true);
  };

  const handleSearchClose = () => {
    setIsSearchOpen(false);
    setSearchTerm("");
  };

  return (
    <div className={`relative ${className}`}>
      {/* Mobile button - only visible on small screens */}
      <button
        onClick={handleSearchOpen}
        className="lg:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors"
      >
        <SearchIcon size={24} className="text-gray-600" />
      </button>

      {/* Desktop search input - only visible on large screens */}
      <div className="hidden lg:block">
        <TextInput
          icon={<SearchIcon className="text-gray-600" />}
          placeholder="Search"
          value={searchTerm}
          onTextChange={setSearchTerm}
          onFocus={handleSearchOpen}
          inputClassName="min-w-[120px]"
        />
      </div>

      <SearchBox
        isOpen={isSearchOpen}
        onClose={handleSearchClose}
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
      />
    </div>
  );
}
