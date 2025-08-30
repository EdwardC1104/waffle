"use client";

import { useParams } from "next/navigation";

export default function UserProfilePage() {
  //get url value
  const userId = useParams().userid;

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">Profile: {userId}</div>
      </div>
    </div>
  );
}
