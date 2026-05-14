"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export default function FixturesPage() {

  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);

  async function fetchFixtures() {

    try {

      const response = await fetch("/api/fixtures");

      const data = await response.json();

      setMatches(data.matches || []);

    } catch (error) {

      console.log(error);

    } finally {

      setLoading(false);

    }

  }

  useEffect(() => {

    fetchFixtures();

  }, []);

  if (loading) {

    return (

      <div style={{ padding: "20px" }}>

        <h1>Loading Fixtures...</h1>

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
        Upcoming Fixtures
      </h1>

      {matches.length === 0 && (

        <h2>No Upcoming Fixtures</h2>

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

            {/* LEAGUE */}

            <p
              style={{
                color: "#94a3b8",
                marginBottom: "20px",
              }}
            >
              {match.strLeague}
            </p>

            {/* MATCH */}

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
                  textAlign: "center",
                  width: "35%",
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

              {/* TIME */}

              <div
                style={{
                  textAlign: "center",
                }}
              >

                <h1
                  style={{
                    color: "#39ff14",
                    margin: 0,
                    fontSize: "28px",
                  }}
                >
                  VS
                </h1>

                <p
                  style={{
                    color: "#facc15",
                  }}
                >
                  {match.strTime || "TBD"}
                </p>

              </div>

              {/* AWAY */}

              <div
                style={{
                  textAlign: "center",
                  width: "35%",
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