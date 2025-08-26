"use client";

import { createClient } from "@/utils/supabase/client";
import type { Provider } from "@supabase/supabase-js";

export function useAuth() {
  const supabase = createClient();

  const signInWithProvider = async (provider: Provider) => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    if (error) {
      console.error("Error signing in:", error);
      return { error };
    }

    return { error: null };
  };

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();

    if (error) {
      console.error("Error signing out:", error);
      return { error };
    }

    return { error: null };
  };

  return {
    signInWithProvider,
    signOut,
  };
}
