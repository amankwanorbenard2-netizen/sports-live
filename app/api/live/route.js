export async function GET() {

  try {

    const response = await fetch(
      "https://www.thesportsdb.com/api/v1/json/3/livescore.php?s=Soccer",
      {
        cache: "no-store",
      }
    );

    const data = await response.json();

    const events = data.events || [];

    return Response.json({
      matches: events,
    });

  } catch (error) {

    return Response.json({
      matches: [],
    });

  }

}