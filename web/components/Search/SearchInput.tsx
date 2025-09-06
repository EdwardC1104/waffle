"use client";

import { forwardRef } from "react";
import { SearchIcon } from "../general/Icons";
import TextInput from "../general/TextInput";

interface SearchInputProps {
  value: string;
  onChange: (value: string) => void;
  onFocus?: () => void;
  placeholder?: string;
  autoFocus?: boolean;
  className?: string;
}

const SearchInput = forwardRef<HTMLInputElement, SearchInputProps>(
  (
    {
      value,
      onChange,
      onFocus,
      placeholder = "Search",
      autoFocus = false,
      className = "",
    },
    ref
  ) => {
    return (
      <TextInput
        ref={ref}
        icon={<SearchIcon className="text-gray-600" size={20} />}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        onFocus={onFocus}
        autoFocus={autoFocus}
        containerClassName={className}
        inputClassName="min-w-[120px]"
      />
    );
  }
);

SearchInput.displayName = "SearchInput";

export default SearchInput;
