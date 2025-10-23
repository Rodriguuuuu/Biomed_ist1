import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const basicAuth = process.env.BASIC_AUTH_ENABLED === "true";

export function middleware(req: NextRequest) {
  if (!basicAuth) return NextResponse.next();

  const auth = req.headers.get("authorization");
  if (auth) {
    const [scheme, b64] = auth.split(" ");
    if (scheme?.toLowerCase() === "basic") {
      const [user, pass] = atob(b64).split(":");
      if (user === process.env.BASIC_AUTH_USER && pass === process.env.BASIC_AUTH_PASS) {
        return NextResponse.next();
      }
    }
  }
  return new NextResponse("Authentication required.", {
    status: 401,
    headers: { "WWW-Authenticate": 'Basic realm="Private", charset="UTF-8"' }
  });
}

export const config = { matcher: ["/admin/:path*"] };
