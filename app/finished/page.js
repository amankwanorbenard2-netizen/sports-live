
"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";

const styles = {
  page: {
    minHeight: "100vh",
    background: "#07111f",
    color: "#f1f5f9",
    paddingBottom: 100,
    fontFamily: "Arial, sans-serif",
  },
  header: {
    padding: "18px 22px",
    borderBottom: "1px solid #223047",
    display: "flex",
    alignItems: "center",
    gap: 12,
    background: "#0c1728",
  },
  brandIcon: {
    width: 42,
    height: 42,
    display: "grid",
    placeItems: "center",
    borderRadius: 12,
    background: "#183047",
    fontSize: 24,
  },
  content: {
    maxWidth: 1400,
    margin: "0 auto",
    padding: 22,
  },
  eyebrow: {
    color: "#38bdf8",
    fontSize: 11,
    fontWeight: 800,
    letterSpacing: 2,
  },
  title: {
    fontSize: "clamp(32px, 5vw, 48px)",
    margin: "8px 0",
    letterSpacing: -1,
  },
  muted: {
    color: "#94a3b8",
    fontSize: 13,
    lineHeight: 1.6,
  },
  filters: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(190px, 1fr))",
    gap: 12,
    padding: 16,
    margin: "24px 0",
    background: "#101d30",
    border: "1px solid #223047",
    borderRadius: 18,
  },
  input: {
    width: "100%",
    boxSizing: "border-box",
    padding: "13px 14px",
    borderRadius: 10,
    border: "1px solid #30415a",
    background: "#07111f",
    color: "#f1f5f9",
    outline: "none",
    fontSize: 14,
  },
  summary: {
    display: "flex",
    flexWrap: "wrap",
    gap: 10,
    marginBottom: 20,
  },
  summaryCard: {
    flex: "1 1 150px",
    background: "#101d30",
    border: "1px solid #223047",
    borderRadius: 14,
    padding: 15,
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 340px), 1fr))",
    gap: 16,
  },
  card: {
    display: "block",
    color: "inherit",
    textDecoration: "none",
    background: "#101d30",
    border: "1px solid #253650",
    borderRadius: 18,
    padding: 18,
    transition: "border-color 150ms ease, transform 150ms ease",
  },
  league: {
    display: "flex",
    alignItems: "center",
    gap: 10,
    paddingBottom: 14,
    marginBottom: 18,
    borderBottom: "1px solid #253650",
  },
  leagueLogo: {
    width: 30,
    height: 30,
    objectFit: "contain",
  },
  teams: {
    display: "grid",
    gridTemplateColumns: "minmax(0, 1fr) auto minmax(0, 1fr)",
    alignItems: "center",
    gap: 10,
  },
  team: {
    minWidth: 0,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    textAlign: "center",
    gap: 9,
  },
  teamLogo: {
    width: 55,
    height: 55,
    objectFit: "contain",
  },
  teamName: {
    fontSize: 14,
    fontWeight: 700,
    lineHeight: 1.4,
    overflowWrap: "anywhere",
  },
  score: {
    fontSize: 30,
    fontWeight: 900,
    whiteSpace: "nowrap",
    letterSpacing: -1,
  },
  status: {
    display: "inline-block",
    background: "#123629",
    color: "#4ade80",
    padding: "5px 9px",
    borderRadius: 7,
    fontSize: 11,
    fontWeight: 800,
    marginTop: 8,
  },
  matchFooter: {
    display: "flex",
    justifyContent: "space-between",
    gap: 10,
    alignItems: "center",
    flexWrap: "wrap",
    marginTop: 20,
    color: "#94a3b8",
    fontSize: 12,
  },
  notice: {
    textAlign: "center",
    padding: "36px 20px",
    border: "1px solid #253650",
    background: "#101d30",
    borderRadius: 16,
    color: "#cbd5e1",
    lineHeight: 1.7,
  },
  button: {
    border: "1px solid #38536d",
    background: "#183047",
    color: "#e0f2fe",
    padding: "10px 14px",
    borderRadius: 9,
    cursor: "pointer",
    fontWeight: 700,
  },
};

