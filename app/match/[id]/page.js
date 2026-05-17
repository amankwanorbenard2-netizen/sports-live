"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

function PlayerCard({
  player,
}) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection:
          "column",
        alignItems:
          "center",
        width: "90px",
      }}
    >
      <div
        style={{
          background:
            "#facc15",
          color: "black",
          fontWeight:
            "900",
          fontSize: "13px",
          padding: "4px 8px",
          borderRadius: "8px",
          marginBottom: "-8px",
          zIndex: 2,
        }}
      >
        6.5
      </div>

      <div
        className="pitch-player"
        style={{
          width: "74px",
          height: "74px",
          borderRadius:
            "50%",
          overflow:
            "hidden",
          border:
            "3px solid white",
          background:
            "white",
        }}
      >
        <img
          src={`https://media.api-sports.io/football/players/${player?.player?.id}.png`}
          width="74"
          height="74"
          alt=""
        />
      </div>

      <p
        style={{
          marginTop: "8px",
          fontSize: "12px",
          fontWeight:
            "bold",
          textAlign:
            "center",
          color: "white",
        }}
      >
        {
          player?.player
            ?.name
        }
      </p>

      <span
        style={{
          color: "#d1d5db",
          fontSize: "11px",
        }}
      >
        #
        {
          player?.player
            ?.number
        }
      </span>
    </div>
  );
}

