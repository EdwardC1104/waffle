import { NextRequest, NextResponse } from "next/server";

/** Middleware to rewrite API requests to the backend server. */
export function middleware(request: NextRequest) {
  if (request.nextUrl.pathname.startsWith("/api/")) {
    if (!process.env.API_URL) {
      throw new Error("API_URL is not defined in the environment variables");
    }

    const url = new URL(request.nextUrl.pathname, process.env.API_URL);

    request.nextUrl.searchParams.forEach((value, key) => {
      url.searchParams.set(key, value);
    });

    const headers = new Headers(request.headers);

    headers.delete("host");

    return NextResponse.rewrite(url, {
      request: {
        headers,
      },
    });
  }

  return NextResponse.next();
}

export const config = {
  matcher: "/api/:path*",
};
