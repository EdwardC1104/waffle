import { getSupportedImageTypes, validateImage } from "@/utils/imageUtils";
import Image from "next/image";
import { useRef } from "react";
import { ImageIcon } from "../general/Icons";

interface ImageUploadProps {
  imagePreview: string | null;
  onImageChange: (file: File | null) => void;
  onRemoveImage: () => void;
  onError: (error: string) => void;
  maxSizeMB?: number;
}

/** Component for uploading and previewing a post cover image. */
export default function ImageUpload({
  imagePreview,
  onImageChange,
  onRemoveImage,
  onError,
  maxSizeMB = 10,
}: ImageUploadProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const validation = validateImage(file, maxSizeMB);
    if (!validation.isValid) {
      onError(validation.error || "Invalid image file");
      return;
    }

    onImageChange(file);
  };

  const handleRemoveImage = () => {
    onRemoveImage();
    // Clear the file input
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  if (imagePreview) {
    return (
      <div className="relative">
        <Image
          src={imagePreview}
          alt="Post preview"
          width={800}
          height={400}
          className="w-full h-64 sm:h-80 rounded-lg object-cover"
        />
        <button
          type="button"
          onClick={handleRemoveImage}
          className="absolute top-3 right-3 bg-black/50 text-white rounded-full p-2 hover:bg-black/70 transition-colors"
          aria-label="Remove image"
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path
              d="M12 4L4 12M4 4L12 12"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      </div>
    );
  }

  return (
    <div className="border-2 border-dashed border-zinc-300 rounded-lg p-8 text-center hover:border-zinc-400 transition-colors">
      <input
        ref={fileInputRef}
        type="file"
        accept={getSupportedImageTypes()}
        onChange={handleFileChange}
        className="hidden"
        id="image-upload"
      />
      <label
        htmlFor="image-upload"
        className="cursor-pointer flex flex-col items-center gap-3"
      >
        <div className="w-12 h-12 bg-zinc-100 rounded-full flex items-center justify-center">
          <ImageIcon size={24} className="text-zinc-500" />
        </div>
        <div>
          <p className="text-zinc-600 font-medium">
            Add an image to your story
          </p>
          <p className="text-zinc-400 text-sm">
            Click to upload or drag and drop
          </p>
        </div>
      </label>
    </div>
  );
}
