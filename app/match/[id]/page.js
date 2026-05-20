"use client";

import {
  useEffect,
  useState,
  use,
} from "react";

import "./match.css";

export default function MatchPage({
  params,
}) {

  const resolvedParams =
    use(params);

  const [match, setMatch] =
    useState(null);

  const [statistics, setStatistics] =
    useState([]);

  const [lineups, setLineups] =
    useState([]);

  const [events, setEvents] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [activeTab, setActiveTab] =
    useState("overview");

  // FETCH MATCH
  async function fetchMatch() {

    try {

      // MATCH
      const matchReq =
        await fetch(
          `/api/match?id=${resolvedParams.id}`
        );

      const matchJson =
        await matchReq.json();

      setMatch(
        matchJson.response?.[0] ||
        null
      );

      // STATS
      const statsReq =
        await fetch(
          `/api/match?id=${resolvedParams.id}&type=statistics`
        );

      const statsJson =
        await statsReq.json();

      setStatistics(
        statsJson.response || []
      );

      // LINEUPS
      const lineupReq =
        await fetch(
          `/api/match?id=${resolvedParams.id}&type=lineups`
        );

      const lineupJson =
        await lineupReq.json();

      setLineups(
        lineupJson.response || []
      );

      // EVENTS
      const eventsReq =
        await fetch(
          `/api/match?id=${resolvedParams.id}&type=events`
        );

      const eventsJson =
        await eventsReq.json();

      setEvents(
        eventsJson.response || []
      );

    } catch (error) {

      console.log(error);

    } finally {

      setLoading(false);

    }

  }

  // LOAD MATCH
  useEffect(() => {

    fetchMatch();

  }, [resolvedParams.id]);

  // AUTO REFRESH
  useEffect(() => {

    if (
      match?.fixture?.status
        ?.short === "1H" ||

      match?.fixture?.status
        ?.short === "2H" ||

      match?.fixture?.status
        ?.short === "HT" ||

      match?.fixture?.status
        ?.short === "LIVE"
    ) {

      const interval =
        setInterval(() => {

          fetchMatch();

        }, 60000);

      return () =>
        clearInterval(interval);

    }

  }, [
    match?.fixture?.status
      ?.short,
  ]);

  // ORGANIZE PLAYERS
  function organizePlayers(
    team,
    reverse = false
  ) {

    if (!team?.startXI)
      return [];

    const groupedRows = {};

    team.startXI.forEach(
      (playerData) => {

        const player =
          playerData.player;

        const grid =
          player.grid || "1:1";

        const [
          row,
          col,
        ] = grid
          .split(":")
          .map(Number);

        if (
          !groupedRows[row]
        ) {

          groupedRows[row] =
            [];

        }

        groupedRows[row].push({

          ...player,

          statistics:
            playerData.statistics,

          gridCol: col,

        });

      }
    );

    Object.keys(
      groupedRows
    ).forEach((rowKey) => {

      groupedRows[
        rowKey
      ].sort(
        (a, b) =>
          a.gridCol -
          b.gridCol
      );

    });

    let rows =
      Object.keys(
        groupedRows
      )
        .sort(
          (a, b) =>
            Number(a) -
            Number(b)
        )
        .map(
          (key) =>
            groupedRows[key]
        );

    if (reverse) {

      rows = rows.reverse();

    }

    return rows;

  }

  // LOADING
  if (loading || !match) {

    return (

      <div
        style={{
          background:
            "#071b2d",
          minHeight:
            "100vh",
          color: "white",
          display: "flex",
          justifyContent:
            "center",
          alignItems:
            "center",
          fontSize: "28px",
          fontWeight:
            "bold",
        }}
      >
        Loading Match...
      </div>

    );

  }

  const homeTeam =
    lineups[0];

  const awayTeam =
    lineups[1];

  const homeRows =
    organizePlayers(
      homeTeam,
      true
    );

  const awayRows =
    organizePlayers(
      awayTeam,
      false
    );
const pulseAnimation = `
@keyframes pulse {

  0% {
    opacity: 1;
    transform: scale(1);
  }

  50% {
    opacity: 0.3;
    transform: scale(0.7);
  }

  100% {
    opacity: 1;
    transform: scale(1);
  }

}
`;
  return (

    <div
      style={{
        background:
          "linear-gradient(to bottom,#071b2d,#0f172a)",
        minHeight:
          "100vh",
        color: "white",
        paddingBottom:
          "100px",
      }}
    >
<style>
  {pulseAnimation}
</style>
      {/* HEADER */}
      <div
        style={{
          padding: "25px",
          textAlign: "center",
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
              width: "35%",
            }}
          >

            <img
              src={
                match.teams.home.logo
              }
              width="80"
              alt=""
            />

            <h2>
              {
                match.teams.home.name
              }
            </h2>

          </div>

          {/* SCORE */}
          <div>

            <h1
              style={{
                fontSize:
                  "55px",
                margin: 0,
                color:
                  "#facc15",
              }}
            >
              {
                match.goals.home
              }
              {" - "}
              {
                match.goals.away
              }
            </h1>

            <div
              style={{
                marginTop:
                  "10px",
                background:
  match.fixture.status.short === "LIVE" ||
  match.fixture.status.short === "1H" ||
  match.fixture.status.short === "2H"
    ? "#ef4444"
    : "#334155",
                padding:
                  "6px 14px",
                borderRadius:
                  "999px",
                fontWeight:
                  "bold",
                display:
                  "inline-block",
                  boxShadow:
  match.fixture.status.short === "LIVE" ||
  match.fixture.status.short === "1H" ||
  match.fixture.status.short === "2H"
    ? "0 0 20px rgba(239,68,68,0.8)"
    : "none",
              }}
            >
             <>
  {(match.fixture.status.short === "LIVE" ||
    match.fixture.status.short === "1H" ||
    match.fixture.status.short === "2H") && (

    <span
      style={{
        display:
          "inline-block",

        width: "10px",

        height: "10px",

        borderRadius:
          "50%",

        background:
          "#fff",

        marginRight:
          "8px",

        animation:
          "pulse 1s infinite",
      }}
    />

  )}

  <div
  style={{
    display: "flex",
    alignItems: "center",
    gap: "8px",
  }}
>

  {(match?.fixture?.status?.short === "1H" ||
    match?.fixture?.status?.short === "2H" ||
    match?.fixture?.status?.short === "LIVE") && (

    <div
      style={{
        width: "10px",
        height: "10px",
        borderRadius: "50%",
        background: "white",
        animation:
          "pulse 1s infinite",
      }}
    />

  )}

  <span>
    {
      match.fixture.status.long
    }
  </span>

</div>
</>
            </div>

          </div>

          {/* AWAY */}
          <div
            style={{
              width: "35%",
            }}
          >

            <img
              src={
                match.teams.away.logo
              }
              width="80"
              alt=""
            />

            <h2>
              {
                match.teams.away.name
              }
            </h2>

          </div>

        </div>

      </div>

      {/* TABS */}
      <div
        style={{
          display: "flex",
          gap: "10px",
          overflowX: "auto",
          padding: "0 20px 20px",
        }}
      >

        {[
          "overview",
          "bench",
          "stats",
          "timeline",
          "commentary",
        ].map((tab) => (

          <button
            key={tab}
            onClick={() =>
              setActiveTab(tab)
            }
            style={{
              background:
                activeTab === tab
                  ? "#facc15"
                  : "#10263d",

              color:
                activeTab === tab
                  ? "#000"
                  : "#fff",

              border: "none",

              padding:
                "12px 18px",

              borderRadius:
                "12px",

              fontWeight:
                "bold",

              cursor: "pointer",

              textTransform:
                "capitalize",

              whiteSpace:
                "nowrap",
            }}
          >
            {tab}
          </button>

        ))}

      </div>

      {/* OVERVIEW */}
      {activeTab === "overview" && (

        <div
          style={{
            margin: "20px",
            background:
              "linear-gradient(to bottom,#169c43,#11853a)",
            borderRadius:
              "30px",
            position:
              "relative",
            overflow:
              "hidden",
            padding:
              "60px 10px",
            border:
              "4px solid rgba(255,255,255,0.15)",
          }}
        >

          {/* CENTER LINE */}
          <div
            style={{
              position:
                "absolute",
              top: "50%",
              left: 0,
              width: "100%",
              height: "4px",
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
              width: "200px",
              height: "200px",
              borderRadius:
                "50%",
              border:
                "4px solid rgba(255,255,255,0.35)",
              transform:
                "translate(-50%, -50%)",
            }}
          />

          {/* AWAY TEAM */}
          {awayRows.map(
            (
              row,
              rowIndex
            ) => (

              <div
                key={rowIndex}
                style={{
                  display:
                    "flex",
                  justifyContent:
                    "space-evenly",
                  alignItems:
                    "center",
                  marginBottom:
                    "70px",
                }}
              >

                {row.map(
                  (
                    player,
                    i
                  ) => (

                    <PlayerCard
                      key={i}
                      player={player}
                      statistics={
                        player.statistics
                      }
                    />

                  )
                )}

              </div>

            )
          )}

          {/* SPACE */}
          <div
            style={{
              height: "220px",
            }}
          />

          {/* HOME TEAM */}
          {homeRows.map(
            (
              row,
              rowIndex
            ) => (

              <div
                key={rowIndex}
                style={{
                  display:
                    "flex",
                  justifyContent:
                    "space-evenly",
                  alignItems:
                    "center",
                  marginBottom:
                    "70px",
                }}
              >

                {row.map(
                  (
                    player,
                    i
                  ) => (

                    <PlayerCard
                      key={i}
                      player={player}
                      statistics={
                        player.statistics
                      }
                    />

                  )
                )}

              </div>

            )
          )}

        </div>

      )}

      {/* BENCH */}
      {activeTab === "bench" && (

        <div
          style={{
            padding: "20px",
          }}
        >

          <h2
            style={{
              color: "#facc15",
              marginBottom:
                "20px",
            }}
          >
            Bench Players
          </h2>

          {/* HOME */}
          <h3>
            {
              homeTeam?.team?.name
            }
          </h3>

          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: "15px",
              marginBottom: "30px",
            }}
          >

            {homeTeam?.substitutes?.map(
              (
                playerData,
                index
              ) => (

                <PlayerCard
                  key={index}
                  player={
                    playerData.player
                  }
                  statistics={
                    playerData.statistics
                  }
                />

              )
            )}

          </div>

          {/* AWAY */}
          <h3>
            {
              awayTeam?.team?.name
            }
          </h3>

          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: "15px",
            }}
          >

            {awayTeam?.substitutes?.map(
              (
                playerData,
                index
              ) => (

                <PlayerCard
                  key={index}
                  player={
                    playerData.player
                  }
                  statistics={
                    playerData.statistics
                  }
                />

              )
            )}

          </div>

        </div>

      )}

      {/* STATS */}
      {activeTab === "stats" && (

        <div
          style={{
            padding: "20px",
          }}
        >

          <h2
            style={{
              color: "#facc15",
              marginBottom:
                "20px",
            }}
          >
            Match Statistics
          </h2>
{/* POSSESSION BAR */}
{statistics.length >= 2 && (

  <div
    style={{
      background: "#10263d",
      padding: "20px",
      borderRadius: "18px",
      marginBottom: "20px",
    }}
  >

    <h3
      style={{
        marginBottom: "20px",
        color: "#facc15",
      }}
    >
      Ball Possession
    </h3>

    {(() => {

      const homePossession =
        statistics[0]
          ?.statistics
          ?.find(
            (s) =>
              s.type ===
              "Ball Possession"
          )?.value || "0%";

      const awayPossession =
        statistics[1]
          ?.statistics
          ?.find(
            (s) =>
              s.type ===
              "Ball Possession"
          )?.value || "0%";

      const homeValue =
        parseInt(
          homePossession
        );

      const awayValue =
        parseInt(
          awayPossession
        );

      return (

        <>

          {/* TOP */}
          <div
            style={{
              display: "flex",
              justifyContent:
                "space-between",
              marginBottom:
                "10px",
              fontWeight:
                "bold",
            }}
          >

            <span>
              {
                match.teams.home
                  .name
              }
            </span>

            <span>
              Possession
            </span>

            <span>
              {
                match.teams.away
                  .name
              }
            </span>

          </div>

          {/* VALUES */}
          <div
            style={{
              display: "flex",
              justifyContent:
                "space-between",
              marginBottom:
                "10px",
              color: "#facc15",
              fontWeight:
                "bold",
            }}
          >

            <span>
              {homePossession}
            </span>

            <span>
              {awayPossession}
            </span>

          </div>

          {/* BAR */}
          <div
            style={{
              display: "flex",
              width: "100%",
              height: "18px",
              borderRadius:
                "999px",
              overflow:
                "hidden",
              background:
                "#1e293b",
            }}
          >

            {/* HOME */}
            <div
              style={{
                width:
                  `${homeValue}%`,
                background:
                  "#22c55e",
              }}
            />

            {/* AWAY */}
            <div
              style={{
                width:
                  `${awayValue}%`,
                background:
                  "#facc15",
              }}
            />

          </div>

        </>

      );

    })()}

  </div>

)}
          {statistics.map(
            (
              team,
              index
            ) => (

              <div
                key={index}
                style={{
                  background:
                    "#10263d",
                  padding:
                    "18px",
                  borderRadius:
                    "18px",
                  marginBottom:
                    "20px",
                }}
              >

                <h3>
                  {
                    team.team.name
                  }
                </h3>

                {team.statistics.map(
                  (
                    stat,
                    i
                  ) => (

                    <div
                      key={i}
                      style={{
                        display:
                          "flex",
                        justifyContent:
                          "space-between",
                        padding:
                          "8px 0",
                        borderBottom:
                          "1px solid rgba(255,255,255,0.08)",
                      }}
                    >

                      <span>
                        {stat.type}
                      </span>

                      <strong>
                        {stat.value || 0}
                      </strong>

                    </div>

                  )
                )}

              </div>

            )
          )}

        </div>

      )}

      {/* TIMELINE */}
      {activeTab === "timeline" && (

        <div
          style={{
            padding: "20px",
          }}
        >

          <h2
            style={{
              marginBottom:
                "20px",
              color: "#facc15",
            }}
          >
            Match Timeline
          </h2>

          {events.map(
            (
              event,
              index
            ) => {

              let icon = "📌";
              let bg = "#10263d";

              if (
                event.type ===
                "Goal"
              ) {

                icon = "⚽";
                bg = "#14532d";

              }

              else if (
                event.type ===
                "Card"
              ) {

                if (
                  event.detail ===
                  "Yellow Card"
                ) {

                  icon = "🟨";
                  bg = "#713f12";

                } else {

                  icon = "🟥";
                  bg = "#7f1d1d";

                }

              }

              else if (
                event.type ===
                "subst"
              ) {

                icon = "🔄";
                bg = "#1e3a8a";

              }

              return (

                <div
                  key={index}
                  style={{
                    background: bg,
                    padding: "18px",
                    borderRadius:
                      "18px",
                    marginBottom:
                      "16px",
                  }}
                >

                  <div
                    style={{
                      display:
                        "flex",
                      justifyContent:
                        "space-between",
                      marginBottom:
                        "10px",
                    }}
                  >

                    <strong>
                      {icon}
                      {" "}
                      {
                        event.time
                          ?.elapsed
                      }
                      '
                    </strong>

                    <span>
                      {
                        event.team
                          ?.name
                      }
                    </span>

                  </div>

                  {event.type ===
                  "subst" ? (

                    <div>

                      <div
                        style={{
                          color:
                            "#22c55e",
                          fontWeight:
                            "bold",
                        }}
                      >
                        IN:
                        {" "}
                        {
                          event.player
                            ?.name
                        }
                      </div>

                      <div
                        style={{
                          color:
                            "#ef4444",
                          marginTop:
                            "8px",
                          fontWeight:
                            "bold",
                        }}
                      >
                        OUT:
                        {" "}
                        {
                          event.assist
                            ?.name ||
                          "Unknown"
                        }
                      </div>

                    </div>

                  ) : (

                    <div>

                      <div
                        style={{
                          fontWeight:
                            "bold",
                          fontSize:
                            "18px",
                        }}
                      >
                        {
                          event.player
                            ?.name
                        }
                      </div>

                      <div
                        style={{
                          marginTop:
                            "6px",
                          color:
                            "#cbd5e1",
                        }}
                      >
                        {event.type}
                        {" - "}
                        {
                          event.detail
                        }
                      </div>

                      {event.assist
                        ?.name && (

                        <div
                          style={{
                            marginTop:
                              "8px",
                            color:
                              "#22c55e",
                            fontWeight:
                              "bold",
                          }}
                        >
                          Assist:
                          {" "}
                          {
                            event.assist
                              ?.name
                          }
                        </div>

                      )}

                    </div>

                  )}

                </div>

              );

            }
          )}

        </div>

      )}

      {/* COMMENTARY */}
      {activeTab === "commentary" && (

        <div
          style={{
            padding: "20px",
          }}
        >

          <h2
            style={{
              color: "#facc15",
              marginBottom:
                "20px",
            }}
          >
            Live Commentary
          </h2>

          {events.map(
            (
              event,
              index
            ) => (

              <div
                key={index}
                style={{
                  background:
                    "#10263d",
                  padding:
                    "18px",
                  borderRadius:
                    "18px",
                  marginBottom:
                    "16px",
                  borderLeft:
                    "5px solid #facc15",
                }}
              >

                <div
                  style={{
                    color:
                      "#facc15",
                    fontWeight:
                      "bold",
                    marginBottom:
                      "8px",
                  }}
                >
                  {
                    event.time
                      ?.elapsed
                  }
                  '
                </div>

                <div>

                  {/* GOAL */}
                  {event.type ===
                  "Goal" && (

                    <div>

                      ⚽ GOAL!

                      {" "}

                      <strong>
                        {
                          event.player
                            ?.name
                        }
                      </strong>

                      scored for{" "}

                      {
                        event.team
                          ?.name
                      }

                      {event.assist
                        ?.name && (

                        <>
                          {" "}
                          — Assist by{" "}

                          <strong>
                            {
                              event.assist
                                ?.name
                            }
                          </strong>
                        </>

                      )}

                    </div>

                  )}

                  {/* CARD */}
                  {event.type ===
                  "Card" && (

                    <div>

                      {event.detail ===
                      "Yellow Card"
                        ? "🟨"
                        : "🟥"}

                      {" "}

                      <strong>
                        {
                          event.player
                            ?.name
                        }
                      </strong>

                      received a{" "}

                      {
                        event.detail
                      }.

                    </div>

                  )}

                  {/* SUB */}
                  {event.type ===
                  "subst" && (

                    <div>

                      🔄 Substitution for{" "}

                      {
                        event.team
                          ?.name
                      }

                      <br />

                      IN:
                      {" "}

                      <strong>
                        {
                          event.player
                            ?.name
                        }
                      </strong>

                      <br />

                      OUT:
                      {" "}

                      <strong>
                        {
                          event.assist
                            ?.name ||
                          "Unknown"
                        }
                      </strong>

                    </div>

                  )}

                </div>

              </div>

            )
          )}

        </div>

      )}

    </div>

  );

}

