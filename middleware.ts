import {NextResponse} from "next/server";
import type {NextRequest} from "next/server";

const LOCALES = new Set(["ge", "ru", "en"]);
const EXCLUDED_PREFIXES = ["/admin", "/api", "/_next", "/favicon.ico", "/robots.txt", "/sitemap.xml"];

export function middleware(req: NextRequest) {
    const {pathname} = req.nextUrl;

    if (EXCLUDED_PREFIXES.some((p) => pathname === p || pathname.startsWith(p + "/"))) {
        return NextResponse.next();
    }

    if (pathname === "/") {
        const url = req.nextUrl.clone();
        url.pathname = "/ge";
        return NextResponse.redirect(url);
    }

    const match = pathname.match(/^\/([^/]+)(\/.*)?$/);
    if (!match) return NextResponse.next();

    const firstSegment = match[1];
    const rest = match[2] ?? "";

    if (!LOCALES.has(firstSegment)) {
        const url = req.nextUrl.clone();
        url.pathname = `/ge${rest}`;
        return NextResponse.redirect(url);
    }

    return NextResponse.next();
}

export const config = {
    matcher: ["/((?!_next/static|_next/image|.*\\.(?:png|jpg|jpeg|gif|svg|webp|ico|css|js|map)$).*)"],
};