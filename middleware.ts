import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { redis } from "@/lib/redis";

export default async function middleware(request: NextRequest) {
    const isMaintenance = await redis.get("maintenance_mode");

    // 🟣 Backend maintenance mode
    if (isMaintenance === "true") {
      const maintenanceUrl = new URL("/maintenance.html", request.url);

      const html = await fetch(maintenanceUrl).then(r => r.text());

      return new NextResponse(html, {
        status: 503,
        headers: {
          "Content-Type": "text/html",
        },
      });
    }
    return NextResponse.next();
} 



// 👇 ADD IT AT BOTTOM OF SAME FILE
export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|maintenance.html).*)",
  ],
};