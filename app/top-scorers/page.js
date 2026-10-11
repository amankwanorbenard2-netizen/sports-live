
"use client";

import { useEffect, useState } from "react";
import StatsBackButton from "../../components/StatsBackButton";

const LEAGUES = [
  { id: "39", name: "Premier League" },
  { id: "140", name: "La Liga" },
  { id: "135", name: "Serie A" },
  { id: "78", name: "Bundesliga" },
  { id: "61", name: "Ligue 1" },
];

export default function TopScorersPage() {
  const [league, setLeague] = useState("39");
  const [season, setSeason] = useState("2026");
  const [players, setPlayers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [retry, setRetry] = useState(0);

  useEffect(() => {
    const controller = new AbortController();

    async function loadScorers() {
      setLoading(true);
      setError("");

      try {
        const response = await fetch(
          `/api/top-scorers?league=${league}&season=${season}&retry=${retry}`,
          { signal: controller.signal }
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data.error || "Failed to load top scorers."
          );
        }

        setPlayers(data.players || []);
      } catch (err) {
        if (err.name !== "AbortError") {
          setError(err.message || "Unable to load players.");
          setPlayers([]);
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    }

    loadScorers();

    return () => controller.abort();
  }, [league, season, retry]);

  return (
    <main style={styles.page}>
      <div style={styles.container}>
        <StatsBackButton />

        <header style={styles.header}>
          <p style={styles.eyebrow}>
            SPORTS LIVE · PLAYER STATISTICS
          </p>

          <h1 style={styles.title}>Top Scorers</h1>

          <p style={styles.subtitle}>
            Discover the leading goal scorers in your favourite leagues.
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
            Loading top scorers...
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

            <p style={styles.hint}>
              If the error continues, check your API key and server terminal.
            </p>
          </div>
        )}

        {!loading && !error && players.length === 0 && (
          <div style={styles.message}>
            No scorer data is available for this league and season.
          </div>
        )}

        {!loading && !error && players.length > 0 && (
          <>
            <div style={styles.resultCount}>
              {players.length} players returned by the API
            </div>

            <div style={styles.tableWrap}>
              <table style={styles.table}>
                <thead>
                  <tr>
                    <th style={styles.th}>#</th>
                    <th style={styles.th}>Player</th>
                    <th style={styles.th}>Club</th>
                    <th style={styles.th}>Apps</th>
                    <th style={styles.th}>Goals</th>
                    <th style={styles.th}>Assists</th>
                    <th style={styles.th}>Penalties</th>
                  </tr>
                </thead>

                <tbody>
                  {players.map((player, index) => (
                    <tr
                      key={player.id ?? `${player.name}-${index}`}
                      style={{
                        background:
                          index % 2 === 0 ? "#101d2d" : "#0c1725",
                      }}
                    >
                      <td style={styles.td}>{player.rank}</td>

                      <td style={styles.td}>
                        <div style={styles.player}>
                          {player.photo ? (
                            <img
                              src={player.photo}
                              alt=""
                              style={styles.playerPhoto}
                            />
                          ) : (
                            <div style={styles.photoPlaceholder}>
                              {player.name?.charAt(0) || "?"}
                            </div>
                          )}

                          <div>
                            <div style={styles.playerName}>
                              {player.name}
                            </div>

                            <div style={styles.smallText}>
                              {player.nationality || "Player"}
                            </div>
                          </div>
                        </div>
                      </td>

                      <td style={styles.td}>
                        <div style={styles.club}>
                          {player.teamLogo && (
                            <img
                              src={player.teamLogo}
                              alt=""
                              style={styles.clubLogo}
                            />
                          )}

                          <span>{player.team}</span>
                        </div>
                      </td>

                      <td style={styles.td}>
                        {player.appearances}
                      </td>

                      <td style={styles.goals}>{player.goals}</td>

                      <td style={styles.td}>{player.assists}</td>

                      <td style={styles.td}>{player.penalties}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
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
    padding: "24px 20px 60px",
    fontFamily: "Arial, sans-serif",
  },

  container: {
    maxWidth: "1200px",
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
    fontSize: "clamp(30px, 5vw, 46px)",
    margin: "12px 0",
  },

  subtitle: {
    color: "#9caec2",
    lineHeight: 1.6,
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
    fontWeight: 600,
  },

  select: {
    minWidth: "190px",
    padding: "12px",
    borderRadius: "8px",
    border: "1px solid #2b4058",
    background: "#101d2d",
    color: "#ffffff",
    fontSize: "14px",
  },

  message: {
    margin: "20px auto",
    padding: "24px",
    background: "#101d2d",
    borderRadius: "12px",
    color: "#bdc9d8",
  },

  error: {
    margin: "20px auto",
    padding: "24px",
    background: "#301820",
    border: "1px solid #743343",
    borderRadius: "12px",
    color: "#fecdd3",
  },

  hint: {
    color: "#e5aab4",
    fontSize: "13px",
  },

  button: {
    padding: "10px 16px",
    borderRadius: "8px",
    border: "none",
    background: "#35d07f",
    color: "#07111f",
    fontWeight: 700,
    cursor: "pointer",
  },

  resultCount: {
    margin: "0 auto 12px",
    color: "#9caec2",
    fontSize: "13px",
  },

  tableWrap: {
    margin: "0 auto",
    overflowX: "auto",
    border: "1px solid #26374b",
    borderRadius: "12px",
  },

  table: {
    width: "100%",
    minWidth: "720px",
    borderCollapse: "collapse",
    textAlign: "left",
  },

  th: {
    padding: "16px 14px",
    background: "#17273a",
    color: "#aebed0",
    fontSize: "12px",
    textTransform: "uppercase",
    letterSpacing: "0.5px",
    whiteSpace: "nowrap",
  },

  td: {
    padding: "14px",
    borderTop: "1px solid #223247",
    fontSize: "13px",
    whiteSpace: "nowrap",
  },

  player: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
  },

  playerPhoto: {
    width: "38px",
    height: "38px",
    borderRadius: "50%",
    objectFit: "cover",
    background: "#26374b",
  },

  photoPlaceholder: {
    width: "38px",
    height: "38px",
    borderRadius: "50%",
    display: "grid",
    placeItems: "center",
    background: "#26374b",
    color: "#35d07f",
    fontWeight: 700,
  },

  playerName: {
    fontWeight: 700,
    color: "#f1f5f9",
  },

  smallText: {
    marginTop: "4px",
    fontSize: "11px",
    color: "#93a6ba",
  },

  club: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
  },

  clubLogo: {
    width: "23px",
    height: "23px",
    objectFit: "contain",
  },

  goals: {
    padding: "14px",
    borderTop: "1px solid #223247",
    color: "#35d07f",
    fontSize: "16px",
    fontWeight: 800,
  },
};
