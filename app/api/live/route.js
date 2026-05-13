export async function GET() {

  try {

    const today =
      new Date().toISOString().split("T")[0];

    const response = await fetch(
      `https://www.thesportsdb.com/api/v1/json/3/eventsday.php?d=${today}&s=Soccer`
    );

    const data = await response.json();

    const events = data.events || [];

    // ONLY KEEP LIVE OR UPCOMING MATCHES

    const filteredMatches = events.filter((match) => {

      // REMOVE FINISHED MATCHES

      if (

        match.strStatus === "Match Finished" ||
        match.strStatus === "FT"

      ) {

        return false;

      }

      return true;

    });

    return Response.json({
      matches: filteredMatches,
    });

  } catch (error) {

    return Response.json({
      matches: [],
    });

  }

}