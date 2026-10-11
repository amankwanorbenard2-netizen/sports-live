
"use client";

import { useEffect, useState } from "react";
import StatsBackButton from "../../../components/StatsBackButton";

const LEAGUES = [
  { id: "39", name: "Premier League" },
  { id: "140", name: "La Liga" },
  { id: "135", name: "Serie A" },
  { id: "78", name: "Bundesliga" },
  { id: "61", name: "Ligue 1" },
];

export default function CleanSheetsPage() {
  const [league, setLeague] = useState("39");
  const [season, setSeason] = useState("2026");
  const [teams, setTeams] = useState([]);
  const [partial, setPartial] = useState(false);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [retry, setRetry] = useState(0);

  useEffect(() => {
    const controller = new AbortController();

    async function loadCleanSheets() {
      setLoading(true);
      setError("");
      setMessage("");
      setTeams([]);
      setPartial(false);

      try {
        const response = await fetch(
          `/api/clean-sheets?league=${league}&season=${season}&retry=${retry}`,
          { signal: controller.signal }
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data.error || "Unable to load clean sheets."
          );
        }

        setTeams(data.teams || []);
        setPartial(Boolean(data.partial));
        setMessage(data.message || "");
      } catch (err) {
        if (err.name !== "AbortError") {
          setError(err.message || "Something went wrong.");
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    }

    loadCleanSheets();

    return () => controller.abort();
  }, [league, season, retry]);

  return (
    <main style={styles.page}>
      <div style={styles.container}>
        <StatsBackButton />

        <header style={styles.header}>
          <p style={styles.eyebrow}>
            SPORTS LIVE · TEAM STATISTICS
          </p>

          <h1 style={styles.title}>Clean Sheets</h1>

          <p style={styles.subtitle}>
            Compare the number of matches teams have finished
            without conceding a goal.
          </p>
        </header>

        <section style={styles.filters}>
          <label style={styles.label}>
            League
            <select
              value={league}
              onChange={(event) => setLeague(event.target.value)}
              style={styles.select}
            >
              {LEAGUES.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.name}
                </option>
              ))}
            </select>
          </label>

          <label style={styles.label}>
            Season
            <select
              value={season}
              onChange={(event) => setSeason(event.target.value)}
              style={styles.select}
            >
              {["2026", "2025", "2024", "2023"].map((year) => (
                <option key={year} value={year}>
                  {year}/{String(Number(year) + 1).slice(-2)}
                </option>
              ))}
            </select>
          </label>
        </section>

        {loading && (
          <div style={styles.message}>
            Loading clean-sheet statistics...
          </div>
        )}

        {!loading && error && (
          <div style={styles.error}>
            <p>{error}</p>

            <button
              onClick={() => setRetry((value) => value + 1)}
              style={styles.button}
            >
              Try again
            </button>
          </div>
        )}

        {!loading && !error && partial && (
          <div style={styles.warning}>
            <strong>Partial results</strong>
            <p>
              {message || "Only some teams have been checked."}
            </p>
            These results do not represent the complete league ranking.
          </div>
        )}

        {!loading && !error && teams.length === 0 && (
          <div style={styles.message}>
            No clean-sheet data is available for this selection.
          </div>
        )}

        {!loading && !error && teams.length > 0 && (
          <div style={styles.tableWrap}>
            <table style={styles.table}>
              <thead>
                <tr>
                  <th style={styles.th}>Rank</th>
                  <th style={styles.th}>Team</th>
                  <th style={styles.th}>Played</th>
                  <th style={styles.th}>Home</th>
                  <th style={styles.th}>Away</th>
                  <th style={styles.th}>Clean Sheets</th>
                </tr>
              </thead>

              <tbody>
                {teams.map((team) => (
                  <tr key={team.id}>
                    <td style={styles.td}>{team.rank}</td>

                    <td style={styles.td}>
                      <div style={styles.team}>
                        {team.logo && (
                          <img
                            src={team.logo}
                            alt=""
                            style={styles.logo}
                          />
                        )}
                        <span>{team.name}</span>
                      </div>
                    </td>

                    <td style={styles.td}>{team.played}</td>
                    <td style={styles.td}>
                      {team.homeCleanSheets}
                    </td>
                    <td style={styles.td}>
                      {team.awayCleanSheets}
                    </td>
                    <td style={styles.total}>{team.cleanSheets}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </main>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    background: "#07111f",
    color: "#f1f5f9",
    padding: "24px 18px 120px",
    fontFamily: "Arial, sans-serif",
  },

  container: {
    maxWidth: "1100px",
    margin: "0 auto",
  },

  header: {
    margin: "20px auto 28px",
  },

  eyebrow: {
    color: "#35d07f",
    fontSize: "12px",
    fontWeight: 700,
    letterSpacing: "2px",
  },

  title: {
    fontSize: "clamp(30px, 5vw, 44px)",
    margin: "12px 0",
  },

  subtitle: {
    color: "#9caec2",
    lineHeight: 1.7,
  },

  filters: {
    margin: "0 auto 24px",
    display: "flex",
    flexWrap: "wrap",
    gap: "16px",
  },

  label: {
    display: "flex",
    flexDirection: "column",
    gap: "8px",
    color: "#bdc9d8",
    fontSize: "13px",
  },

  select: {
    minWidth: "180px",
    padding: "12px",
    borderRadius: "8px",
    border: "1px solid #2b4058",
    background: "#101d2d",
    color: "white",
  },

  message: {
    margin: "20px auto",
    padding: "24px",
    borderRadius: "12px",
    background: "#101d2d",
    color: "#bdc9d8",
  },

  warning: {
    margin: "0 auto 20px",
    padding: "18px",
    borderRadius: "10px",
    border: "1px solid #8a6b2b",
    background: "#302817",
    color: "#f5d58b",
    lineHeight: 1.6,
  },

  error: {
    margin: "20px auto",
    padding: "20px",
    borderRadius: "10px",
    background: "#301820",
    color: "#fecdd3",
  },

  button: {
    padding: "10px 16px",
    border: 0,
    borderRadius: "8px",
    background: "#35d07f",
    color: "#07111f",
    cursor: "pointer",
    fontWeight: 700,
  },

  tableWrap: {
    margin: "0 auto",
    overflowX: "auto",
    border: "1px solid #26374b",
    borderRadius: "12px",
  },

  table: {
    width: "100%",
    minWidth: "620px",
    borderCollapse: "collapse",
    textAlign: "left",
  },

  th: {
    padding: "15px 12px",
    background: "#17273a",
    color: "#aebed0",
    fontSize: "12px",
    whiteSpace: "nowrap",
  },

  td: {
    padding: "15px 12px",
    borderTop: "1px solid #223247",
    fontSize: "13px",
    whiteSpace: "nowrap",
  },

  team: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
  },

  logo: {
    width: "26px",
    height: "26px",
    objectFit: "contain",
  },

  total: {
    padding: "15px 12px",
    borderTop: "1px solid #223247",
    color: "#35d07f",
    fontWeight: 800,
    fontSize: "16px",
  },
};