const leagueOrder = [
  "Premier League",
  "UEFA Champions League",
  "La Liga",
  "Serie A",
  "Bundesliga",
  "Ligue 1",
];

function getLocalDate(dateValue) {
  if (!dateValue) return "";

  const date = new Date(dateValue);
  if (Number.isNaN(date.getTime())) return "";

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

function formatDate(dateValue) {
  if (!dateValue) return "Date unavailable";

  const date = new Date(dateValue);

  if (Number.isNaN(date.getTime())) return "Date unavailable";

  return date.toLocaleString(undefined, {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function FinishedPage() {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedLeague, setSelectedLeague] = useState("all");

  async function loadMatches() {
    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/finished", {
        cache: "no-store",
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data?.error || "Unable to load finished matches."
        );
      }

      if (data?.errors && Object.keys(data.errors).length > 0) {
        throw new Error(JSON.stringify(data.errors));
      }

      const events = Array.isArray(data.events) ? data.events : [];

      const sorted = [...events].sort((a, b) => {
        const aLeague = a.league?.name || "";
        const bLeague = b.league?.name || "";

        const aIndex = leagueOrder.indexOf(aLeague);
        const bIndex = leagueOrder.indexOf(bLeague);

        const aOrder = aIndex === -1 ? 999 : aIndex;
        const bOrder = bIndex === -1 ? 999 : bIndex;

        if (aOrder !== bOrder) return aOrder - bOrder;

        return (
          new Date(b.fixture?.date || 0).getTime() -
          new Date(a.fixture?.date || 0).getTime()
        );
      });

      setMatches(sorted);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Something went wrong while loading matches."
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadMatches();
  }, []);

  const leagues = useMemo(() => {
    return [...new Set(
      matches.map((match) => match.league?.name).filter(Boolean)
    )].sort();
  }, [matches]);

  const filteredMatches = useMemo(() => {
    const query = search.trim().toLowerCase();

    return matches.filter((match) => {
      const home = match.teams?.home?.name || "";
      const away = match.teams?.away?.name || "";
      const league = match.league?.name || "";

      const matchesSearch =
        !query ||
        home.toLowerCase().includes(query) ||
        away.toLowerCase().includes(query) ||
        league.toLowerCase().includes(query);

      const matchesDate =
        !selectedDate ||
        getLocalDate(match.fixture?.date) === selectedDate;

      const matchesLeague =
        selectedLeague === "all" || league === selectedLeague;

      return matchesSearch && matchesDate && matchesLeague;
    });
  }, [matches, search, selectedDate, selectedLeague]);

  const today = getLocalDate(new Date());

  return (
    <main style={styles.page}>
      <header style={styles.header}>
        <div style={styles.brandIcon}>⚽</div>
        <div>
          <div style={{ fontWeight: 900, fontSize: 19, letterSpacing: 1 }}>
            SPORTS LIVE
          </div>
          <div style={{ color: "#94a3b8", fontSize: 10, letterSpacing: 2 }}>
            FOOTBALL RESULTS
          </div>
        </div>
      </header>

      <div style={styles.content}>
        <p style={styles.eyebrow}>MATCH CENTRE / RESULTS</p>
        <h1 style={styles.title}>Finished Matches</h1>
        <p style={styles.muted}>
          Final scores, completed fixtures and results from your football API.
        </p>

        <section style={styles.summary}>
          <div style={styles.summaryCard}>
            <div style={styles.muted}>MATCHES LOADED</div>
            <strong style={{ display: "block", fontSize: 26, marginTop: 8 }}>
              {loading ? "…" : matches.length}
            </strong>
          </div>
          <div style={styles.summaryCard}>
            <div style={styles.muted}>MATCHES SHOWN</div>
            <strong style={{ display: "block", fontSize: 26, marginTop: 8 }}>
              {loading ? "…" : filteredMatches.length}
            </strong>
          </div>
          <div style={styles.summaryCard}>
            <div style={styles.muted}>TODAY</div>
            <strong style={{ display: "block", fontSize: 16, marginTop: 12 }}>
              {today}
            </strong>
          </div>
        </section>

        <section style={styles.filters}>
          <input
            style={styles.input}
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search team or league..."
            aria-label="Search team or league"
          />

          <input
            style={styles.input}
            type="date"
            value={selectedDate}
            onChange={(event) => setSelectedDate(event.target.value)}
            aria-label="Filter by match date"
          />

          <select
            style={styles.input}
            value={selectedLeague}
            onChange={(event) => setSelectedLeague(event.target.value)}
            aria-label="Filter by league"
          >
            <option value="all">All leagues</option>
            {leagues.map((league) => (
              <option key={league} value={league}>
                {league}
              </option>
            ))}
          </select>

          <button
            type="button"
            style={styles.button}
            onClick={() => {
              setSearch("");
              setSelectedDate("");
              setSelectedLeague("all");
            }}
          >
            Clear filters
          </button>
        </section>

        {loading && (
          <div style={styles.notice}>Loading finished matches…</div>
        )}

        {!loading && error && (
          <div style={styles.notice}>
            <strong>Unable to load results</strong>
            <p>{error}</p>
            <button style={styles.button} onClick={loadMatches}>
              Try again
            </button>
          </div>
        )}

        {!loading && !error && filteredMatches.length === 0 && (
          <div style={styles.notice}>
            <div style={{ fontSize: 34, marginBottom: 12 }}>⚽</div>
            <strong>No matching finished matches</strong>
            <p style={styles.muted}>
              Try a different date or clear your filters. If no matches
              appear, check which fixtures your /api/finished endpoint returns.
            </p>
          </div>
        )}

        {!loading && !error && filteredMatches.length > 0 && (
          <section style={styles.grid}>
            {filteredMatches.map((match) => {
              const id = match.fixture?.id;
              const home = match.teams?.home;
              const away = match.teams?.away;
              const goals = match.goals || {};
              const status = match.fixture?.status?.short || "FT";

              return (
                <Link
                  key={id}
                  href={id ? `/match/${id}` : "#"}
                  style={styles.card}
                >
                  <div style={styles.league}>
                    {match.league?.logo && (
                      <img
                        src={match.league.logo}
                        alt=""
                        style={styles.leagueLogo}
                      />
                    )}
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontWeight: 700, fontSize: 13 }}>
                        {match.league?.name || "Football"}
                      </div>
                      <div style={styles.muted}>
                        {match.league?.country || ""}
                      </div>
                    </div>
                    <span style={styles.status}>{status}</span>
                  </div>

                  <div style={styles.teams}>
                    <div style={styles.team}>
                      {home?.logo && (
                        <img
                          src={home.logo}
                          alt=""
                          style={styles.teamLogo}
                        />
                      )}
                      <div style={styles.teamName}>
                        {home?.name || "Home team"}
                      </div>
                    </div>

                    <div style={{ textAlign: "center" }}>
                      <div style={styles.score}>
                        {goals.home ?? "–"} : {goals.away ?? "–"}
                      </div>
                      <div
                        style={{
                          color: "#4ade80",
                          fontSize: 10,
                          fontWeight: 800,
                          marginTop: 7,
                        }}
                      >
                        {status === "PEN"
                          ? "PENALTIES"
                          : status === "AET"
                            ? "AFTER EXTRA TIME"
                            : "FULL TIME"}
                      </div>
                    </div>

                    <div style={styles.team}>
                      {away?.logo && (
                        <img
                          src={away.logo}
                          alt=""
                          style={styles.teamLogo}
                        />
                      )}
                      <div style={styles.teamName}>
                        {away?.name || "Away team"}
                      </div>
                    </div>
                  </div>

                  <div style={styles.matchFooter}>
                    <span>{formatDate(match.fixture?.date)}</span>
                    <span>Match details →</span>
                  </div>
                </Link>
              );
            })}
          </section>
        )}
      </div>
    </main>
  );
}
