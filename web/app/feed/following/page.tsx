"use client";

import Feed from "@/components/Feed/Feed";
import { AuthenticatedRoute } from "@/components/General/AuthenticatedRoute";

export default function FollowingPage() {
  return (
    <AuthenticatedRoute>
      <Feed feedType="following" />
    </AuthenticatedRoute>
  );
}
