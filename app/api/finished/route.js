
const API_KEY = process.env.API_FOOTBALL_KEY;

const leagues = [
  { id: 39, name: "Premier League", country: "England" },
  { id: 140, name: "La Liga", country: "Spain" },
  { id: 135, name: "Serie A", country: "Italy" },
  { id: 78, name: "Bundesliga", country: "Germany" },
  { id: 61, name: "Ligue 1", country: "France" },
  { id: 2, name: "UEFA Champions League", country: "World" },
  { id: 3, name: "UEFA Europa League", country: "World" },
  { id: 848, name: "UEFA Conference League", country: "World" },
  { id: 13, name: "Copa Libertadores", country: "South America" },
  { id: 71, name: "Brasileirão", country: "Brazil" },
  { id: 128, name: "Ghana Premier League", country: "Ghana" },
  { id: 253, name: "MLS", country: "USA" },
  { id: 307, name: "Saudi Pro League", country: "Saudi Arabia" },
  { id: 4, name: "UEFA European Championship", country: "World" },
  { id: 1, name: "FIFA World Cup", country: "World" },
];

let cachedLeagues = null;
let cacheExpiresAt = 0;

export async function GET() {
  if (!API_KEY) {
    return Response.json(
      {
        success: false,
        error: "API_FOOTBALL_KEY is missing from .env.local",
      },
      { status: 500 }
    );
  }

  // Return cached league data when available.
  if (cachedLeagues && Date.now() < cacheExpiresAt) {
    return Response.json(cachedLeagues);
  }

  try {
    const response = await fetch(
      "https://v3.football.api-sports.io/leagues",
      {
        headers: {
          "x-apisports-key": API_KEY,
        },
        next: {
          revalidate: 3600,
        },
      }
    );

    const data = await response.json();

    if (!response.ok) {
      return Response.json(
        {
          success: false,
          error: data.errors || `API request failed: ${response.status}`,
        },
        { status: response.status }
      );
    }

    if (data.errors && Object.keys(data.errors).length > 0) {
      return Response.json(
        {
          success: false,
          error: data.errors,
        },
        { status: 429 }
      );
    }

    const availableLeagues = data.response || [];

    // Keep only the 15 selected competitions.
    const result = leagues.map((selected) => {
      const match = availableLeagues.find(
        (item) => item.league.id === selected.id
      );

      return {
        league: {
          id: selected.id,
          name: selected.name,
          logo: match?.league?.logo || null,
          type: match?.league?.type || "League",
        },
        country: {
          name: selected.country,
          code: match?.country?.code || null,
          flag: match?.country?.flag || null,
        },
        seasons: match?.seasons || [],
      };
    });

    cachedLeagues = {
      success: true,
      count: result.length,
      response: result,
    };

    cacheExpiresAt = Date.now() + 60 * 60 * 1000;

    return Response.json(cachedLeagues);
  } catch (error) {
    return Response.json(
      {
        success: false,
        error: error.message || "Unable to load leagues",
      },
      { status: 500 }
    );
  }
}
