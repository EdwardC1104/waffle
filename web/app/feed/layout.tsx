"use client";

import UserProfile from "@/components/user/UserProfile";
import WhoToFollow from "@/components/WhoToFollow";
import FloatingWriteButton from "@/components/widgets/FloatingWriteButton";
import WritePost from "@/components/widgets/WritePost";
import useAuth from "@/hooks/useAuth";

export default function FeedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user } = useAuth();

  return (
    <>
      <div className="w-full max-w-[1476px] mx-auto flex justify-center items-start gap-4 lg:gap-8 xl:gap-16 px-4 sm:px-6 lg:px-8 py-6">
        <div className="hidden lg:flex w-60 flex-col gap-8 flex-shrink-0 sticky top-16">
          <div className="flex flex-col gap-6">
            {user && <UserProfile user={user} />}
            <WritePost />
          </div>
        </div>

        <div className="flex flex-col gap-8 w-full max-w-[600px] min-w-0">
          {children}
        </div>

        <div className="hidden md:flex w-60 flex-col gap-8 flex-shrink-0 sticky top-16">
          <WhoToFollow />
        </div>
      </div>

      <div className="lg:hidden">
        <FloatingWriteButton />
      </div>
    </>
  );
}
