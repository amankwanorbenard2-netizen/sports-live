const API_KEY =
  process.env.NEXT_PUBLIC_API_KEY;

const BASE_URL =
  "https://v3.football.api-sports.io";

const headers = {
  "x-apisports-key": API_KEY,
};

const TOP_LEAGUES = [
  39,
  140,
  135,
  78,
  61,
  2,
  3,
  848,
  88,
  94,
  203,
  307,
];

export async function getLiveMatches() {

  try {

    const response = await fetch(
      `${BASE_URL}/fixtures?live=all`,
      {
        headers,
        cache: "no-store",
      }
    );

    const data = await response.json();

    const filtered =
      data.response.filter((match) =>
        TOP_LEAGUES.includes(
          match.league.id
        )
      );

    return filtered;

  } catch (error) {

    console.log(error);

    return [];

  }

}

export async function getFixtures() {

  try {

    const response = await fetch(
      `${BASE_URL}/fixtures?next=50`,
      {
        headers,
        next: {
          revalidate: 14400,
        },
      }
    );

    const data = await response.json();

    const filtered =
      data.response.filter((match) =>
        TOP_LEAGUES.includes(
          match.league.id
        )
      );

    return filtered;

  } catch (error) {

    console.log(error);

    return [];

  }

}

export async function getStandings(
  leagueId,
  season = 2025
) {

  try {

    const response = await fetch(
      `${BASE_URL}/standings?league=${leagueId}&season=${season}`,
      {
        headers,
        next: {
          revalidate: 3600,
        },
      }
    );

    const data = await response.json();

    return (
      data.response?.[0]
        ?.league?.standings?.[0] || []
    );

  } catch (error) {

    console.log(error);

    return [];

  }

}