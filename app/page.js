"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

export default function HomePage() {

  const [matches, setMatches] = useState([]);

  useEffect(() => {

    async function fetchLiveMatches() {

      try {

        const response = await fetch("/api/live");

        const data = await response.json();

        setMatches(data.matches || []);

      } catch (error) {

        console.log(error);

      }

    }

    fetchLiveMatches();

  }, []);

  return (

    <div
      style={{
        minHeight: "100vh",
        background: "#0f172a",
        color: "white",
      }}
    >

      {/* HERO SECTION */}

      <section
        style={{
          padding: "60px 20px",
          textAlign: "center",
          background:
            "linear-gradient(to bottom, #0f172a, #111827)",
        }}
      >

        <h1
          style={{
            fontSize: "55px",
            color: "#22c55e",
            marginBottom: "20px",
            fontWeight: "bold",
          }}
        >
          Sports Live
        </h1>

        <p
          style={{
            fontSize: "22px",
            maxWidth: "700px",
            margin: "auto",
            color: "#cbd5e1",
            lineHeight: "1.7",
          }}
        >
          Follow live football matches, fixtures,
          results and real-time football updates
          from leagues around the world.
        </p>

        <div
          style={{
            marginTop: "40px",
            display: "flex",
            justifyContent: "center",
            gap: "20px",
            flexWrap: "wrap",
          }}
        >

          <Link href="/live">

            <button
              style={{
                background: "#22c55e",
                color: "white",
                border: "none",
                padding: "15px 35px",
                borderRadius: "12px",
                fontSize: "18px",
                cursor: "pointer",
                fontWeight: "bold",
              }}
            >
              Watch Live Matches
            </button>

          </Link>

          <button
            style={{
              background: "transparent",
              color: "white",
              border: "1px solid #22c55e",
              padding: "15px 35px",
              borderRadius: "12px",
              fontSize: "18px",
              cursor: "pointer",
              fontWeight: "bold",
            }}
          >
            Create Account
          </button>

        </div>

      </section>

      {/* REAL LIVE MATCHES */}

      <section
        style={{
          padding: "40px 20px",
        }}
      >

        <h2
          style={{
            color: "#22c55e",
            fontSize: "35px",
            marginBottom: "25px",
          }}
        >
          Live Football
        </h2>

        <div
          style={{
            display: "grid",
            gridTemplateColumns:
              "repeat(auto-fit, minmax(280px, 1fr))",
            gap: "20px",
          }}
        >

          {matches.slice(0, 6).map((match) => (

            <div
              key={match.idEvent}
              style={{
                background: "#1e293b",
                padding: "25px",
                borderRadius: "15px",
                border: "1px solid #334155",
              }}
            >

              <p
                style={{
                  color: "#22c55e",
                  marginBottom: "10px",
                  fontWeight: "bold",
                }}
              >
                {

                  match.strStatus === "Match Finished"
                    ? "FT"
                    : match.strStatus || "LIVE"

                }
              </p>

              <h3>
                {match.strHomeTeam}
              </h3>

              <h1
                style={{
                  color: "#22c55e",
                  margin: "15px 0",
                  fontSize: "35px",
                }}
              >
                {match.intHomeScore || 0}
                {" - "}
                {match.intAwayScore || 0}
              </h1>

              <h3>
                {match.strAwayTeam}
              </h3>

              <p
                style={{
                  marginTop: "15px",
                  color: "#cbd5e1",
                }}
              >
                {match.strLeague}
              </p>

            </div>

          ))}

        </div>

      </section>

      {/* FEATURES */}

      <section
        style={{
          padding: "40px 20px",
        }}
      >

        <h2
          style={{
            color: "#22c55e",
            fontSize: "35px",
            marginBottom: "25px",
          }}
        >
          Features
        </h2>

        <div
          style={{
            display: "grid",
            gridTemplateColumns:
              "repeat(auto-fit, minmax(250px, 1fr))",
            gap: "20px",
          }}
        >

          <div
            style={{
              background: "#1e293b",
              padding: "25px",
              borderRadius: "15px",
            }}
          >

            <h3>⚽ Live Scores</h3>

            <p
              style={{
                marginTop: "15px",
                color: "#cbd5e1",
              }}
            >
              Follow real-time football scores and
              live updates.
            </p>

          </div>

          <div
            style={{
              background: "#1e293b",
              padding: "25px",
              borderRadius: "15px",
            }}
          >

            <h3>📅 Fixtures</h3>

            <p
              style={{
                marginTop: "15px",
                color: "#cbd5e1",
              }}
            >
              View upcoming football matches from
              multiple leagues.
            </p>

          </div>

          <div
            style={{
              background: "#1e293b",
              padding: "25px",
              borderRadius: "15px",
            }}
          >

            <h3>🏆 Results</h3>

            <p
              style={{
                marginTop: "15px",
                color: "#cbd5e1",
              }}
            >
              Check completed football matches and
              results instantly.
            </p>

          </div>

        </div>

      </section>

      {/* CTA */}

      <section
        style={{
          padding: "60px 20px",
        }}
      >

        <div
          style={{
            background: "#1e293b",
            padding: "50px 20px",
            borderRadius: "20px",
            textAlign: "center",
          }}
        >

          <h2
            style={{
              fontSize: "40px",
              color: "#22c55e",
              marginBottom: "20px",
            }}
          >
            Join Football Fans Worldwide
          </h2>

          <p
            style={{
              color: "#cbd5e1",
              maxWidth: "700px",
              margin: "auto",
              lineHeight: "1.7",
              marginBottom: "30px",
            }}
          >
            Create your account to follow your
            favorite clubs, matches and leagues.
          </p>

          <button
            style={{
              background: "#22c55e",
              color: "white",
              border: "none",
              padding: "15px 40px",
              borderRadius: "12px",
              fontSize: "18px",
              cursor: "pointer",
              fontWeight: "bold",
            }}
          >
            Sign Up Now
          </button>

        </div>

      </section>

    </div>

  );

}