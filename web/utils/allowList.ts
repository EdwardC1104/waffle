// Validate that the redirect URL is one of the allowed paths to prevent open redirect vulnerabilities
export function isValidRedirectUrl(url: string): boolean {

  /* The following checks before the allow list are to improve speed by rejecting obviously bad URLs early.
  They are hopefully redundant with a comprehensive allow list. */

  // Reject invalid URLs
  if (!url || typeof url !== 'string' || !url.startsWith('/')) {
    return false;
  }

  // Decode URL to catch encoded attacks
  let decodedUrl: string;
  try {
    decodedUrl = decodeURIComponent(url);
  } catch {
    return false; // Invalid encoding
  }

  // Additional safety checks on decoded URL
  if (decodedUrl.includes('://') || 
      decodedUrl.startsWith('//') || 
      decodedUrl.includes('\\') ||
      decodedUrl.toLowerCase().includes('javascript:') ||
      decodedUrl.toLowerCase().includes('data:')) {
    return false;
  }

  // Allowed list
  const allowedPatterns = [
    // Feed pages
    /^\/feed\/(following|fyp|popular)$/,
    // Post pages
    /^\/post\/[0-9]+$/,
    // Profile pages
    /^\/profile\/[a-zA-Z0-9_]+$/,
    // Other pages
    /^\/create\/post$/,
  ];
  
  return allowedPatterns.some(pattern => pattern.test(url));
}

// Default redirect URL if none provided or invalid
export const DEFAULT_REDIRECT_URL = "/feed/following";