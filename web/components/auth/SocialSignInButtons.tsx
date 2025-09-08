import { GitHubIcon, GoogleIcon } from "@/components/general/Icons";

interface SocialSignInButtonsProps {
  mode: "login" | "signup";
}

/** Buttons for social sign-in options (Google and GitHub). */
export default function SocialSignInButtons({
  mode,
}: SocialSignInButtonsProps) {
  const buttonText = mode === "login" ? "Sign in with" : "Sign up with";

  return (
    <>
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-stone-300" />
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-2 bg-white text-stone-500">Or continue with</span>
        </div>
      </div>

      <div className="space-y-3">
        <button className="w-full py-3 px-6 border border-stone-300 rounded-full shadow-sm text-stone-900 text-sm font-semibold transition-colors hover:bg-stone-50 flex items-center justify-center gap-2">
          <GoogleIcon size={20} />
          {buttonText} Google
        </button>

        <button className="w-full py-3 px-6 border border-stone-300 rounded-full shadow-sm text-stone-900 text-sm font-semibold transition-colors hover:bg-stone-50 flex items-center justify-center gap-2">
          <GitHubIcon size={20} />
          {buttonText} GitHub
        </button>
      </div>
    </>
  );
}
