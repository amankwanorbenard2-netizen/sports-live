
import { NextResponse } from "next/server";
import { fetchFootball } from "@/lib/football-api";

export async function GET(request, { params }) {
  try {
    const { id } = await params;
    const { searchParams } = new URL(request.url);

    if (!id || !/^\d+$/.test(String(id))) {
      return NextResponse.json(
        { error: "A valid player ID is required." },
        { status: 400 }
      );
    }

    // Use the requested season, or default to the current season.
    const season =
      searchParams.get("season") || String(new Date().getFullYear());

    const data = await fetchFootball(
      `players?id=${encodeURIComponent(id)}&season=${encodeURIComponent(season)}`
    );

    if (data?.errors && Object.keys(data.errors).length > 0) {
      return NextResponse.json(
        {
          error: "API-Sports rejected the player request.",
          details: data.errors,
        },
        { status: 502 }
      );
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error("Player route error:", error);

    return NextResponse.json(
      {
        error: "Unable to retrieve player information.",
        details:
          error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
