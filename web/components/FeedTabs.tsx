"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function FeedTabs() {
  const pathname = usePathname();

  const tabs = [
    { href: "/feed/fyp", label: "For You" },
    { href: "/feed/following", label: "Following" },
    { href: "/feed/popular", label: "Popular" },
  ];

  return (
    <div className="flex justify-center items-center gap-6">
      {tabs.map((tab) => (
        <Link
          key={tab.href}
          href={tab.href}
          className={`px-6 py-2.5 rounded-full flex justify-center items-center transition-colors ${
            pathname === tab.href
              ? "bg-stone-900 text-white font-bold"
              : "bg-transparent text-stone-900 font-semibold hover:bg-stone-100"
          }`}
        >
          {tab.label}
        </Link>
      ))}
    </div>
  );
}
