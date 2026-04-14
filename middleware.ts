import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

const INTERNAL_ROUTE_PREFIXES = ["/dashboard"];

export async function middleware(_request: NextRequest) {
  return NextResponse.next();
}

export const config = {
  matcher: INTERNAL_ROUTE_PREFIXES.map((prefix) => `${prefix}/:path*`),
};
