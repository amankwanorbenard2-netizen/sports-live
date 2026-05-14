export async function GET() {

  try {

    const leagueIds = [

      4328, // Premier League
      4335, // La Liga
      4332, // Serie A
      4331, // Bundesliga
      4334, // Ligue 1
      4337, // Eredivisie
      4339, // Turkish Super Lig
      4396, // Saudi Pro League
      4338, // Portugal Liga
      4336, // Belgian Pro League
      4374, // MLS
      4376  // Brazil Serie A

    ];

    let allMatches = [];

    for (const leagueId of leagueIds) {

      try {

        const response = await fetch(
          `https://www.thesportsdb.com/api/v1/json/3/eventspastleague.php?id=${leagueId}`
        );

        const data = await response.json();

        if (data.events) {

          allMatches.push(...data.events);

        }

      } catch (error) {

        console.log(error);

      }

    }

    // SORT BY DATE

    allMatches.sort((a, b) => {

      return new Date(b.dateEvent) -
             new Date(a.dateEvent);

    });

    return Response.json({
      matches: allMatches,
    });

  } catch (error) {

    return Response.json({
      matches: [],
    });

  }

}