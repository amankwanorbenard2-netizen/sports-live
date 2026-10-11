
import { NextResponse } from "next/server";
import { fetchFootball } from "@/lib/football-api";

export const dynamic = "force-dynamic";

const FINISHED_STATUSES = ["FT", "AET", "PEN"];
const UPCOMING_STATUSES = ["NS", "TBD", "PST", "SUSP", "INT"];

export async function GET(request, context) {
  try {
    // Read the team ID from the working dynamic route.
    const params = await context?.params;
    const id = params?.id;

    if (!id || !Number.isInteger(Number(id)) || Number(id) <= 0) {
      return NextResponse.json(
        { error: "A valid team ID is required." },
        { status: 400 }
      );
    }

    const teamId = Number(id);
    const url = new URL(request.url);
    const season = Number(url.searchParams.get("season") || 2026);
    const leagueId = Number(url.searchParams.get("league") || 0);

    if (!Number.isInteger(season) || season < 2000 || season > 2100) {
      return NextResponse.json(
        { error: "Invalid season." },
        { status: 400 }
      );
    }

    // 1. Retrieve the club and stadium details.
    const teamResult = await fetchFootball(`teams?id=${teamId}`);

    if (teamResult?.errors && Object.keys(teamResult.errors).length) {
      throw new Error(JSON.stringify(teamResult.errors));
    }

    const entry = teamResult?.response?.[0];

    if (!entry?.team) {
      return NextResponse.json(
        { error: "Team not found.", details: teamResult?.errors || null },
        { status: 404 }
      );
    }

    // 2. Retrieve fixtures and squad data.
    const fixturePath = leagueId
      ? `fixtures?team=${teamId}&league=${leagueId}&season=${season}`
      : `fixtures?team=${teamId}&season=${season}`;

    const [fixtureResult, playerResult] = await Promise.allSettled([
      fetchFootball(fixturePath),
      fetchFootball(`players?team=${teamId}&season=${season}&page=1`),
    ]);

    const fixtureData =
      fixtureResult.status === "fulfilled"
        ? fixtureResult.value
        : null;

    const playerData =
      playerResult.status === "fulfilled"
        ? playerResult.value
        : null;

    const fixtures = Array.isArray(fixtureData?.response)
      ? fixtureData.response
      : [];

    const playerItems = Array.isArray(playerData?.response)
      ? playerData.response
      : [];

    // 3. Normalize match data for the frontend.
    const normalizedFixtures = fixtures.map((item) => ({
      id: item.fixture?.id,
      date: item.fixture?.date,
      timestamp: item.fixture?.timestamp || 0,
      status: item.fixture?.status?.short || "NS",
      statusLong: item.fixture?.status?.long || "",
      league: item.league?.name || "",
      leagueLogo: item.league?.logo || "",
      home: {
        id: item.teams?.home?.id,
        name: item.teams?.home?.name || "Home",
        logo: item.teams?.home?.logo || "",
      },
      away: {
        id: item.teams?.away?.id,
        name: item.teams?.away?.name || "Away",
        logo: item.teams?.away?.logo || "",
      },
      goals: {
        home: item.goals?.home ?? null,
        away: item.goals?.away ?? null,
      },
    }));

    const now = Math.floor(Date.now() / 1000);

    const upcoming = normalizedFixtures
      .filter(
        (match) =>
          match.timestamp >= now &&
          UPCOMING_STATUSES.includes(match.status)
      )
      .sort((a, b) => a.timestamp - b.timestamp)
      .slice(0, 10);

    const recent = normalizedFixtures
      .filter((match) => FINISHED_STATUSES.includes(match.status))
      .sort((a, b) => b.timestamp - a.timestamp)
      .slice(0, 10);

    // 4. Normalize player data.
    const players = playerItems.map((item) => {
      const stats = item.statistics?.[0] || {};
      const games = stats.games || {};
      const goals = stats.goals || {};

      return {
        id: item.player?.id,
        name: item.player?.name || "Unknown player",
        photo: item.player?.photo || "",
        age: item.player?.age ?? null,
        nationality: item.player?.nationality || "",
        position: games.position || "Unknown",
        number: games.number ?? null,
        appearances: games.appearences ?? 0,
        goals: goals.total ?? 0,
        assists: goals.assists ?? 0,
      };
    });

    // 5. Return the complete team profile.
    return NextResponse.json({
      team: {
        id: entry.team.id,
        name: entry.team.name,
        logo: entry.team.logo || "",
        country: entry.team.country || "",
        founded: entry.team.founded ?? null,
        national: entry.team.national ?? false,
        venue: entry.venue?.name || "",
        city: entry.venue?.city || "",
        capacity: entry.venue?.capacity ?? null,
        surface: entry.venue?.surface || "",
        image: entry.venue?.image || "",
      },
      season,
      upcoming,
      recent,
      players,
      warnings: {
        fixtures:
          fixtureResult.status === "rejected" ||
          (fixtureData?.errors &&
            Object.keys(fixtureData.errors).length > 0)
            ? "Fixtures could not be loaded. Check your API access."
            : "",
        players:
          playerResult.status === "rejected" ||
          (playerData?.errors &&
            Object.keys(playerData.errors).length > 0)
            ? "Squad information could not be loaded. Check your API access."
            : "",
      },
    });
  } catch (error) {
    console.error("Team API error:", error);

    return NextResponse.json(
      { error: error?.message || "Unable to load team information." },
      { status: 500 }
    );
  }
}
