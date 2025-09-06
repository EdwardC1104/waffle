"use client";

import Feed from "@/components/feed/Feed";
import { AuthenticatedRoute } from "@/components/general/AuthenticatedRoute";

export default function FYPPage() {
  return (
    <AuthenticatedRoute>
      <Feed feedType="fyp" />
    </AuthenticatedRoute>
  );
}
