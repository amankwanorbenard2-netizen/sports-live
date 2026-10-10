
const leagues = [
  39,   // Premier League
  140,  // La Liga
  135,  // Serie A
  78,   // Bundesliga
  61,   // Ligue 1
  88,   // Eredivisie
  94,   // Primeira Liga
  203,  // Turkish League
  144,  // Belgian League
  307,  // Saudi Pro League
  71,   // Brazil Serie A
  253,  // MLS
  128,  // Argentina
  119,  // Denmark
  106,  // Poland
  113,  // Sweden
  103,  // Norway
  98,   // Japan
  292,  // South Korea
  197   // Egypt
];

export async function GET() {
  try {
    const API_KEY = process.env.API_FOOTBALL_KEY;

    if (!API_KEY) {
      console.error("API_FOOTBALL_KEY is missing.");

      return Response.json(
        {
          success: false,
          error: "Football API key is not configured."
        },
        { status: 500 }
      );
    }

    const results = await Promise.all(
      leagues.map(async (league) => {
        try {
          const res = await fetch(
            `https://v3.football.api-sports.io/fixtures?league=${league}&season=2026&last=20`,
            {
              headers: {
                "x-apisports-key": API_KEY
              },
              cache: "no-store"
            }
          );

          const data = await res.json();

          if (
            !res.ok ||
            (data.errors && Object.keys(data.errors).length > 0)
          ) {
            console.error(
              `Finished matches request failed for league ${league}:`,
              res.status,
              data.errors
            );

            return [];
          }

          return Array.isArray(data.response)
            ? data.response.filter((match) =>
                ["FT", "AET", "PEN"].includes(
                  match.fixture?.status?.short
                )
              )
            : [];
        } catch (error) {
          console.error(
            `Finished matches request failed for league ${league}:`,
            error
          );

          return [];
        }
      })
    );

    const allFixtures = results.flat();

    // MOST RECENTLY COMPLETED MATCHES FIRST
    allFixtures.sort(
      (a, b) =>
        new Date(b.fixture.date).getTime() -
        new Date(a.fixture.date).getTime()
    );

    return Response.json({
      success: true,
      events: allFixtures
    });
  } catch (error) {
    console.error("Finished API route error:", error);

    return Response.json(
      {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "An unexpected error occurred."
      },
      { status: 500 }
    );
  }
}
