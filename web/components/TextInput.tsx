"use client";

import { useState } from "react";

interface TextInputProps {
  icon?: React.ReactNode;
  placeholder?: string;
  type?: "text" | "email" | "password" | "username";
  onTextChange?: (text: string) => void;
  containerClassName?: string;
  inputClassName?: string;
  value?: string;
  defaultValue?: string;
}

export default function TextInput({
  icon,
  placeholder = "Search",
  type = "text",
  onTextChange,
  containerClassName = "",
  inputClassName = "",
  value,
  defaultValue = "",
}: TextInputProps) {
  const [internalValue, setInternalValue] = useState(defaultValue);
  const displayValue = value !== undefined ? value : internalValue;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    if (value === undefined) {
      setInternalValue(newValue);
    }
    onTextChange?.(newValue);
  };

  return (
    <div
      className={`px-3 py-2.5 bg-neutral-700/1 rounded-[99px] shadow-[inset_2px_4px_6px_0px_rgba(0,0,0,0.25)] inline-flex justify-start items-center gap-2 ${containerClassName}`}
    >
      {icon && (
        <div className="w-5 h-5 relative overflow-hidden flex justify-center align-middle">
          {icon}
        </div>
      )}
      <input
        type={type}
        value={displayValue}
        onChange={handleChange}
        placeholder={placeholder}
        className={`bg-transparent border-none outline-none text-zinc-800/50 text-base font-semibold placeholder:text-zinc-800/50 flex-1 ${inputClassName}`}
      />
    </div>
  );
}
