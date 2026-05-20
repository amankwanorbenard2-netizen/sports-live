"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export default function FinishedPage() {

  const [matches, setMatches] =
    useState([]);

  useEffect(() => {

    fetch("/api/finished")
      .then((res) => res.json())
      .then((data) => {

        setMatches(
          data.events || []
        );

      });

  }, []);

  return (

    <div
      style={{
        background:
          "#071b2d",
        minHeight:
          "100vh",
        color: "white",
        paddingBottom:
          "100px",
      }}
    >

      {/* HEADER */}
      <div
        style={{
          padding: "18px",
          borderBottom:
            "1px solid #1e293b",
          display: "flex",
          alignItems:
            "center",
          gap: "10px",
        }}
      >

        <img
          src="https://cdn-icons-png.flaticon.com/512/53/53283.png"
          width={
            window.innerWidth < 600
              ? "32"
              : "40"
          }
        />

        <h1
          style={{
            color: "#84cc16",
            fontSize:
              window.innerWidth < 600
                ? "28px"
                : "42px",
            fontWeight:
              "bold",
            margin: 0,
          }}
        >
          Sports Live
        </h1>

      </div>

      {/* BODY */}
      <div
        style={{
          padding: "16px",
        }}
      >

        {/* TITLE */}
        <h1
          style={{
            color: "#facc15",
            fontSize:
              window.innerWidth < 600
                ? "34px"
                : "58px",
            fontWeight:
              "bold",
            marginBottom:
              "20px",
          }}
        >
          Finished Matches
        </h1>

        {/* EMPTY */}
        {matches.length === 0 ? (

          <div
            style={{
              background:
                "#10263d",
              padding: "24px",
              borderRadius:
                "16px",
              textAlign:
                "center",
              fontSize:
                "20px",
              color:
                "#d1d5db",
            }}
          >
            No finished matches available.
          </div>

        ) : (

          <div
            style={{
              display: "grid",
              gridTemplateColumns:
                "repeat(auto-fit,minmax(300px,1fr))",
              gap: "16px",
            }}
          >

            {matches.map(
              (match) => (

                <Link
                  key={
                    match.fixture.id
                  }
                  href={`/match/${match.fixture.id}`}
                  style={{
                    textDecoration:
                      "none",
                  }}
                >

                  <div
                    style={{
                      background:
                        "#10263d",
                      borderRadius:
                        "20px",
                      padding:
                        window.innerWidth <
                        600
                          ? "16px"
                          : "20px",
                      border:
                        "1px solid rgba(255,255,255,0.08)",
                      transition:
                        "0.3s",
                      cursor:
                        "pointer",
                    }}
                    onMouseEnter={(
                      e
                    ) => {

                      e.currentTarget.style.transform =
                        "scale(1.02)";

                      e.currentTarget.style.boxShadow =
                        "0 0 20px rgba(250,204,21,0.25)";

                    }}
                    onMouseLeave={(
                      e
                    ) => {

                      e.currentTarget.style.transform =
                        "scale(1)";

                      e.currentTarget.style.boxShadow =
                        "none";

                    }}
                  >

                    {/* LEAGUE */}
                    <div
                      style={{
                        display:
                          "flex",
                        alignItems:
                          "center",
                        gap: "10px",
                        marginBottom:
                          "18px",
                      }}
                    >

                      <img
                        src={
                          match.league
                            .logo
                        }
                        width={
                          window.innerWidth <
                          600
                            ? "24"
                            : "30"
                        }
                      />

                      <span
                        style={{
                          color:
                            "#cbd5e1",
                          fontSize:
                            window.innerWidth <
                            600
                              ? "16px"
                              : "18px",
                        }}
                      >
                        {
                          match.league
                            .name
                        }
                      </span>

                    </div>

                    {/* MATCH */}
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

                      {/* HOME */}
                      <div
                        style={{
                          width: "35%",
                          display:
                            "flex",
                          flexDirection:
                            "column",
                          alignItems:
                            "center",
                          textAlign:
                            "center",
                        }}
                      >

                        <img
                          src={
                            match.teams
                              .home.logo
                          }
                          style={{
                            width:
                              window.innerWidth <
                              600
                                ? "58px"
                                : "72px",

                            height:
                              window.innerWidth <
                              600
                                ? "58px"
                                : "72px",

                            objectFit:
                              "contain",
                          }}
                        />

                        <div
                          style={{
                            marginTop:
                              "8px",
                            fontWeight:
                              "bold",
                            fontSize:
                              window.innerWidth <
                              600
                                ? "15px"
                                : "18px",
                            lineHeight:
                              "20px",
                          }}
                        >
                          {
                            match.teams
                              .home.name
                          }
                        </div>

                      </div>

                      {/* SCORE */}
                      <div
                        style={{
                          textAlign:
                            "center",
                          width: "30%",
                        }}
                      >

                        <div
                          style={{
                            fontSize:
                              window.innerWidth <
                              600
                                ? "38px"
                                : "48px",

                            fontWeight:
                              "bold",

                            color:
                              "#facc15",

                            lineHeight:
                              "48px",
                          }}
                        >
                          {
                            match.goals
                              .home
                          }

                          {" - "}

                          {
                            match.goals
                              .away
                          }
                        </div>

                        <div
                          style={{
                            marginTop:
                              "8px",
                            color:
                              "#22c55e",
                            fontWeight:
                              "bold",
                            fontSize:
                              window.innerWidth <
                              600
                                ? "18px"
                                : "20px",
                          }}
                        >
                          FT
                        </div>

                      </div>

                      {/* AWAY */}
                      <div
                        style={{
                          width: "35%",
                          display:
                            "flex",
                          flexDirection:
                            "column",
                          alignItems:
                            "center",
                          textAlign:
                            "center",
                        }}
                      >

                        <img
                          src={
                            match.teams
                              .away.logo
                          }
                          style={{
                            width:
                              window.innerWidth <
                              600
                                ? "58px"
                                : "72px",

                            height:
                              window.innerWidth <
                              600
                                ? "58px"
                                : "72px",

                            objectFit:
                              "contain",
                          }}
                        />

                        <div
                          style={{
                            marginTop:
                              "8px",
                            fontWeight:
                              "bold",
                            fontSize:
                              window.innerWidth <
                              600
                                ? "15px"
                                : "18px",
                            lineHeight:
                              "20px",
                          }}
                        >
                          {
                            match.teams
                              .away.name
                          }
                        </div>

                      </div>

                    </div>

                    {/* DATE */}
                    <div
                      style={{
                        marginTop:
                          "16px",
                        color:
                          "#94a3b8",
                        textAlign:
                          "center",
                        fontSize:
                          window.innerWidth <
                          600
                            ? "13px"
                            : "15px",
                      }}
                    >
                      {new Date(
                        match.fixture.date
                      ).toLocaleString()}
                    </div>

                  </div>

                </Link>

              )
            )}

          </div>

        )}

      </div>

    </div>

  );

}