function PlayerCard({
  player,
  statistics,
}) {

  // GET REAL PLAYER RATING
  let rating = null;

  // STARTING XI PLAYERS
  if (
    statistics &&
    statistics[0] &&
    statistics[0].games &&
    statistics[0].games.rating
  ) {

    rating =
      statistics[0]
        .games.rating;

  }

  // FALLBACK
  else if (
    player.statistics &&
    player.statistics[0] &&
    player.statistics[0].games &&
    player.statistics[0].games.rating
  ) {

    rating =
      player.statistics[0]
        .games.rating;

  }

  // REMOVE INVALID RATINGS
  if (
    rating === "0" ||
    rating === 0 ||
    rating === null ||
    rating === undefined
  ) {

    rating = null;

  }

  // FORMAT
  if (rating) {

    rating =
      Number(rating)
        .toFixed(1);

  }

  return (

    <div
      style={{
        textAlign:
          "center",
       width:
  window.innerWidth < 600
    ? "72px"
    : "90px",
        position:
          "relative",
      }}
    >

      {/* RATING */}
      {rating && (

        <div
          style={{
            position:
              "absolute",

            top: "-12px",

            left: "50%",

            transform:
              "translateX(-50%)",

            background:
              Number(rating) >= 7
                ? "#22c55e"
                : Number(rating) >= 6
                ? "#facc15"
                : "#ef4444",

            color:
              Number(rating) >= 6
                ? "#000"
                : "#fff",

            padding:
              "4px 8px",

            borderRadius:
              "999px",

            fontSize:
              "12px",

            fontWeight:
              "bold",

            zIndex: 10,
          }}
        >
          {rating}
        </div>

      )}

      {/* PLAYER IMAGE */}
      <img
        src={`https://media.api-sports.io/football/players/${player.id}.png`}
        alt={
          player.name
        }
        style={{
         width:
  window.innerWidth < 600
    ? "58px"
    : "72px",

height:
  window.innerWidth < 600
    ? "58px"
    : "72px",
          borderRadius:
            "50%",
          objectFit:
            "cover",
          border:
            "3px solid white",
          background:
            "#fff",
        }}
      />

      {/* NAME */}
      <div
        style={{
          marginTop:
            "8px",
          fontSize:
  window.innerWidth < 600
    ? "10px"
    : "13px",
          fontWeight:
            "bold",
         lineHeight:
  window.innerWidth < 600
    ? "12px"
    : "16px",
        }}
      >
        {player.name}
      </div>

      {/* NUMBER */}
      <div
        style={{
          fontSize:
  window.innerWidth < 600
    ? "10px"
    : "12px",
          opacity: 0.85,
        }}
      >
        #{player.number}
      </div>

    </div>

  );

}