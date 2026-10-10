
export async function fetchFootball(endpoint) {
  const apiKey = process.env.API_FOOTBALL_KEY;

  if (!apiKey) {
    throw new Error("Missing API_FOOTBALL_KEY environment variable");
  }

  const response = await fetch(
    `https://v3.football.api-sports.io/${endpoint}`,
    {
      method: "GET",
      headers: {
        "x-apisports-key": apiKey,
      },
      cache: "no-store",
    }
  );

  const data = await response.json();

  if (!response.ok || data.errors?.length) {
    console.error("Football API error:", data.errors);
  }

  return data;
}
