"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

export default function TablesPage() {
  const [leagues, setLeagues] =
    useState([]);

  const [expandedCountry, setExpandedCountry] =
    useState(null);

  useEffect(() => {
    fetchLeagues();
  }, []);

  async function fetchLeagues() {
    try {
      const res = await fetch(
        "/api/leagues"
      );

      const data =
        await res.json();

      setLeagues(
        data.response || []
      );
    } catch (err) {
      console.log(err);
    }
  }

  // GROUP BY COUNTRY
  const grouped =
    leagues.reduce(
      (acc, item) => {
        const country =
          item.country.name;

        if (!acc[country]) {
          acc[country] = [];
        }

        acc[country].push(item);

        return acc;
      },
      {}
    );

  return (
    <div
      style={{
        background: "#071b2d",
        minHeight: "100vh",
        color: "white",
        paddingBottom: "100px",
      }}
    >
      <div
        style={{
          padding: "20px",
          fontSize: "30px",
          fontWeight: "bold",
        }}
      >
        Football Tables
      </div>

      {Object.entries(grouped).map(
        ([country, leagues]) => (
          <div
            key={country}
            style={{
              marginBottom: "14px",
            }}
          >
            {/* COUNTRY HEADER */}
            <div
              onClick={() =>
                setExpandedCountry(
                  expandedCountry ===
                    country
                    ? null
                    : country
                )
              }
              style={{
                background: "#10263d",
                padding: "18px",
                cursor: "pointer",
                display: "flex",
                justifyContent:
                  "space-between",
                alignItems: "center",
                fontWeight: "bold",
                fontSize: "18px",
                borderBottom:
                  "1px solid rgba(255,255,255,0.08)",
              }}
            >
              <span>
                {country}
              </span>

              <span>
                {expandedCountry ===
                country
                  ? "−"
                  : "+"}
              </span>
            </div>

            {/* LEAGUES */}
            {expandedCountry ===
              country && (
              <div
                style={{
                  background:
                    "#0f172a",
                }}
              >
                {leagues.map(
                  (league) => (
                    <Link
                      key={
                        league
                          .league.id
                      }
                      href={`/table/${league.league.id}`}
                      style={{
                        display:
                          "flex",
                        alignItems:
                          "center",
                        gap: "12px",
                        padding:
                          "14px 18px",
                        textDecoration:
                          "none",
                        color:
                          "white",
                        borderBottom:
                          "1px solid rgba(255,255,255,0.05)",
                      }}
                    >
                      <img
                        src={
                          league
                            .league
                            .logo
                        }
                        width="28"
                        height="28"
                        alt=""
                      />

                      <span>
                        {
                          league
                            .league
                            .name
                        }
                      </span>
                    </Link>
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