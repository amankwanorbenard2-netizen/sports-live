
const LEAGUES = [
  39, 140, 135, 78, 61,
  88, 94, 203, 144, 179,
  71, 128, 253, 262,
  307, 292, 98, 233, 288,
  2, 3, 848, 4, 1,
];

const SEASON = 2026;
const CACHE_SECONDS = 1800;

function ghanaDate(offset = 0) {
  const now = new Date();
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Africa/Accra",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(now);

  const [year, month, day] = parts.split("-").map(Number);
  const date = new Date(Date.UTC(year, month - 1, day + offset));

  return date.toISOString().slice(0, 10);
}

export async function GET() {
  const API_KEY = process.env.API_FOOTBALL_KEY;

  if (!API_KEY) {
    return Response.json(
      { success: false, error: "Football API key is not configured." },
      { status: 500 }
    );
  }

  try {
    const from = ghanaDate(0);
    const to = ghanaDate(13);

    // Each league request has its own Next.js data cache.
    // This reduces repeated calls when visitors open the page.
    const fetchLeague = async (league) => {
      try {
        const url = new URL(
          "https://v3.football.api-sports.io/fixtures"
        );

        url.searchParams.set("league", String(league));
        url.searchParams.set("season", String(SEASON));
        url.searchParams.set("from", from);
        url.searchParams.set("to", to);
        url.searchParams.set("timezone", "Africa/Accra");

        const response = await fetch(url.toString(), {
          headers: { "x-apisports-key": API_KEY },
          next: { revalidate: CACHE_SECONDS },
        });

        const data = await response.json();

        if (!response.ok) {
          console.error(`League ${league}: HTTP ${response.status}`);
          return { fixtures: [], failed: true };
        }

        if (data.errors && Object.keys(data.errors).length > 0) {
          console.error(`League ${league} API error:`, data.errors);
          return { fixtures: [], failed: true };
        }

        return {
          fixtures: Array.isArray(data.response) ? data.response : [],
          failed: false,
        };
      } catch (error) {
        console.error(`League ${league} request failed:`, error);
        return { fixtures: [], failed: true };
      }
    };

    // Limit simultaneous requests to reduce rate-limit pressure.
    const results = [];

    for (let i = 0; i < LEAGUES.length; i += 4) {
      const batch = LEAGUES.slice(i, i + 4);
      const batchResults = await Promise.all(batch.map(fetchLeague));
      results.push(...batchResults);
    }

    const events = results
      .flatMap((result) => result.fixtures)
      .filter((match) => match.fixture?.date)
      .sort(
        (a, b) =>
          new Date(a.fixture.date).getTime() -
          new Date(b.fixture.date).getTime()
      );

    const failedRequests = results.filter((result) => result.failed).length;

    return Response.json(
      {
        success: true,
        from,
        to,
        leaguesRequested: LEAGUES.length,
        events,
        warning:
          failedRequests > 0
            ? `${failedRequests} league requests failed. This may be due to your API rate limit or unavailable season data.`
            : null,
      },
      {
        headers: {
          "Cache-Control": "public, s-maxage=1800, stale-while-revalidate=3600",
        },
      }
    );
  } catch (error) {
    console.error("Fixtures route error:", error);

    return Response.json(
      {
        success: false,
        error: "Unable to retrieve football fixtures.",
      },
      { status: 500 }
    );
  }
}
