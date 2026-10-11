
import { NextResponse } from "next/server";
import { fetchFootball } from "../../../../lib/football-api";

export const dynamic = "force-dynamic";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const league = searchParams.get("league") || "39";
    const season = searchParams.get("season") || "2026";

    const requestedPage = Number.parseInt(
      searchParams.get("page") || "1",
      10
    );
    const page = Number.isFinite(requestedPage)
      ? Math.max(1, Math.min(100, requestedPage))
      : 1;

    const endpoint =
      `players?league=${encodeURIComponent(league)}` +
      `&season=${encodeURIComponent(season)}&page=${page}`;

    const data = await fetchFootball(endpoint);

    if (!data || typeof data !== "object") {
      return NextResponse.json(
        { error: "Invalid response from Football API." },
        { status: 502 }
      );
    }

    if (data.errors && Object.keys(data.errors).length > 0) {
      return NextResponse.json(
        {
          error: "Football API returned an error.",
          details: data.errors,
        },
        { status: 502 }
      );
    }

    const players = (data.response || []).map((item) => {
      const player = item.player || {};
      const stats = item.statistics?.[0] || {};
      const games = stats.games || {};
      const goals = stats.goals || {};

      return {
        id: player.id,
        name: player.name || "Unknown",
        photo: player.photo || "",
        age: player.age ?? null,
        nationality: player.nationality || "",
        team: stats.team?.name || "Unknown",
        teamLogo: stats.team?.logo || "",
        position: games.position || "Unknown",
        appearances: games.appearences ?? 0,
        starts: games.lineups ?? 0,
        minutes: games.minutes ?? 0,
        rating: games.rating ?? null,
        goals: goals.total ?? 0,
        assists: goals.assists ?? 0,
        penalties: goals.penalty ?? 0,
      };
    });

    return NextResponse.json({
      league,
      season,
      page,
      totalPages: data.paging?.total ?? 1,
      count: players.length,
      players,
    });
  } catch (error) {
    console.error("Player statistics API error:", error);

    return NextResponse.json(
      {
        error: "Unable to load player statistics.",
        details: error.message || "Unknown server error.",
      },
      { status: 500 }
    );
  }
}
