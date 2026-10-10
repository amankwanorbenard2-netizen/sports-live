
import { NextResponse } from "next/server";
import { fetchFootball } from "@/lib/football-api";

export async function GET(request, { params }) {
  try {
    const { id } = await params;

    if (!id || !/^\d+$/.test(String(id))) {
      return NextResponse.json(
        { success: false, error: "A valid player ID is required." },
        { status: 400 }
      );
    }

    const { searchParams } = new URL(request.url);
    const type = searchParams.get("type");

    let data;

    if (type === "transfers") {
      data = await fetchFootball(`transfers?player=${id}`);
    } else {
      const season = searchParams.get("season") || "2026";
      data = await fetchFootball(
        `players?id=${id}&season=${encodeURIComponent(season)}`
      );
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error("Player API error:", error);

    return NextResponse.json(
      {
        success: false,
        error: "Unable to retrieve player information."
      },
      { status: 500 }
    );
  }
}
