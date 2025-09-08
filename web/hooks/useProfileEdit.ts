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
  profilePicture: File | null;
}

const CONFIRMATION_MESSAGE =
  "Are you sure you want to delete your account? This action cannot be undone.";

const createInitialFormData = (user: User): ProfileEditFormData => ({
  name: user.name || "",
  username: user.username || "",
  profilePicture: null,
});

const validateForm = (formData: ProfileEditFormData): boolean => {
  return formData.name.trim().length > 0 && formData.username.trim().length > 0;
};

const hasFormChanges = (formData: ProfileEditFormData, user: User): boolean => {
  return (
    formData.name !== user.name ||
    formData.username !== user.username ||
    formData.profilePicture !== null
  );
};

/** Provides logic for editing a user's profile. */
export default function useProfileEdit({
  user,
  onUserUpdated,
  onUserDeleted,
}: UseProfileEditOptions) {
  const router = useRouter();
  const [formData, setFormData] = useState<ProfileEditFormData>(() =>
    createInitialFormData(user)
  );

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const updateField = <K extends keyof ProfileEditFormData>(
    field: K,
    value: ProfileEditFormData[K]
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleProfilePictureChange = (file: File) => {
    setFormData((prev) => ({ ...prev, profilePicture: file }));
    setError(null);
  };

  const isFormValid = validateForm(formData);
  const hasChanges = hasFormChanges(formData, user);

  const handleError = (err: unknown, defaultMessage: string) => {
    console.error(defaultMessage, err);
    setError(err instanceof Error ? err.message : defaultMessage);
  };

  const handleSubmit = async () => {
    if (!isFormValid || !hasChanges) return;

    setIsLoading(true);
    setError(null);

    try {
      await updateUserProfile(
        formData.username,
        formData.name,
        formData.profilePicture || undefined
      );
      await onUserUpdated();
      router.push(`/profile/${formData.username}`);
    } catch (err) {
      handleError(err, "Failed to update profile");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    router.push(`/profile/${user.username}`);
  };

  const handleDelete = async () => {
    if (!window.confirm(CONFIRMATION_MESSAGE)) return;

    setIsLoading(true);
    setError(null);

    try {
      await deleteUser();
      await onUserDeleted();
    } catch (err) {
      handleError(err, "Failed to delete account");
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
