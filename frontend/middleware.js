import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

async function middleware(req) {
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
}

export default withAuth(middleware, {
  callbacks: {
    authorized: ({ token, req }) => {
      const { pathname } = req.nextUrl;
      if (
        pathname === "/" ||
        pathname.startsWith("/login") ||
        pathname.startsWith("/register") ||
        pathname.startsWith("/display") ||
        pathname.startsWith("/api/")
      ) {
        return true;
      }
      return !!token;
    },
  },
});

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico).*)",
  ],
};
