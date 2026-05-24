export async function fetchFootball(endpoint) {

  const response = await fetch(
    `https://v3.football.api-sports.io/${endpoint}`,
    {
      method: "GET",
      headers: {
        "x-apisports-key":
          "e3f7de2b8a8f97d91582c713eb9651a1",
      },
    }
  );

  const data = await response.json();

  console.log(data);

  return data;
}