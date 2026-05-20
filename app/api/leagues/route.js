export async function GET() {
  try {
    const response = await fetch(
      "https://v3.football.api-sports.io/leagues?current=true",
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

    return Response.json(data);
  } catch (error) {
    console.log(error);

    return Response.json({
      error:
        error.message,
    });
  }
}