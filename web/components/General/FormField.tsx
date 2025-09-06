"use client";

import TextInput from "@/components/General/TextInput";

interface FormFieldProps {
  label?: string;
  value?: string;
  onChange: (value: string) => void;
  placeholder?: string;
  helpText?: string;
  type?: "text" | "email" | "password";
  disabled?: boolean;
  required?: boolean;
  error?: string;
  id?: string;
  name?: string;
  autoFocus?: boolean;
  containerClassName?: string;
  inputClassName?: string;
  showLabel?: boolean;
}

/** A form field with a label, input, help text, and error message. */
export default function FormField({
  label,
  value,
  onChange,
  placeholder,
  helpText,
  type = "text",
  disabled = false,
  required = false,
  error,
  id,
  name,
  autoFocus = false,
  containerClassName = "",
  inputClassName = "",
  showLabel = true,
}: FormFieldProps) {
  const fieldId =
    id || (label ? label.toLowerCase().replace(/\s+/g, "-") : undefined);
  const helpId = fieldId ? `${fieldId}-help` : undefined;
  const errorId = fieldId ? `${fieldId}-error` : undefined;

  const ariaDescribedBy =
    [helpId, error ? errorId : null].filter(Boolean).join(" ") || undefined;

  if (disabled && value !== undefined) {
    return (
      <div className={containerClassName}>
        {showLabel && label && (
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {label}
          </label>
        )}
        <div className="px-3 py-2.5 bg-neutral-700/5 rounded-[99px] border border-neutral-700/10 w-full">
          <span className="text-zinc-800/50 text-base font-semibold">
            {value}
          </span>
        </div>
        {helpText && (
          <p id={helpId} className="text-sm text-gray-500 mt-1">
            {helpText}
          </p>
        )}
        {error && (
          <p id={errorId} className="text-sm text-red-600 mt-1">
            {error}
          </p>
        )}
      </div>
    );
  }

  return (
    <div className={containerClassName}>
      {showLabel && label && (
        <label
          htmlFor={fieldId}
          className="block text-sm font-medium text-gray-700 mb-2"
        >
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      <TextInput
        id={fieldId}
        name={name}
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        disabled={disabled}
        required={required}
        autoFocus={autoFocus}
        containerClassName={`w-full ${error ? "ring-2 ring-red-500" : ""}`}
        inputClassName={`w-full ${inputClassName}`}
        aria-describedby={ariaDescribedBy}
      />
      {helpText && (
        <p id={helpId} className="text-sm text-gray-500 mt-1">
          {helpText}
        </p>
      )}
      {error && (
        <p id={errorId} className="text-sm text-red-600 mt-1">
          {error}
        </p>
      )}
    </div>
  );
}
