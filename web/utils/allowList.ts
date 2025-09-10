// Validate that the redirect URL is one of the allowed paths to prevent open redirect vulnerabilities
export function isValidRedirectUrl(url: string): boolean {

  // Reject obviously invalid URLs for speed
  if (!url || typeof url !== 'string' || !url.startsWith('/')) {
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