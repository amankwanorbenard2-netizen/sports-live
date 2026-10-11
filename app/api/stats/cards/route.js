
import { NextResponse } from "next/server";
import { fetchFootball } from "../../../../lib/football-api";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const league = searchParams.get("league") || "39";
    const season = searchParams.get("season") || "2026";

    const query = `league=${encodeURIComponent(league)}&season=${encodeURIComponent(season)}`;

    const [yellowData, redData] = await Promise.all([
      fetchFootball(`players/topyellowcards?${query}`),
      fetchFootball(`players/topredcards?${query}`),
    ]);

    for (const data of [yellowData, redData]) {
      if (data?.errors && Object.keys(data.errors).length > 0) {
        return NextResponse.json(
          { error: "Football API returned an error.", details: data.errors },
          { status: 502 }
        );
      }
    }

    const playersById = new Map();

    function addPlayers(response, cardType) {
      for (const item of response || []) {
        const player = item.player || {};
        const stats = item.statistics?.[0] || {};
        const id = player.id;

        if (id == null) continue;

        if (!playersById.has(id)) {
          playersById.set(id, {
            id,
            name: player.name || "Unknown",
            photo: player.photo || "",
            team: stats.team?.name || "Unknown",
            teamLogo: stats.team?.logo || "",
            appearances: stats.games?.appearences ?? 0,
            yellow: 0,
            red: 0,
          });
        }

        const entry = playersById.get(id);
        entry[cardType] = stats.cards?.[cardType] ?? 0;
      }
    }

    addPlayers(yellowData?.response, "yellow");
    addPlayers(redData?.response, "red");

    const players = [...playersById.values()].sort(
      (a, b) => b.yellow - a.yellow || b.red - a.red
    );

    return NextResponse.json({
      league,
      season,
      count: players.length,
      players,
    });
  } catch (error) {
    return NextResponse.json(
      { error: error.message || "Unable to load card statistics." },
      { status: 500 }
    );
  }
}
