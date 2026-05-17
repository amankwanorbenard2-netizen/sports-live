"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export default function LivePage() {
  const [matches, setMatches] = useState([]);

  useEffect(() => {
    fetch("/api/live")
      .then((res) => res.json())
      .then((data) => {
        setMatches(data.events || []);
      });
  }, []);

  return (
    <div
      style={{
        background: "#111827",
        minHeight: "100vh",
        padding: "20px",
        color: "white",
      }}
    >
      <h1
        style={{
          fontSize: "42px",
          fontWeight: "bold",
          color: "#22c55e",
          marginBottom: "30px",
        }}
      >
        🔴 Live Matches
      </h1>

      {matches.length === 0 ? (
        <div
          style={{
            background: "#1f2937",
            padding: "30px",
            borderRadius: "15px",
            textAlign: "center",
            fontSize: "22px",
          }}
        >
          No live matches currently.
        </div>
      ) : (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit,minmax(320px,1fr))",
            gap: "20px",
          }}
        >
          {matches.map((match) => (
            <Link
              key={match.fixture.id}
              href={`/match/${match.fixture.id}`}
              style={{ textDecoration: "none" }}
            >
              <div
                style={{
                  background: "#1f2937",
                  borderRadius: "18px",
                  padding: "20px",
                  transition: "0.3s",
                  cursor: "pointer",
                  border: "2px solid transparent",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "scale(1.04)";
                  e.currentTarget.style.border =
                    "2px solid #22c55e";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "scale(1)";
                  e.currentTarget.style.border =
                    "2px solid transparent";
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <div style={{ textAlign: "center" }}>
                    <img
                      src={match.teams.home.logo}
                      width="70"
                    />
                    <h2>{match.teams.home.name}</h2>
                  </div>

                  <div style={{ textAlign: "center" }}>
                    <h1
                      style={{
                        color: "#22c55e",
                        fontSize: "40px",
                      }}
                    >
                      {match.goals.home} - {match.goals.away}
                    </h1>

                    <p
                      style={{
                        color: "#facc15",
                        fontWeight: "bold",
                      }}
                    >
                      {match.fixture.status.elapsed}'
                    </p>
                  </div>

                  <div style={{ textAlign: "center" }}>
                    <img
                      src={match.teams.away.logo}
                      width="70"
                    />
                    <h2>{match.teams.away.name}</h2>
                  </div>
                </div>

                <div
                  style={{
                    marginTop: "15px",
                    textAlign: "center",
                    color: "#9ca3af",
                  }}
                >
                  {match.league.name}
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}