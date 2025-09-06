"use client";

import TextInput from "@/components/General/TextInput";

interface FormFieldProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  helpText: string;
  type?: "text" | "email" | "password";
  disabled?: boolean;
  required?: boolean;
}

export default function FormField({
  label,
  value,
  onChange,
  placeholder,
  helpText,
  type = "text",
  disabled = false,
  required = false,
}: FormFieldProps) {
  if (disabled) {
    return (
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {label}
        </label>
        <div className="px-3 py-2.5 bg-neutral-700/5 rounded-[99px] border border-neutral-700/10">
          <span className="text-zinc-800/50 text-base font-semibold">
            {value}
          </span>
        </div>
        <p className="text-sm text-gray-500 mt-1">{helpText}</p>
      </div>
    );
  }

  return (
    <div>
      <label
        htmlFor={label.toLowerCase().replace(/\s+/g, "-")}
        className="block text-sm font-medium text-gray-700 mb-2"
      >
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      <TextInput
        id={label.toLowerCase().replace(/\s+/g, "-")}
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        disabled={disabled}
        required={required}
        containerClassName="w-full"
        inputClassName="w-full"
        aria-describedby={`${label.toLowerCase().replace(/\s+/g, "-")}-help`}
      />
      <p
        id={`${label.toLowerCase().replace(/\s+/g, "-")}-help`}
        className="text-sm text-gray-500 mt-1"
      >
        {helpText}
      </p>
    </div>
  );
}
