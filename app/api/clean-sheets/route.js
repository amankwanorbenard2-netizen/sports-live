
import { NextResponse } from "next/server";
import { fetchFootball } from "@/lib/football-api";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

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

    const teamsData = await fetchFootball(
      `teams?league=${league}&season=${season}`
    );

    const teams = teamsData.response || [];

    if (!teams.length) {
      return NextResponse.json({
        league,
        season,
        count: 0,
        teams: [],
        message: "No teams were returned for this league and season.",
      });
    }

    // Request statistics for only the first five teams initially.
    // This avoids queuing dozens of requests with the current API helper.
    const selectedTeams = teams.slice(0, 5);

    const results = await Promise.all(
      selectedTeams.map(async ({ team }) => {
        try {
          const data = await fetchFootball(
            `teams/statistics?league=${league}&season=${season}&team=${team.id}`
          );

          const stats = data.response;
          if (!stats) return null;

          const home = stats.clean_sheet?.home ?? 0;
          const away = stats.clean_sheet?.away ?? 0;

          return {
            id: team.id,
            name: team.name,
            logo: team.logo,
            played: stats.fixtures?.played?.total ?? 0,
            homeCleanSheets: home,
            awayCleanSheets: away,
            cleanSheets: home + away,
          };
        } catch (error) {
          console.error(
            `Clean sheets request failed for ${team.name}:`,
            error.message
          );
          return null;
        }
      })
    );

    const rankings = results
      .filter(Boolean)
      .sort((a, b) => b.cleanSheets - a.cleanSheets)
      .map((team, index) => ({ ...team, rank: index + 1 }));

    return NextResponse.json({
      league,
      season,
      count: rankings.length,
      teams: rankings,
      partial: teams.length > selectedTeams.length,
      message:
        teams.length > selectedTeams.length
          ? "Showing a partial sample while the API request load is limited."
          : undefined,
    });
  } catch (error) {
    console.error("Clean sheets API error:", error);

    return NextResponse.json(
      { error: "Unable to load clean sheets. Check the VS Code terminal." },
      { status: 500 }
    );
  }
}
