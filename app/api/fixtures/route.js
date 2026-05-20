const API_KEY =
  "e3f7de2b8a8f97d91582c713eb9651a1";

const leagues = [
  39,   // Premier League
  140,  // La Liga
  135,  // Serie A
  78,   // Bundesliga
  61,   // Ligue 1

  88,   // Eredivisie
  94,   // Portugal
  203,  // Turkey
  144,  // Belgium
  179,  // Scotland

  71,   // Brazil
  128,  // Argentina
  253,  // MLS
  262,  // Liga MX

  307,  // Saudi League
  292,  // Korea
  98,   // Japan
  233,  // Egypt
  288,  // South Africa

  2,    // Champions League
  3,    // Europa League
  848,  // Conference League
  4,    // EURO
  1,    // World Cup
];

export async function GET() {
  try {
    const fixturePromises =
      leagues.map(
        async (league) => {
          const res =
            await fetch(
              `https://v3.football.api-sports.io/fixtures?league=${league}&season=2025&next=3`,
              {
                headers: {
                  "x-apisports-key":
                    API_KEY,

                  "x-rapidapi-host":
                    "v3.football.api-sports.io",
                },

                next: {
                  revalidate: 60,
                },
              }
            );

          const data =
            await res.json();

          return (
            data.response ||
            []
          );
        }
      );

    const results =
      await Promise.all(
        fixturePromises
      );

    const allFixtures =
      results.flat();

    // SORT FIXTURES
    allFixtures.sort(
      (a, b) =>
        new Date(
          a.fixture.date
        ) -
        new Date(
          b.fixture.date
        )
    );

    return Response.json({
      success: true,
      events:
        allFixtures,
    });
  } catch (error) {
    return Response.json({
      success: false,
      error:
        error.message,
    });
  }
}