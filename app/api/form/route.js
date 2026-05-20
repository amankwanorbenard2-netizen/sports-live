import { NextResponse } from "next/server";

export async function GET(req) {

  const { searchParams } =
    new URL(req.url);

  const team =
    searchParams.get("team");

  try {

  const response =
  await fetch(

    `https://v3.football.api-sports.io/fixtures?team=${team}&last=10&status=FT`,

    {
      method: "GET",

      headers: {
        "x-apisports-key":
          process.env.NEXT_PUBLIC_API_KEY,

        "x-rapidapi-host":
          "v3.football.api-sports.io",
      },
    }

  );
    const data =
      await response.json();
console.log(data);
    const matches =
      data.response || [];

    const form =
      matches.map((match) => {

        const isHome =
          match.teams.home.id ==
          Number(team);

        const teamGoals =
          isHome
            ? match.goals.home
            : match.goals.away;

        const opponentGoals =
          isHome
            ? match.goals.away
            : match.goals.home;

        if (teamGoals > opponentGoals)
          return "W";

        if (teamGoals < opponentGoals)
          return "L";

        return "D";

      });

    return NextResponse.json({
      form,
    });

  } catch (error) {

    console.log(error);

    return NextResponse.json({
      form: [],
    });

  }

}