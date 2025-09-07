"use client";

import ErrorMessage from "@/components/general/ErrorMessage";
import FormField from "@/components/general/FormField";
import EditProfilePicture from "@/components/user/EditProfilePicture";
import useProfileEdit from "@/hooks/useProfileEdit";
import { User } from "@/types";

interface EditProfileFormProps {
  user: User;
  onUserUpdated: () => Promise<void>;
  onUserDeleted: () => Promise<void>;
}

/** Allows the user to edit their profile information. */
export default function EditProfileForm({
  user,
  onUserUpdated,
  onUserDeleted,
}: EditProfileFormProps) {
  const {
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
  } = useProfileEdit({ user, onUserUpdated, onUserDeleted });

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSubmit();
  };

  return (
    <div className="bg-white shadow rounded-lg overflow-hidden">
      {error && (
        <div className="mx-8 mt-8">
          <ErrorMessage
            title="Failed to update profile"
            message={error}
            onRetry={() => setError(null)}
            showRetryButton={false}
          />
        </div>
      )}

      <form onSubmit={onSubmit} className="border-b border-gray-100">
        <EditProfilePicture
          currentImageUrl={
            formData.profilePicture
              ? URL.createObjectURL(formData.profilePicture)
              : user.profilePictureUrl
          }
          onImageChange={handleProfilePictureChange}
          onError={setError}
          hasNewImage={formData.profilePicture !== null}
          disabled={isLoading}
        />

        <div className="py-8 px-8">
          <h2 className="text-xl font-semibold text-stone-900 mb-6">
            Personal Information
          </h2>

          <div className="space-y-6">
            <FormField
              label="Display Name"
              value={formData.name}
              onChange={(value) => updateField("name", value)}
              placeholder="Enter your display name"
              helpText="This is the name that will be displayed on your profile"
              required
            />

            <FormField
              label="Username"
              value={formData.username}
              onChange={(value) => updateField("username", value)}
              placeholder="Enter your username"
              helpText="This will be your unique identifier (without the @ symbol)"
              required
            />

            <FormField
              label="Email"
              value={user.email}
              onChange={() => {}}
              placeholder=""
              helpText="Email cannot be changed"
              disabled
            />
          </div>
        </div>

        <div className="px-8 py-6 bg-white flex justify-between items-center">
          <button
            type="button"
            onClick={handleCancel}
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
            {isLoading ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </form>

      <div className="py-8 px-8">
        <h2 className="text-xl font-semibold text-red-600 mb-4">Danger Zone</h2>
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <h3 className="text-lg font-medium text-red-800 mb-2">
            Delete Account
          </h3>
          <p className="text-red-700 text-sm mb-4">
            Once you delete your account, there is no going back. Please be
            certain.
          </p>
          <button
            type="button"
            onClick={handleDelete}
            disabled={isLoading}
            className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm font-medium"
          >
            Delete Account
          </button>
        </div>
      </div>
    </div>
  );
}