export default function MatchPage() {
  const params = useParams();

  const [match, setMatch] =
    useState(null);

  const [players, setPlayers] =
    useState([]);

  const [statistics, setStatistics] =
    useState([]);

  const [lineups, setLineups] =
    useState([]);

  const [events, setEvents] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  useEffect(() => {
    if (!params?.id) return;

    async function fetchMatch() {
      try {
        setLoading(true);

        // MATCH
        const matchRes =
          await fetch(
            `/api/match?id=${params.id}`
          );

        const matchData =
          await matchRes.json();

        setMatch(
          matchData?.response?.[0] ||
            null
        );

        // PLAYERS
        const playersRes =
          await fetch(
            `/api/match?id=${params.id}&type=players`
          );

        const playersData =
          await playersRes.json();

        setPlayers(
          playersData?.response ||
            []
        );

        // STATISTICS
        const statsRes =
          await fetch(
            `/api/match?id=${params.id}&type=statistics`
          );

        const statsData =
          await statsRes.json();

        setStatistics(
          statsData?.response ||
            []
        );

        // LINEUPS
        const lineupsRes =
          await fetch(
            `/api/match?id=${params.id}&type=lineups`
          );

        const lineupsData =
          await lineupsRes.json();

        setLineups(
          lineupsData?.response ||
            []
        );

        // EVENTS
        const eventsRes =
          await fetch(
            `/api/match?id=${params.id}&type=events`
          );

        const eventsData =
          await eventsRes.json();

        setEvents(
          eventsData?.response ||
            []
        );
      } catch (error) {
        console.log(error);
      }

      setLoading(false);
    }

    fetchMatch();

    const interval =
      setInterval(() => {
        fetchMatch();
      }, 60000);

    return () =>
      clearInterval(interval);
  }, [params]);

  if (loading || !match) {
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
          fontSize: "30px",
          fontWeight: "bold",
        }}
      >
        Loading Match...
      </div>
    );
  }

  return (
    <div
      style={{
        background:
          "linear-gradient(to bottom,#020617,#111827)",
        minHeight: "100vh",
        padding: "16px",
        paddingBottom: "120px",
        color: "white",
      }}
    >
      {/* HEADER */}
      <div
        style={{
          background:
            "linear-gradient(to right,#1e293b,#0f172a)",
          borderRadius:
            "24px",
          padding: "24px",
          marginBottom: "30px",
          boxShadow:
            "0 0 25px rgba(0,0,0,0.45)",
        }}
      >
        <div
          style={{
            display: "flex",
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
                match?.teams?.home
                  ?.logo
              }
              width="80"
              alt=""
            />

            <h2
              style={{
                marginTop: "12px",
              }}
            >
              {match?.teams?.home
                ?.name}
            </h2>
          </div>

          {/* SCORE */}
          <div
            style={{
              textAlign:
                "center",
              minWidth: "150px",
            }}
          >
            <div
              style={{
                background:
                  "#ef4444",
                display:
                  "inline-block",
                padding:
                  "6px 14px",
                borderRadius:
                  "999px",
                fontWeight:
                  "bold",
                marginBottom:
                  "10px",
                animation:
                  "pulse 1s infinite",
              }}
            >
              {match?.fixture
                ?.status?.long}
            </div>

            <h1
              style={{
                fontSize: "54px",
                color: "#22c55e",
              }}
            >
              {match?.goals
                ?.home ?? 0}{" "}
              -{" "}
              {match?.goals
                ?.away ?? 0}
            </h1>
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
                match?.teams?.away
                  ?.logo
              }
              width="80"
              alt=""
            />

            <h2
              style={{
                marginTop: "12px",
              }}
            >
              {match?.teams?.away
                ?.name}
            </h2>
          </div>
        </div>
      </div>

      {/* EVENTS */}
      <h2
        style={{
          color: "#facc15",
          fontSize: "30px",
          marginBottom: "20px",
        }}
      >
        Match Events
      </h2>

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "14px",
          marginBottom: "40px",
        }}
      >
        {events.map(
          (event, index) => {
            let icon = "⚽";

            if (
              event.type ===
              "Card"
            ) {
              icon =
                event.detail ===
                "Yellow Card"
                  ? "🟨"
                  : "🟥";
            }

            if (
              event.type ===
              "subst"
            ) {
              icon = "🔄";
            }

            return (
              <div
                key={index}
                className="event-card"
                style={{
                  background:
                    "#1e293b",
                  borderRadius:
                    "18px",
                  padding:
                    "16px",
                  display: "flex",
                  justifyContent:
                    "space-between",
                  alignItems:
                    "center",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems:
                      "center",
                    gap: "14px",
                  }}
                >
                  <div
                    style={{
                      fontSize:
                        "28px",
                    }}
                  >
                    {icon}
                  </div>

                  <div>
                    <h3
                      style={{
                        margin: 0,
                      }}
                    >
                      {
                        event
                          ?.player
                          ?.name
                      }
                    </h3>

                    <p
                      style={{
                        margin: 0,
                        color:
                          "#94a3b8",
                        fontSize:
                          "13px",
                      }}
                    >
                      {
                        event
                          ?.team
                          ?.name
                      }
                    </p>

                    {event
                      ?.assist
                      ?.name && (
                      <p
                        style={{
                          margin: 0,
                          color:
                            "#22c55e",
                          fontSize:
                            "12px",
                        }}
                      >
                        Assist:{" "}
                        {
                          event
                            ?.assist
                            ?.name
                        }
                      </p>
                    )}
                  </div>
                </div>

                <div
                  style={{
                    background:
                      "#facc15",
                    color:
                      "black",
                    padding:
                      "8px 14px",
                    borderRadius:
                      "999px",
                    fontWeight:
                      "900",
                  }}
                >
                  {event?.time
                    ?.elapsed ||
                    0}
                  '
                </div>
              </div>
            );
          }
        )}
      </div>

      {/* PLAYER RATINGS */}
      <h2
        style={{
          color: "#facc15",
          fontSize: "30px",
          marginBottom: "20px",
        }}
      >
        Player Ratings
      </h2>

      {players?.map(
        (team, index) => (
          <div
            key={index}
            style={{
              marginBottom:
                "30px",
            }}
          >
            <h3
              style={{
                color: "#22c55e",
                marginBottom:
                  "16px",
              }}
            >
              {team?.team?.name}
            </h3>

            <div
              style={{
                display: "grid",
                gridTemplateColumns:
                  "repeat(auto-fit,minmax(220px,1fr))",
                gap: "14px",
              }}
            >
              {team?.players?.map(
                (
                  player,
                  playerIndex
                ) => (
                  <div
                    key={
                      playerIndex
                    }
                    className="player-card"
                    style={{
                      background:
                        "#1e293b",
                      borderRadius:
                        "18px",
                      padding:
                        "16px",
                    }}
                  >
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
                      <div>
                        <h4>
                          {player
                            ?.player
                            ?.name}
                        </h4>

                        <p
                          style={{
                            color:
                              "#94a3b8",
                          }}
                        >
                          #
                          {player
                            ?.player
                            ?.number}
                        </p>
                      </div>

                      <div
                        style={{
                          background:
                            "#22c55e",
                          color:
                            "black",
                          width:
                            "44px",
                          height:
                            "44px",
                          borderRadius:
                            "50%",
                          display:
                            "flex",
                          justifyContent:
                            "center",
                          alignItems:
                            "center",
                          fontWeight:
                            "900",
                        }}
                      >
                        {player
                          ?.statistics?.[0]
                          ?.games
                          ?.rating ||
                          "-"}
                      </div>
                    </div>
                  </div>
                )
              )}
            </div>
          </div>
        )
      )}

      {/* STATISTICS */}
      <h2
        style={{
          color: "#facc15",
          fontSize: "30px",
          marginBottom: "20px",
        }}
      >
        Match Statistics
      </h2>

      {statistics?.map(
        (team, index) => (
          <div
            key={index}
            style={{
              background:
                "#1e293b",
              borderRadius:
                "18px",
              padding: "18px",
              marginBottom:
                "18px",
            }}
          >
            <h3
              style={{
                color: "#22c55e",
                marginBottom:
                  "14px",
              }}
            >
              {team?.team?.name}
            </h3>

            {team?.statistics?.map(
              (
                stat,
                statIndex
              ) => (
                <div
                  key={statIndex}
                  style={{
                    display:
                      "flex",
                    justifyContent:
                      "space-between",
                    marginBottom:
                      "10px",
                  }}
                >
                  <span>
                    {stat?.type}
                  </span>

                  <strong>
                    {stat?.value ||
                      0}
                  </strong>
                </div>
              )
            )}
          </div>
        )
      )}

      {/* LINEUPS */}
      <h2
        style={{
          color: "#facc15",
          fontSize: "30px",
          marginBottom: "20px",
          marginTop: "40px",
        }}
      >
        Match Lineups
      </h2>

      {lineups.length >= 2 && (
        <div
          style={{
            background:
              "linear-gradient(to bottom,#15803d,#166534)",
            borderRadius:
              "30px",
            padding:
              "30px 15px",
            position:
              "relative",
            overflow:
              "hidden",
            border:
              "4px solid rgba(255,255,255,0.08)",
            minHeight: "1400px",
          }}
        >
          {/* CENTER LINE */}
          <div
            style={{
              position:
                "absolute",
              top: "50%",
              left: 0,
              right: 0,
              height: "3px",
              background:
                "rgba(255,255,255,0.25)",
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
                "translate(-50%,-50%)",
              width: "180px",
              height: "180px",
              borderRadius:
                "50%",
              border:
                "3px solid rgba(255,255,255,0.25)",
            }}
          />

          {/* HOME */}
          <div
            style={{
              marginBottom:
                "180px",
            }}
          >
            {(() => {
              const formation =
                lineups[0]
                  ?.formation ||
                "4-3-3";

              const rows =
                formation
                  .split("-")
                  .map(Number);

              const players =
                lineups[0]
                  ?.startXI ||
                [];

              const goalkeeper =
                players[0];

              let start = 1;

              return (
                <>
                  <div
                    style={{
                      display:
                        "flex",
                      justifyContent:
                        "center",
                      marginBottom:
                        "50px",
                    }}
                  >
                    <PlayerCard
                      player={
                        goalkeeper
                      }
                    />
                  </div>

                  {rows.map(
                    (
                      rowCount,
                      rowIndex
                    ) => {
                      const rowPlayers =
                        players.slice(
                          start,
                          start +
                            rowCount
                        );

                      start +=
                        rowCount;

                      return (
                        <div
                          key={
                            rowIndex
                          }
                          style={{
                            display:
                              "flex",
                            justifyContent:
                              "space-evenly",
                            alignItems:
                              "center",
                            marginBottom:
                              "55px",
                          }}
                        >
                          {rowPlayers.map(
                            (
                              player,
                              i
                            ) => (
                              <PlayerCard
                                key={
                                  i
                                }
                                player={
                                  player
                                }
                              />
                            )
                          )}
                        </div>
                      );
                    }
                  )}
                </>
              );
            })()}
          </div>

          {/* AWAY */}
          <div>
            {(() => {
              const formation =
                lineups[1]
                  ?.formation ||
                "4-3-3";

              const rows =
                formation
                  .split("-")
                  .map(Number);

              const players =
                lineups[1]
                  ?.startXI ||
                [];

              const goalkeeper =
                players[0];

              let start = 1;

              return (
                <>
                  {rows
                    .slice()
                    .reverse()
                    .map(
                      (
                        rowCount,
                        rowIndex
                      ) => {
                        const rowPlayers =
                          players.slice(
                            start,
                            start +
                              rowCount
                          );

                        start +=
                          rowCount;

                        return (
                          <div
                            key={
                              rowIndex
                            }
                            style={{
                              display:
                                "flex",
                              justifyContent:
                                "space-evenly",
                              alignItems:
                                "center",
                              marginBottom:
                                "55px",
                            }}
                          >
                            {rowPlayers.map(
                              (
                                player,
                                i
                              ) => (
                                <PlayerCard
                                  key={
                                    i
                                  }
                                  player={
                                    player
                                  }
                                />
                              )
                            )}
                          </div>
                        );
                      }
                    )}

                  <div
                    style={{
                      display:
                        "flex",
                      justifyContent:
                        "center",
                      marginTop:
                        "40px",
                    }}
                  >
                    <PlayerCard
                      player={
                        goalkeeper
                      }
                    />
                  </div>
                </>
              );
            })()}
          </div>
        </div>
      )}

      {/* STYLES */}
      <style jsx>{`
        @keyframes pulse {
          0% {
            transform: scale(1);
          }

          50% {
            transform: scale(1.05);
          }

          100% {
            transform: scale(1);
          }
        }

        .player-card:hover {
          transform: translateY(-5px)
            scale(1.02);

          transition: 0.3s;

          box-shadow:
            0 0 20px
              rgba(
                250,
                204,
                21,
                0.45
              );
        }

        .pitch-player:hover {
          transform: scale(1.08);

          transition: 0.3s;

          box-shadow:
            0 0 25px
              rgba(
                250,
                204,
                21,
                0.75
              );
        }

        .event-card:hover {
          transform: translateY(-4px);

          transition: 0.3s;

          box-shadow:
            0 0 22px
              rgba(
                250,
                204,
                21,
                0.4
              );
        }
      `}</style>
    </div>
  );
}