export async function GET(request) {
  try {
    const {
      searchParams,
    } = new URL(
      request.url
    );

    const league =
      searchParams.get(
        "league"
      );

    const season =
      searchParams.get(
        "season"
      ) || "2024";

    const response =
      await fetch(
        `https://v3.football.api-sports.io/standings?league=${league}&season=${season}`,
        {
          method: "GET",

          headers: {
            "x-apisports-key":
              "e3f7de2b8a8f97d91582c713eb9651a1",

            "x-rapidapi-host":
              "v3.football.api-sports.io",

            Accept:
              "application/json",
          },
        }
      );

    const data =
      await response.json();

    console.log(data);

    return Response.json(
      data
    );
  } catch (error) {
    console.log(error);

    return Response.json({
      error:
        error.message,
    });
  }
}