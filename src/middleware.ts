import { NextRequest, NextResponse } from "next/server";

const PUBLIC_FILE = /\.(.*)$/;

export async function middleware(req: NextRequest) {
  console.log(req.nextUrl);
  console.log(
    "Will not redirect",
    req.nextUrl.pathname.startsWith("/_next") ||
      req.nextUrl.pathname.includes("/api/") ||
      req.headers.has("x-prerender-revalidate") ||
      PUBLIC_FILE.test(req.nextUrl.pathname)
  );
  if (
    req.nextUrl.pathname.startsWith("/_next") ||
    req.nextUrl.pathname.includes("/api/") ||
    req.headers.has("x-prerender-revalidate") ||
    PUBLIC_FILE.test(req.nextUrl.pathname)
  ) {
    return;
  }

  console.log("Will redirect", req.nextUrl.locale === "default");
  if (req.nextUrl.locale === "default") {
    const locale = req.cookies.get("NEXT_LOCALE")?.value || "en";
    return NextResponse.redirect(
      new URL(`/${locale}${req.nextUrl.pathname}${req.nextUrl.search}`, req.url)
    );
  }
}
