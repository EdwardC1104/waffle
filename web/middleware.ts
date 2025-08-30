import { NextRequest, NextResponse } from "next/server";

export function middleware(request: NextRequest) {
  // Check if the request is for an API route
  if (request.nextUrl.pathname.startsWith("/api/")) {
    // Construct the URL for the .NET backend
    // You'll need to update this URL to match your .NET API
    const backendUrl =
      process.env.NEXT_PUBLIC_API_URL || "http://192.168.68.109:5204";
    const url = new URL(request.nextUrl.pathname, backendUrl);

    // Copy search parameters
    request.nextUrl.searchParams.forEach((value, key) => {
      url.searchParams.set(key, value);
    });

    // Create the request to the backend
    const headers = new Headers(request.headers);

    // Remove host header to avoid conflicts
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
