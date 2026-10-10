
import { NextResponse } from "next/server";

export const revalidate = 3600;

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const league = searchParams.get("league");
    const season = searchParams.get("season") || "2026";

    if (!league || !/^\d+$/.test(league)) {
      return NextResponse.json(
        { errors: ["A valid league ID is required."], response: [] },
        { status: 400 }
      );
    }

    if (!/^\d{4}$/.test(season)) {
      return NextResponse.json(
        { errors: ["A valid season is required."], response: [] },
        { status: 400 }
      );
    }

    const apiKey = process.env.API_FOOTBALL_KEY;

    if (!apiKey) {
      return NextResponse.json(
        { errors: ["API_FOOTBALL_KEY is not configured."], response: [] },
        { status: 500 }
      );
    }

    const url = new URL(
      "https://v3.football.api-sports.io/standings"
    );
    url.searchParams.set("league", league);
    url.searchParams.set("season", season);

    const response = await fetch(url.toString(), {
      headers: {
        "x-apisports-key": apiKey,
        Accept: "application/json",
      },
      next: { revalidate: 3600 },
    });

    const data = await response.json();

    if (!response.ok || data.errors?.requests) {
      console.error("Standings provider error:", data.errors);

      return NextResponse.json(
        {
          errors: data.errors || ["Unable to retrieve standings."],
          response: [],
        },
        { status: response.status || 502 }
      );
    }

    return NextResponse.json(data, {
      headers: {
        "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
      },
    });
  } catch (error) {
    console.error("Standings route error:", error);

    return NextResponse.json(
      { errors: ["Unable to retrieve standings."], response: [] },
      { status: 500 }
    );
  }
}
