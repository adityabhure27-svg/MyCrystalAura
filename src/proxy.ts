import { clerkMiddleware } from "@clerk/nextjs/server";

/**
 * Next.js 16 middleware lives in `proxy.ts`. Clerk owns authentication.
 * (Supabase is a data store accessed with the publishable key, so there is no
 * separate Supabase auth session to refresh here.)
 */
export default clerkMiddleware();

export const config = {
  matcher: [
    // Everything except static assets and image files…
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)",
    // …plus API/TRPC and Clerk's auto-proxy path.
    "/(api|trpc)(.*)",
    "/__clerk/:path*",
  ],
};
