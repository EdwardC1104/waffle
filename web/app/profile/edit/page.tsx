"use client";

import { AuthenticatedRoute } from "@/components/AuthenticatedRoute";
import BackButton from "@/components/BackButton";
import EditProfileForm from "@/components/EditProfileForm";
import useAuth from "@/hooks/useAuth";
import { User } from "@/types";
import { useRouter } from "next/navigation";

export default function EditProfilePage() {
  return (
    <AuthenticatedRoute loadingText="Loading profile...">
      {(user) => <EditProfileContent user={user} />}
    </AuthenticatedRoute>
  );
}

function EditProfileContent({ user }: { user: User }) {
  const { refetchUser, logout } = useAuth();

  const router = useRouter();

  const onUserDeleted = async () => {
    logout();
    router.push("/");
  };

  return (
    <div className="flex-1 w-full">
      <div className="w-full max-w-[1476px] mx-auto flex justify-center items-start px-4 sm:px-6 lg:px-8 py-6">
        <div className="w-full max-w-[600px]">
          {/* Header */}
          <div className="mb-8">
            <BackButton
              text="Back to Profile"
              goTo={`/profile/${user.username}`}
              className="mb-4"
            />
            <h1 className="text-3xl font-bold text-stone-900">Edit Profile</h1>
            <p className="text-zinc-600 mt-2">
              Update your profile information
            </p>
          </div>

          <EditProfileForm
            user={user}
            onUserUpdated={refetchUser}
            onUserDeleted={onUserDeleted}
          />
        </div>
      </div>
    </div>
  );
}
