"use client";

import { forwardRef } from "react";

interface TextInputProps {
  placeholder?: string;
  value?: string;
  defaultValue?: string;
  type?: "text" | "email" | "password";
  disabled?: boolean;
  required?: boolean;
  autoFocus?: boolean;
  readOnly?: boolean;
  icon?: React.ReactNode;
  containerClassName?: string;
  inputClassName?: string;
  onChange?: (value: string) => void;
  onFocus?: () => void;
  onBlur?: () => void;
  onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  id?: string;
  name?: string;
  "aria-label"?: string;
  "aria-describedby"?: string;
}

/** A styled text input. */
const TextInput = forwardRef<HTMLInputElement, TextInputProps>(
  (
    {
      placeholder,
      value,
      defaultValue,
      type = "text",
      disabled = false,
      required = false,
      autoFocus = false,
      readOnly = false,
      icon,
      containerClassName = "",
      inputClassName = "",
      onChange,
      onFocus,
      onBlur,
      onKeyDown,
      id,
      name,
      "aria-label": ariaLabel,
      "aria-describedby": ariaDescribedBy,
    },
    ref
  ) => {
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      onChange?.(e.target.value);
    };

    return (
      <div
        className={`px-3 py-2.5 bg-neutral-700/1 rounded-[99px] shadow-[inset_2px_4px_5px_0px_rgba(0,0,0,0.25)] inline-flex justify-start items-center gap-2 transition-opacity ${
          disabled ? "opacity-50 cursor-not-allowed" : ""
        } ${containerClassName}`}
      >
        {icon && (
          <div className="w-5 h-5 relative overflow-hidden flex justify-center items-center shrink-0">
            {icon}
          </div>
        )}
        <input
          ref={ref}
          id={id}
          name={name}
          type={type}
          value={value}
          defaultValue={defaultValue}
          onChange={handleChange}
          onFocus={onFocus}
          onBlur={onBlur}
          onKeyDown={onKeyDown}
          placeholder={placeholder}
          autoFocus={autoFocus}
          disabled={disabled}
          required={required}
          readOnly={readOnly}
          aria-label={ariaLabel}
          aria-describedby={ariaDescribedBy}
          className={`bg-transparent border-none outline-none text-[#1C1C19] text-base font-semibold placeholder:text-[#1C1C19]/50 flex-1 disabled:cursor-not-allowed ${inputClassName}`}
        />
      </div>
    );
  }
);

TextInput.displayName = "TextInput";

export default TextInput;
