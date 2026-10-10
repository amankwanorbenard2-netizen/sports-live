
const API_KEY = process.env.API_FOOTBALL_KEY;

const leagues = [
  { id: 39, name: "Premier League", season: 2026 },
  { id: 140, name: "La Liga", season: 2026 },
  { id: 135, name: "Serie A", season: 2026 },
  { id: 78, name: "Bundesliga", season: 2026 },
  { id: 61, name: "Ligue 1", season: 2026 },
  { id: 2, name: "UEFA Champions League", season: 2026 },
  { id: 3, name: "UEFA Europa League", season: 2026 },
  { id: 848, name: "UEFA Conference League", season: 2026 },
  { id: 13, name: "Copa Libertadores", season: 2026 },
  { id: 71, name: "Brasileirão", season: 2026 },
  { id: 128, name: "Ghana Premier League", season: 2026 },
  { id: 253, name: "MLS", season: 2026 },
  { id: 307, name: "Saudi Pro League", season: 2026 },
];

const COMPLETED_STATUSES = new Set(["FT", "AET", "PEN"]);

export async function GET() {
  if (!API_KEY) {
    return Response.json(
      {
        success: false,
        error: "API_FOOTBALL_KEY is missing from .env.local",
        count: 0,
        events: [],
      },
      { status: 500 }
    );
  }

  const events = [];
  const errors = [];

  try {
    // Make requests sequentially to reduce rate-limit errors.
    for (const league of leagues) {
      try {
        const url = new URL(
          "https://v3.football.api-sports.io/fixtures"
        );

        url.searchParams.set("league", String(league.id));
        url.searchParams.set("season", String(league.season));
        url.searchParams.set("last", "20");
        url.searchParams.set("timezone", "Africa/Accra");

        const response = await fetch(url.toString(), {
          headers: {
            "x-apisports-key": API_KEY,
          },
          cache: "no-store",
        });

        const data = await response.json();

        console.log(
          `[Finished Matches] ${league.name}:`,
          "HTTP",
          response.status,
          "Results:",
          data.results,
          "Errors:",
          data.errors
        );

        if (!response.ok) {
          errors.push({
            league: league.name,
            error: `HTTP ${response.status}`,
          });
          continue;
        }

        if (
          data.errors &&
          Object.keys(data.errors).length > 0
        ) {
          errors.push({
            league: league.name,
            error: data.errors,
          });
          continue;
        }

        for (const match of data.response || []) {
          if (!COMPLETED_STATUSES.has(match.fixture?.status?.short)) {
            continue;
          }

          events.push({
            ...match,
            leagueName: league.name,
          });
        }
      } catch (leagueError) {
        errors.push({
          league: league.name,
          error: leagueError.message || "Request failed",
        });
      }
    }

    // Remove duplicate fixtures.
    const uniqueEvents = [
      ...new Map(
        events
          .filter((match) => match.fixture?.id != null)
          .map((match) => [match.fixture.id, match])
      ).values(),
    ];

    // Newest completed matches first.
    uniqueEvents.sort(
      (a, b) =>
        new Date(b.fixture.date).getTime() -
        new Date(a.fixture.date).getTime()
    );

    return Response.json({
      success: true,
      count: uniqueEvents.length,
      events: uniqueEvents,
      errors,
    });
  } catch (error) {
    console.error("[Finished Matches API]", error);

    return Response.json(
      {
        success: false,
        error: error.message || "Failed to load finished matches",
        count: events.length,
        events,
        errors,
      },
      { status: 500 }
    );
  }
}
