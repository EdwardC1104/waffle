import { User } from "../types";
import UserProfile from "./UserProfile";
import useAuth from "@/hooks/useAuth";
import { useCallback,
          useState,
          useEffect
        } from "react";
import { getSuggestedUsers } from "@/utils/api";

export default function WhoToFollow() {
  
  const [suggestedUsers, setSuggestedUsers] = useState<User[]>([]);
  const [followStates, setFollowStates] = useState<boolean[]>([]);
  const { user: currentUser } = useAuth();

const fetchSuggestedUsers = useCallback(async () => {
    if (currentUser) {
      try {
        const users = await getSuggestedUsers(currentUser.username);
        setSuggestedUsers(users);
        // Initialize follow states array with false for each user
        setFollowStates(new Array(users.length).fill(false));
      } catch (err) {
        console.error("Failed to fetch suggested users:", err);
        setSuggestedUsers([]);
        setFollowStates([]);
      }
    }
  }, [currentUser]);

  const toggleFollowState = (index: number) => {
    setFollowStates(prev => {
      const newStates = [...prev];
      newStates[index] = !newStates[index];
      return newStates;
    });
  };

  useEffect(() => {
    fetchSuggestedUsers();
  }, [fetchSuggestedUsers]);

  return (
    <div className="py-6 rounded-2xl flex flex-col gap-6">
      <h3 className="text-stone-900 text-xl font-semibold">Who to follow</h3>

      <div className="flex flex-col gap-4">
        {suggestedUsers.map((user, index) => {
          const isFollowing = followStates[index] || false;
          return (
            <div key={user.id} className="flex justify-between items-center">
              <div className="flex items-center gap-2.5">
                <UserProfile user={user} size="sm" />
              </div>

              <button 
                onClick={() => toggleFollowState(index)}
                className={`px-3.5 py-1 rounded-full shadow-lg flex justify-center items-center transition-all hover:opacity-90 ${
                  isFollowing 
                    ? 'bg-gray-200 border border-stone-900' 
                    : 'bg-stone-900'
                }`}
              >
                <span className={`text-xs font-semibold ${
                  isFollowing 
                    ? 'text-stone-900' 
                    : 'text-white'
                }`}>
                  {isFollowing ? 'Following' : 'Follow'}
                </span>
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
