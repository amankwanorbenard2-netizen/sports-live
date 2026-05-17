"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export default function FixturesPage() {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchFixtures() {
      try {
        const res = await fetch("/api/fixtures");
        const data = await res.json();

        setMatches(data.events || []);
      } catch (error) {
        console.log(error);
      }

      // FORCE LOADING ANIMATION TO SHOW
      setTimeout(() => {
        setLoading(false);
      }, 400);
    }

    fetchFixtures();
  }, []);

  // LOADING SCREEN
  if (loading) {
    return (
      <div
        style={{
          background: "#111827",
          minHeight: "100vh",
          padding: "20px",
        }}
      >
        <h1
          style={{
            color: "#3b82f6",
            fontSize: "55px",
            marginBottom: "30px",
          }}
        >
          📅 Fixtures
        </h1>

        <div
          style={{
            display: "grid",
            gridTemplateColumns:
              "repeat(auto-fit,minmax(320px,1fr))",
            gap: "20px",
          }}
        >
          {[1, 2, 3, 4, 5, 6].map((item) => (
            <div
              key={item}
              style={{
                background: "#1f2937",
                borderRadius: "20px",
                padding: "20px",
                height: "230px",
                animation:
                  "pulse 1.5s infinite",
              }}
            >
              <div
                style={{
                  background: "#374151",
                  height: "25px",
                  width: "60%",
                  borderRadius: "10px",
                  marginBottom: "30px",
                }}
              />

              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <div
                  style={{
                    background: "#374151",
                    width: "80px",
                    height: "80px",
                    borderRadius: "50%",
                  }}
                />

                <div
                  style={{
                    background: "#374151",
                    width: "90px",
                    height: "40px",
                    borderRadius: "10px",
                  }}
                />

                <div
                  style={{
                    background: "#374151",
                    width: "80px",
                    height: "80px",
                    borderRadius: "50%",
                  }}
                />
              </div>
            </div>
          ))}
        </div>

        <style jsx>{`
          @keyframes pulse {
            0% {
              opacity: 0.5;
            }

            50% {
              opacity: 1;
            }

            100% {
              opacity: 0.5;
            }
          }
        `}</style>
      </div>
    );
  }

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
          color: "#3b82f6",
          fontSize: "55px",
          marginBottom: "30px",
        }}
      >
        📅 Fixtures
      </h1>

      <div
        style={{
          display: "grid",
          gridTemplateColumns:
            "repeat(auto-fit,minmax(320px,1fr))",
          gap: "20px",
        }}
      >
        {matches.map((match) => (
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
                border: "1px solid #374151",
                transition: "0.3s",
                cursor: "pointer",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform =
                  "translateY(-8px) scale(1.02)";

                e.currentTarget.style.boxShadow =
                  "0 0 25px rgba(59,130,246,0.5)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform =
                  "translateY(0px) scale(1)";

                e.currentTarget.style.boxShadow =
                  "none";
              }}
            >
              {/* LEAGUE */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                  marginBottom: "20px",
                }}
              >
                <img
                  src={match.league.logo}
                  width="28"
                />

                <span
                  style={{
                    color: "#cbd5e1",
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
                    width: "40%",
                    textAlign: "center",
                  }}
                >
                  <img
                    src={match.teams.home.logo}
                    width="70"
                  />

                  <p
                    style={{
                      marginTop: "10px",
                      fontWeight: "bold",
                    }}
                  >
                    {match.teams.home.name}
                  </p>
                </div>

                {/* TIME */}
                <div
                  style={{
                    textAlign: "center",
                  }}
                >
                  <h2
                    style={{
                      color: "#3b82f6",
                      fontSize: "24px",
                    }}
                  >
                    VS
                  </h2>

                  <p
                    style={{
                      color: "#9ca3af",
                    }}
                  >
                    {new Date(
                      match.fixture.date
                    ).toLocaleTimeString()}
                  </p>
                </div>

                {/* AWAY */}
                <div
                  style={{
                    width: "40%",
                    textAlign: "center",
                  }}
                >
                  <img
                    src={match.teams.away.logo}
                    width="70"
                  />

                  <p
                    style={{
                      marginTop: "10px",
                      fontWeight: "bold",
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
                  textAlign: "center",
                  color: "#9ca3af",
                }}
              >
                {new Date(
                  match.fixture.date
                ).toLocaleDateString()}
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}