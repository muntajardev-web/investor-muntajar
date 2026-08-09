import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const url = new URL(request.url);
  return NextResponse.redirect(new URL("/", url.origin));
}

export async function POST(request: Request) {
  const url = new URL(request.url);
  return NextResponse.redirect(new URL("/", url.origin));
}
