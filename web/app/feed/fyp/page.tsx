"use client";

import FeedLayout from "@/components/FeedLayout";
import { AuthenticatedRoute } from "@/components/General/AuthenticatedRoute";

export default function FYPPage() {
  return (
    <AuthenticatedRoute>
      {(user) => <FeedLayout feedType="fyp" user={user} />}
    </AuthenticatedRoute>
  );
}
