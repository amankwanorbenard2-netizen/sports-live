"use client";

import {
  useEffect,
  useState,
  use,
} from "react";

export default function LeagueTablePage({
  params,
}) {
  const resolvedParams =
    use(params);

  const [table, setTable] =
    useState([]);

  const [league, setLeague] =
    useState(null);

  useEffect(() => {
    fetchTable();
  }, [resolvedParams.league]);

  async function fetchTable() {
    try {
      const res =
        await fetch(
          `/api/standings?league=${resolvedParams.league}`
        );

      const data =
        await res.json();

      const standings =
        data.response?.[0]
          ?.league;

      setLeague(standings);

      setTable(
        standings
          ?.standings?.[0] ||
          []
      );
    } catch (err) {
      console.log(err);
    }
  }

  return (
    <div
      style={{
        background:
          "#071b2d",
        minHeight: "100vh",
        color: "white",
        padding: "20px",
        paddingBottom:
          "100px",
      }}
    >
      {league && (
        <>
          {/* HEADER */}
          <div
            style={{
              display: "flex",
              alignItems:
                "center",
              gap: "15px",
              marginBottom:
                "25px",
            }}
          >
            <img
              src={league.logo}
              width="50"
              alt=""
            />

            <h1>
              {league.name}
            </h1>
          </div>

          {/* TABLE */}
          <div
            style={{
              background:
                "#10263d",
              borderRadius:
                "20px",
              overflow:
                "hidden",
            }}
          >
            {table.map(
              (team) => (
                <div
                  key={
                    team.team.id
                  }
                  style={{
                    display:
                      "grid",
                    gridTemplateColumns:
                      "40px 1fr 50px 50px",
                    alignItems:
                      "center",
                    gap: "10px",
                    padding:
                      "14px",
                    borderBottom:
                      "1px solid rgba(255,255,255,0.06)",
                  }}
                >
                  <strong>
                    {
                      team.rank
                    }
                  </strong>

                  <div
                    style={{
                      display:
                        "flex",
                      alignItems:
                        "center",
                      gap: "10px",
                    }}
                  >
                    <img
                      src={
                        team.team
                          .logo
                      }
                      width="26"
                      alt=""
                    />

                    <span>
                      {
                        team.team
                          .name
                      }
                    </span>
                  </div>

                  <span>
                    {
                      team.all
                        .played
                    }
                  </span>

                  <strong>
                    {
                      team.points
                    }
                  </strong>
                </div>
              )
            )}
          </div>
        </>
      )}
    </div>
  );
}