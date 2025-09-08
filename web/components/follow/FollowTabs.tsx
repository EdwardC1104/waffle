import Link from "next/link";

type FollowType = "followers" | "following";

interface FollowTabsProps {
  username: string;
  activeTab: FollowType;
}

/** Switches from followers to following or vice versa. */
export default function FollowTabs({ username, activeTab }: FollowTabsProps) {
  const tabs: { key: FollowType; label: string; href: string }[] = [
    {
      key: "followers",
      label: "Followers",
      href: `/profile/${username}/followers`,
    },
    {
      key: "following",
      label: "Following",
      href: `/profile/${username}/following`,
    },
  ];

  return (
    <div className="flex gap-2 mb-6">
      {tabs.map((tab) => {
        const isActive = activeTab === tab.key;
        return (
          <Link
            key={tab.key}
            href={tab.href}
            className={`flex-1 px-4 py-2 rounded-full text-center text-sm font-semibold transition-colors ${
              isActive
                ? "bg-stone-900 text-white"
                : "bg-transparent text-stone-900 hover:bg-stone-100"
            }`}
          >
            {tab.label}
          </Link>
        );
      })}
    </div>
  );
}
