"use client";

import { useParams } from "next/navigation";
import UserProfile from "@/components/UserProfile";
import { User } from "@/types";
import { currentUser, mockPosts } from "@/data/mockData";

export default function UserProfilePage() {
  //get url value
  const username = useParams().username;
  const user = currentUser

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          <div className="bg-white shadow rounded-lg">
            <UserProfile user={user} containerClassName="p-6" hideButton={true}/>
            <div className="px-6 pb-6">
              <div className="border-t pt-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">About</h2>
                <p className="text-gray-600">
                  {user.username === currentUser.username ? " This is your profile." : "Welcome to {user.name}'s profile! "}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
