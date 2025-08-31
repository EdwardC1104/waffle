"use client";

import { useState } from "react";
import { SearchIcon } from "./Icons";
import SearchBox from "./SearchBox";
import TextInput from "./TextInput";

interface SearchProps {
  isMobile?: boolean;
  className?: string;
}

export default function Search({ isMobile = false, className = "" }: SearchProps) {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const handleSearchOpen = () => {
    setIsSearchOpen(true);
  };

  const handleSearchClose = () => {
    setIsSearchOpen(false);
    setSearchTerm("");
  };

  if (isMobile) {
    return (
      <div className={`relative ${className}`}>
        <button
          onClick={handleSearchOpen}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <SearchIcon size={24} className="text-gray-600" />
        </button>
        <SearchBox
          isOpen={isSearchOpen}
          onClose={handleSearchClose}
          isMobile={true}
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
        />
      </div>
    );
  }

  return (
    <div className={`relative ${className}`}>
      <TextInput
        icon={<SearchIcon className="text-gray-600" />}
        placeholder="Search"
        value={searchTerm}
        onTextChange={setSearchTerm}
        onFocus={handleSearchOpen}
        inputClassName="min-w-[120px]"
      />
      <SearchBox
        isOpen={isSearchOpen}
        onClose={handleSearchClose}
        isMobile={false}
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
      />
    </div>
  );
}
