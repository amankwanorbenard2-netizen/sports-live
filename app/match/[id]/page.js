"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

export default function MatchDetails() {
  const params = useParams();
  const id = params.id;

  const [data, setData] = useState(null);

  useEffect(() => {
    async function fetchData() {
      const res = await fetch(`/api/match?id=${id}`);
      const result = await res.json();

      setData(result);
    }

    if (id) {
      fetchData();
    }
  }, [id]);

  if (!data) {
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
        }}
      >
        Loading...
      </div>
    );
  }

  const match = data.event;
  const statistics = data.statistics || [];
  const lineups = data.lineups || [];
  const events = data.events || [];

  return (
    <div
      style={{
        background: "#111827",
        color: "white",
        minHeight: "100vh",
        paddingBottom: "100px",
      }}
    >
      {/* HEADER */}
      <div
        style={{
          padding: "20px",
          borderBottom: "1px solid #374151",
        }}
      >
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

      {/* TEAMS */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-around",
          alignItems: "center",
          padding: "40px",
          flexWrap: "wrap",
          gap: "30px",
        }}
      >
        {/* HOME */}
        <div style={{ textAlign: "center" }}>
          <img src={match.teams.home.logo} width="120" />

          <h2>{match.teams.home.name}</h2>
        </div>

        {/* SCORE */}
        <div style={{ textAlign: "center" }}>
          <h1
            style={{
              fontSize: "70px",
              color: "#facc15",
            }}
          >
            {match.goals.home} - {match.goals.away}
          </h1>

          <p style={{ color: "#22c55e" }}>
            {match.fixture.status.long}
          </p>
        </div>

        {/* AWAY */}
        <div style={{ textAlign: "center" }}>
          <img src={match.teams.away.logo} width="120" />

          <h2>{match.teams.away.name}</h2>
        </div>
      </div>

      {/* MATCH INFO */}
      <div
        style={{
          background: "#1f2937",
          margin: "20px",
          padding: "25px",
          borderRadius: "20px",
        }}
      >
        <h2 style={{ color: "#facc15" }}>
          Match Information
        </h2>

        <p>
          Date:{" "}
          {new Date(match.fixture.date).toLocaleString()}
        </p>

        <p>
          Referee: {match.fixture.referee || "Unknown"}
        </p>

        <p>
          Stadium: {match.fixture.venue?.name || "Unknown"}
        </p>

        <p>
          City: {match.fixture.venue?.city || "Unknown"}
        </p>
      </div>

      {/* STATISTICS */}
      <div
        style={{
          background: "#1f2937",
          margin: "20px",
          padding: "25px",
          borderRadius: "20px",
        }}
      >
        <h2 style={{ color: "#facc15" }}>
          Match Statistics
        </h2>

        {statistics.map((teamStats, index) => (
          <div
            key={index}
            style={{
              marginTop: "20px",
            }}
          >
            <h3>{teamStats.team.name}</h3>

            {teamStats.statistics.map((stat, i) => (
              <div
                key={i}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  padding: "8px 0",
                  borderBottom: "1px solid #374151",
                }}
              >
                <span>{stat.type}</span>

                <span>{stat.value || 0}</span>
              </div>
            ))}
          </div>
        ))}
      </div>

      {/* LINEUPS */}
      <div
        style={{
          background: "#1f2937",
          margin: "20px",
          padding: "25px",
          borderRadius: "20px",
        }}
      >
        <h2 style={{ color: "#facc15" }}>
          Starting Lineups
        </h2>

        {lineups.map((team, index) => (
          <div
            key={index}
            style={{
              marginTop: "30px",
            }}
          >
            <h3>{team.team.name}</h3>

            {team.startXI.map((player, i) => (
              <p key={i}>
                {player.player.number} -{" "}
                {player.player.name}
              </p>
            ))}
          </div>
        ))}
      </div>

      {/* EVENTS */}
      <div
        style={{
          background: "#1f2937",
          margin: "20px",
          padding: "25px",
          borderRadius: "20px",
        }}
      >
        <h2 style={{ color: "#facc15" }}>
          Match Events
        </h2>

        {events.map((event, index) => (
          <div
            key={index}
            style={{
              borderBottom: "1px solid #374151",
              padding: "10px 0",
            }}
          >
            <p>
              {event.time.elapsed}' - {event.team.name}
            </p>

            <p>
              {event.type} - {event.detail}
            </p>

            <p>{event.player?.name}</p>
          </div>
        ))}
      </div>
    </div>
  );
}