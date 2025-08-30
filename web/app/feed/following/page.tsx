"use client";

import Feed from "@/components/Feed";
import { ProtectedRoute } from "@/components/ProtectedRoute";

export default function FollowingPage() {
  return (
    <ProtectedRoute>
      <Feed feedType="following" />
    </ProtectedRoute>
  );
}
