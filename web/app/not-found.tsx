"use client";

import Link from "next/link";

export default function NotFound() {
  return (
    <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <div className="text-center">
        <div className="mx-auto flex items-center justify-center h-24 w-24 rounded-full bg-gray-100 mb-6">
          <span className="text-4xl font-bold text-gray-600">404</span>
        </div>

        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          Page Not Found
        </h1>
        <p className="text-lg text-gray-600 mb-8 max-w-md mx-auto">
          Sorry, we couldn&apos;t find the page you&apos;re looking for. It
          might have been moved, deleted, or doesn&apos;t exist.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/"
            className="px-6 py-3 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors font-medium"
          >
            Go Home
          </Link>
          <Link
            href="/feed/popular"
            className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
          >
            Browse Popular Posts
          </Link>
        </div>

        <div className="mt-8 text-sm text-gray-500">
          <p>
            If you think this is a mistake, please{" "}
            <button
              onClick={() => window.history.back()}
              className="font-bold hover:underline"
            >
              go back
            </button>{" "}
            or contact support at <b>support@thewaffle.app</b>.
          </p>
        </div>
      </div>
    </div>
  );
}
