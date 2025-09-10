"use client";

import AuthForm from "@/components/auth/AuthForm";
import AuthPageLayout from "@/components/auth/AuthPageLayout";
import AuthRedirectLink from "@/components/auth/AuthRedirectLink";
import SubmitButton from "@/components/auth/SubmitButton";
import TextInput from "@/components/general/TextInput";
import useAuth from "@/hooks/useAuth";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { isValidRedirectUrl, DEFAULT_REDIRECT_URL } from "@/utils/allowList";

export default function SignupPage() {
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const { register, isLoading } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!name || !username || !email || !password || !confirmPassword) {
      setError("Please fill in all fields");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    const result = await register(name, username, email, password);

    if (result.success) {
      // Redirect user to the page they were attempting to access - default to following feed
      const redirectParam = searchParams.get("redirect");
      const redirectTo = redirectParam && isValidRedirectUrl(redirectParam) 
        ? redirectParam 
        : DEFAULT_REDIRECT_URL;
      router.push(redirectTo);
    } else {
      setError(result.error || "Registration failed");
    }
  };

  return (
    <AuthPageLayout
      title="Create your account"
      subtitle="Sign up using your preferred provider"
    >
      <AuthForm
        onSubmit={handleSubmit}
        error={error}
        errorTitle="Registration Failed"
      >
        <TextInput
          placeholder="Full Name"
          onChange={setName}
          containerClassName="w-full"
        />
        <TextInput
          placeholder="Username"
          onChange={setUsername}
          containerClassName="w-full"
        />
        <TextInput
          placeholder="Email"
          type="email"
          onChange={setEmail}
          containerClassName="w-full"
        />
        <TextInput
          placeholder="Password"
          type="password"
          onChange={setPassword}
          inputClassName="[text-security:disc] [-webkit-text-security:disc] font-bold"
          containerClassName="w-full"
        />
        <TextInput
          placeholder="Confirm Password"
          type="password"
          onChange={setConfirmPassword}
          inputClassName="[text-security:disc] [-webkit-text-security:disc] font-bold"
          containerClassName="w-full"
        />

        <SubmitButton
          isLoading={isLoading}
          loadingText="Creating Account..."
          defaultText="Sign Up"
        />
      </AuthForm>

      {/* sso is not yet implemented */}
      {/* <SocialSignInButtons mode="signup" /> */}

      <AuthRedirectLink mode="signup" />
    </AuthPageLayout>
  );
}
