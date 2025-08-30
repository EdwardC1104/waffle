"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import FeedTabs from "./FeedTabs";
import { SearchIcon } from "./Icons";
import TextInput from "./TextInput";

export function Navbar() {
  const pathname = usePathname();
  const isFeedPage = pathname?.startsWith("/feed");

  const handleSearchChange = (text: string) => {
    console.log("Search text:", text);
  };

  return (
    <nav className="bg-white border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex-shrink-0 flex items-center">
            <Link href="/" className="flex items-center space-x-2">
              <Image
                src="/logo.svg"
                alt="Waffle logo"
                height={39}
                width={130}
              />
            </Link>
          </div>

          {/* Feed tabs - desktop: center, mobile: hidden (shown below navbar) */}
          {isFeedPage && (
            <div className="hidden md:flex">
              <FeedTabs />
            </div>
          )}

          <div className="hidden md:flex">
            <TextInput
              icon={<SearchIcon />}
              placeholder="Search"
              onTextChange={handleSearchChange}
            />
          </div>
        </div>
      </div>

      {/* Feed tabs for mobile - shown below main navbar */}
      {isFeedPage && (
        <div className="md:hidden border-t border-gray-100 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
            <FeedTabs />
          </div>
        </div>
      )}
    </nav>
  );
}
