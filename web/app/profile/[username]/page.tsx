"use client";



import { useParams } from "next/navigation";
import UserProfile from "@/components/UserProfile";
import { User } from "@/types";
import { currentUser, mockPosts, suggestedUsers, todayWordCount } from "@/data/mockData";
import WritePostCTA from "@/components/WritePostCTA";
import PostCard from "@/components/PostCard";
import WhoToFollow from "@/components/WhoToFollow";

export default function UserProfilePage() {
  //get url value
  const username = useParams().username;

  // Find user from mock data by username, searching suggested users first
  const findUserByUsername = (searchUsername: string): User => {
    // Check suggested users first
    const suggestedUser = suggestedUsers.find(user => user.username === searchUsername);
    if (suggestedUser) {
      return suggestedUser;
    }
    
    // Fallback to current user if not found
    return currentUser;
  };

  const user = username && typeof username === 'string' 
    ? findUserByUsername(username) 
    : currentUser;

  
  const posts = mockPosts.filter(post => post.author.username === user.username);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="w-full max-w-[1476px] mx-auto flex justify-center items-start gap-4 lg:gap-8 xl:gap-16 px-4 sm:px-6 lg:px-8 py-6">
        
        {/* Left sidebar - hidden on mobile and tablet */}
        <div className="hidden xl:flex w-60 flex-col gap-8 flex-shrink-0">
          <WritePostCTA todayWordCount={todayWordCount} />
        </div>
    
        {/* Main content - Profile and Posts */}
        <div className="flex flex-col gap-8 w-full max-w-[600px] min-w-0">
          {/* Profile Section */}
          <div className="bg-white shadow rounded-lg">
            <UserProfile user={user} size="lg" />
            <div className="px-6 pb-6">
              <div className="border-t pt-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">About</h2>
                <p className="text-gray-600">
                  {user.username === currentUser.username ? "This is your profile." : `Welcome to ${user.name}'s profile!`}
                </p>
              </div>
            </div>
          </div>

          {/* Posts Section */}
          <div className="flex flex-col gap-6 md:gap-8">
            {posts.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>
        </div>
    
        {/* Right sidebar - hidden on mobile, shown on tablet+ */}
        <div className="hidden lg:flex w-60 flex-col gap-8 flex-shrink-0">
          <WhoToFollow users={suggestedUsers} />
        </div>

      </div>
    </div>
  );
}
