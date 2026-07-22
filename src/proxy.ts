import { clerkMiddleware } from "@clerk/nextjs/server";

/**
 * Next.js 16 middleware lives in `proxy.ts`. Clerk owns customer auth.
 *
 * IMPORTANT: clerkMiddleware runs ONLY on the routes below — the customer
 * account/checkout/order flows and Clerk's own auth routes. The entire public
 * storefront (/, /shop, /product, /learn, /community, /experience, /about,
 * /search) is intentionally excluded so unauthenticated visitors are never
 * sent through Clerk's handshake. Admin uses its own cookie gate, not Clerk.
 */
export default clerkMiddleware();

export const config = {
  matcher: [
    "/checkout(.*)",
    "/account(.*)",
    "/order(.*)",
    "/sign-in(.*)",
    "/sign-up(.*)",
    "/(api|trpc)(.*)",
    "/__clerk(.*)",
  ],
};
