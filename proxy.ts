import { auth } from "@/lib/auth/server";
import type { NextRequest } from "next/server";

const authProxy = auth.middleware({
  // Redirects unauthenticated users to sign-in page
  loginUrl: "/auth/sign-in",
});

export default function proxy(request: NextRequest) {
  if (request.method === "POST" && request.headers.has("next-action")) {
    return;
  }

  return authProxy(request);
}

export const config = {
  matcher: [
    // Protected routes requiring authentication
    "/account/:path*",
    "/dashboard/:path*",
    "/events/:path*",
  ],
};
