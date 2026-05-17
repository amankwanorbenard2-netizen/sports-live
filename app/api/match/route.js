const API_KEY =
  "e3f7de2b8a8f97d91582c713eb9651a1";

export async function GET(
  request
) {
  try {
    const { searchParams } =
      new URL(request.url);

    const id =
      searchParams.get("id");

    const type =
      searchParams.get("type");

    let endpoint =
      `https://v3.football.api-sports.io/fixtures?id=${id}`;

    // EVENTS
    if (type === "events") {
      endpoint =
        `https://v3.football.api-sports.io/fixtures/events?fixture=${id}`;
    }

    // LINEUPS
    if (type === "lineups") {
      endpoint =
        `https://v3.football.api-sports.io/fixtures/lineups?fixture=${id}`;
    }

    // STATISTICS
    if (
      type ===
      "statistics"
    ) {
      endpoint =
        `https://v3.football.api-sports.io/fixtures/statistics?fixture=${id}`;
    }

    // PLAYERS / RATINGS
    if (type === "players") {
      endpoint =
        `https://v3.football.api-sports.io/fixtures/players?fixture=${id}`;
    }

    const res = await fetch(
      endpoint,
      {
        headers: {
          "x-apisports-key":
            API_KEY,
        },
        cache: "no-store",
      }
    );

    const data =
      await res.json();

    return Response.json(data);
  } catch (error) {
    return Response.json({
      success: false,
      error: error.message,
    });
  }
}