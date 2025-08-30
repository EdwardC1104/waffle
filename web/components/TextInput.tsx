"use client";

import { useState } from "react";

interface TextInputProps {
  icon?: React.ReactNode;
  placeholder?: string;
  onTextChange?: (text: string) => void;
  className?: string;
  containerClassName?: string;
  inputClassName?: string;
}

export default function TextInput({
  icon,
  placeholder = "Search",
  onTextChange,
  containerClassName = "",
  inputClassName = "",
  className
}: TextInputProps) {
  const [value, setValue] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setValue(newValue);
    onTextChange?.(newValue);
  };

  return (
    <div className={`px-3 py-2.5 bg-neutral-700/1 rounded-[99px] shadow-[inset_2px_4px_6px_0px_rgba(0,0,0,0.25)] inline-flex justify-start items-center gap-2 ${containerClassName} ${className}`}>
      {icon && <div className="w-5 h-5 relative overflow-hidden">{icon}</div>}
      <input
        type="text"
        value={value}
        onChange={handleChange}
        placeholder={placeholder}
        className={`bg-transparent border-none outline-none text-zinc-800/50 text-base font-semibold placeholder:text-zinc-800/50 flex-1 ${inputClassName}`}
      />
    </div>
  );
}
