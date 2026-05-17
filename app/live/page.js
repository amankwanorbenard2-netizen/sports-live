"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export default function LivePage() {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchLiveMatches() {
      try {
        const res = await fetch("/api/live");
        const data = await res.json();

        setMatches(data.events || []);
      } catch (error) {
        console.log(error);
      }

      setLoading(false);
    }

    fetchLiveMatches();

    const interval = setInterval(() => {
      fetchLiveMatches();
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div
        style={{
          background: "#111827",
          color: "white",
          minHeight: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          fontSize: "40px",
          fontWeight: "bold",
        }}
      >
        Loading Live Matches...
      </div>
    );
  }

  const leaguePriority = [
    "FIFA World Cup",
    "UEFA Champions League",
    "Premier League",
    "La Liga",
    "Serie A",
    "Bundesliga",
    "Ligue 1",
    "UEFA Europa League",
    "UEFA Europa Conference League",
    "Major League Soccer",
    "Saudi Pro League",
    "CAF Champions League",
  ];

  const groupedMatches = matches.reduce(
    (groups, match) => {
      const leagueName = match.league.name;

      if (!groups[leagueName]) {
        groups[leagueName] = [];
      }

      groups[leagueName].push(match);

      return groups;
    },
    {}
  );

  const sortedLeagues = Object.entries(
    groupedMatches
  ).sort(([a], [b]) => {
    const indexA =
      leaguePriority.indexOf(a);

    const indexB =
      leaguePriority.indexOf(b);

    if (indexA === -1 && indexB === -1)
      return a.localeCompare(b);

    if (indexA === -1) return 1;

    if (indexB === -1) return -1;

    return indexA - indexB;
  });

  return (
    <div
      style={{
        background: "#111827",
        color: "white",
        minHeight: "100vh",
        padding: "20px",
        paddingBottom: "140px",
      }}
    >
      <h1
        style={{
          color: "#22c55e",
          fontSize: "55px",
          marginBottom: "30px",
        }}
      >
        🔴 Live Matches
      </h1>

      {sortedLeagues.length === 0 ? (
        <div
          style={{
            background: "#1f2937",
            padding: "30px",
            borderRadius: "20px",
            textAlign: "center",
            fontSize: "24px",
          }}
        >
          No live matches currently.
        </div>
      ) : (
        sortedLeagues.map(
          ([league, leagueMatches]) => (
            <div
              key={league}
              style={{
                marginBottom: "50px",
              }}
            >
              {/* LEAGUE */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "12px",
                  marginBottom: "20px",
                }}
              >
                <img
                  src={leagueMatches[0].league.logo}
                  width="40"
                />

                <h2
                  style={{
                    color: "#facc15",
                    fontSize: "32px",
                  }}
                >
                  {league}
                </h2>
              </div>

              {/* MATCHES */}
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns:
                    "repeat(auto-fit,minmax(320px,1fr))",
                  gap: "20px",
                }}
              >
                {leagueMatches.map((match) => (
                  <Link
                    key={match.fixture.id}
                    href={`/match/${match.fixture.id}`}
                    style={{
                      textDecoration: "none",
                    }}
                  >
                    <div
                      style={{
                        background: "#1f2937",
                        borderRadius: "20px",
                        padding: "20px",
                        border:
                          "1px solid #374151",
                        transition: "0.3s",
                        cursor: "pointer",
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.transform =
                          "translateY(-8px) scale(1.02)";

                        e.currentTarget.style.boxShadow =
                          "0 0 25px rgba(34,197,94,0.5)";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.transform =
                          "translateY(0px) scale(1)";

                        e.currentTarget.style.boxShadow =
                          "none";
                      }}
                    >
                      {/* LIVE */}
                      <div
                        style={{
                          color: "#22c55e",
                          fontWeight: "bold",
                          marginBottom: "15px",
                        }}
                      >
                        🔴 LIVE{" "}
                        {
                          match.fixture.status
                            .elapsed
                        }
                        '
                      </div>

                      {/* TEAMS */}
                      <div
                        style={{
                          display: "flex",
                          justifyContent:
                            "space-between",
                          alignItems: "center",
                        }}
                      >
                        {/* HOME */}
                        <div
                          style={{
                            width: "40%",
                            textAlign: "center",
                          }}
                        >
                          <img
                            src={
                              match.teams.home.logo
                            }
                            width="70"
                          />

                          <p>
                            {
                              match.teams.home.name
                            }
                          </p>
                        </div>

                        {/* SCORE */}
                        <div
                          style={{
                            textAlign: "center",
                          }}
                        >
                          <h2
                            style={{
                              color: "#22c55e",
                              fontSize: "36px",
                            }}
                          >
                            {match.goals.home} -{" "}
                            {match.goals.away}
                          </h2>
                        </div>

                        {/* AWAY */}
                        <div
                          style={{
                            width: "40%",
                            textAlign: "center",
                          }}
                        >
                          <img
                            src={
                              match.teams.away.logo
                            }
                            width="70"
                          />

                          <p>
                            {
                              match.teams.away.name
                            }
                          </p>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )
        )
      )}
    </div>
  );
}