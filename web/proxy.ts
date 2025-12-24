import { NextRequest, NextResponse } from "next/server";

/** Middleware to rewrite API and MinIO requests to backend services. */
export function proxy(request: NextRequest) {
  // Proxy API requests to the backend API server
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

  // Proxy MinIO requests to the MinIO server
  if (request.nextUrl.pathname.startsWith("/minio/")) {
    const minioUrl = process.env.MINIO_URL || "http://minio:9000";

    // Remove /minio prefix and construct the MinIO URL
    const minioPath = request.nextUrl.pathname.replace(/^\/minio/, "");
    const url = new URL(minioPath, minioUrl);

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
  matcher: ["/api/:path*", "/minio/:path*"],
};
