"use client";

import { AuthenticatedRoute } from "@/components/general/AuthenticatedRoute";
import BackButton from "@/components/general/BackButton";
import EditProfileForm from "@/components/user/EditProfileForm";
import useAuth from "@/hooks/useAuth";
import { useRouter } from "next/navigation";

export default function EditProfilePage() {
  return (
    <AuthenticatedRoute loadingText="Loading profile...">
      <EditProfileContent />
    </AuthenticatedRoute>
  );
}

function EditProfileContent() {
  const { user, refetchUser, logout } = useAuth();

  const router = useRouter();

  const onUserDeleted = async () => {
    logout();
    router.push("/");
  };

  if (!user) return null;

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
