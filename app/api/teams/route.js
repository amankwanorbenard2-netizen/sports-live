
import { NextResponse } from "next/server";
import { fetchFootball } from "@/lib/football-api";

export const dynamic = "force-dynamic";

export async function GET(request) {
  try {
    const url = new URL(request.url);

    const league = Number(url.searchParams.get("league") || 39);
    const season = Number(url.searchParams.get("season") || 2026);

    if (!Number.isInteger(league) || league <= 0) {
      return NextResponse.json(
        { error: "A valid league ID is required." },
        { status: 400 }
      );
    }

    if (
      !Number.isInteger(season) ||
      season < 2000 ||
      season > 2100
    ) {
      return NextResponse.json(
        { error: "A valid season is required." },
        { status: 400 }
      );
    }

    const result = await fetchFootball(
      `teams?league=${league}&season=${season}`
    );

    if (result?.errors && Object.keys(result.errors).length > 0) {
      console.error("Football API teams error:", result.errors);

      return NextResponse.json(
        {
          error: "The football API could not load this competition.",
          details: result.errors,
        },
        { status: 502 }
      );
    }

    const teams = (result?.response || [])
      .map((item) => item.team)
      .filter((team) => team?.id);

    return NextResponse.json({
      league,
      season,
      count: teams.length,
      teams,
    });
  } catch (error) {
    console.error("Teams API error:", error);

    return NextResponse.json(
      {
        error: error.message || "Unable to load teams.",
      },
      { status: 500 }
    );
  }
}
