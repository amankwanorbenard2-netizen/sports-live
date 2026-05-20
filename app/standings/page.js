"use client";

import {
  useEffect,
  useState,
} from "react";

export default function StandingsPage() {
  const [countries, setCountries] =
    useState([]);

  const [searchTeam, setSearchTeam] =
    useState("");

  const [openedCountry, setOpenedCountry] =
    useState(null);

  const [openedLeague, setOpenedLeague] =
    useState(null);

  const [leagueTable, setLeagueTable] =
    useState(null);

  const [loading, setLoading] =
    useState(true);

  // FETCH LEAGUES
  useEffect(() => {
    async function fetchLeagues() {
      try {
        const res =
          await fetch(
            "/api/leagues"
          );

        const data =
          await res.json();

        if (
          data.response
        ) {
          // GROUP BY COUNTRY
          const grouped =
            {};

          data.response.forEach(
            (item) => {
              const country =
                item.country
                  .name;

              if (
                !grouped[
                  country
                ]
              ) {
                grouped[
                  country
                ] = [];
              }

              grouped[
                country
              ].push(item);
            }
          );

          const result =
            Object.entries(
              grouped
            ).map(
              ([
                country,
                leagues,
              ]) => ({
                country,
                leagues,
              })
            );

          // SORT COUNTRIES
          result.sort(
            (a, b) =>
              a.country.localeCompare(
                b.country
              )
          );

          setCountries(
            result
          );
        }
      } catch (error) {
        console.log(error);
      }

      setLoading(false);
    }

    fetchLeagues();
  }, []);

  // FETCH TABLE
async function openLeague(
  league
) {
  try {
    const leagueId =
      league.league.id;

    // TOGGLE OPEN/CLOSE
    if (
      openedLeague ===
      leagueId
    ) {
      setOpenedLeague(
        null
      );

      return;
    }

    setOpenedLeague(
      leagueId
    );

    const res =
      await fetch(
        `/api/standings?league=${leagueId}&season=2025`
      );

    const data =
      await res.json();

    if (
      data.response?.[0]
    ) {
      setLeagueTable(
        data.response[0]
      );
    }
  } catch (error) {
    console.log(error);
  }
}

  // LOADING
  if (loading) {
    return (
      <div
        style={{
          background:
            "#0f172a",
          color: "white",
          minHeight:
            "100vh",
          display: "flex",
          justifyContent:
            "center",
          alignItems:
            "center",
          fontSize:
            "35px",
          fontWeight:
            "bold",
        }}
      >
        Loading Leagues...
      </div>
    );
  }

 return (
  <div
    style={{
      background: "#0f172a",
      color: "white",
      minHeight: "100vh",
      padding: "20px",
      paddingBottom: "120px",
    }}
  >

   <input
  type="text"
  placeholder="Search team..."
  value={searchTeam || ""}
  onChange={(e) =>
    setSearchTeam(e.target.value)
  }
  style={{
    width: "100%",
    padding: "12px",
    marginBottom: "20px",
    borderRadius: "10px",
    border: "none",
    fontSize: "16px",
  }}
/>
      {/* HEADER */}
      <h1
        style={{
          color:
            "#f472b6",
          fontSize:
            "50px",
          marginBottom:
            "30px",
        }}
      >
        🏆 League Tables
      </h1>

{/* COUNTRIES */}
{countries
  .filter((countryData) =>
    (
      countryData.country?.name || ""
    )
      .toLowerCase()
      .includes(
        searchTeam
          .toLowerCase()
          .trim()
      ) ||

    countryData.leagues?.some(
      (league) =>
        (
          league.league.name || ""
        )
          .toLowerCase()
          .includes(
            searchTeam
              .toLowerCase()
              .trim()
          )
    )
  )
  .map((countryData, index) => (
    <div
      key={index}
      style={{
        marginBottom: "18px",
        background: "#111827",
        borderRadius: "18px",
        overflow: "hidden",
      }}
    >
            {/* COUNTRY HEADER */}
            <div
              onClick={() =>
                setOpenedCountry(
                  openedCountry ===
                    countryData.country
                    ? null
                    : countryData.country
                )
              }
              style={{
                padding:
                  "18px",
                cursor:
                  "pointer",
                display:
                  "flex",
                justifyContent:
                  "space-between",
                alignItems:
                  "center",
                background:
                  "#1f2937",
              }}
            >
              <h2
                style={{
                  margin: 0,
                  fontSize:
                    "24px",
                }}
              >
                {
                  countryData.country
                }
              </h2>

              <span
                style={{
                  fontSize:
                    "22px",
                }}
              >
                {openedCountry ===
                countryData.country
                  ? "−"
                  : "+"}
              </span>
            </div>

            {/* LEAGUES */}
            {openedCountry ===
              countryData.country && (
              <div>
                {countryData.leagues.map(
                  (
                    league,
                    i
                  ) => (
                    <div
                      key={i}
                      style={{
                        borderTop:
                          "1px solid rgba(255,255,255,0.08)",
                      }}
                    >
                      {/* LEAGUE BUTTON */}
                      <div
                        onClick={() =>
                          openLeague(
                            league
                          )
                        }
                        style={{
                          padding:
                            "16px",
                          display:
                            "flex",
                          alignItems:
                            "center",
                          gap: "15px",
                          cursor:
                            "pointer",
                          transition:
                            "0.3s",
                        }}
                      >
                        <img
                          src={
                            league
                              .league
                              .logo
                          }
                          width="34"
                          height="34"
                          alt=""
                        />

                        <span
                          style={{
                            fontSize:
                              "18px",
                            fontWeight:
                              "bold",
                          }}
                        >
                          {
                            league
                              .league
                              .name
                          }
                        </span>
                      </div>

                      {/* TABLE */}
                      {openedLeague ===
                        league
                          .league
                          .id &&
                        leagueTable && (
                          <div
                            style={{
                              overflowX:
                                "auto",
                              padding:
                                "10px",
                            }}
                          >
                            <table
                              style={{
                                width:
                                  "100%",
                                minWidth:
                                  "700px",
                                borderCollapse:
                                  "collapse",
                              }}
                            >
                              <thead>
                                <tr
                                  style={{
                                    background:
                                      "#374151",
                                  }}
                                >
                                  <th
                                    style={
                                      thStyle
                                    }
                                  >
                                    #
                                  </th>

                                  <th
                                    style={
                                      thStyle
                                    }
                                  >
                                    Team
                                  </th>

                                  <th
                                    style={
                                      thStyle
                                    }
                                  >
                                    Pts
                                  </th>

                                  <th
                                    style={
                                      thStyle
                                    }
                                  >
                                    P
                                  </th>

                                  <th
                                    style={
                                      thStyle
                                    }
                                  >
                                    W
                                  </th>

                                  <th
                                    style={
                                      thStyle
                                    }
                                  >
                                    D
                                  </th>

                                  <th
                                    style={
                                      thStyle
                                    }
                                  >
                                    L
                                  </th>

                                  <th
                                    style={
                                      thStyle
                                    }
                                  >
                                    GD
                                  </th>
                                </tr>
                              </thead>

                              <tbody>
                                {leagueTable.league.standings[0]?.map(
                                  (
                                    team
                                  ) => (
                                    <tr
                                      key={
                                        team
                                          .team
                                          .id
                                      }
                                      style={{
                                        borderBottom:
                                          "1px solid rgba(255,255,255,0.08)",
                                      }}
                                    >
                                      <td
                                        style={
                                          tdStyle
                                        }
                                      >
                                        {
                                          team.rank
                                        }
                                      </td>

                                      <td
                                        style={
                                          tdStyle
                                        }
                                      >
                                        <div
                                          style={{
                                            display:
                                              "flex",
                                            alignItems:
                                              "center",
                                            gap:
                                              "10px",
                                          }}
                                        >
                                          <img
                                            src={
                                              team
                                                .team
                                                .logo
                                            }
                                            width="25"
                                            alt=""
                                          />

                                          {
                                            team
                                              .team
                                              .name
                                          }
                                        </div>
                                      </td>

                                      <td
                                        style={
                                          tdStyle
                                        }
                                      >
                                        {
                                          team.points
                                        }
                                      </td>

                                      <td
                                        style={
                                          tdStyle
                                        }
                                      >
                                        {
                                          team
                                            .all
                                            .played
                                        }
                                      </td>

                                      <td
                                        style={
                                          tdStyle
                                        }
                                      >
                                        {
                                          team
                                            .all
                                            .win
                                        }
                                      </td>

                                      <td
                                        style={
                                          tdStyle
                                        }
                                      >
                                        {
                                          team
                                            .all
                                            .draw
                                        }
                                      </td>

                                      <td
                                        style={
                                          tdStyle
                                        }
                                      >
                                        {
                                          team
                                            .all
                                            .lose
                                        }
                                      </td>

                                      <td
                                        style={
                                          tdStyle
                                        }
                                      >
                                        {
                                          team.goalsDiff
                                        }
                                      </td>
                                    </tr>
                                  )
                                )}
                              </tbody>
                            </table>
                          </div>
                        )}
                    </div>
                  )
                )}
              </div>
            )}
          </div>
        )
      )}
    </div>
  );
}

const thStyle = {
  padding: "14px",
  textAlign: "left",
  color: "#facc15",
};

const tdStyle = {
  padding: "14px",
};