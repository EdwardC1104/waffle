"use client";

import { useState, useRef, useEffect, ReactNode } from "react";
import { MoreIcon } from "./Icons";
import useAuth from "@/hooks/useAuth";

interface DropdownItem {
  label: string;
  onClick: () => void;
  icon?: ReactNode;
}

interface DropDownProps {
  items?: DropdownItem[];
  iconSize?: number;
  className?: string;
  showForCurrentUserOnly?: boolean;
  userId?: string;
  children?: ReactNode;
}

export default function DropDown({
  items = [],
  iconSize = 16,
  className = "",
  showForCurrentUserOnly = false,
  userId,
  children,
}: DropDownProps) {
  const { user: currentUser, logout } = useAuth();
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Check if the displayed user is the current logged-in user
  const isCurrentUser = currentUser && userId && currentUser.id === userId;

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    };

    if (showDropdown) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showDropdown]);

  const handleLogout = async () => {
    try {
      await logout();
      setShowDropdown(false);
    } catch (error) {
      console.error('Failed to logout:', error);
      setShowDropdown(false);
    }
  };

  // Don't show dropdown if showForCurrentUserOnly is true and it's not the current user
  if (showForCurrentUserOnly && !isCurrentUser) {
    return null;
  }

  // Default logout item if no custom items provided
  const defaultLogoutItem: DropdownItem = {
    label: 'Logout',
    onClick: handleLogout,
    icon: (
      <svg 
        className="w-4 h-4" 
        fill="none" 
        stroke="currentColor" 
        viewBox="0 0 24 24"
      >
        <path 
          strokeLinecap="round" 
          strokeLinejoin="round" 
          strokeWidth={2} 
          d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" 
        />
      </svg>
    )
  };

  // Use provided items or default to logout
  const menuItems = items.length > 0 ? items : [defaultLogoutItem];

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      <button 
        className="p-1"
        onClick={() => setShowDropdown(!showDropdown)}
      >
        {children || <MoreIcon size={iconSize} className="text-stone-900" />}
      </button>
      
      {showDropdown && (showForCurrentUserOnly ? isCurrentUser : true) && (
        <div className="absolute right-0 top-full mt-2 w-40 bg-white rounded-2xl shadow-lg border border-gray-100 py-2 z-10">
          {menuItems.map((item, index) => (
            <button
              key={index}
              onClick={() => {
                item.onClick();
                setShowDropdown(false);
              }}
              className="w-full px-4 py-3 text-left text-sm font-medium text-stone-900 hover:bg-gray-50 transition-colors rounded-xl mx-1 flex items-center gap-2"
            >
              {item.icon && item.icon}
              {item.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
