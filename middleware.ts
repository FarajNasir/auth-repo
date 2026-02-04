import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { supabaseServer } from "@/lib/server";

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  const supabase = await supabaseServer();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const isAuthPage =
    pathname.startsWith("/login") || pathname.startsWith("/signup");

  const isDashboard = pathname.startsWith("/dashboard");

  // ❌ Not logged in → dashboard block
  if (!user && isDashboard) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  // ❌ Logged in → login/signup block
  if (user && isAuthPage) {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/login", "/signup", "/dashboard/:path*"],
};
