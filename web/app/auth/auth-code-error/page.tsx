import Link from 'next/link'

export default function AuthCodeError() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8 text-center">
        <div>
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
            Authentication Error
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Sorry, there was an error during the authentication process.
          </p>
        </div>
        <div className="mt-8">
          <div className="rounded-md bg-red-50">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg
                  className="h-5 w-5 text-red-400"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">
                  Authentication failed
                </h3>
                <div className="mt-2 text-sm text-red-700">
                  <p>
                    The authentication process could not be completed. This might be due to:
                  </p>
                  <ul className="mt-2 list-disc list-inside space-y-1">
                    <li>An invalid or expired authorization code</li>
                    <li>OAuth provider configuration issues</li>
                    <li>Network connectivity problems</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
          <div className="mt-6 space-y-4">
            <Link
              href="/login"
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
            >
              Try Again
            </Link>
            <Link
              href="/"
              className="w-full flex justify-center py-2 px-4 border border-gray-300"
            >
              Go Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
