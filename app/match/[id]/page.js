"use client";

import {
  useEffect,
  useState,
  use,
} from "react";

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

  // AUTO REFRESH ONLY LIVE MATCHES
  useEffect(() => {
    if (
      match?.fixture?.status
        ?.short === "1H" ||
      match?.fixture?.status
        ?.short === "2H" ||
      match?.fixture?.status
        ?.short === "HT" ||
      match?.fixture?.status
        ?.short === "ET" ||
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

  // FORMATION BUILDER
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

    // SORT LEFT TO RIGHT
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

    // AWAY TEAM
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
          minHeight: "100vh",
          color: "white",
          display: "flex",
          justifyContent:
            "center",
          alignItems:
            "center",
          fontSize: "28px",
          fontWeight: "bold",
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

  return (
    <div
      style={{
        background:
          "linear-gradient(to bottom,#071b2d,#0f172a)",
        minHeight: "100vh",
        color: "white",
        paddingBottom: "100px",
      }}
    >
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
                match.teams.home
                  .logo
              }
              width="80"
              alt=""
            />

            <h2>
              {
                match.teams.home
                  .name
              }
            </h2>
          </div>

          {/* SCORE */}
          <div>
            <h1
              style={{
                fontSize: "55px",
                margin: 0,
                color: "#facc15",
              }}
            >
              {
                match.goals
                  .home
              }{" "}
              -{" "}
              {
                match.goals
                  .away
              }
            </h1>

            <div
              style={{
                marginTop: "10px",
                background:
                  "#ef4444",
                padding:
                  "6px 14px",
                borderRadius:
                  "999px",
                fontWeight:
                  "bold",
                display:
                  "inline-block",
              }}
            >
              {
                match.fixture
                  .status.long
              }
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
                match.teams.away
                  .logo
              }
              width="80"
              alt=""
            />

            <h2>
              {
                match.teams.away
                  .name
              }
            </h2>
          </div>
        </div>
      </div>

      {/* FOOTBALL PITCH */}
      <div
        style={{
          margin: "20px",
          background:
            "linear-gradient(to bottom,#169c43,#11853a)",
          borderRadius: "30px",
          position: "relative",
          overflow: "hidden",
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

        {/* TOP PENALTY BOX */}
        <div
          style={{
            position:
              "absolute",
            top: 0,
            left: "50%",
            width: "420px",
            height: "180px",
            border:
              "4px solid rgba(255,255,255,0.35)",
            transform:
              "translateX(-50%)",
          }}
        />

        {/* BOTTOM PENALTY BOX */}
        <div
          style={{
            position:
              "absolute",
            bottom: 0,
            left: "50%",
            width: "420px",
            height: "180px",
            border:
              "4px solid rgba(255,255,255,0.35)",
            transform:
              "translateX(-50%)",
          }}
        />

        {/* AWAY TEAM */}
        {awayRows.map(
          (row, rowIndex) => (
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
                  "80px",
              }}
            >
              {row.map(
                (
                  player,
                  i
                ) => (
                  <PlayerCard
                    key={i}
                    player={
                      player
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
          (row, rowIndex) => (
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
                  "80px",
              }}
            >
              {row.map(
                (
                  player,
                  i
                ) => (
                  <PlayerCard
                    key={i}
                    player={
                      player
                    }
                  />
                )
              )}
            </div>
          )
        )}
      </div>

      {/* STATISTICS */}
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
          Match Statistics
        </h2>

        {statistics.map(
          (team, index) => (
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
                  team.team
                    .name
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
                      {
                        stat.type
                      }
                    </span>

                    <strong>
                      {stat.value ||
                        0}
                    </strong>
                  </div>
                )
              )}
            </div>
          )
        )}
      </div>

      {/* EVENTS */}
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
          Match Events
        </h2>

        {events.map(
          (event, index) => (
            <div
              key={index}
              style={{
                background:
                  "#10263d",
                padding:
                  "16px",
                borderRadius:
                  "16px",
                marginBottom:
                  "14px",
              }}
            >
              <div
                style={{
                  display:
                    "flex",
                  justifyContent:
                    "space-between",
                }}
              >
                <strong>
                  {
                    event.time
                      .elapsed
                  }
                  '
                </strong>

                <strong>
                  {
                    event.team
                      .name
                  }
                </strong>
              </div>

              <div
                style={{
                  marginTop:
                    "8px",
                  fontWeight:
                    "bold",
                }}
              >
                {
                  event.player
                    ?.name
                }
              </div>

              <div
                style={{
                  color:
                    "#cbd5e1",
                }}
              >
                {event.type}{" "}
                -{" "}
                {
                  event.detail
                }
              </div>

              {event.assist
                ?.name && (
                <div
                  style={{
                    marginTop:
                      "4px",
                    color:
                      "#22c55e",
                  }}
                >
                  Assist:{" "}
                  {
                    event
                      .assist
                      .name
                  }
                </div>
              )}
            </div>
          )
        )}
      </div>
    </div>
  );
}

// PLAYER CARD
function PlayerCard({
  player,
}) {
  const rating =
    player.statistics?.[0]
      ?.games?.rating ||
    player.rating ||
    "6.5";

  return (
    <div
      style={{
        textAlign: "center",
        width: "90px",
      }}
    >
      {/* RATING */}
      <div
        style={{
          background:
            Number(rating) >= 7
              ? "#22c55e"
              : Number(
                    rating
                  ) >= 6
              ? "#facc15"
              : "#ef4444",

          color:
            Number(rating) >= 6
              ? "#000"
              : "#fff",

          display:
            "inline-block",

          padding:
            "4px 8px",

          borderRadius:
            "10px",

          fontWeight:
            "bold",

          marginBottom:
            "-6px",

          position:
            "relative",

          zIndex: 2,
        }}
      >
        {rating}
      </div>

      {/* PHOTO */}
      <img
        src={`https://media.api-sports.io/football/players/${player.id}.png`}
        alt={
          player.name
        }
        style={{
          width: "72px",
          height: "72px",
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
          marginTop: "8px",
          fontSize: "13px",
          fontWeight: "bold",
          lineHeight:
            "16px",
          textShadow:
            "0 2px 5px rgba(0,0,0,0.7)",
        }}
      >
        {player.name}
      </div>

      {/* NUMBER */}
      <div
        style={{
          fontSize: "12px",
          opacity: 0.85,
        }}
      >
        #{player.number}
      </div>
    </div>
  );
}