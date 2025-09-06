"use client";

import FeedLayout from "@/components/FeedLayout";
import { AuthenticatedRoute } from "@/components/General/AuthenticatedRoute";

export default function FollowingPage() {
  return (
    <AuthenticatedRoute>
      {(user) => <FeedLayout feedType="following" user={user} />}
    </AuthenticatedRoute>
  );
}
