const leagues = [

  4328, // Premier League
  4335, // La Liga
  4332, // Serie A
  4331, // Bundesliga
  4334, // Ligue 1
  4337, // Eredivisie
  4346, // MLS
  4480, // Champions League
  4481, // Europa League
  4391, // Portuguese League
  4330, // Scottish Premiership
  4344, // Brazilian Serie A

];

export async function GET() {

  try {

    let allMatches = [];

    for (const leagueId of leagues) {

      try {

        const response = await fetch(
          `https://www.thesportsdb.com/api/v1/json/3/eventspastleague.php?id=${leagueId}`,
          {
            cache: "no-store",
          }
        );

        const data = await response.json();

        if (
          data &&
          data.events &&
          Array.isArray(data.events)
        ) {

          allMatches.push(...data.events);

        }

      } catch (error) {

        console.log(
          "League failed:",
          leagueId
        );

      }

    }

    return Response.json({
      today: allMatches.slice(0, 25),
      yesterday: allMatches.slice(25, 50),
    });

  } catch (error) {

    return Response.json({
      today: [],
      yesterday: [],
    });

  }

}