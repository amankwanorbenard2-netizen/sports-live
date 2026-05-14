"use client";

import { useEffect, useState } from "react";

const leagues = [

  {
    name: "Premier League",
    id: 4328,
  },

  {
    name: "La Liga",
    id: 4335,
  },

  {
    name: "Serie A",
    id: 4332,
  },

  {
    name: "Bundesliga",
    id: 4331,
  },

  {
    name: "Ligue 1",
    id: 4334,
  },

  {
    name: "Eredivisie",
    id: 4337,
  },

  {
    name: "MLS",
    id: 4346,
  },

  {
    name: "Champions League",
    id: 4480,
  },

  {
    name: "Europa League",
    id: 4481,
  },

  {
    name: "Portuguese League",
    id: 4391,
  },

  {
    name: "Scottish Premiership",
    id: 4330,
  },

  {
    name: "Brazil Serie A",
    id: 4344,
  },

];

export default function StandingsPage() {

  const [selectedLeague, setSelectedLeague] =
    useState(leagues[0]);

  const [table, setTable] = useState([]);

  const [loading, setLoading] = useState(true);

  async function fetchStandings(id) {

    setLoading(true);

    try {

      const response = await fetch(
        `https://www.thesportsdb.com/api/v1/json/3/lookuptable.php?l=${id}&s=2025-2026`,
        {
          cache: "no-store",
        }
      );

      const data = await response.json();

      let standings = data.table || [];

      standings = standings.sort(
        (a, b) =>
          Number(a.intRank) -
          Number(b.intRank)
      );

      setTable(standings);

    } catch (error) {

      console.log(error);

      setTable([]);

    } finally {

      setLoading(false);

    }

  }

  useEffect(() => {

    fetchStandings(selectedLeague.id);

  }, [selectedLeague]);

  return (

    <div
      style={{
        padding: "20px",
        color: "white",
      }}
    >

      {/* TITLE */}

      <h1
        style={{
          color: "#39ff14",
          fontSize: "40px",
          marginBottom: "25px",
        }}
      >
        League Standings
      </h1>

      {/* LEAGUE BUTTONS */}

      <div
        style={{
          display: "flex",
          gap: "10px",
          overflowX: "auto",
          marginBottom: "30px",
          paddingBottom: "10px",
        }}
      >

        {leagues.map((league) => (

          <button
            key={league.id}
            onClick={() =>
              setSelectedLeague(league)
            }
            style={{
              background:
                selectedLeague.id === league.id
                  ? "#39ff14"
                  : "#1e293b",

              color:
                selectedLeague.id === league.id
                  ? "black"
                  : "white",

              border: "none",
              borderRadius: "12px",
              padding: "12px 16px",
              cursor: "pointer",
              fontWeight: "bold",
              whiteSpace: "nowrap",
            }}
          >

            {league.name}

          </button>

        ))}

      </div>

      {/* TABLE */}

      {loading ? (

        <h2>Loading Standings...</h2>

      ) : table.length === 0 ? (

        <h2>No standings available</h2>

      ) : (

        <div
          style={{
            overflowX: "auto",
            width: "100%",
          }}
        >

          <table
            style={{
              width: "100%",
              minWidth: "1200px",
              borderCollapse: "collapse",
              background: "#1e293b",
              borderRadius: "15px",
              overflow: "hidden",
            }}
          >

            <thead>

              <tr
                style={{
                  background: "#111827",
                }}
              >

                <th style={thStyle}>#</th>
                <th style={thStyle}>Club</th>
                <th style={thStyle}>P</th>
                <th style={thStyle}>W</th>
                <th style={thStyle}>D</th>
                <th style={thStyle}>L</th>
                <th style={thStyle}>GF</th>
                <th style={thStyle}>GA</th>
                <th style={thStyle}>GD</th>
                <th style={thStyle}>PTS</th>

              </tr>

            </thead>

            <tbody>

              {table.map((team) => (

                <tr
                  key={team.idStanding}
                  style={{
                    borderBottom:
                      "1px solid #334155",
                  }}
                >

                  {/* POSITION */}

                  <td style={tdStyle}>
                    {team.intRank}
                  </td>

                  {/* TEAM */}

                  <td style={tdStyle}>

                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "10px",
                      }}
                    >

                      <img
                        src={
                          team.strBadge ||
                          "https://placehold.co/30"
                        }
                        alt=""
                        width="30"
                        height="30"
                      />

                      <span>
                        {team.strTeam}
                      </span>

                    </div>

                  </td>

                  {/* PLAYED */}

                  <td style={tdStyle}>
                    {team.intPlayed}
                  </td>

                  {/* WINS */}

                  <td style={tdStyle}>
                    {team.intWin}
                  </td>

                  {/* DRAWS */}

                  <td style={tdStyle}>
                    {team.intDraw}
                  </td>

                  {/* LOSSES */}

                  <td style={tdStyle}>
                    {team.intLoss}
                  </td>

                  {/* GOALS FOR */}

                  <td style={tdStyle}>
                    {team.intGoalsFor}
                  </td>

                  {/* GOALS AGAINST */}

                  <td style={tdStyle}>
                    {team.intGoalsAgainst}
                  </td>

                  {/* GOAL DIFFERENCE */}

                  <td style={tdStyle}>
                    {team.intGoalDifference}
                  </td>

                  {/* POINTS */}

                  <td
                    style={{
                      ...tdStyle,
                      color: "#39ff14",
                      fontWeight: "bold",
                    }}
                  >
                    {team.intPoints}
                  </td>

                </tr>

              ))}

            </tbody>

          </table>

        </div>

      )}

    </div>

  );

}

const thStyle = {

  padding: "15px",
  textAlign: "left",
  color: "#39ff14",

};

const tdStyle = {

  padding: "15px",

};