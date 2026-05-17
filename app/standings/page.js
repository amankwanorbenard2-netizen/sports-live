"use client";

import { useEffect, useState } from "react";

export default function StandingsPage() {
  const [tables, setTables] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStandings() {
      try {
        const res = await fetch("/api/standings");
        const data = await res.json();

        if (data.response) {
          setTables(data.response);
        }
      } catch (error) {
        console.log(error);
      }

      setLoading(false);
    }

    fetchStandings();
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
        Loading Tables...
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
          color: "#a855f7",
          fontSize: "55px",
          marginBottom: "30px",
        }}
      >
        🏆 League Tables
      </h1>

      {tables.map((leagueData, index) => (
        <div
          key={index}
          style={{
            background: "#1f2937",
            borderRadius: "20px",
            padding: "20px",
            marginBottom: "40px",
            overflowX: "auto",
          }}
        >
          {/* LEAGUE HEADER */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "15px",
              marginBottom: "25px",
            }}
          >
            <img
              src={leagueData.league.logo}
              width="50"
            />

            <div>
              <h2
                style={{
                  color: "#22c55e",
                  margin: 0,
                }}
              >
                {leagueData.league.name}
              </h2>

              <p
                style={{
                  color: "#9ca3af",
                  marginTop: "5px",
                }}
              >
                {leagueData.league.country}
              </p>
            </div>
          </div>

          {/* TABLE */}
          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
              minWidth: "700px",
            }}
          >
            <thead>
              <tr
                style={{
                  background: "#374151",
                }}
              >
                <th style={thStyle}>#</th>
                <th style={thStyle}>Team</th>
                <th style={thStyle}>Pts</th>
                <th style={thStyle}>P</th>
                <th style={thStyle}>W</th>
                <th style={thStyle}>D</th>
                <th style={thStyle}>L</th>
                <th style={thStyle}>GD</th>
              </tr>
            </thead>

            <tbody>
              {leagueData.league.standings[0]?.map(
                (team) => (
                  <tr
                    key={team.team.id}
                    style={{
                      borderBottom:
                        "1px solid #374151",
                      transition: "0.3s",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background =
                        "#374151";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background =
                        "transparent";
                    }}
                  >
                    <td style={tdStyle}>
                      {team.rank}
                    </td>

                    <td style={tdStyle}>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "10px",
                        }}
                      >
                        <img
                          src={team.team.logo}
                          width="28"
                        />

                        {team.team.name}
                      </div>
                    </td>

                    <td style={tdStyle}>
                      {team.points}
                    </td>

                    <td style={tdStyle}>
                      {team.all.played}
                    </td>

                    <td style={tdStyle}>
                      {team.all.win}
                    </td>

                    <td style={tdStyle}>
                      {team.all.draw}
                    </td>

                    <td style={tdStyle}>
                      {team.all.lose}
                    </td>

                    <td style={tdStyle}>
                      {team.goalsDiff}
                    </td>
                  </tr>
                )
              )}
            </tbody>
          </table>
        </div>
      ))}
    </div>
  );
}

const thStyle = {
  padding: "15px",
  textAlign: "left",
  color: "#facc15",
};

const tdStyle = {
  padding: "15px",
};