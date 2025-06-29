import { createMiddlewareClient } from "@supabase/auth-helpers-nextjs";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  const response = NextResponse.next();
  const supabase = createMiddlewareClient({ req: request, res: response });

  const {
    data: { session },
    error,
  } = await supabase.auth.getSession();

if (!session) {
    return NextResponse.redirect(new URL("/login", request.url));
}

  return response;
}

export const config = {
  matcher: ["/dashboard"],
};
