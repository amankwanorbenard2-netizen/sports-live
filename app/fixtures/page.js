"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export default function FixturesPage() {
  const [matches, setMatches] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  useEffect(() => {
    let interval;

    async function fetchFixtures() {
      try {
        const res = await fetch(
          "/api/fixtures"
        );

        const data =
          await res.json();

        const matchesData =
          Array.isArray(
            data.events
          )
            ? data.events
            : [];

        const liveStatuses = [
          "1H",
          "2H",
          "HT",
        ];

        // LIVE FIRST
        const sortedMatches =
          [...matchesData].sort(
            (a, b) => {
              const aLive =
                liveStatuses.includes(
                  a.fixture
                    ?.status
                    ?.short
                );

              const bLive =
                liveStatuses.includes(
                  b.fixture
                    ?.status
                    ?.short
                );

              if (
                aLive &&
                !bLive
              )
                return -1;

              if (
                !aLive &&
                bLive
              )
                return 1;

              return 0;
            }
          );

        setMatches(
          sortedMatches
        );

        setLoading(false);

        // CHECK LIVE
        const hasLiveMatches =
          sortedMatches.some(
            (match) =>
              liveStatuses.includes(
                match.fixture
                  ?.status
                  ?.short
              )
          );

        clearInterval(interval);

        // LIVE = 1 MINUTE
        if (hasLiveMatches) {
          interval = setInterval(
            fetchFixtures,
            60000
          );
        }

        // NO LIVE = 1 DAY
        else {
          interval = setInterval(
            fetchFixtures,
            86400000
          );
        }
      } catch (error) {
        console.log(error);
        setLoading(false);
      }
    }

    fetchFixtures();

    return () =>
      clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div
        style={{
          background:
            "#020617",
          minHeight: "100vh",
          display: "flex",
          justifyContent:
            "center",
          alignItems:
            "center",
          color: "white",
          fontSize: "32px",
          fontWeight: "bold",
        }}
      >
        Loading Fixtures...
      </div>
    );
  }

  return (
    <div
      style={{
        background:
          "linear-gradient(to bottom, #020617, #111827)",
        minHeight: "100vh",
        padding: "16px",
        paddingBottom: "120px",
        color: "white",
      }}
    >
      {/* TITLE */}
      <div
        style={{
          textAlign: "center",
          marginBottom: "28px",
        }}
      >
        <h1
          style={{
            fontSize: "40px",
            fontWeight: "900",
            color: "#22c55e",
            marginBottom: "8px",
          }}
        >
          Fixtures
        </h1>

        <p
          style={{
            color: "#94a3b8",
            fontSize: "15px",
          }}
        >
          Live Matches &
          Upcoming Games
        </p>
      </div>

      {/* EMPTY */}
      {matches.length === 0 && (
        <div
          style={{
            textAlign: "center",
            marginTop: "60px",
            color: "#94a3b8",
            fontSize: "22px",
          }}
        >
          No Fixtures Available
        </div>
      )}

      {/* MATCHES */}
      <div
        style={{
          display: "flex",
          flexDirection:
            "column",
          gap: "18px",
        }}
      >
        {matches.map(
          (match, index) => {
            const isLive =
              match.fixture
                ?.status
                ?.short ===
                "1H" ||
              match.fixture
                ?.status
                ?.short ===
                "2H" ||
              match.fixture
                ?.status
                ?.short ===
                "HT";

            return (
              <Link
                key={index}
                href={`/match/${
                  match.fixture
                    ?.id || index
                }`}
                style={{
                  textDecoration:
                    "none",
                }}
              >
                <div
                  className="fixture-card"
                  style={{
                    background:
                      "linear-gradient(to right, #1e293b, #0f172a)",
                    borderRadius:
                      "24px",
                    padding: "18px",
                    border:
                      "1px solid rgba(255,255,255,0.08)",
                    boxShadow:
                      "0 10px 30px rgba(0,0,0,0.35)",
                    transition:
                      "all 0.3s ease",
                  }}
                >
                  {/* LEAGUE */}
                  <div
                    style={{
                      display:
                        "flex",
                      alignItems:
                        "center",
                      gap: "10px",
                      marginBottom:
                        "18px",
                    }}
                  >
                    <img
                      src={
                        match.league
                          ?.logo
                      }
                      width="24"
                      alt=""
                    />

                    <span
                      style={{
                        color:
                          "#cbd5e1",
                        fontSize:
                          "14px",
                        fontWeight:
                          "700",
                      }}
                    >
                      {
                        match.league
                          ?.name
                      }
                    </span>
                  </div>

                  {/* MATCH ROW */}
                  <div
                    style={{
                      display:
                        "flex",
                      justifyContent:
                        "space-between",
                      alignItems:
                        "center",
                    }}
                  >
                    {/* HOME */}
                    <div
                      style={{
                        flex: 1,
                        textAlign:
                          "center",
                      }}
                    >
                      <img
                        src={
                          match
                            .teams
                            ?.home
                            ?.logo
                        }
                        width="56"
                        alt=""
                      />

                      <p
                        style={{
                          marginTop:
                            "10px",
                          fontSize:
                            "14px",
                          fontWeight:
                            "800",
                          lineHeight:
                            "20px",
                        }}
                      >
                        {
                          match
                            .teams
                            ?.home
                            ?.name
                        }
                      </p>
                    </div>

                    {/* CENTER */}
                    <div
                      style={{
                        minWidth:
                          "130px",
                        textAlign:
                          "center",
                      }}
                    >
                      {/* LIVE */}
                      {isLive ? (
                        <div
                          style={{
                            background:
                              "#ef4444",
                            color:
                              "white",
                            display:
                              "inline-flex",
                            alignItems:
                              "center",
                            gap: "6px",
                            padding:
                              "6px 14px",
                            borderRadius:
                              "999px",
                            fontSize:
                              "12px",
                            fontWeight:
                              "900",
                            marginBottom:
                              "10px",
                            animation:
                              "pulse 1s infinite",
                            boxShadow:
                              "0 0 18px rgba(239,68,68,0.6)",
                          }}
                        >
                          <span
                            style={{
                              width:
                                "8px",
                              height:
                                "8px",
                              borderRadius:
                                "50%",
                              background:
                                "white",
                            }}
                          ></span>

                          LIVE
                        </div>
                      ) : (
                        <p
                          style={{
                            color:
                              "#94a3b8",
                            marginBottom:
                              "10px",
                            fontSize:
                              "13px",
                            fontWeight:
                              "600",
                            lineHeight:
                              "20px",
                          }}
                        >
                          {match
                            .fixture
                            ?.date
                            ? new Date(
                                match
                                  .fixture
                                  .date
                              ).toLocaleDateString(
                                [],
                                {
                                  weekday:
                                    "short",
                                  day: "2-digit",
                                  month:
                                    "short",
                                  year:
                                    "numeric",
                                }
                              ) +
                              " • " +
                              new Date(
                                match
                                  .fixture
                                  .date
                              ).toLocaleTimeString(
                                [],
                                {
                                  hour:
                                    "2-digit",
                                  minute:
                                    "2-digit",
                                }
                              )
                            : "Upcoming"}
                        </p>
                      )}

                      {/* SCORE */}
                      <h2
                        style={{
                          fontSize:
                            "32px",
                          color:
                            "#22c55e",
                          fontWeight:
                            "900",
                        }}
                      >
                        {match
                          .goals
                          ?.home ??
                          "-"}{" "}
                        -{" "}
                        {match
                          .goals
                          ?.away ??
                          "-"}
                      </h2>
                    </div>

                    {/* AWAY */}
                    <div
                      style={{
                        flex: 1,
                        textAlign:
                          "center",
                      }}
                    >
                      <img
                        src={
                          match
                            .teams
                            ?.away
                            ?.logo
                        }
                        width="56"
                        alt=""
                      />

                      <p
                        style={{
                          marginTop:
                            "10px",
                          fontSize:
                            "14px",
                          fontWeight:
                            "800",
                          lineHeight:
                            "20px",
                        }}
                      >
                        {
                          match
                            .teams
                            ?.away
                            ?.name
                        }
                      </p>
                    </div>
                  </div>
                </div>
              </Link>
            );
          }
        )}
      </div>

      {/* STYLES */}
      <style jsx>{`
        @keyframes pulse {
          0% {
            transform: scale(1);
            opacity: 1;
          }

          50% {
            transform: scale(1.08);
            opacity: 0.85;
          }

          100% {
            transform: scale(1);
            opacity: 1;
          }
        }

        .fixture-card:hover {
          transform: translateY(-6px)
            scale(1.025);

          border: 1px solid
            rgba(
              250,
              204,
              21,
              0.55
            );

          box-shadow:
            0 0 12px
              rgba(
                250,
                204,
                21,
                0.45
              ),
            0 0 25px
              rgba(
                250,
                204,
                21,
                0.35
              ),
            0 0 50px
              rgba(
                250,
                204,
                21,
                0.25
              ),
            0 18px 40px
              rgba(
                0,
                0,
                0,
                0.55
              );

          background: linear-gradient(
            to right,
            #243447,
            #111827
          );
        }
      `}</style>
    </div>
  );
}