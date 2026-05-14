"use client";

import { useEffect, useState } from "react";

export default function LivePage() {

  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {

    async function fetchMatches() {

      try {

        const response = await fetch("/api/live");

        const data = await response.json();

        setMatches(data.matches || []);

      } catch (error) {

        console.log(error);

      } finally {

        setLoading(false);

      }

    }

    fetchMatches();

    const interval = setInterval(() => {

      fetchMatches();

    }, 30000);

    return () => clearInterval(interval);

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
          padding: "20px",
        }}
      >

        <h1>Loading Live Matches...</h1>

      </div>

    );

  }

  return (

    <div
      style={{
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
        Live Football
      </h1>

      {Object.keys(groupedMatches).length === 0 && (

        <h2>No Live Matches Available</h2>

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
                  marginBottom: "15px",
                  flexWrap: "wrap",
                }}
              >

                <p
                  style={{
                    color: "#22c55e",
                    fontWeight: "bold",
                    margin: 0,
                  }}
                >
                  {

                    match.strStatus === "Match Finished"
                      ? "FT"
                      : match.strStatus || "LIVE"

                  }
                </p>

                <p
                  style={{
                    margin: 0,
                  }}
                >
                  {match.strTime || ""}
                </p>

              </div>

              {/* MATCH */}

              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: "10px",
                  flexWrap: "wrap",
                }}
              >

                {/* HOME */}

                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "10px",
                    width: "35%",
                  }}
                >

                  <img
                    src={
                      match.strHomeTeamBadge ||
                      "https://placehold.co/40"
                    }
                    alt=""
                    width="40"
                    height="40"
                    style={{
                      borderRadius: "50%",
                    }}
                  />

                  <h3
                    style={{
                      margin: 0,
                      fontSize: "16px",
                    }}
                  >
                    {match.strHomeTeam}
                  </h3>

                </div>

                {/* SCORE */}

                <h1
                  style={{
                    color: "#22c55e",
                    margin: 0,
                    fontSize: "30px",
                  }}
                >
                  {match.intHomeScore || 0}
                  {" - "}
                  {match.intAwayScore || 0}
                </h1>

                {/* AWAY */}

                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "10px",
                    justifyContent: "flex-end",
                    width: "35%",
                  }}
                >

                  <h3
                    style={{
                      margin: 0,
                      fontSize: "16px",
                    }}
                  >
                    {match.strAwayTeam}
                  </h3>

                  <img
                    src={
                      match.strAwayTeamBadge ||
                      "https://placehold.co/40"
                    }
                    alt=""
                    width="40"
                    height="40"
                    style={{
                      borderRadius: "50%",
                    }}
                  />

                </div>

              </div>

            </div>

          ))}

        </div>

      ))}

    </div>

  );

}