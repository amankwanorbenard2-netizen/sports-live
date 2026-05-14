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

      const response = await fetch(
        `https://www.thesportsdb.com/api/v1/json/3/eventsnextleague.php?id=${leagueId}`,
        {
          cache: "no-store",
        }
      );

      const data = await response.json();

      if (data.events) {

        allMatches.push(...data.events);

      }

    }

    return Response.json({
      matches: allMatches,
    });

  } catch (error) {

    return Response.json({
      matches: [],
    });

  }

}