
import { NextResponse } from "next/server";
import { fetchFootball } from "@/lib/football-api";

export const dynamic = "force-dynamic";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const league = searchParams.get("league") || "39";
    const season = searchParams.get("season") || "2026";

    if (!/^\d+$/.test(league) || !/^\d{4}$/.test(season)) {
      return NextResponse.json(
        { error: "Invalid league or season." },
        { status: 400 }
      );
    }

    const data = await fetchFootball(
      `players/topassists?league=${league}&season=${season}`
    );

    const players = (data.response || [])
      .map((item) => {
        const stats = item.statistics?.[0] || {};

        return {
          id: item.player?.id ?? null,
          name: item.player?.name ?? "Unknown player",
          photo: item.player?.photo ?? null,
          nationality: item.player?.nationality ?? "",
          team: stats.team?.name ?? "Unknown team",
          teamLogo: stats.team?.logo ?? null,
          appearances: stats.games?.appearences ?? 0,
          goals: stats.goals?.total ?? 0,
          assists: stats.goals?.assists ?? 0,
          rating: stats.games?.rating ?? null,
        };
      })
      .sort((a, b) => b.assists - a.assists)
      .map((player, index) => ({ ...player, rank: index + 1 }));

    return NextResponse.json({
      league,
      season,
      count: players.length,
      players,
    });
  } catch (error) {
    console.error("Top assists API error:", error);

    return NextResponse.json(
      { error: "Unable to load top assists. Check the server terminal." },
      { status: 500 }
    );
  }
}
