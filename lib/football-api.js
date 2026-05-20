const API_KEY =
  process.env.API_FOOTBALL_KEY;

const BASE_URL =
  "https://v3.football.api-sports.io";

export async function fetchFootball(
  endpoint
) {
  try {
    const response =
      await fetch(
        `${BASE_URL}/${endpoint}`,
        {
          headers: {
            "x-apisports-key":
              API_KEY,
          },

          cache: "no-store",
        }
      );

    const data =
      await response.json();

    return data;
  } catch (error) {
    console.log(error);

    return {
      response: [],
    };
  }
}