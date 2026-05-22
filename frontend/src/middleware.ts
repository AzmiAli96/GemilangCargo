import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
    const token = request.cookies.get("token")?.value;

    const isLoginPage = request.nextUrl.pathname === "/signin";

    // ❌ kalau belum login & bukan di halaman signin
    if (!token && !isLoginPage) {
        return NextResponse.redirect(new URL("/signin", request.url));
    }

    // ❌ kalau sudah login tapi masih di signin → redirect ke dashboard
    if (token && isLoginPage) {
        return NextResponse.redirect(new URL("/", request.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        "/((?!api|_next/static|_next/image|favicon.ico|images).*)",
    ],
};