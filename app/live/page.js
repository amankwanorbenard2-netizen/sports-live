"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export default function LivePage() {

  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);

  async function fetchLiveMatches() {

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

  useEffect(() => {

    fetchLiveMatches();

    const interval = setInterval(() => {

      fetchLiveMatches();

    }, 30000);

    return () => clearInterval(interval);

  }, []);

  if (loading) {

    return (

      <div style={{ padding: "20px" }}>

        <h1>Loading Live Matches...</h1>

      </div>

    );

  }

  return (

    <div style={{ padding: "20px" }}>

      <h1
        style={{
          color: "#39ff14",
          fontSize: "40px",
          marginBottom: "30px",
        }}
      >
        Live Football Matches
      </h1>

      {matches.length === 0 && (

        <h2>No Live Matches Available</h2>

      )}

      {matches.map((match) => (

        <Link
          key={match.idEvent}
          href={`/match/${match.idEvent}`}
          style={{
            textDecoration: "none",
            color: "white",
          }}
        >

          <div
            style={{
              background: "#1e293b",
              borderRadius: "15px",
              padding: "20px",
              marginBottom: "20px",
              border: "1px solid #334155",
              cursor: "pointer",
            }}
          >

            {/* LIVE STATUS */}

            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "10px",
                marginBottom: "20px",
              }}
            >

              <div
                style={{
                  width: "10px",
                  height: "10px",
                  borderRadius: "50%",
                  background: "red",
                }}
              />

              <span
                style={{
                  color: "#39ff14",
                  fontWeight: "bold",
                }}
              >
                LIVE
              </span>

              <span
                style={{
                  color: "#facc15",
                  fontWeight: "bold",
                }}
              >
                {match.strStatus || ""}
              </span>

            </div>

            {/* MATCH ROW */}

            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: "10px",
              }}
            >

              {/* HOME */}

              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  width: "35%",
                  textAlign: "center",
                }}
              >

                <img
                  src={
                    match.strHomeTeamBadge ||
                    "https://placehold.co/70"
                  }
                  alt=""
                  width="70"
                  height="70"
                />

                <h3>{match.strHomeTeam}</h3>

              </div>

              {/* SCORE */}

              <div
                style={{
                  textAlign: "center",
                }}
              >

                <h1
                  style={{
                    color: "#39ff14",
                    fontSize: "40px",
                    margin: 0,
                  }}
                >
                  {match.intHomeScore ?? 0}
                  {" - "}
                  {match.intAwayScore ?? 0}
                </h1>

                <p
                  style={{
                    color: "#94a3b8",
                  }}
                >
                  {match.strLeague}
                </p>

              </div>

              {/* AWAY */}

              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  width: "35%",
                  textAlign: "center",
                }}
              >

                <img
                  src={
                    match.strAwayTeamBadge ||
                    "https://placehold.co/70"
                  }
                  alt=""
                  width="70"
                  height="70"
                />

                <h3>{match.strAwayTeam}</h3>

              </div>

            </div>

          </div>

        </Link>

      ))}

    </div>

  );

}