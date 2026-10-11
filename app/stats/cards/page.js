
"use client";

import { useEffect, useState } from "react";
import StatsBackButton from "../../../components/StatsBackButton";

const leagues = [
  { id: "39", name: "Premier League" },
  { id: "140", name: "La Liga" },
  { id: "135", name: "Serie A" },
  { id: "78", name: "Bundesliga" },
  { id: "61", name: "Ligue 1" },
];

export default function CardsPage() {
  const [league, setLeague] = useState("39");
  const [season, setSeason] = useState("2026");
  const [players, setPlayers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [sortBy, setSortBy] = useState("yellow");
  const [retry, setRetry] = useState(0);

  useEffect(() => {
    const controller = new AbortController();

    async function load() {
      setLoading(true);
      setError("");

      try {
        const res = await fetch(
          `/api/stats/cards?league=${league}&season=${season}&retry=${retry}`,
          { signal: controller.signal }
        );

        const data = await res.json();

        if (!res.ok) {
          throw new Error(
            data.error || "Failed to load statistics."
          );
        }

        setPlayers(data.players || []);
      } catch (err) {
        if (err.name !== "AbortError") {
          setError(err.message || "Unable to load card statistics.");
          setPlayers([]);
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    }

    load();

    return () => controller.abort();
  }, [league, season, retry]);

  const sortedPlayers = [...players].sort(
    (a, b) => (Number(b[sortBy]) || 0) - (Number(a[sortBy]) || 0)
  );

  return (
    <main style={styles.page}>
      <div style={styles.container}>
        <StatsBackButton />

        <header style={styles.header}>
          <h1 style={styles.title}>🟨🟥 Yellow &amp; Red Cards</h1>

          <p style={styles.subtitle}>
            Player disciplinary statistics
          </p>
        </header>

        <section style={styles.filters}>
          <label style={styles.label}>
            League
            <select
              value={league}
              onChange={(e) => setLeague(e.target.value)}
              style={styles.select}
            >
              {leagues.map((l) => (
                <option key={l.id} value={l.id}>
                  {l.name}
                </option>
              ))}
            </select>
          </label>

          <label style={styles.label}>
            Season
            <select
              value={season}
              onChange={(e) => setSeason(e.target.value)}
              style={styles.select}
            >
              {["2026", "2025", "2024", "2023"].map((year) => (
                <option key={year} value={year}>
                  {year}/{Number(year) + 1}
                </option>
              ))}
            </select>
          </label>

          <label style={styles.label}>
            Sort players by
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              style={styles.select}
            >
              <option value="yellow">Most Yellow Cards</option>
              <option value="red">Most Red Cards</option>
            </select>
          </label>
        </section>

        {loading && (
          <div style={styles.message}>
            Loading card statistics...
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

        {!loading && !error && (
          <>
            <p style={styles.resultCount}>
              {players.length} players returned
            </p>

            {players.length === 0 ? (
              <div style={styles.message}>
                No card statistics available for this selection.
              </div>
            ) : (
              <div style={styles.tableWrap}>
                <table style={styles.table}>
                  <thead>
                    <tr>
                      {["#", "Player", "Team", "Apps", "🟨", "🟥"].map(
                        (heading) => (
                          <th key={heading} style={styles.th}>
                            {heading}
                          </th>
                        )
                      )}
                    </tr>
                  </thead>

                  <tbody>
                    {sortedPlayers.map((p, index) => (
                      <tr
                        key={p.id || `${p.name}-${index}`}
                        style={{
                          background:
                            index % 2 === 0 ? "#101d2d" : "#0c1725",
                        }}
                      >
                        <td style={styles.td}>{index + 1}</td>

                        <td style={styles.td}>
                          <div style={styles.player}>
                            {p.photo ? (
                              <img
                                src={p.photo}
                                alt=""
                                style={styles.playerPhoto}
                              />
                            ) : (
                              <div style={styles.photoPlaceholder}>
                                {p.name?.charAt(0) || "?"}
                              </div>
                            )}

                            <span>{p.name || "Unknown player"}</span>
                          </div>
                        </td>

                        <td style={styles.td}>
                          {p.team || "Unknown team"}
                        </td>

                        <td style={styles.td}>
                          {p.appearances ?? 0}
                        </td>

                        <td style={styles.yellow}>
                          {p.yellow ?? 0}
                        </td>

                        <td style={styles.red}>
                          {p.red ?? 0}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </>
        )}
      </div>
    </main>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    padding: "24px 16px 110px",
    color: "#e5e7eb",
    background: "#0b1220",
    fontFamily: "Arial, sans-serif",
  },

  container: {
    maxWidth: "1100px",
    margin: "0 auto",
  },

  header: {
    margin: "20px 0 24px",
  },

  title: {
    fontSize: "clamp(26px, 4vw, 36px)",
    fontWeight: 800,
    margin: "12px 0",
  },

  subtitle: {
    color: "#9ca3af",
    marginTop: "8px",
    lineHeight: 1.6,
  },

  filters: {
    display: "flex",
    gap: "16px",
    flexWrap: "wrap",
    margin: "24px 0",
  },

  label: {
    display: "flex",
    flexDirection: "column",
    gap: "8px",
    color: "#bdc9d8",
    fontSize: "13px",
    fontWeight: 600,
  },

  select: {
    minWidth: "180px",
    padding: "12px",
    borderRadius: "8px",
    border: "1px solid #334155",
    background: "#101d2d",
    color: "#ffffff",
    fontSize: "14px",
  },

  resultCount: {
    color: "#9ca3af",
    marginBottom: "14px",
    fontSize: "14px",
  },

  message: {
    padding: "24px",
    borderRadius: "12px",
    background: "#101d2d",
    color: "#bdc9d8",
    margin: "20px 0",
  },

  error: {
    padding: "20px",
    borderRadius: "10px",
    background: "#301820",
    border: "1px solid #743343",
    color: "#fecdd3",
    margin: "20px 0",
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
    overflowX: "auto",
    border: "1px solid #26374b",
    borderRadius: "12px",
  },

  table: {
    width: "100%",
    minWidth: "600px",
    borderCollapse: "collapse",
    textAlign: "left",
  },

  th: {
    padding: "14px 12px",
    background: "#1e293b",
    color: "#cbd5e1",
    fontSize: "12px",
    whiteSpace: "nowrap",
  },

  td: {
    padding: "12px",
    borderBottom: "1px solid #334155",
    fontSize: "13px",
    whiteSpace: "nowrap",
  },

  player: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
  },

  playerPhoto: {
    width: "36px",
    height: "36px",
    borderRadius: "50%",
    objectFit: "cover",
    background: "#26374b",
  },

  photoPlaceholder: {
    width: "36px",
    height: "36px",
    borderRadius: "50%",
    display: "grid",
    placeItems: "center",
    background: "#26374b",
    color: "#35d07f",
    fontWeight: 700,
  },

  yellow: {
    padding: "12px",
    borderBottom: "1px solid #334155",
    color: "#facc15",
    fontWeight: 700,
  },

  red: {
    padding: "12px",
    borderBottom: "1px solid #334155",
    color: "#f87171",
    fontWeight: 700,
  },
};
