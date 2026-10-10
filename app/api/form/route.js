import { NextResponse } from "next/server";

export async function GET(req) {

  const { searchParams } =
    new URL(req.url);

  const team =
    searchParams.get("team");

  try {

    const response =
      await fetch(

        `https://v3.football.api-sports.io/fixtures?team=${team}&last=10`,

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
      matches.slice(0, 5).map(
        (match) => {

          const homeId =
            match.teams.home.id;

          const awayId =
            match.teams.away.id;

          const homeGoals =
            match.goals.home;

          const awayGoals =
            match.goals.away;

          // TEAM IS HOME
          if (
            Number(team) === homeId
          ) {

            if (
              homeGoals > awayGoals
            ) {

              return "W";

            }

            if (
              homeGoals < awayGoals
            ) {

              return "L";

            }

            return "D";

          }

          // TEAM IS AWAY
          else {

            if (
              awayGoals > homeGoals
            ) {

              return "W";

            }

            if (
              awayGoals < homeGoals
            ) {

              return "L";

            }

            return "D";

          }

        }
      );

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