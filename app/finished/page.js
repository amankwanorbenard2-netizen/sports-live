"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export default function FinishedPage() {
  const [matches, setMatches] = useState([]);

  useEffect(() => {
    fetch("/api/finished")
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
        color: "white",
        paddingBottom: "100px",
      }}
    >
      {/* HEADER */}
      <div
        style={{
          padding: "20px",
          borderBottom: "1px solid #374151",
          display: "flex",
          alignItems: "center",
          gap: "10px",
        }}
      >
        <img
          src="https://cdn-icons-png.flaticon.com/512/53/53283.png"
          width="40"
        />
        <h1
          style={{
            color: "#84cc16",
            fontSize: "42px",
            fontWeight: "bold",
          }}
        >
          Sports Live
        </h1>
      </div>

      {/* TITLE */}
      <div style={{ padding: "20px" }}>
        <h1
          style={{
            color: "#facc15",
            fontSize: "58px",
            fontWeight: "bold",
            marginBottom: "20px",
          }}
        >
          Finished Matches
        </h1>

        {matches.length === 0 ? (
          <div
            style={{
              background: "#1f2937",
              padding: "30px",
              borderRadius: "16px",
              textAlign: "center",
              fontSize: "24px",
              color: "#d1d5db",
            }}
          >
            No finished matches available.
          </div>
        ) : (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
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
                    borderRadius: "20px",
                    padding: "20px",
                    transition: "0.3s",
                    cursor: "pointer",
                    border: "1px solid #374151",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = "scale(1.03)";
                    e.currentTarget.style.boxShadow =
                      "0px 0px 25px rgba(250,204,21,0.4)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "scale(1)";
                    e.currentTarget.style.boxShadow = "none";
                  }}
                >
                  {/* LEAGUE */}
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "10px",
                      marginBottom: "15px",
                    }}
                  >
                    <img src={match.league.logo} width="28" />
                    <span
                      style={{
                        color: "#cbd5e1",
                        fontSize: "18px",
                      }}
                    >
                      {match.league.name}
                    </span>
                  </div>

                  {/* TEAMS */}
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    {/* HOME */}
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        width: "40%",
                      }}
                    >
                      <img src={match.teams.home.logo} width="70" />
                      <p
                        style={{
                          marginTop: "10px",
                          fontWeight: "bold",
                          textAlign: "center",
                        }}
                      >
                        {match.teams.home.name}
                      </p>
                    </div>

                    {/* SCORE */}
                    <div
                      style={{
                        textAlign: "center",
                      }}
                    >
                      <div
                        style={{
                          fontSize: "42px",
                          fontWeight: "bold",
                          color: "#facc15",
                        }}
                      >
                        {match.goals.home} - {match.goals.away}
                      </div>

                      <div
                        style={{
                          color: "#22c55e",
                          marginTop: "10px",
                          fontWeight: "bold",
                        }}
                      >
                        FT
                      </div>
                    </div>

                    {/* AWAY */}
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        width: "40%",
                      }}
                    >
                      <img src={match.teams.away.logo} width="70" />
                      <p
                        style={{
                          marginTop: "10px",
                          fontWeight: "bold",
                          textAlign: "center",
                        }}
                      >
                        {match.teams.away.name}
                      </p>
                    </div>
                  </div>

                  {/* DATE */}
                  <div
                    style={{
                      marginTop: "20px",
                      color: "#9ca3af",
                      textAlign: "center",
                    }}
                  >
                    {new Date(match.fixture.date).toLocaleString()}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}