import { NextResponse } from "next/server";
import { getTickerData } from "@/lib/ticker";

export const dynamic = "force-dynamic";

export async function GET() {
  return NextResponse.json(getTickerData(), {
    headers: {
      "Cache-Control": "no-store, max-age=0",
    },
  });
}
