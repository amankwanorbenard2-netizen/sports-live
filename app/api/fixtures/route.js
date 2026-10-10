
const API_KEY = process.env.API_FOOTBALL_KEY;

const LEAGUES = [
  39, 140, 135, 78, 61, 88, 94, 203, 144, 179,
  71, 128, 253, 262, 307, 292, 98, 233, 288,
  2, 3, 848, 4, 1, 45, 48, 40, 41, 42, 143, 137, 81, 66,
];

const UPCOMING_STATUSES = new Set(["NS", "TBD"]);

function ghanaDateString(date) {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Africa/Accra",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(date);

  const get = (type) =>
    parts.find((part) => part.type === type)?.value;

  return `${get("year")}-${get("month")}-${get("day")}`;
}

function getNext14Dates() {
  const today = ghanaDateString(new Date());
  const start = new Date(`${today}T12:00:00Z`);

  return Array.from({ length: 14 }, (_, index) => {
    const date = new Date(start);
    date.setUTCDate(start.getUTCDate() + index);
    return ghanaDateString(date);
  });
}

async function fetchFixturesForDate(date) {
  const url = new URL(
    "https://v3.football.api-sports.io/fixtures"
  );

  url.searchParams.set("date", date);
  url.searchParams.set("timezone", "Africa/Accra");

  const response = await fetch(url, {
    headers: {
      "x-apisports-key": API_KEY,
    },
    cache: "no-store",
  });

  const data = await response.json();

  if (!response.ok || (data.errors && Object.keys(data.errors).length)) {
    throw new Error(
      JSON.stringify({
        date,
        status: response.status,
        details: data.errors || data.message || "Request failed",
      })
    );
  }

  return Array.isArray(data.response) ? data.response : [];
}

async function fetchWithConcurrency(items, limit, callback) {
  const results = new Array(items.length);
  let nextIndex = 0;

  async function worker() {
    while (true) {
      const index = nextIndex++;

      if (index >= items.length) return;

      try {
        results[index] = await callback(items[index]);
      } catch (error) {
        results[index] = {
          failed: true,
          date: items[index],
          error: error instanceof Error
            ? error.message
            : String(error),
        };
      }
    }
  }

  await Promise.all(
    Array.from(
      { length: Math.min(limit, items.length) },
      () => worker()
    )
  );

  return results;
}

export async function GET() {
  if (!API_KEY) {
    return Response.json(
      {
        success: false,
        error: "API_FOOTBALL_KEY is missing. Check .env.local.",
        events: [],
      },
      { status: 500 }
    );
  }

  try {
    const dates = getNext14Dates();

    // Fetch one request per day, with limited concurrency.
    const results = await fetchWithConcurrency(
      dates,
      2,
      fetchFixturesForDate
    );

    const failures = results
      .filter((result) => result?.failed)
      .map((result) => ({
        date: result.date,
        error: result.error,
      }));

    const leagueIds = new Set(LEAGUES.map(String));
    const unique = new Map();

    for (const result of results) {
      if (!Array.isArray(result)) continue;

      for (const match of result) {
        const id = match?.fixture?.id;
        const leagueId = match?.league?.id;
        const status = match?.fixture?.status?.short;

        if (
          id == null ||
          leagueId == null ||
          !leagueIds.has(String(leagueId)) ||
          !UPCOMING_STATUSES.has(status)
        ) {
          continue;
        }

        unique.set(String(id), match);
      }
    }

    const events = [...unique.values()].sort(
      (a, b) =>
        new Date(a.fixture.date).getTime() -
        new Date(b.fixture.date).getTime()
    );

    return Response.json({
      success: true,
      events,
      total: events.length,
      from: dates[0],
      to: dates[13],
      datesRequested: dates.length,
      failedDates: failures.length,
      errors: failures,
    });
  } catch (error) {
    console.error("Fixtures route error:", error);

    return Response.json(
      {
        success: false,
        error: error instanceof Error
          ? error.message
          : "Could not load fixtures.",
        events: [],
      },
      { status: 500 }
    );
  }
}
