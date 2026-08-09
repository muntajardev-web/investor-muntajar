import { clerkMiddleware } from "@clerk/nextjs/server";
import { NextResponse, type NextRequest } from "next/server";

function isDummyClerkKey(key?: string): boolean {
  if (!key) return true;
  return (
    key.includes("placeholder") ||
    key.includes("XXXXXXXXXXXXXXXX") ||
    key.includes("muntajar") ||
    key.includes("bXVudGFqYX") ||
    !key.includes("$")
  );
}

export default function proxy(req: NextRequest, evt: any) {
  const clerkKey = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;

  if (isDummyClerkKey(clerkKey)) {
    const requestHeaders = new Headers(req.headers);
    requestHeaders.set("x-pathname", req.nextUrl.pathname);

    return NextResponse.next({
      request: {
        headers: requestHeaders,
      },
    });
  }

  return clerkMiddleware(async (auth, req) => {
    const requestHeaders = new Headers(req.headers);
    requestHeaders.set("x-pathname", req.nextUrl.pathname);

    return NextResponse.next({
      request: {
        headers: requestHeaders,
      },
    });
  })(req, evt);
}

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
};

