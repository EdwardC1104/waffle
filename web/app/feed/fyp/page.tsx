"use client";

import Feed from "@/components/Feed/Feed";
import { AuthenticatedRoute } from "@/components/General/AuthenticatedRoute";

export default function FYPPage() {
  return (
    <AuthenticatedRoute>
      <Feed feedType="fyp" />
    </AuthenticatedRoute>
  );
}
