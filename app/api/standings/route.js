import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);

    const league = searchParams.get("league");
    const season = searchParams.get("season") || "2026";

    if (!league) {
      return NextResponse.json(
        { error: "Missing league parameter" },
        { status: 400 }
      );
    }

    const apiKey = process.env.API_FOOTBALL_KEY;

    if (!apiKey) {
      return NextResponse.json(
        { error: "Football API key is not configured" },
        { status: 500 }
      );
    }

    const response = await fetch(
      `https://v3.football.api-sports.io/standings?league=${encodeURIComponent(league)}&season=${encodeURIComponent(season)}`,
      {
        method: "GET",
        headers: {
          "x-apisports-key": apiKey,
          Accept: "application/json",
        },
        cache: "no-store",
      }
    );

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        { error: "Football API request failed", details: data },
        { status: response.status }
      );
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error("Standings API error:", error);

    return NextResponse.json(
      { error: "Failed to fetch standings" },
      { status: 500 }
    );
  }
}
