import { useRedirectParam } from "@/hooks/useRedirectParam";
import Link from "next/link";


interface AuthRedirectLinkProps {
  mode: "login" | "signup";
}

/** Link to move between login and signup pages. */
export default function AuthRedirectLink({ mode }: AuthRedirectLinkProps) {
  // Get any parameters in the URL
  const redirectTo = useRedirectParam();

  // If there's a desired path, we need to format it as a query parameter and encode it
  const desiredPathPrefixed = redirectTo ? `?redirect=${encodeURIComponent(redirectTo)}` : "";

  if (mode === "login") {
    return (
      <div className="text-center mt-6">
        <p className="text-sm text-stone-600">
          Not a Waffler?{" "}
          <Link
            href={`/signup${desiredPathPrefixed}`}
            className="font-medium text-blue-600 hover:text-blue-500 underline transition-colors"
          >
            Sign up here
          </Link>
        </p>
      </div>
    );
  }

  return (
    <div className="text-center mt-6">
      <p className="text-sm text-stone-600">
        Already a waffler?{" "}
        <Link
          href={`/login${desiredPathPrefixed}`}
          className="font-medium text-blue-600 hover:text-blue-500 underline transition-colors"
        >
          Sign in here
        </Link>
      </p>
    </div>
  );
}
