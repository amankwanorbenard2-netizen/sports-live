"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

export default function MatchDetails() {
  const params = useParams();

  const [match, setMatch] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchMatch() {
      try {
        const res = await fetch(
          `/api/match?id=${params.id}`
        );

        const data = await res.json();

        setMatch(
          data.response
            ? data.response[0]
            : data
        );
      } catch (error) {
        console.log(error);
      }

      setLoading(false);
    }

    if (params.id) {
      fetchMatch();
    }
  }, [params.id]);

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
          fontSize: "32px",
        }}
      >
        Loading Match...
      </div>
    );
  }

  if (!match || !match.teams) {
    return (
      <div
        style={{
          background: "#111827",
          color: "white",
          minHeight: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          fontSize: "32px",
        }}
      >
        Match Not Found
      </div>
    );
  }

  function groupPlayers(startXI, formation) {
    if (!formation) return [startXI];

    const parts = formation
      .split("-")
      .map(Number);

    const grouped = [];

    grouped.push([startXI[0]]);

    let currentIndex = 1;

    for (let count of parts) {
      grouped.push(
        startXI.slice(
          currentIndex,
          currentIndex + count
        )
      );

      currentIndex += count;
    }

    return grouped;
  }

  const homeLineup =
    match.lineups?.[0];

  const awayLineup =
    match.lineups?.[1];

  const homeRows = homeLineup
    ? groupPlayers(
        homeLineup.startXI,
        homeLineup.formation
      )
    : [];

  const awayRows = awayLineup
    ? groupPlayers(
        awayLineup.startXI,
        awayLineup.formation
      ).reverse()
    : [];

  function renderPlayer(playerData) {
    const rating = parseFloat(
      playerData.player.rating || 0
    );

    let ratingColor = "#9ca3af";

    if (rating >= 8) {
      ratingColor = "#22c55e";
    } else if (rating >= 7) {
      ratingColor = "#facc15";
    } else if (rating >= 6) {
      ratingColor = "#fb923c";
    } else if (rating > 0) {
      ratingColor = "#ef4444";
    }

    return (
      <div
        style={{
          textAlign: "center",
          width: "62px",
        }}
      >
        {/* PLAYER */}
        <div
          style={{
            width: "44px",
            height: "44px",
            borderRadius: "50%",
            background: "#facc15",
            color: "#111827",
            display: "flex",
            justifyContent:
              "center",
            alignItems: "center",
            fontWeight: "bold",
            fontSize: "13px",
            margin: "auto",
            border:
              "3px solid white",
            position: "relative",
            boxShadow:
              "0 0 10px rgba(0,0,0,0.4)",
          }}
        >
          {
            playerData.player
              .number
          }

          {/* RATING */}
          <div
            style={{
              position:
                "absolute",
              bottom: "-6px",
              right: "-6px",
              background:
                rating > 0
                  ? ratingColor
                  : "#6b7280",
              color: "white",
              fontSize: "9px",
              fontWeight:
                "bold",
              borderRadius:
                "999px",
              padding:
                "2px 5px",
              border:
                "2px solid #111827",
              minWidth: "22px",
              textAlign:
                "center",
            }}
          >
            {rating > 0
              ? rating.toFixed(1)
              : "-"}
          </div>
        </div>

        {/* NAME */}
        <p
          style={{
            marginTop: "8px",
            fontSize: "10px",
            fontWeight: "bold",
            color: "white",
            lineHeight: "13px",
            wordBreak:
              "break-word",
          }}
        >
          {
            playerData.player
              .name
          }
        </p>
      </div>
    );
  }

  function renderRows(rows) {
    return rows.map(
      (row, rowIndex) => (
        <div
          key={rowIndex}
          style={{
            display: "flex",
            justifyContent:
              "space-evenly",
            alignItems: "center",
            marginBottom: "24px",
            flexWrap: "nowrap",
            gap: "4px",
            width: "100%",
          }}
        >
          {row.map(
            (
              playerData,
              idx
            ) => (
              <div key={idx}>
                {renderPlayer(
                  playerData
                )}
              </div>
            )
          )}
        </div>
      )
    );
  }

  return (
    <div
      style={{
        background: "#111827",
        color: "white",
        minHeight: "100vh",
        padding: "14px",
        paddingBottom: "120px",
      }}
    >
      {/* SCORE */}
      <div
        style={{
          background: "#1f2937",
          borderRadius: "20px",
          padding: "20px",
          marginBottom: "30px",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent:
              "space-between",
            alignItems: "center",
            textAlign: "center",
            gap: "12px",
          }}
        >
          <div style={{ flex: 1 }}>
            <img
              src={match.teams.home.logo}
              width="55"
              alt=""
            />

            <h2
              style={{
                fontSize: "18px",
              }}
            >
              {match.teams.home.name}
            </h2>
          </div>

          <div>
            <h1
              style={{
                color: "#22c55e",
                fontSize: "38px",
                margin: 0,
              }}
            >
              {match.goals.home} -{" "}
              {match.goals.away}
            </h1>

            <p
              style={{
                color: "#9ca3af",
                fontSize: "14px",
              }}
            >
              {
                match.fixture.status
                  .long
              }
            </p>
          </div>

          <div style={{ flex: 1 }}>
            <img
              src={match.teams.away.logo}
              width="55"
              alt=""
            />

            <h2
              style={{
                fontSize: "18px",
              }}
            >
              {match.teams.away.name}
            </h2>
          </div>
        </div>
      </div>

      {/* MATCH INFO */}
      <div
        style={{
          background: "#1f2937",
          borderRadius: "20px",
          padding: "20px",
          marginBottom: "30px",
        }}
      >
        <h2
          style={{
            color: "#facc15",
            marginBottom: "18px",
          }}
        >
          Match Information
        </h2>

        <p>
          <strong>Date:</strong>{" "}
          {new Date(
            match.fixture.date
          ).toLocaleString()}
        </p>

        <p>
          <strong>Referee:</strong>{" "}
          {match.fixture.referee ||
            "Unknown"}
        </p>

        <p>
          <strong>Stadium:</strong>{" "}
          {match.fixture.venue.name}
        </p>

        <p>
          <strong>City:</strong>{" "}
          {match.fixture.venue.city}
        </p>
      </div>

      {/* STATISTICS */}
      <div
        style={{
          marginBottom: "35px",
        }}
      >
        <h2
          style={{
            color: "#3b82f6",
            marginBottom: "18px",
          }}
        >
          Match Statistics
        </h2>

        {match.statistics &&
        match.statistics.length >
          1 ? (
          <div
            style={{
              display: "grid",
              gridTemplateColumns:
                "repeat(auto-fit,minmax(160px,1fr))",
              gap: "12px",
            }}
          >
            {match.statistics[0].statistics.map(
              (
                stat,
                index
              ) => (
                <div
                  key={index}
                  style={{
                    background:
                      "#1f2937",
                    padding:
                      "16px",
                    borderRadius:
                      "16px",
                    textAlign:
                      "center",
                  }}
                >
                  <h3
                    style={{
                      color:
                        "#facc15",
                      fontSize:
                        "14px",
                      marginBottom:
                        "12px",
                    }}
                  >
                    {stat.type}
                  </h3>

                  <div
                    style={{
                      display:
                        "flex",
                      justifyContent:
                        "space-between",
                      alignItems:
                        "center",
                      gap: "10px",
                    }}
                  >
                    <span
                      style={{
                        color:
                          "#22c55e",
                        fontWeight:
                          "bold",
                      }}
                    >
                      {stat.value ||
                        0}
                    </span>

                    <span
                      style={{
                        color:
                          "#9ca3af",
                        fontSize:
                          "12px",
                      }}
                    >
                      vs
                    </span>

                    <span
                      style={{
                        color:
                          "#ef4444",
                        fontWeight:
                          "bold",
                      }}
                    >
                      {match
                        .statistics[1]
                        ?.statistics[
                        index
                      ]?.value ||
                        0}
                    </span>
                  </div>
                </div>
              )
            )}
          </div>
        ) : (
          <div
            style={{
              background:
                "#1f2937",
              padding: "25px",
              borderRadius:
                "18px",
              textAlign: "center",
              color: "#9ca3af",
            }}
          >
            Statistics not available
            for this match.
          </div>
        )}
      </div>

      {/* MATCH EVENTS */}
      {match.events &&
        match.events.length >
          0 && (
          <div
            style={{
              marginBottom: "35px",
            }}
          >
            <h2
              style={{
                color: "#f43f5e",
                marginBottom: "18px",
              }}
            >
              Match Events
            </h2>

            <div
              style={{
                display: "flex",
                flexDirection:
                  "column",
                gap: "12px",
              }}
            >
              {match.events.map(
                (
                  event,
                  index
                ) => {
                  let icon =
                    "⚽";

                  if (
                    event.type ===
                    "Card"
                  ) {
                    if (
                      event.detail ===
                      "Yellow Card"
                    ) {
                      icon =
                        "🟨";
                    }

                    if (
                      event.detail ===
                      "Red Card"
                    ) {
                      icon =
                        "🟥";
                    }
                  }

                  if (
                    event.type ===
                    "subst"
                  ) {
                    icon =
                      "🔄";
                  }

                  return (
                    <div
                      key={index}
                      style={{
                        background:
                          "#1f2937",
                        borderRadius:
                          "16px",
                        padding:
                          "16px",
                        display:
                          "flex",
                        gap: "14px",
                        alignItems:
                          "center",
                      }}
                    >
                      <div
                        style={{
                          color:
                            "#22c55e",
                          fontWeight:
                            "bold",
                          minWidth:
                            "45px",
                        }}
                      >
                        {
                          event.time
                            .elapsed
                        }
                        '
                      </div>

                      <div
                        style={{
                          flex: 1,
                        }}
                      >
                        <div
                          style={{
                            display:
                              "flex",
                            alignItems:
                              "center",
                            gap: "8px",
                            flexWrap:
                              "wrap",
                          }}
                        >
                          <span>
                            {icon}
                          </span>

                          <strong>
                            {
                              event
                                .player
                                .name
                            }
                          </strong>
                        </div>

                        <p
                          style={{
                            color:
                              "#9ca3af",
                            marginTop:
                              "5px",
                            marginBottom:
                              0,
                            fontSize:
                              "13px",
                          }}
                        >
                          {
                            event.detail
                          }
                        </p>

                        {/* SUBSTITUTION */}
                        {event.type ===
                          "subst" &&
                          event
                            .assist &&
                          event
                            .assist
                            .name && (
                            <p
                              style={{
                                color:
                                  "#facc15",
                                marginTop:
                                  "5px",
                                marginBottom:
                                  0,
                                fontSize:
                                  "13px",
                                fontWeight:
                                  "bold",
                              }}
                            >
                              ⬅️ Out:{" "}
                              {
                                event
                                  .assist
                                  .name
                              }
                            </p>
                          )}

                        {/* ASSIST */}
                        {event.type !==
                          "subst" &&
                          event
                            .assist &&
                          event
                            .assist
                            .name && (
                            <p
                              style={{
                                color:
                                  "#22c55e",
                                marginTop:
                                  "5px",
                                marginBottom:
                                  0,
                                fontSize:
                                  "13px",
                                fontWeight:
                                  "bold",
                              }}
                            >
                              🅰️ Assist:{" "}
                              {
                                event
                                  .assist
                                  .name
                              }
                            </p>
                          )}
                      </div>
                    </div>
                  );
                }
              )}
            </div>
          </div>
        )}

      {/* TACTICAL LINEUPS */}
      {homeLineup &&
        awayLineup && (
          <div>
            <h2
              style={{
                color: "#22c55e",
                fontSize: "28px",
                marginBottom:
                  "18px",
              }}
            >
              Tactical Lineups
            </h2>

            <div
              style={{
                background:
                  "linear-gradient(to bottom, #166534, #14532d)",
                borderRadius:
                  "20px",
                padding:
                  "24px 8px",
                position:
                  "relative",
                overflow:
                  "hidden",
                border:
                  "3px solid rgba(255,255,255,0.15)",
              }}
            >
              {/* OUTER BORDER */}
              <div
                style={{
                  position:
                    "absolute",
                  inset: "10px",
                  border:
                    "2px solid rgba(255,255,255,0.35)",
                  borderRadius:
                    "8px",
                }}
              />

              {/* MIDFIELD LINE */}
              <div
                style={{
                  position:
                    "absolute",
                  top: "50%",
                  left: "10px",
                  right: "10px",
                  height: "2px",
                  background:
                    "rgba(255,255,255,0.4)",
                }}
              />

              {/* CENTER CIRCLE */}
              <div
                style={{
                  position:
                    "absolute",
                  top: "50%",
                  left: "50%",
                  transform:
                    "translate(-50%, -50%)",
                  width: "70px",
                  height: "70px",
                  borderRadius:
                    "50%",
                  border:
                    "2px solid rgba(255,255,255,0.4)",
                }}
              />

              {/* TOP PENALTY BOX */}
              <div
                style={{
                  position:
                    "absolute",
                  top: "10px",
                  left: "50%",
                  transform:
                    "translateX(-50%)",
                  width: "160px",
                  height: "75px",
                  border:
                    "2px solid rgba(255,255,255,0.35)",
                  borderTop:
                    "none",
                }}
              />

              {/* TOP GOAL AREA */}
              <div
                style={{
                  position:
                    "absolute",
                  top: "10px",
                  left: "50%",
                  transform:
                    "translateX(-50%)",
                  width: "80px",
                  height: "35px",
                  border:
                    "2px solid rgba(255,255,255,0.35)",
                  borderTop:
                    "none",
                }}
              />

              {/* BOTTOM PENALTY BOX */}
              <div
                style={{
                  position:
                    "absolute",
                  bottom: "10px",
                  left: "50%",
                  transform:
                    "translateX(-50%)",
                  width: "160px",
                  height: "75px",
                  border:
                    "2px solid rgba(255,255,255,0.35)",
                  borderBottom:
                    "none",
                }}
              />

              {/* BOTTOM GOAL AREA */}
              <div
                style={{
                  position:
                    "absolute",
                  bottom: "10px",
                  left: "50%",
                  transform:
                    "translateX(-50%)",
                  width: "80px",
                  height: "35px",
                  border:
                    "2px solid rgba(255,255,255,0.35)",
                  borderBottom:
                    "none",
                }}
              />

              {/* HOME */}
              <div
                style={{
                  marginBottom:
                    "30px",
                  marginTop: "15px",
                  position:
                    "relative",
                  zIndex: 2,
                }}
              >
                {renderRows(
                  homeRows
                )}
              </div>

              {/* AWAY */}
              <div
                style={{
                  position:
                    "relative",
                  zIndex: 2,
                }}
              >
                {renderRows(
                  awayRows
                )}
              </div>
            </div>
          </div>
        )}
    </div>
  );
}