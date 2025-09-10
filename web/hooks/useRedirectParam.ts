"use client";

import { useState, useEffect } from "react";
import { isValidRedirectUrl, DEFAULT_REDIRECT_URL } from "@/utils/allowList";

/* Custom hook to extract and validate the 'redirect' query parameter from the URL. */
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
