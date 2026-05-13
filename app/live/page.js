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

    // FIRST LOAD

    fetchMatches();

    // AUTO REFRESH EVERY 30 SECONDS

    const interval = setInterval(() => {

      fetchMatches();

    }, 30000);

    return () => clearInterval(interval);

  }, []);

  // GROUP MATCHES BY LEAGUE

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

        <h1>Loading Live Matches...</h1>

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
        Live Football Matches
      </h1>

      {Object.keys(groupedMatches).length === 0 && (

        <h2>No Live Matches Available</h2>

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
                  flexWrap: "wrap",
                  gap: "10px",
                }}
              >

                <p
                  style={{
                    color: "#22c55e",
                    fontWeight: "bold",
                  }}
                >
                  {

                    match.strStatus === "Match Finished"
                      ? "FT"
                      : match.strStatus || "LIVE"

                  }
                </p>

                <p>
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

              <h1
                style={{
                  color: "#22c55e",
                  fontSize: "35px",
                }}
              >
                {match.intHomeScore || 0}
                {" - "}
                {match.intAwayScore || 0}
              </h1>

            </div>

          ))}

        </div>

      ))}

    </div>

  );

}