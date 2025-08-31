"use client";

import { AuthenticatedRoute } from "@/components/AuthenticatedRoute";
import FeedLayout from "@/components/FeedLayout";

export default function FYPPage() {
  return (
    <AuthenticatedRoute>
      {(user) => <FeedLayout feedType="fyp" user={user} />}
    </AuthenticatedRoute>
  );
}
