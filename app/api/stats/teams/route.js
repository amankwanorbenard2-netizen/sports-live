
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

const API_KEY = process.env.API_FOOTBALL_KEY;
const BASE_URL = "https://v3.football.api-sports.io";

export async function GET(request) {
  if (!API_KEY) {
    return NextResponse.json(
      { error: "API_FOOTBALL_KEY is missing from .env.local" },
      { status: 500 }
    );
  }

  const { searchParams } = new URL(request.url);
  const league = searchParams.get("league") || "39";
  const season = searchParams.get("season") || "2026";

  try {
    const teamsResponse = await fetch(
      `${BASE_URL}/teams?league=${encodeURIComponent(league)}&season=${encodeURIComponent(season)}`,
      {
        headers: { "x-apisports-key": API_KEY },
        cache: "no-store",
      }
    );

    const teamsData = await teamsResponse.json();

    if (!teamsResponse.ok || teamsData.errors?.length) {
      return NextResponse.json(
        {
          error: "Could not retrieve teams.",
          details: teamsData.errors || teamsData.message || null,
        },
        { status: teamsResponse.status || 502 }
      );
    }

    const teams = teamsData.response || [];
    const results = [];

    // Fetch team statistics sequentially to reduce API request bursts.
    for (const item of teams) {
      const team = item.team;
      if (!team?.id) continue;

      try {
        const statsResponse = await fetch(
          `${BASE_URL}/teams/statistics?league=${encodeURIComponent(league)}&season=${encodeURIComponent(season)}&team=${team.id}`,
          {
            headers: { "x-apisports-key": API_KEY },
            cache: "no-store",
          }
        );

        const statsData = await statsResponse.json();
        const stats = statsData.response;

        if (!statsResponse.ok || !stats || statsData.errors?.length) {
          results.push({
            team,
            statistics: null,
            error: true,
          });
          continue;
        }

        results.push({
          team,
          statistics: stats,
          error: false,
        });
      } catch {
        results.push({
          team,
          statistics: null,
          error: true,
        });
      }
    }

    return NextResponse.json({
      league: {
        id: Number(league),
        season: Number(season),
      },
      total: results.length,
      teams: results,
    });
  } catch (error) {
    console.error("Team statistics error:", error);

    return NextResponse.json(
      { error: "Failed to load team statistics." },
      { status: 500 }
    );
  }
}
