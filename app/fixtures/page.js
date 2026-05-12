"use client";

import { useEffect, useState } from "react";

export default function FixturesPage() {

  const [matches, setMatches] = useState([]);
  const [selectedDate, setSelectedDate] = useState("");

  const dates = [];

  const now = new Date();

  for (let i = -2; i < 5; i++) {

    const future = new Date(now);

    future.setDate(now.getDate() + i);

    const year = future.getFullYear();

    const month = String(
      future.getMonth() + 1
    ).padStart(2, "0");

    const day = String(
      future.getDate()
    ).padStart(2, "0");

    dates.push(`${year}-${month}-${day}`);
  }

  useEffect(() => {

    const fetchFixtures = async () => {

      const dateToLoad = selectedDate || dates[2];

      setSelectedDate(dateToLoad);

      try {

        const res = await fetch(
          `https://v3.football.api-sports.io/fixtures?date=${dateToLoad}`,
          {
            headers: {
              "x-apisports-key":
                "76a878aeb39d96d56d9fbf38ba573654",
            },
          }
        );

        const data = await res.json();

        setMatches(data.response || []);

      } catch (error) {
        console.log(error);
      }
    };

    fetchFixtures();

  }, [selectedDate]);

  const groupedMatches = {};

  matches.forEach((match) => {

    const league = match.league.name;

    if (!groupedMatches[league]) {
      groupedMatches[league] = [];
    }

    groupedMatches[league].push(match);

  });

  const priorityLeagues = [
    "Premier League",
    "UEFA Champions League",
    "La Liga",
    "Serie A",
    "Bundesliga",
    "Ligue 1",
    "UEFA Europa League",
  ];

  const sortedLeagues = Object.keys(groupedMatches).sort((a, b) => {

    const aIndex = priorityLeagues.indexOf(a);
    const bIndex = priorityLeagues.indexOf(b);

    if (aIndex !== -1 && bIndex !== -1) {
      return aIndex - bIndex;
    }

    if (aIndex !== -1) {
      return -1;
    }

    if (bIndex !== -1) {
      return 1;
    }

    return a.localeCompare(b);

  });

  return (
    <div className="min-h-screen bg-black text-white p-6">

      <h1 className="text-5xl font-bold text-green-400 mb-8">
        Fixtures Calendar
      </h1>

      <div className="flex gap-4 overflow-x-auto mb-10">

        {dates.map((date) => (

          <button
            key={date}
            onClick={() => setSelectedDate(date)}
            className={`px-5 py-3 rounded-xl border transition ${
              date === selectedDate
                ? "bg-green-500 text-black"
                : "bg-gray-900 border-gray-700"
            }`}
          >
            {date}
          </button>

        ))}

      </div>

      {sortedLeagues.map((league) => (

        <div key={league} className="mb-10">

          <h2 className="text-3xl font-bold text-yellow-400 mb-4">
            {league}
          </h2>

          {groupedMatches[league].map((match) => (

            <div
              key={match.fixture.id}
              className="bg-gray-900 p-5 rounded-2xl border border-gray-800 mb-4"
            >

              <div className="flex justify-between items-center">

                <div>

                  <h3 className="text-2xl font-bold">
                    {match.teams.home.name}
                  </h3>

                  <h3 className="text-2xl font-bold mt-2">
                    {match.teams.away.name}
                  </h3>

                </div>

                <div className="text-right">

                  <p className="text-3xl font-bold text-green-400">

                    {match.goals.home !== null
                      ? match.goals.home
                      : "-"}

                    {" : "}

                    {match.goals.away !== null
                      ? match.goals.away
                      : "-"}

                  </p>

                  <p className="text-orange-400 mt-2">
                    {match.fixture.status.long}
                  </p>

                </div>

              </div>

              <p className="text-gray-400 mt-4">
                {new Date(match.fixture.date).toLocaleString("en-GB", {
                  timeZone: "Africa/Accra",
                })}
              </p>

            </div>

          ))}

        </div>

      ))}

    </div>
  );
}