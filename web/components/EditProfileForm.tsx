"use client";

import ErrorMessage from "@/components/ErrorMessage";
import FormActions from "@/components/FormActions";
import FormField from "@/components/FormField";
import ProfilePictureUpload from "@/components/ProfilePictureUpload";
import useProfileEdit from "@/hooks/useProfileEdit";
import { User } from "@/types";

interface EditProfileFormProps {
  user: User;
  onUserUpdated: () => Promise<void>;
  onUserDeleted: () => Promise<void>;
}

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
      {/* Error Message */}
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
        {/* Profile Picture Section */}
        <ProfilePictureUpload
          currentImageUrl={formData.profilePicture ? URL.createObjectURL(formData.profilePicture) : user.profilePictureUrl}
          onImageChange={handleProfilePictureChange}
          onError={setError}
          hasNewImage={formData.profilePicture !== null}
          disabled={isLoading}
        />

        {/* Personal Information Section */}
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
              onChange={() => {}} // No-op since email can't be changed
              placeholder=""
              helpText="Email cannot be changed"
              disabled
            />
          </div>
        </div>

        {/* Action Buttons */}
        <FormActions
          onCancel={handleCancel}
          onSubmit={() => {}} // Form handles submit via onSubmit
          isLoading={isLoading}
          isFormValid={isFormValid}
          hasChanges={hasChanges}
        />
      </form>

      {/* Danger Zone - Outside of form since it's not part of profile editing */}
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
            {isLoading ? "Deleting..." : "Delete Account"}
          </button>
        </div>
      </div>
    </div>
  );
}
