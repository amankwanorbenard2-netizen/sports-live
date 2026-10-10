
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);

    const id = searchParams.get("id");
    const type = searchParams.get("type");

    // 1. Validate the fixture ID.
    if (!id || !/^\d+$/.test(id)) {
      return Response.json(
        {
          success: false,
          error: "A valid numeric fixture ID is required.",
        },
        { status: 400 }
      );
    }

    // 2. Choose the correct API-Sports endpoint.
    const endpoints = {
      events: "fixtures/events",
      lineups: "fixtures/lineups",
      statistics: "fixtures/statistics",
      players: "fixtures/players",
    };

    const endpoint = endpoints[type] || "fixtures";

    // 3. Build the request URL.
    const apiUrl = new URL(
      `https://v3.football.api-sports.io/${endpoint}`
    );

    if (endpoints[type]) {
      apiUrl.searchParams.set("fixture", id);
    } else {
      apiUrl.searchParams.set("id", id);
    }

    // 4. Read your existing environment variable.
    const apiKey = process.env.API_FOOTBALL_KEY;

    if (!apiKey) {
      console.error("API_FOOTBALL_KEY is missing.");

      return Response.json(
        {
          success: false,
          error:
            "API_FOOTBALL_KEY is missing. Check your .env.local file and restart the server.",
        },
        { status: 500 }
      );
    }

    // 5. Request data from API-Sports.
    const apiResponse = await fetch(apiUrl.toString(), {
      method: "GET",
      headers: {
        "x-apisports-key": apiKey,
      },
      cache: "no-store",
    });

    // 6. Read the provider response safely.
    const data = await apiResponse.json();

    // 7. Handle HTTP errors.
    if (!apiResponse.ok) {
      console.error("API-Sports HTTP error:", {
        status: apiResponse.status,
        details: data.errors || data.message,
      });

      return Response.json(
        {
          success: false,
          error: "API-Sports request failed.",
          details: data.errors || data.message || data,
        },
        { status: apiResponse.status }
      );
    }

    // 8. Handle errors returned inside a successful HTTP response.
    if (
      data.errors &&
      Object.keys(data.errors).length > 0
    ) {
      console.error("API-Sports API error:", data.errors);

      return Response.json(
        {
          success: false,
          error: "API-Sports reported an error.",
          details: data.errors,
          response: data.response || [],
        },
        { status: 502 }
      );
    }

    // 9. Return the original API response structure.
    return Response.json(data);
  } catch (error) {
    console.error("Match API route error:", error);

    return Response.json(
      {
        success: false,
        error: "Unable to retrieve match data.",
        details: error.message,
      },
      { status: 500 }
    );
  }
}
