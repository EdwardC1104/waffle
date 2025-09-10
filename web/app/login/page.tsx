"use client";

import AuthForm from "@/components/auth/AuthForm";
import AuthPageLayout from "@/components/auth/AuthPageLayout";
import AuthRedirectLink from "@/components/auth/AuthRedirectLink";
import SubmitButton from "@/components/auth/SubmitButton";
import TextInput from "@/components/general/TextInput";
import useAuth from "@/hooks/useAuth";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { login, isLoading } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!username || !password) {
      setError("Please fill in all fields");
      return;
    }

    const result = await login(username, password);

    if (result.success) {
      // Redirect user to the page they were attempting to access - default to following feed
      const redirectTo = searchParams.get("redirect") || "/feed/following";
      router.push(redirectTo);
    } else {
      setError(result.error || "Login failed");
    }
  };

  return (
    <AuthPageLayout
      title="Sign in to your account"
      subtitle="Choose your preferred sign-in method"
    >
      <AuthForm onSubmit={handleSubmit} error={error} errorTitle="Login Failed">
        <TextInput
          placeholder="Username"
          type="text"
          onChange={setUsername}
          containerClassName="w-full"
        />
        <TextInput
          placeholder="Password"
          type="password"
          onChange={setPassword}
          inputClassName="[text-security:disc] [-webkit-text-security:disc] font-bold"
          containerClassName="w-full"
        />

        <SubmitButton
          isLoading={isLoading}
          loadingText="Signing In..."
          defaultText="Sign In"
        />
      </AuthForm>

      {/* forgotten password isn't implemented yet */}
      {/* <div className="flex justify-end">
        <button className="text-sm text-blue-600 hover:text-blue-500 underline transition-colors">
          Forgot your password?
        </button>
      </div> */}

      {/* sso is not yet implemented */}
      {/* <SocialSignInButtons mode="login" /> */}

      <AuthRedirectLink mode="login" />
    </AuthPageLayout>
  );
}
