import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

const middleware = withAuth(
  //Middleware is active when user is authenticated via NextAuth.js
  function middleware(req) {
    if (req.nextUrl.pathname.startsWith("/auth/signin")) {
      return NextResponse.redirect(new URL("/", req.url));
    }
  },
);
export const config = {
  matcher: ["/auth/signin", "/recipe/create", "/recipe/:id/edit"],
};

export default middleware;
