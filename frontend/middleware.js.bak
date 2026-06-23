import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    const { pathname } = req.nextUrl;
    const role = req.nextauth?.token?.role;

    // Kitchen route: staff or admin only
    if (pathname.startsWith("/kitchen") && role !== "staff" && role !== "admin") {
      return NextResponse.redirect(new URL("/", req.url));
    }

    // Admin route: admin only
    if (pathname.startsWith("/admin") && role !== "admin") {
      return NextResponse.redirect(new URL("/", req.url));
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      // Only invoke middleware when user is logged in; redirect to login otherwise
      authorized: ({ token, req }) => {
        const { pathname } = req.nextUrl;
        // Public routes — always allow
        if (
          pathname.startsWith("/login") ||
          pathname.startsWith("/register") ||
          pathname.startsWith("/display") ||
          pathname.startsWith("/api/")
        ) {
          return true;
        }
        // All other routes require a token
        return !!token;
      },
    },
  }
);

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico).*)",
  ],
};
