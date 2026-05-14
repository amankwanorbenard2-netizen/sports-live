"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export default function FinishedPage() {

  const [todayMatches, setTodayMatches] = useState([]);
  const [yesterdayMatches, setYesterdayMatches] = useState([]);
  const [loading, setLoading] = useState(true);

  async function fetchFinishedMatches() {

    try {

      const response = await fetch("/api/finished");

      const data = await response.json();

      setTodayMatches(data.today || []);
      setYesterdayMatches(data.yesterday || []);

    } catch (error) {

      console.log(error);

    } finally {

      setLoading(false);

    }

  }

  useEffect(() => {

    fetchFinishedMatches();

  }, []);

  if (loading) {

    return (

      <div style={{ padding: "20px" }}>

        <h1>Loading Finished Matches...</h1>

      </div>

    );

  }

  function renderMatches(matches) {

    return matches.map((match) => (

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

            {/* SCORE */}

            <div
              style={{
                textAlign: "center",
              }}
            >

              <h1
                style={{
                  color: "#39ff14",
                  margin: 0,
                  fontSize: "32px",
                }}
              >
                {match.intHomeScore ?? 0}
                {" - "}
                {match.intAwayScore ?? 0}
              </h1>

              <p
                style={{
                  color: "#facc15",
                }}
              >
                FT
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

    ));

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
        Finished Matches
      </h1>

      {/* TODAY */}

      <h2
        style={{
          marginBottom: "20px",
        }}
      >
        Today
      </h2>

      {renderMatches(todayMatches)}

      {/* YESTERDAY */}

      <h2
        style={{
          marginTop: "40px",
          marginBottom: "20px",
        }}
      >
        Yesterday
      </h2>

      {renderMatches(yesterdayMatches)}

    </div>

  );

}