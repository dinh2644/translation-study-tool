import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { auth0 } from "@/lib/auth0";

export async function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;

    // Skip middleware for external URLs (e.g., YouTube)
    if (pathname.startsWith("http://") || pathname.startsWith("https://")) {
        return NextResponse.next();
    }

    const authRes = await auth0.middleware(request);
    console.log("Middleware called");


    // authentication routes — let the middleware handle it
    if (request.nextUrl.pathname.startsWith("/auth")) {
        return authRes;
    }

    // public routes — no need to check for session
    if (request.nextUrl.pathname === ("/")) {
        return authRes;
    }

    // protected routes - validate for session
    const { origin } = new URL(request.url)

    const session = await auth0.getSession()

    // user does not have a session — redirect to login
    if (!session) {
        return NextResponse.redirect(`${origin}/auth/login`)
    }

    return authRes
}

export const config = {
    matcher: [
        /*
         * Match all request paths except for the ones starting with:
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico, sitemap.xml, robots.txt (metadata files)
         */
        "/((?!_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt|images/.*|https://www.youtube.com/.*).*)",
    ],
};