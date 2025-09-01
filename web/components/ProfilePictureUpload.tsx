"use client";

import { CheckIcon, ImageIcon } from "@/components/Icons";
import { convertToBase64, validateImage } from "@/utils/imageUtils";
import Image from "next/image";
import { useRef } from "react";

interface ProfilePictureUploadProps {
  currentImageUrl: string;
  onImageChange: (file: File, base64: string) => void;
  onError: (error: string) => void;
  hasNewImage: boolean;
  disabled?: boolean;
}

export default function ProfilePictureUpload({
  currentImageUrl,
  onImageChange,
  onError,
  hasNewImage,
  disabled = false,
}: ProfilePictureUploadProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate the image
    const validation = validateImage(file);
    if (!validation.isValid) {
      onError(validation.error!);
      return;
    }

    try {
      // Convert to base64
      const base64 = await convertToBase64(file);
      onImageChange(file, base64);
    } catch (err) {
      onError("Failed to process image");
      console.error("Error converting image to base64:", err);
    }
  };

  const handleButtonClick = () => {
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
        <div className="relative">
          <Image
            src={currentImageUrl}
            alt="Profile picture"
            width={80}
            height={80}
            className="w-20 h-20 rounded-full object-cover border-2 border-gray-200"
          />
          {hasNewImage && (
            <div className="absolute -top-2 -right-2 w-6 h-6 bg-stone-900 rounded-full flex items-center justify-center">
              <CheckIcon size={16} className="text-white" />
            </div>
          )}
        </div>

        <div className="flex-1">
          <button
            type="button"
            onClick={handleButtonClick}
            disabled={disabled}
            className="px-8 py-3 bg-stone-900 rounded-full shadow-lg text-white text-sm font-semibold transition-opacity hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed inline-flex items-center justify-center gap-2"
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
          onChange={handleFileChange}
          className="hidden"
          disabled={disabled}
        />
      </div>
    </div>
  );
}
