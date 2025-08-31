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
  onFocus?: () => void;
  autoFocus?: boolean;
}

export default function TextInput({
  icon,
  placeholder = "Search",
  type = "text",
  onTextChange,
  containerClassName = "",
  inputClassName = "",
  value: controlledValue,
  onFocus,
  autoFocus = false,
  defaultValue = "",
}: TextInputProps) {
  const [internalValue, setInternalValue] = useState(defaultValue);
  const isControlled = controlledValue !== undefined;
  const value = isControlled ? controlledValue : internalValue;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    if (!isControlled) {
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
        value={value}
        onChange={handleChange}
        onFocus={onFocus}
        placeholder={placeholder}
        autoFocus={autoFocus}
        className={`bg-transparent border-none outline-none text-[#1C1C19] text-base font-semibold placeholder:text-[#1C1C19]/50 flex-1 ${inputClassName}`}
      />
    </div>
  );
}
