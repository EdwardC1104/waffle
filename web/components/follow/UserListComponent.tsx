import UserProfile from "@/components/user/UserProfile";
import { User } from "@/types";

interface UserListComponentProps {
  users: User[];
  emptyMessage?: string;
}

/** Displays a list of users or an empty state message if none are found. */
export default function UserListComponent({
  users,
  emptyMessage = "No users found.",
}: UserListComponentProps) {
  if (users.length === 0) {
    return (
      <div className="text-center py-16">
        <p className="text-zinc-500 text-lg">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {users.map((user) => (
        <div
          key={user.id}
          className="bg-white rounded-lg border border-zinc-200 shadow-sm p-6 hover:shadow-md transition-shadow"
        >
          <UserProfile user={user} size="sm" />
        </div>
      ))}
    </div>
  );
}
