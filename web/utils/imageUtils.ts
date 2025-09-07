/**
 * Utility functions for image processing
 */

export interface ImageValidationResult {
  isValid: boolean;
  error?: string;
}

/**
 * Validate image file type and size
 */
export const validateImage = (
  file: File,
  maxSizeMB: number = 10
): ImageValidationResult => {
  // Validate file type
  if (!file.type.startsWith("image/")) {
    return {
      isValid: false,
      error: "Please select a valid image file",
    };
  }

  // Validate file size
  const maxSizeBytes = maxSizeMB * 1024 * 1024;
  if (file.size > maxSizeBytes) {
    return {
      isValid: false,
      error: `Image must be smaller than ${maxSizeMB}MB`,
    };
  }

  return { isValid: true };
};

/**
 * Get supported image file extensions for input accept attribute
 */
export const getSupportedImageTypes = (): string => {
  return "image/*";
};
