
"use client";

import { useCallback, useEffect, useState } from "react";
import StatsBackButton from "../../../components/StatsBackButton";

const LEAGUES = [
  { id: 39, name: "Premier League", country: "England" },
  { id: 140, name: "La Liga", country: "Spain" },
  { id: 135, name: "Serie A", country: "Italy" },
  { id: 78, name: "Bundesliga", country: "Germany" },
  { id: 61, name: "Ligue 1", country: "France" },
];

const CURRENT_SEASON = 2026;

function number(value) {
  return typeof value === "number" && Number.isFinite(value)
    ? value
    : Number(value) || 0;
}

function percent(value) {
  return value == null ? "—" : `${number(value).toFixed(1)}%`;
}

function getStat(stats, key) {
  const value = stats?.fixtures?.[key];
  return value ?? "—";
}

function getGoals(stats, key) {
  return stats?.goals?.for?.[key] ?? "—";
}

function getCleanSheets(stats) {
  return stats?.clean_sheet?.total ?? "—";
}

function getFailedToScore(stats) {
  return stats?.failed_to_score?.total ?? "—";
}

export default function TeamStatisticsPage() {
  const [league, setLeague] = useState("39");
  const [season, setSeason] = useState(String(CURRENT_SEASON));
  const [teams, setTeams] = useState([]);
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("played");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [retry, setRetry] = useState(0);

  const loadTeams = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const response = await fetch(
        `/api/stats/teams?league=${encodeURIComponent(league)}&season=${encodeURIComponent(season)}`,
        { cache: "no-store" }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error || "Unable to load team statistics."
        );
      }

      setTeams(data.teams || []);
    } catch (err) {
      setTeams([]);
      setError(err.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  }, [league, season, retry]);

  useEffect(() => {
    loadTeams();
  }, [loadTeams]);

  const filteredTeams = teams
    .filter(({ team }) =>
      team?.name?.toLowerCase().includes(search.toLowerCase())
    )
    .sort((a, b) => {
      const aStats = a.statistics;
      const bStats = b.statistics;

      if (sort === "name") {
        return (a.team?.name || "").localeCompare(b.team?.name || "");
      }

      if (sort === "wins") {
        return number(bStats?.fixtures?.wins?.total) -
          number(aStats?.fixtures?.wins?.total);
      }

      if (sort === "goals") {
        return number(bStats?.goals?.for?.total?.total) -
          number(aStats?.goals?.for?.total?.total);
      }

      if (sort === "clean") {
        return number(bStats?.clean_sheet?.total) -
          number(aStats?.clean_sheet?.total);
      }

      return number(bStats?.fixtures?.played?.total) -
        number(aStats?.fixtures?.played?.total);
    });

  const styles = {
    page: {
      minHeight: "100vh",
      background: "#0b1220",
      color: "#e5e7eb",
      padding: "24px 16px 48px",
      fontFamily: "Arial, sans-serif",
    },
    container: {
      maxWidth: "1200px",
      margin: "0 auto",
    },
    heading: {
      fontSize: "30px",
      fontWeight: 800,
      margin: "22px 0 8px",
    },
    muted: {
      color: "#94a3b8",
      fontSize: "14px",
    },
    controls: {
      display: "flex",
      flexWrap: "wrap",
      gap: "12px",
      margin: "24px 0",
    },
    input: {
      background: "#111c30",
      border: "1px solid #334155",
      borderRadius: "8px",
      color: "#f8fafc",
      padding: "12px",
      minWidth: "180px",
      flex: "1 1 180px",
    },
    panel: {
      background: "#111c30",
      border: "1px solid #25334b",
      borderRadius: "12px",
      overflow: "hidden",
    },
    tableWrap: {
      width: "100%",
      overflowX: "auto",
    },
    table: {
      width: "100%",
      borderCollapse: "collapse",
      minWidth: "950px",
      textAlign: "left",
    },
    th: {
      padding: "14px 12px",
      background: "#17243a",
      color: "#cbd5e1",
      fontSize: "12px",
      textTransform: "uppercase",
      whiteSpace: "nowrap",
    },
    td: {
      padding: "14px 12px",
      borderTop: "1px solid #25334b",
      fontSize: "13px",
      whiteSpace: "nowrap",
    },
    button: {
      padding: "10px 14px",
      borderRadius: "8px",
      border: "1px solid #475569",
      background: "#1e293b",
      color: "#fff",
      cursor: "pointer",
    },
  };

  return (
    <main style={styles.page}>
      <div style={styles.container}>
        <StatsBackButton />

        <h1 style={styles.heading}>Team Statistics</h1>
        <p style={styles.muted}>
          Compare matches played, wins, goals, clean sheets, and other
          statistics for teams in major European leagues.
        </p>

        <div style={styles.controls}>
          <select
            value={league}
            onChange={(event) => setLeague(event.target.value)}
            style={styles.input}
            aria-label="Select league"
          >
            {LEAGUES.map((item) => (
              <option key={item.id} value={String(item.id)}>
                {item.name} — {item.country}
              </option>
            ))}
          </select>

          <select
            value={season}
            onChange={(event) => setSeason(event.target.value)}
            style={styles.input}
            aria-label="Select season"
          >
            {[2026, 2025, 2024, 2023].map((year) => (
              <option key={year} value={String(year)}>
                Season {year}
              </option>
            ))}
          </select>

          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search team..."
            style={styles.input}
            aria-label="Search teams"
          />

          <select
            value={sort}
            onChange={(event) => setSort(event.target.value)}
            style={styles.input}
            aria-label="Sort teams"
          >
            <option value="played">Sort by matches played</option>
            <option value="wins">Sort by wins</option>
            <option value="goals">Sort by goals scored</option>
            <option value="clean">Sort by clean sheets</option>
            <option value="name">Sort alphabetically</option>
          </select>

          <button
            style={styles.button}
            onClick={() => setRetry((value) => value + 1)}
            disabled={loading}
          >
            {loading ? "Loading..." : "Refresh"}
          </button>
        </div>

        {loading && (
          <p style={styles.muted}>
            Loading statistics. This may take a few minutes because the API
            is queried for each team.
          </p>
        )}

        {error && (
          <div
            role="alert"
            style={{
              ...styles.panel,
              padding: "18px",
              marginBottom: "20px",
              color: "#fca5a5",
            }}
          >
            <p>{error}</p>
            <button
              style={styles.button}
              onClick={() => setRetry((value) => value + 1)}
            >
              Try again
            </button>
          </div>
        )}

        {!loading && !error && (
          <p style={{ ...styles.muted, marginBottom: "14px" }}>
            Showing {filteredTeams.length} of {teams.length} teams.
            Statistics not supplied by the API appear as a dash.
          </p>
        )}

        <div style={styles.panel}>
          <div style={styles.tableWrap}>
            <table style={styles.table}>
              <thead>
                <tr>
                  {[
                    "Team",
                    "Played",
                    "Wins",
                    "Draws",
                    "Losses",
                    "Goals For",
                    "Goals Against",
                    "Clean Sheets",
                    "Failed to Score",
                    "Win Rate",
                  ].map((heading) => (
                    <th key={heading} style={styles.th}>
                      {heading}
                    </th>
                  ))}
                </tr>
              </thead>

              <tbody>
                {filteredTeams.map(({ team, statistics, error: failed }) => {
                  const fixtures = statistics?.fixtures;
                  const played = fixtures?.played?.total;
                  const wins = fixtures?.wins?.total;
                  const goalsFor = statistics?.goals?.for?.total?.total;
                  const goalsAgainst =
                    statistics?.goals?.against?.total?.total;

                  return (
                    <tr key={team.id}>
                      <td style={styles.td}>
                        <div style={{ display: "flex", alignItems: "center", gap: "9px" }}>
                          {team.logo && (
                            <img
                              src={team.logo}
                              alt=""
                              width="25"
                              height="25"
                              style={{ objectFit: "contain" }}
                            />
                          )}
                          <span>{team.name}</span>
                        </div>
                        {failed && (
                          <small style={{ color: "#fca5a5" }}>
                            Statistics unavailable
                          </small>
                        )}
                      </td>
                      <td style={styles.td}>{getStat(statistics, "played") === "—" ? "—" : played ?? "—"}</td>
                      <td style={styles.td}>{getStat(statistics, "wins") === "—" ? "—" : wins ?? "—"}</td>
                      <td style={styles.td}>{fixtures?.draws?.total ?? "—"}</td>
                      <td style={styles.td}>{fixtures?.loses?.total ?? "—"}</td>
                      <td style={styles.td}>{goalsFor ?? "—"}</td>
                      <td style={styles.td}>{goalsAgainst ?? "—"}</td>
                      <td style={styles.td}>{getCleanSheets(statistics)}</td>
                      <td style={styles.td}>{getFailedToScore(statistics)}</td>
                      <td style={styles.td}>
                        {played && wins != null
                          ? percent((number(wins) / number(played)) * 100)
                          : "—"}
                      </td>
                    </tr>
                  );
                })}

                {!loading && filteredTeams.length === 0 && (
                  <tr>
                    <td
                      colSpan={10}
                      style={{ ...styles.td, textAlign: "center", padding: "30px" }}
                    >
                      {error
                        ? "Unable to display statistics."
                        : "No teams found for these filters."}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        <p style={{ ...styles.muted, marginTop: "18px" }}>
          Data is provided by API-Football. Coverage and season availability
          depend on your API plan.
        </p>
      </div>
    </main>
  );
}
