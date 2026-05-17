const API_KEY = "e3f7de2b8a8f97d91582c713eb9651a1";

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
  253   // MLS
];

export async function GET() {
  try {
    let allFixtures = [];

    for (const league of leagues) {
      const res = await fetch(
        `https://v3.football.api-sports.io/fixtures?league=${league}&season=2025&next=3`,
        {
          headers: {
            "x-apisports-key": API_KEY,
          },
          cache: "no-store",
        }
      );

      const data = await res.json();

      if (data.response) {
        allFixtures.push(...data.response);
      }
    }

    return Response.json({
      success: true,
      events: allFixtures,
    });
  } catch (error) {
    return Response.json({
      success: false,
      error: error.message,
    });
  }
}