"use client";

import Image from "next/image";
import Link from "next/link";
import TextInput from "./TextInput";

const SearchIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width={17} height={17} fill="none">
    <path
      stroke="#707070"
      strokeLinecap="square"
      strokeWidth={1.5}
      d="m11.71 12.227 3.604 3.596M13.728 7.54A6.364 6.364 0 1 1 1 7.541a6.364 6.364 0 0 1 12.728 0Z"
    />
  </svg>
);

export function Navbar() {
  const handleSearchChange = (text: string) => {
    console.log("Search text:", text);
  };

  return (
    <nav className="bg-white">
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

          <div className="hidden md:flex">
            <TextInput
              icon={<SearchIcon />}
              placeholder="Search"
              onTextChange={handleSearchChange}
            />
          </div>
        </div>
      </div>
    </nav>
  );
}
