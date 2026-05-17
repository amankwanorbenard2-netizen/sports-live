"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

export default function MatchDetails() {
  const params = useParams();

  const [match, setMatch] = useState(null);
  const [loading, setLoading] =
    useState(true);

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
          justifyContent:
            "center",
          alignItems: "center",
          fontSize: "40px",
        }}
      >
        Loading Match...
      </div>
    );
  }

  if (
    !match ||
    !match.teams
  ) {
    return (
      <div
        style={{
          background: "#111827",
          color: "white",
          minHeight: "100vh",
          display: "flex",
          justifyContent:
            "center",
          alignItems: "center",
          fontSize: "40px",
        }}
      >
        Match Not Found
      </div>
    );
  }

  function groupPlayers(
    startXI,
    formation
  ) {
    if (!formation)
      return [startXI];

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

  function renderPlayer(
    playerData
  ) {
    const rating =
      playerData.player.rating;

    let ratingColor =
      "#9ca3af";

    if (rating >= 8) {
      ratingColor = "#22c55e";
    } else if (
      rating >= 7
    ) {
      ratingColor = "#facc15";
    } else if (
      rating >= 6
    ) {
      ratingColor = "#fb923c";
    } else {
      ratingColor = "#ef4444";
    }

    return (
      <div
        style={{
          textAlign: "center",
        }}
      >
        <div
          style={{
            width: "58px",
            height: "58px",
            borderRadius: "50%",
            background: "#facc15",
            color: "#111827",
            display: "flex",
            justifyContent:
              "center",
            alignItems: "center",
            fontWeight: "bold",
            fontSize: "15px",
            margin: "auto",
            border:
              "3px solid white",
            position: "relative",
          }}
        >
          {
            playerData.player
              .number
          }

          {/* RATING */}
          {rating && (
            <div
              style={{
                position:
                  "absolute",
                bottom: "-8px",
                right: "-8px",
                background:
                  ratingColor,
                color: "white",
                fontSize:
                  "10px",
                fontWeight:
                  "bold",
                borderRadius:
                  "999px",
                padding:
                  "4px 6px",
                border:
                  "2px solid #111827",
                minWidth:
                  "24px",
                textAlign:
                  "center",
              }}
            >
              {rating}
            </div>
          )}
        </div>

        <p
          style={{
            marginTop: "10px",
            fontSize: "12px",
            fontWeight: "bold",
            maxWidth: "75px",
            color: "white",
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
            marginBottom: "40px",
            flexWrap: "wrap",
            gap: "10px",
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
        padding: "20px",
        paddingBottom: "140px",
      }}
    >
      {/* SCORE */}
      <div
        style={{
          background: "#1f2937",
          borderRadius: "25px",
          padding: "25px",
          marginBottom: "35px",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent:
              "space-between",
            alignItems: "center",
            textAlign: "center",
            gap: "20px",
            flexWrap: "wrap",
          }}
        >
          <div style={{ flex: 1 }}>
            <img
              src={match.teams.home.logo}
              width="70"
            />
            <h2>
              {match.teams.home.name}
            </h2>
          </div>

          <div>
            <h1
              style={{
                color: "#22c55e",
                fontSize: "52px",
                margin: 0,
              }}
            >
              {match.goals.home} -{" "}
              {match.goals.away}
            </h1>

            <p
              style={{
                color: "#9ca3af",
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
              width="70"
            />
            <h2>
              {match.teams.away.name}
            </h2>
          </div>
        </div>
      </div>

      {/* MATCH INFO */}
      <div
        style={{
          background: "#1f2937",
          borderRadius: "25px",
          padding: "25px",
          marginBottom: "40px",
        }}
      >
        <h2
          style={{
            color: "#facc15",
            fontSize: "34px",
            marginBottom: "20px",
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
          marginBottom: "40px",
        }}
      >
        <h2
          style={{
            color: "#3b82f6",
            fontSize: "38px",
            marginBottom: "25px",
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
                "repeat(auto-fit,minmax(280px,1fr))",
              gap: "20px",
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
                      "20px",
                    borderRadius:
                      "20px",
                  }}
                >
                  <h3
                    style={{
                      color:
                        "#facc15",
                    }}
                  >
                    {stat.type}
                  </h3>

                  <p>
                    {
                      match.teams.home
                        .name
                    }
                    :{" "}
                    {stat.value ||
                      0}
                  </p>

                  <p>
                    {
                      match.teams.away
                        .name
                    }
                    :{" "}
                    {match
                      .statistics[1]
                      ?.statistics[
                      index
                    ]?.value || 0}
                  </p>
                </div>
              )
            )}
          </div>
        ) : (
          <div
            style={{
              background:
                "#1f2937",
              padding: "30px",
              borderRadius:
                "20px",
              textAlign: "center",
              color: "#9ca3af",
              fontSize: "18px",
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
              marginBottom: "45px",
            }}
          >
            <h2
              style={{
                color: "#f43f5e",
                fontSize: "38px",
                marginBottom: "25px",
              }}
            >
              Match Events
            </h2>

            <div
              style={{
                display: "flex",
                flexDirection:
                  "column",
                gap: "18px",
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
                          "18px",
                        padding:
                          "18px",
                        display:
                          "flex",
                        justifyContent:
                          "space-between",
                        alignItems:
                          "center",
                        gap: "15px",
                        flexWrap:
                          "wrap",
                      }}
                    >
                      <div
                        style={{
                          color:
                            "#22c55e",
                          fontWeight:
                            "bold",
                          fontSize:
                            "22px",
                          minWidth:
                            "60px",
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
                            gap: "10px",
                            flexWrap:
                              "wrap",
                          }}
                        >
                          <span
                            style={{
                              fontSize:
                                "28px",
                            }}
                          >
                            {icon}
                          </span>

                          <strong>
                            {
                              event
                                .player
                                .name
                            }
                          </strong>

                          <span
                            style={{
                              color:
                                "#9ca3af",
                            }}
                          >
                            (
                            {
                              event.team
                                .name
                            }
                            )
                          </span>
                        </div>

                        <div
                          style={{
                            marginTop:
                              "6px",
                          }}
                        >
                          <p
                            style={{
                              color:
                                "#9ca3af",
                              margin: 0,
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
                                  fontSize:
                                    "14px",
                                  fontWeight:
                                    "bold",
                                }}
                              >
                                ⬅️ Out:
                                {" "}
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
                                  fontSize:
                                    "14px",
                                  fontWeight:
                                    "bold",
                                }}
                              >
                                🅰️ Assist:
                                {" "}
                                {
                                  event
                                    .assist
                                    .name
                                }
                              </p>
                            )}
                        </div>
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
                fontSize: "38px",
                marginBottom: "25px",
              }}
            >
              Tactical Lineups
            </h2>

            <div
              style={{
                background:
                  "linear-gradient(to bottom, #166534, #14532d)",
                borderRadius:
                  "25px",
                padding:
                  "40px 15px",
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
                  inset: "15px",
                  border:
                    "2px solid rgba(255,255,255,0.35)",
                  borderRadius:
                    "10px",
                }}
              />

              {/* MIDFIELD LINE */}
              <div
                style={{
                  position:
                    "absolute",
                  top: "50%",
                  left: "15px",
                  right: "15px",
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
                  width: "100px",
                  height:
                    "100px",
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
                  top: "15px",
                  left: "50%",
                  transform:
                    "translateX(-50%)",
                  width: "220px",
                  height:
                    "110px",
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
                  top: "15px",
                  left: "50%",
                  transform:
                    "translateX(-50%)",
                  width: "120px",
                  height: "55px",
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
                  bottom: "15px",
                  left: "50%",
                  transform:
                    "translateX(-50%)",
                  width: "220px",
                  height:
                    "110px",
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
                  bottom: "15px",
                  left: "50%",
                  transform:
                    "translateX(-50%)",
                  width: "120px",
                  height: "55px",
                  border:
                    "2px solid rgba(255,255,255,0.35)",
                  borderBottom:
                    "none",
                }}
              />

              {/* HOME TEAM */}
              <div
                style={{
                  marginBottom:
                    "70px",
                  position:
                    "relative",
                  zIndex: 2,
                }}
              >
                {renderRows(
                  homeRows
                )}
              </div>

              {/* AWAY TEAM */}
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