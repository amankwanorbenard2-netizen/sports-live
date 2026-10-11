
"use client";

import { useEffect, useMemo, useState } from "react";
import StatsBackButton from "../../../components/StatsBackButton";

const leagues = [
  { id: "39", name: "Premier League" },
  { id: "140", name: "La Liga" },
  { id: "135", name: "Serie A" },
  { id: "78", name: "Bundesliga" },
  { id: "61", name: "Ligue 1" },
];

const seasons = ["2026", "2025", "2024", "2023"];

const styles = {
  input: {
    padding: "11px 12px",
    border: "1px solid #334155",
    borderRadius: 8,
    background: "#111c2e",
    color: "#f8fafc",
    minWidth: 150,
    maxWidth: "100%",
  },
  th: {
    padding: 12,
    textAlign: "left",
    whiteSpace: "nowrap",
    background: "#1e293b",
    fontSize: 13,
  },
  td: {
    padding: 12,
    borderBottom: "1px solid #263449",
    whiteSpace: "nowrap",
    fontSize: 14,
  },
  button: {
    padding: "10px 15px",
    borderRadius: 8,
    border: "1px solid #334155",
    background: "#172338",
    color: "#f8fafc",
    cursor: "pointer",
  },
};

export default function PlayerStatisticsPage() {
  const [league, setLeague] = useState("39");
  const [season, setSeason] = useState("2026");
  const [page, setPage] = useState(1);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("goals");
  const [retry, setRetry] = useState(0);

  useEffect(() => {
    const controller = new AbortController();

    async function loadPlayers() {
      setLoading(true);
      setError("");

      try {
        const response = await fetch(
          `/api/stats/players?league=${league}&season=${season}&page=${page}&retry=${retry}`,
          { signal: controller.signal }
        );

        const result = await response.json();

        if (!response.ok) {
          throw new Error(
            result.details
              ? JSON.stringify(result.details)
              : result.error || "Could not load player statistics."
          );
        }

        setData(result);
      } catch (err) {
        if (err.name !== "AbortError") {
          setError(err.message || "Unable to load player statistics.");
          setData(null);
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    }

    loadPlayers();

    return () => controller.abort();
  }, [league, season, page, retry]);

  const filteredPlayers = useMemo(() => {
    const players = [...(data?.players || [])];
    const term = search.trim().toLowerCase();

    return players
      .filter((player) =>
        `${player.name || ""} ${player.team || ""} ${player.position || ""}`
          .toLowerCase()
          .includes(term)
      )
      .sort((a, b) => {
        const first = Number(a[sortBy] ?? -1);
        const second = Number(b[sortBy] ?? -1);
        return second - first;
      });
  }, [data, search, sortBy]);

  function changeLeague(value) {
    setLeague(value);
    setPage(1);
    setSearch("");
  }

  function changeSeason(value) {
    setSeason(value);
    setPage(1);
    setSearch("");
  }

  return (
    <main
      style={{
        minHeight: "100vh",
        padding: "24px 14px 110px",
        background: "#0b1220",
        color: "#e5e7eb",
        maxWidth: 1250,
        margin: "0 auto",
        fontFamily: "Arial, sans-serif",
      }}
    >
      <StatsBackButton />

      <div style={{ margin: "20px 0 24px" }}>
        <p style={{ color: "#38bdf8", fontWeight: 700 }}>
          SPORTS LIVE · STATISTICS
        </p>

        <h1 style={{ fontSize: 30, fontWeight: 800, margin: "8px 0" }}>
          👤 Player Statistics
        </h1>

        <p style={{ color: "#94a3b8", lineHeight: 1.6 }}>
          Explore player performances by league and season.
        </p>
      </div>

      <div
        style={{
          display: "flex",
          gap: 10,
          flexWrap: "wrap",
          marginBottom: 18,
        }}
      >
        <select
          aria-label="League"
          value={league}
          onChange={(e) => changeLeague(e.target.value)}
          style={styles.input}
        >
          {leagues.map((item) => (
            <option key={item.id} value={item.id}>
              {item.name}
            </option>
          ))}
        </select>

        <select
          aria-label="Season"
          value={season}
          onChange={(e) => changeSeason(e.target.value)}
          style={styles.input}
        >
          {seasons.map((year) => (
            <option key={year} value={year}>
              {year}/{Number(year) + 1}
            </option>
          ))}
        </select>

        <select
          aria-label="Sort players"
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          style={styles.input}
        >
          <option value="goals">Most Goals</option>
          <option value="assists">Most Assists</option>
          <option value="appearances">Most Appearances</option>
          <option value="minutes">Most Minutes</option>
          <option value="rating">Highest Rating</option>
        </select>

        <input
          type="search"
          aria-label="Search players"
          placeholder="Search player or team..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{ ...styles.input, flex: "1 1 210px" }}
        />
      </div>

      {loading && (
        <p style={{ padding: 20, color: "#93c5fd" }}>
          Loading player statistics...
        </p>
      )}

      {!loading && error && (
        <div
          style={{
            padding: 16,
            border: "1px solid #7f1d1d",
            borderRadius: 10,
            background: "#27131a",
            color: "#fecaca",
          }}
        >
          <strong>Unable to load players</strong>
          <p style={{ overflowWrap: "anywhere" }}>{error}</p>

          <button
            style={styles.button}
            onClick={() => setRetry((current) => current + 1)}
          >
            Retry
          </button>
        </div>
      )}

      {!loading && !error && data && (
        <>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              flexWrap: "wrap",
              gap: 8,
              margin: "20px 0 14px",
              color: "#94a3b8",
              fontSize: 14,
            }}
          >
            <span>{filteredPlayers.length} displayed on this page</span>
            <span>
              Page {data.page} of {data.totalPages}
            </span>
          </div>

          {filteredPlayers.length === 0 ? (
            <p style={{ padding: 20 }}>
              No players match your search on this page.
            </p>
          ) : (
            <div
              style={{
                overflowX: "auto",
                border: "1px solid #263449",
                borderRadius: 12,
              }}
            >
              <table
                style={{
                  width: "100%",
                  borderCollapse: "collapse",
                  textAlign: "left",
                }}
              >
                <thead>
                  <tr>
                    {[
                      "#",
                      "Player",
                      "Club",
                      "Position",
                      "Apps",
                      "Minutes",
                      "Goals",
                      "Assists",
                      "Rating",
                    ].map((heading) => (
                      <th key={heading} style={styles.th}>
                        {heading}
                      </th>
                    ))}
                  </tr>
                </thead>

                <tbody>
                  {filteredPlayers.map((player, index) => (
                    <tr key={player.id || index}>
                      <td style={styles.td}>
                        {(data.page - 1) * 20 + index + 1}
                      </td>

                      <td style={styles.td}>
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: 9,
                          }}
                        >
                          {player.photo && (
                            <img
                              src={player.photo}
                              alt=""
                              loading="lazy"
                              width="38"
                              height="38"
                              style={{
                                borderRadius: "50%",
                                objectFit: "cover",
                              }}
                            />
                          )}

                          <div>
                            <div style={{ fontWeight: 700 }}>
                              {player.name}
                            </div>

                            {player.age != null && (
                              <small style={{ color: "#94a3b8" }}>
                                Age {player.age}
                              </small>
                            )}
                          </div>
                        </div>
                      </td>

                      <td style={styles.td}>
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: 8,
                          }}
                        >
                          {player.teamLogo && (
                            <img
                              src={player.teamLogo}
                              alt=""
                              width="22"
                              height="22"
                              loading="lazy"
                            />
                          )}
                          {player.team}
                        </div>
                      </td>

                      <td style={styles.td}>{player.position}</td>
                      <td style={styles.td}>{player.appearances}</td>
                      <td style={styles.td}>
                        {Number(player.minutes || 0).toLocaleString()}
                      </td>
                      <td style={styles.td}>{player.goals}</td>
                      <td style={styles.td}>{player.assists}</td>
                      <td style={styles.td}>
                        {player.rating == null
                          ? "—"
                          : Number(player.rating).toFixed(2)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              gap: 12,
              marginTop: 22,
            }}
          >
            <button
              style={{
                ...styles.button,
                opacity: page <= 1 ? 0.45 : 1,
              }}
              disabled={page <= 1 || loading}
              onClick={() => setPage((current) => current - 1)}
            >
              ← Previous
            </button>

            <span style={{ color: "#94a3b8" }}>
              {page} / {data.totalPages}
            </span>

            <button
              style={{
                ...styles.button,
                opacity: page >= data.totalPages ? 0.45 : 1,
              }}
              disabled={page >= data.totalPages || loading}
              onClick={() => setPage((current) => current + 1)}
            >
              Next →
            </button>
          </div>

          <p
            style={{
              marginTop: 20,
              fontSize: 12,
              lineHeight: 1.6,
              color: "#64748b",
            }}
          >
            Statistics are provided by API-Football. Results are paginated;
            search and sorting apply to the current page only. Ratings may
            be unavailable for some players.
          </p>
        </>
      )}
    </main>
  );
}
