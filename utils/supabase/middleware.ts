import { NextResponse, type NextRequest } from "next/server";
import { createMiddlewareClient } from "@supabase/auth-helpers-nextjs";

export async function updateSession(request: NextRequest) {
  const res = NextResponse.next(); // important: single response instance

  const supabase = createMiddlewareClient({ req: request, res });

  const {
    data: { session },
    error,
  } = await supabase.auth.getSession();

  // Debug: confirm cookie presence and errors
  // console.log("sb-access-token?", request.cookies.get("sb-access-token")?.value?.slice(0,16), "err:", error?.message);

  if (!session) {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    url.searchParams.set("next", request.nextUrl.pathname);
    return NextResponse.redirect(url);
  }

  return res; // return the same response with any refreshed cookies
}