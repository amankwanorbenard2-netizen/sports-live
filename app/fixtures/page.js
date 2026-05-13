"use client";

import { useEffect, useState } from "react";

export default function FixturesPage() {

  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {

    async function fetchFixtures() {

      try {

        const today = new Date();

        const tomorrow = new Date();

        tomorrow.setDate(today.getDate() + 1);

        const todayDate =
          today.toISOString().split("T")[0];

        const tomorrowDate =
          tomorrow.toISOString().split("T")[0];

        // TODAY MATCHES

        const todayResponse = await fetch(
          `https://www.thesportsdb.com/api/v1/json/3/eventsday.php?d=${todayDate}&s=Soccer`
        );

        const todayData = await todayResponse.json();

        // TOMORROW MATCHES

        const tomorrowResponse = await fetch(
          `https://www.thesportsdb.com/api/v1/json/3/eventsday.php?d=${tomorrowDate}&s=Soccer`
        );

        const tomorrowData = await tomorrowResponse.json();

        const allMatches = [

          ...(todayData.events || []),
          ...(tomorrowData.events || []),

        ];

        // REMOVE FINISHED MATCHES

        const upcomingMatches = allMatches.filter((match) => {

          return (

            match.strStatus !== "Match Finished" &&
            match.strStatus !== "FT"

          );

        });

        setMatches(upcomingMatches);

      } catch (error) {

        console.log(error);

      } finally {

        setLoading(false);

      }

    }

    fetchFixtures();

  }, []);

  // GROUP BY LEAGUE

  const groupedMatches = matches.reduce((groups, match) => {

    const league = match.strLeague || "Other League";

    if (!groups[league]) {

      groups[league] = [];

    }

    groups[league].push(match);

    return groups;

  }, {});

  if (loading) {

    return (

      <div
        style={{
          background: "#0f172a",
          color: "white",
          minHeight: "100vh",
          padding: "20px",
        }}
      >

        <h1>Loading Fixtures...</h1>

      </div>

    );

  }

  return (

    <div
      style={{
        background: "#0f172a",
        color: "white",
        minHeight: "100vh",
        padding: "20px",
      }}
    >

      <h1
        style={{
          color: "#22c55e",
          fontSize: "40px",
          marginBottom: "30px",
        }}
      >
        Fixtures
      </h1>

      {Object.keys(groupedMatches).length === 0 && (

        <h2>No Upcoming Matches</h2>

      )}

      {Object.keys(groupedMatches).map((league) => (

        <div key={league}>

          <h2
            style={{
              color: "#22c55e",
              marginTop: "30px",
              marginBottom: "20px",
            }}
          >
            {league}
          </h2>

          {groupedMatches[league].map((match) => (

            <div
              key={match.idEvent}
              style={{
                background: "#1e293b",
                borderRadius: "15px",
                padding: "20px",
                marginBottom: "15px",
                border: "1px solid #334155",
              }}
            >

              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginBottom: "10px",
                }}
              >

                <p
                  style={{
                    color: "#22c55e",
                    fontWeight: "bold",
                  }}
                >
                  UPCOMING
                </p>

                <p>
                  {match.strTime || ""}
                </p>

              </div>

              <h2>
                {match.strHomeTeam}
                {" vs "}
                {match.strAwayTeam}
              </h2>

              <p>
                {match.dateEvent}
              </p>

            </div>

          ))}

        </div>

      ))}

    </div>

  );

}