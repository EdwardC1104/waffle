'use client'

import Image from "next/image";
import Link from "next/link";
import { useUser } from "@/hooks/useUser";

export default function Home() {
  const { user, loading } = useUser();

  return (
    <div className="font-sans grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20">
      <main className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start">
        <div className="text-center sm:text-left">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Welcome to Waffle
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300 mb-8">
            A Next.js application with Supabase authentication
          </p>
        </div>

        <Image
          className="dark:invert"
          src="/next.svg"
          alt="Next.js logo"
          width={180}
          height={38}
          priority
        />

        {loading ? (
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 dark:border-white mx-auto"></div>
            <p className="mt-2 text-gray-600 dark:text-gray-300">Loading...</p>
          </div>
        ) : user ? (
          <div className="text-center sm:text-left">
            <p className="text-lg text-gray-700 dark:text-gray-300 mb-4">
              Welcome back, {user.user_metadata?.full_name || user.user_metadata?.name || user.email}!
            </p>
            <Link
              href="/profile"
              className="inline-flex items-center justify-center bg-blue-600 hover:bg-blue-700 text-white font-medium text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 rounded-full transition-colors"
            >
              View Profile
            </Link>
          </div>
        ) : (
          <div className="text-center sm:text-left">
            <p className="text-lg text-gray-700 dark:text-gray-300 mb-6">
              Get started by signing in with your preferred provider
            </p>
            <div className="flex gap-4 items-center flex-col sm:flex-row">
              <Link
                href="/signup"
                className="rounded-full border border-solid border-transparent transition-colors flex items-center justify-center bg-foreground text-background gap-2 hover:bg-[#383838] dark:hover:bg-[#ccc] font-medium text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 sm:w-auto"
              >
                Get Started
              </Link>
              <Link
                href="/login"
                className="rounded-full border border-solid border-black/[.08] dark:border-white/[.145] transition-colors flex items-center justify-center hover:bg-[#f2f2f2] dark:hover:bg-[#1a1a1a] hover:border-transparent font-medium text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 w-full sm:w-auto md:w-[158px]"
              >
                Sign In
              </Link>
            </div>
          </div>
        )}

        <ol className="font-mono list-inside list-decimal text-sm/6 text-center sm:text-left max-w-md">
          <li className="mb-2 tracking-[-.01em]">
            Features include SSO authentication with Google and GitHub
          </li>
          <li className="mb-2 tracking-[-.01em]">
            Protected routes and user profile management
          </li>
          <li className="tracking-[-.01em]">
            Built with Next.js 15, TypeScript, and Tailwind CSS
          </li>
        </ol>
      </main>

      <footer className="row-start-3 flex gap-[24px] flex-wrap items-center justify-center">
        <a
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
          href="https://nextjs.org/learn?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            aria-hidden
            src="/file.svg"
            alt="File icon"
            width={16}
            height={16}
          />
          Learn Next.js
        </a>
        <a
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
          href="https://supabase.com/docs"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            aria-hidden
            src="/window.svg"
            alt="Window icon"
            width={16}
            height={16}
          />
          Supabase Docs
        </a>
        <a
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
          href="https://tailwindcss.com/docs"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            aria-hidden
            src="/globe.svg"
            alt="Globe icon"
            width={16}
            height={16}
          />
          Tailwind CSS
        </a>
      </footer>
    </div>
  );
}
