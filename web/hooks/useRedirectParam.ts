"use client";

import { useEffect, useState } from "react";

// Default redirect URL if none provided or invalid
const DEFAULT_REDIRECT_URL = "/feed/following";

// Validate that the redirect URL is relative to our site to prevent open redirect vulnerabilities
function isValidRedirectUrl(url: string): boolean {
  return !!(url && typeof url === "string" && url.startsWith("/"));
}

/*  Custom hook to extract and validate the 'redirect' query parameter from the URL.
    Wanted to avoid a suspense wrapper...
*/
export function useRedirectParam() {
  const [redirectTo, setRedirectTo] = useState(DEFAULT_REDIRECT_URL);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const urlParams = new URLSearchParams(window.location.search);
      const redirectParam = urlParams.get("redirect");

      if (redirectParam && isValidRedirectUrl(redirectParam)) {
        setRedirectTo(redirectParam);
      }
    }
  }, []);

  return redirectTo;
}
