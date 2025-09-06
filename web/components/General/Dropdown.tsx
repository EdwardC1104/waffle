"use client";

import { ReactNode, useCallback, useEffect, useRef, useState } from "react";
import { MoreIcon } from "../Icons";

export interface DropdownItem {
  id?: string;
  label: string;
  onClick: () => void;
  icon?: ReactNode;
  disabled?: boolean;
  destructive?: boolean;
}

export interface DropdownProps {
  items: DropdownItem[];
  trigger?: ReactNode;
  align?: "left" | "right";
  size?: "sm" | "md" | "lg";
  className?: string;
  triggerClassName?: string;
  menuClassName?: string;
  disabled?: boolean;
}

/** Reusable dropdown component */
export default function Dropdown({
  items,
  trigger,
  align = "right",
  size = "md",
  className = "",
  triggerClassName = "",
  menuClassName = "",
  disabled = false,
}: DropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

  const closeDropdown = useCallback(() => {
    setIsOpen(false);
  }, []);

  const toggleDropdown = useCallback(() => {
    if (!disabled) {
      setIsOpen((prev) => !prev);
    }
  }, [disabled]);

  const handleItemClick = useCallback(
    (item: DropdownItem) => {
      if (!item.disabled) {
        item.onClick();
        closeDropdown();
      }
    },
    [closeDropdown]
  );

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        closeDropdown();
      }
    };

    const handleEscapeKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        closeDropdown();
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("keydown", handleEscapeKey);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscapeKey);
    };
  }, [isOpen, closeDropdown]);

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "ArrowDown" || event.key === "ArrowUp") {
        event.preventDefault();
        const items = Array.from(
          dropdownRef.current?.querySelectorAll(
            "button[data-dropdown-item]:not([disabled])"
          ) || []
        ) as HTMLButtonElement[];

        if (items.length === 0) return;

        const currentIndex = items.findIndex(
          (item) => item === document.activeElement
        );
        let nextIndex;

        if (event.key === "ArrowDown") {
          nextIndex = currentIndex < items.length - 1 ? currentIndex + 1 : 0;
        } else {
          nextIndex = currentIndex > 0 ? currentIndex - 1 : items.length - 1;
        }

        items[nextIndex]?.focus();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen]);

  const menuClass = {
    sm: "w-32 py-1",
    md: "w-40 py-2",
    lg: "w-48 py-2",
  }[size];

  const itemClass = {
    sm: "px-3 py-2 text-sm",
    md: "px-4 py-3 text-sm",
    lg: "px-4 py-3 text-base",
  }[size];

  const triggerClass = {
    sm: "p-1",
    md: "p-1",
    lg: "p-2",
  }[size];

  const alignmentClass = align === "left" ? "left-0" : "right-0";

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      <button
        ref={triggerRef}
        type="button"
        onClick={toggleDropdown}
        disabled={disabled}
        className={`${triggerClass} ${triggerClassName} ${
          disabled ? "opacity-50 cursor-not-allowed" : ""
        }`}
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        {trigger || <MoreIcon size={16} className="text-stone-900" />}
      </button>

      {isOpen && (
        <div
          className={`
            absolute ${alignmentClass} top-full mt-2 
            ${menuClass}
            bg-white rounded-2xl shadow-lg border border-gray-100 
            z-50 overflow-hidden
            ${menuClassName}
          `}
          role="menu"
        >
          {items.map((item, index) => (
            <button
              key={item.id || index}
              type="button"
              onClick={() => handleItemClick(item)}
              disabled={item.disabled}
              data-dropdown-item
              className={`
                w-full text-left font-medium transition-colors 
                flex items-center gap-2
                ${itemClass}
                ${
                  item.disabled
                    ? "text-gray-400 cursor-not-allowed"
                    : item.destructive
                    ? "text-red-600 hover:bg-red-50"
                    : "text-stone-900 hover:bg-gray-50"
                }
                ${index === 0 ? "rounded-t-xl" : ""}
                ${index === items.length - 1 ? "rounded-b-xl" : ""}
                focus:outline-none focus:bg-gray-100
              `}
              role="menuitem"
            >
              {item.icon && (
                <span className="flex-shrink-0" aria-hidden="true">
                  {item.icon}
                </span>
              )}
              <span className="truncate">{item.label}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
