"use client";

import { User } from "@/types";
import { deleteUser, updateUserProfile } from "@/utils/api";
import { useRouter } from "next/navigation";
import { useState } from "react";

interface UseProfileEditOptions {
  user: User;
  onUserUpdated: () => Promise<void>;
  onUserDeleted: () => Promise<void>;
}

export interface ProfileEditFormData {
  name: string;
  username: string;
  profilePicture: File | undefined;
}

export default function useProfileEdit({
  user,
  onUserUpdated,
  onUserDeleted,
}: UseProfileEditOptions) {
  const router = useRouter();

  // Form state
  const [formData, setFormData] = useState<ProfileEditFormData>({
    name: user.name || "",
    username: user.username || "",
    profilePicture: undefined,
  });

  // UI state
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Update individual form fields
  const updateField = <K extends keyof ProfileEditFormData>(
    field: K,
    value: ProfileEditFormData[K]
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  // Handle profile picture change
  const handleProfilePictureChange = (file: File) => {
    setFormData((prev) => ({
      ...prev,
      profilePicture: file,
    }));
    setError(null);
  };

  // Validation
  const isFormValid =
    formData.name.trim().length > 0 && formData.username.trim().length > 0;

  const hasChanges =
    formData.name !== user.name ||
    formData.username !== user.username ||
    formData.profilePicture !== undefined;

  // Submit handler
  const handleSubmit = async () => {
    if (!isFormValid || !hasChanges) return;

    setIsLoading(true);
    setError(null);

    try {
      // Call the API to update user profile
      await updateUserProfile(
        formData.username,
        formData.name,
        formData.profilePicture
      );

      // Refetch user data to get updated info
      await onUserUpdated();

      // Redirect back to profile immediately
      router.push(`/profile/${formData.username}`);
    } catch (err) {
      console.error("Failed to update profile:", err);
      setError(err instanceof Error ? err.message : "Failed to update profile");
    } finally {
      setIsLoading(false);
    }
  };

  // Cancel handler
  const handleCancel = () => {
    router.push(`/profile/${user.username}`);
  };

  // Delete handler
  const handleDelete = async () => {
    const confirmed = window.confirm(
      "Are you sure you want to delete your account? This action cannot be undone."
    );

    if (!confirmed) return;

    setIsLoading(true);
    setError(null);

    try {
      await deleteUser();
      await onUserDeleted();
    } catch (err) {
      console.error("Failed to delete user:", err);
      setError(err instanceof Error ? err.message : "Failed to delete account");
    } finally {
      setIsLoading(false);
    }
  };

  return {
    formData,
    updateField,
    handleProfilePictureChange,
    isLoading,
    error,
    setError,
    isFormValid,
    hasChanges,
    handleSubmit,
    handleCancel,
    handleDelete,
  };
}
