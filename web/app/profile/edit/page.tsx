"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import BackButton from "@/components/BackButton";
import TextInput from "@/components/TextInput";
import LoadingSpinner from "@/components/LoadingSpinner";
import ErrorMessage from "@/components/ErrorMessage";
import { AuthenticatedRoute } from "@/components/AuthenticatedRoute";
import { CheckIcon, ImageIcon } from "@/components/Icons";
import useAuth from "@/hooks/useAuth";

export default function EditProfilePage() {
  return (
    <AuthenticatedRoute loadingText="Loading profile...">
      {(user) => <EditProfileContent user={user} />}
    </AuthenticatedRoute>
  );
}

function EditProfileContent({ user }: { user: any }) {
  const { refetchUser } = useAuth();
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Form state
  const [name, setName] = useState(user?.name || "");
  const [profilePicture, setProfilePicture] = useState<File | null>(null);
  const [profilePicturePreview, setProfilePicturePreview] = useState(user?.profilePictureUrl || "");
  
  // UI state
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleProfilePictureChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith("image/")) {
        setError("Please select a valid image file");
        return;
      }

      // Validate file size (5MB max)
      if (file.size > 5 * 1024 * 1024) {
        setError("Image must be smaller than 5MB");
        return;
      }

      setProfilePicture(file);
      
      // Create preview URL
      const reader = new FileReader();
      reader.onload = (e) => {
        setProfilePicturePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
      
      setError(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setSuccessMessage(null);

    try {
      // Create FormData for file upload
      const formData = new FormData();
      formData.append("name", name);
      
      if (profilePicture) {
        formData.append("profilePicture", profilePicture);
      }

      // TODO: Replace with actual API call
      // For now, simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock success - in real app, this would be an API call
      console.log("Profile update data:", { name, profilePicture: profilePicture?.name });
      
      setSuccessMessage("Profile updated successfully!");
      
      // Refetch user data to get updated info
      await refetchUser();
      
      // Redirect back to profile after short delay
      setTimeout(() => {
        router.push(`/profile/${user.username}`);
      }, 1500);

    } catch (err) {
      console.error("Failed to update profile:", err);
      setError(
        err instanceof Error ? err.message : "Failed to update profile"
      );
    } finally {
      setIsLoading(false);
    }
  };

  const isFormValid = name.trim().length > 0;
  const hasChanges = name !== user.name || profilePicture !== null;

  return (
    <div className="min-h-screen">
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
            <p className="text-zinc-600 mt-2">Update your profile information</p>
          </div>

          {/* Main Form Card */}
          <div className="bg-white shadow rounded-lg overflow-hidden">
            <form onSubmit={handleSubmit}>
              {/* Profile Picture Section */}
              <div className="py-8 px-8 border-b border-gray-100">
                <h2 className="text-xl font-semibold text-stone-900 mb-6">Profile Picture</h2>
                
                <div className="flex items-center gap-6">
                  <div className="relative">
                    <Image
                      src={profilePicturePreview}
                      alt="Profile picture"
                      width={80}
                      height={80}
                      className="w-20 h-20 rounded-full object-cover border-2 border-gray-200"
                    />
                    {profilePicture && (
                      <div className="absolute -top-2 -right-2 w-6 h-6 bg-stone-900 rounded-full flex items-center justify-center">
                        <CheckIcon size={16} className="text-white" />
                      </div>
                    )}
                  </div>
                  
                  <div className="flex-1">
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="px-8 py-3 bg-stone-900 rounded-full shadow-lg text-white text-sm font-semibold transition-opacity hover:opacity-90 inline-flex items-center justify-center gap-2"
                    >
                      <ImageIcon size={16} />
                      Change Picture
                    </button>
                    <p className="text-sm text-gray-500 mt-2">
                      JPG, PNG or GIF. Max size 5MB.
                    </p>
                  </div>
                  
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleProfilePictureChange}
                    className="hidden"
                  />
                </div>
              </div>

              {/* Personal Information Section */}
              <div className="py-8 px-8 border-b border-gray-100">
                <h2 className="text-xl font-semibold text-stone-900 mb-6">Personal Information</h2>
                
                <div className="space-y-6">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                      Display Name
                    </label>
                    <TextInput
                      type="text"
                      placeholder="Enter your display name"
                      value={name}
                      onTextChange={setName}
                      containerClassName="w-full"
                      inputClassName="w-full"
                    />
                    <p className="text-sm text-gray-500 mt-1">
                      This is the name that will be displayed on your profile
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Username
                    </label>
                    <div className="px-3 py-2.5 bg-neutral-700/5 rounded-[99px] border border-neutral-700/10">
                      <span className="text-zinc-800/50 text-base font-semibold">@{user.username}</span>
                    </div>
                    <p className="text-sm text-gray-500 mt-1">
                      Username cannot be changed
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email
                    </label>
                    <div className="px-3 py-2.5 bg-neutral-700/5 rounded-[99px] border border-neutral-700/10">
                      <span className="text-zinc-800/50 text-base font-semibold">{user.email}</span>
                    </div>
                    <p className="text-sm text-gray-500 mt-1">
                      Email cannot be changed
                    </p>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="px-8 py-6 bg-white flex justify-between items-center">
                <button
                  type="button"
                  onClick={() => router.push(`/profile/${user.username}`)}
                  className="px-8 py-3 border border-stone-300 rounded-full shadow-sm text-sm font-semibold text-stone-900 bg-white hover:bg-stone-50 transition-colors"
                  disabled={isLoading}
                >
                  Cancel
                </button>
                
                <button
                  type="submit"
                  disabled={!isFormValid || !hasChanges || isLoading}
                  className="px-8 py-3 bg-stone-900 rounded-full shadow-lg text-white text-sm font-semibold transition-opacity hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed inline-flex items-center justify-center gap-2"
                >
                  {isLoading ? (
                    <>
                      <LoadingSpinner />
                      <span>Saving...</span>
                    </>
                  ) : (
                    "Save Changes"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
