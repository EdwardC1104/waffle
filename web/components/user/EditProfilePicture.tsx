"use client";

import { CheckIcon, ImageIcon } from "@/components/general/Icons";
import ProfilePicture from "@/components/user/ProfilePicture";
import { validateImage } from "@/utils/imageUtils";
import { useRef } from "react";

const ACCEPTED_IMAGE_TYPES = "image/*";
const MAX_FILE_SIZE_TEXT = "JPG, PNG or GIF. Max size 5MB.";

interface EditProfilePictureProps {
  currentImageUrl: string;
  onImageChange: (file: File) => void;
  onError: (error: string) => void;
  hasNewImage: boolean;
  disabled?: boolean;
}

/** Allows you to upload a new profile picture image. */
export default function EditProfilePicture({
  currentImageUrl,
  onImageChange,
  onError,
  hasNewImage,
  disabled = false,
}: EditProfilePictureProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelection = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const selectedFile = event.target.files?.[0];

    if (!selectedFile) {
      return;
    }

    const validation = validateImage(selectedFile);

    if (!validation.isValid) {
      onError(validation.error!);
      return;
    }

    onImageChange(selectedFile);
  };

  const triggerFileInput = () => {
    if (!disabled) {
      fileInputRef.current?.click();
    }
  };

  return (
    <div className="py-8 px-8 border-b border-gray-100">
      <h2 className="text-xl font-semibold text-stone-900 mb-6">
        Profile Picture
      </h2>

      <div className="flex items-center gap-6">
        {/* Profile Image Preview */}
        <div className="relative">
          <ProfilePicture
            url={currentImageUrl}
            name="Your new"
            size="lg"
            className="border-2 border-gray-200"
          />
          {hasNewImage && (
            <div className="absolute -top-2 -right-2 w-6 h-6 bg-stone-900 rounded-full flex items-center justify-center">
              <CheckIcon size={16} className="text-white" />
            </div>
          )}
        </div>

        {/* Upload Controls */}
        <div className="flex-1">
          <button
            type="button"
            onClick={triggerFileInput}
            disabled={disabled}
            className="px-8 py-3 bg-stone-900 rounded-full shadow-lg text-white text-sm font-semibold transition-opacity hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed inline-flex items-center justify-center gap-2"
          >
            <ImageIcon size={16} />
            Change Picture
          </button>
          <p className="text-sm text-gray-500 mt-2">{MAX_FILE_SIZE_TEXT}</p>
        </div>

        {/* Hidden file input */}
        <input
          ref={fileInputRef}
          type="file"
          accept={ACCEPTED_IMAGE_TYPES}
          onChange={handleFileSelection}
          className="hidden"
          disabled={disabled}
        />
      </div>
    </div>
  );
}
