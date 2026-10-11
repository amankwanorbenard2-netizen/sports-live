
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
      `players/topscorers?league=${league}&season=${season}`
    );

    const players = (data.response || []).map((item, index) => {
      const stats = item.statistics?.[0] || {};

      return {
        rank: index + 1,
        id: item.player?.id ?? null,
        name: item.player?.name ?? "Unknown player",
        photo: item.player?.photo ?? null,
        nationality: item.player?.nationality ?? "",
        age: item.player?.age ?? null,
        team: stats.team?.name ?? "Unknown team",
        teamLogo: stats.team?.logo ?? null,
        appearances: stats.games?.appearences ?? 0,
        minutes: stats.games?.minutes ?? 0,
        goals: stats.goals?.total ?? 0,
        assists: stats.goals?.assists ?? 0,
        penalties: stats.penalty?.scored ?? 0,
        rating: stats.games?.rating ?? null,
      };
    });

    return NextResponse.json({
      league,
      season,
      count: players.length,
      players,
    });
  } catch (error) {
    console.error("Top scorers API error:", error);

    return NextResponse.json(
      { error: "Unable to load top scorers. Check the server terminal for details." },
      { status: 500 }
    );
  }
}
