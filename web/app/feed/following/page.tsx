"use client";

import { AuthenticatedRoute } from "@/components/AuthenticatedRoute";
import FeedLayout from "@/components/FeedLayout";

export default function FollowingPage() {
  return (
    <AuthenticatedRoute>
      {(user) => <FeedLayout feedType="following" user={user} />}
    </AuthenticatedRoute>
  );
}
