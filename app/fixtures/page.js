"use client";

import { useEffect, useState } from "react";

export default function FixturesPage() {

  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {

    async function fetchFixtures() {

      try {

        const leagueIds = [

          4328, // Premier League
          4335, // La Liga
          4332, // Serie A
          4331, // Bundesliga
          4334, // Ligue 1
          4396, // Saudi Pro League
          4374, // MLS
          4376, // Brazil Serie A
          4338, // Portugal Liga
          4337, // Netherlands Eredivisie
          4339, // Turkish Super Lig
          4336, // Belgian Pro League

        ];

        let allMatches = [];

        const responses = await Promise.all(

          leagueIds.map((leagueId) =>

            fetch(
              `https://www.thesportsdb.com/api/v1/json/3/eventsnextleague.php?id=${leagueId}`
            ).then((res) => res.json())

          )

        );

        responses.forEach((data) => {

          if (data.events) {

            allMatches.push(...data.events);

          }

        });

        // SORT BY DATE

        allMatches.sort((a, b) => {

          return new Date(a.dateEvent) -
                 new Date(b.dateEvent);

        });

        setMatches(allMatches);

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
        Upcoming Fixtures
      </h1>

      {Object.keys(groupedMatches).length === 0 && (

        <h2>No Upcoming Fixtures</h2>

      )}

      {Object.keys(groupedMatches).map((league) => (

        <div key={league}>

          <h2
            style={{
              color: "#22c55e",
              marginTop: "35px",
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
                  flexWrap: "wrap",
                  gap: "10px",
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
                  {match.dateEvent}
                  {" "}
                  {match.strTime || ""}
                </p>

              </div>

              <h2
                style={{
                  marginBottom: "10px",
                }}
              >
                {match.strHomeTeam}
                {" vs "}
                {match.strAwayTeam}
              </h2>

            </div>

          ))}

        </div>

      ))}

    </div>

  );

}