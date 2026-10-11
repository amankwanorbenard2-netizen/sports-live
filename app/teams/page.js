
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import styles from "./teams.module.css";

const LEAGUES = [
  { id: 39, name: "Premier League", country: "England" },
  { id: 140, name: "La Liga", country: "Spain" },
  { id: 135, name: "Serie A", country: "Italy" },
  { id: 78, name: "Bundesliga", country: "Germany" },
  { id: 61, name: "Ligue 1", country: "France" },
  { id: 2, name: "Champions League", country: "Europe" },
  { id: 3, name: "Europa League", country: "Europe" },
  { id: 848, name: "Conference League", country: "Europe" },
  { id: 45, name: "FA Cup", country: "England" },
  { id: 48, name: "EFL Cup", country: "England" },
  { id: 143, name: "Copa del Rey", country: "Spain" },
  { id: 137, name: "Coppa Italia", country: "Italy" },
  { id: 81, name: "DFB Pokal", country: "Germany" },
  { id: 66, name: "Coupe de France", country: "France" },
  { id: 88, name: "Eredivisie", country: "Netherlands" },
  { id: 94, name: "Primeira Liga", country: "Portugal" },
  { id: 203, name: "Süper Lig", country: "Türkiye" },
  { id: 71, name: "Brasileirão Série A", country: "Brazil" },
  { id: 128, name: "Liga Profesional", country: "Argentina" },
  { id: 253, name: "Major League Soccer", country: "USA" },
  { id: 262, name: "Liga MX", country: "Mexico" },
  { id: 307, name: "Saudi Pro League", country: "Saudi Arabia" },
  { id: 292, name: "J1 League", country: "Japan" },
  { id: 169, name: "Chinese Super League", country: "China" },
  { id: 144, name: "Belgian Pro League", country: "Belgium" },
  { id: 179, name: "Scottish Premiership", country: "Scotland" },
  { id: 218, name: "Austrian Bundesliga", country: "Austria" },
];

function normalizeTeams(result) {
  const list = Array.isArray(result?.teams)
    ? result.teams
    : Array.isArray(result?.response)
      ? result.response
      : Array.isArray(result)
        ? result
        : [];

  return list
    .map((item) => item?.team || item)
    .filter((team) => team?.id != null);
}

export default function TeamsPage() {
  const [season, setSeason] = useState("2026");
  const [league, setLeague] = useState("39");
  const [search, setSearch] = useState("");
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [retry, setRetry] = useState(0);

  useEffect(() => {
    const controller = new AbortController();

    async function loadTeams() {
      setLoading(true);
      setError("");
      setTeams([]);

      try {
        const query = new URLSearchParams({
          league,
          season,
        });

        const response = await fetch(
          `/api/teams?${query.toString()}`,
          {
            cache: "no-store",
            signal: controller.signal,
          }
        );

        const result = await response.json();

        if (!response.ok) {
          throw new Error(
            result?.error || `Unable to load teams (${response.status}).`
          );
        }

        const list = normalizeTeams(result);

        if (!controller.signal.aborted) {
          setTeams(list);
        }
      } catch (err) {
        if (err.name === "AbortError") return;

        console.error("Teams loading error:", err);

        if (!controller.signal.aborted) {
          setError(err.message || "Unable to load teams.");
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    }

    loadTeams();

    return () => controller.abort();
  }, [league, season, retry]);

  const filteredTeams = teams.filter((team) => {
    const searchableText = [
      team.name,
      team.country,
      team.code,
    ]
      .filter(Boolean)
      .join(" ")
      .toLowerCase();

    return searchableText.includes(search.trim().toLowerCase());
  });

  const selectedLeague =
    LEAGUES.find((item) => String(item.id) === league) || LEAGUES[0];

  return (
    <main className={styles.page}>
      <div className={styles.container}>
        <nav className={styles.breadcrumb}>
          <Link href="/">Home</Link>
          <span>/</span>
          <span>Teams</span>
        </nav>

        <header className={styles.hero}>
          <div className={styles.heroText}>
            <span className={styles.eyebrow}>
              <span className={styles.liveDot} />
              THE HOME OF FOOTBALL
            </span>

            <h1>
              Explore <span>Teams.</span>
            </h1>

            <p>
              Discover clubs, explore their squads, and follow
              upcoming matches and recent results.
            </p>
          </div>

          <div className={styles.heroBall} aria-hidden="true">
            ⚽
          </div>
        </header>

        <section className={styles.filterPanel}>
          <div className={styles.filterHeading}>
            <div>
              <h2>Find your team</h2>
              <p>Choose a competition and season to get started.</p>
            </div>

            <span className={styles.filterIcon}>⚙</span>
          </div>

          <div className={styles.filters}>
            <div className={styles.field}>
              <label htmlFor="competition">COMPETITION</label>

              <select
                id="competition"
                value={league}
                onChange={(event) => setLeague(event.target.value)}
              >
                {LEAGUES.map((item) => (
                  <option key={item.id} value={String(item.id)}>
                    {item.name} · {item.country}
                  </option>
                ))}
              </select>
            </div>

            <div className={styles.field}>
              <label htmlFor="season">SEASON</label>

              <select
                id="season"
                value={season}
                onChange={(event) => setSeason(event.target.value)}
              >
                <option value="2026">2026 / 27</option>
                <option value="2025">2025 / 26</option>
                <option value="2024">2024 / 25</option>
              </select>
            </div>

            <div className={`${styles.field} ${styles.searchField}`}>
              <label htmlFor="team-search">SEARCH CLUBS</label>

              <div className={styles.searchBox}>
                <span aria-hidden="true">⌕</span>

                <input
                  id="team-search"
                  type="search"
                  placeholder="Search by team name..."
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                />

                {search && (
                  <button
                    type="button"
                    onClick={() => setSearch("")}
                    aria-label="Clear search"
                  >
                    ×
                  </button>
                )}
              </div>
            </div>
          </div>
        </section>

        <section className={styles.results}>
          <div className={styles.resultsHeader}>
            <div className={styles.resultsTitle}>
              <div className={styles.titleAccent} />

              <div>
                <h2>{selectedLeague.name}</h2>
                <p>
                  {selectedLeague.country} · Season {season}
                </p>
              </div>
            </div>

            {!loading && !error && (
              <span className={styles.count}>
                {filteredTeams.length} CLUBS
              </span>
            )}
          </div>

          {loading && (
            <div className={styles.statePanel}>
              <div className={styles.spinner} />
              <h3>Loading teams</h3>
              <p>Fetching club information...</p>
            </div>
          )}

          {!loading && error && (
            <div className={styles.statePanel}>
              <div className={styles.stateIcon}>!</div>
              <h3>Couldn’t load teams</h3>
              <p>{error}</p>

              <button
                className={styles.primaryButton}
                type="button"
                onClick={() => setRetry((value) => value + 1)}
              >
                Try again
              </button>
            </div>
          )}

          {!loading && !error && filteredTeams.length === 0 && (
            <div className={styles.statePanel}>
              <div className={styles.stateIcon}>⚽</div>
              <h3>No teams found</h3>
              <p>
                Try another search or select a different competition.
              </p>

              {search && (
                <button
                  className={styles.primaryButton}
                  type="button"
                  onClick={() => setSearch("")}
                >
                  Clear search
                </button>
              )}
            </div>
          )}

          {!loading && !error && filteredTeams.length > 0 && (
            <div className={styles.grid}>
              {filteredTeams.map((team, index) => (
                <Link
                  key={team.id}
                  href={`/team/${team.id}?league=${encodeURIComponent(
                    league
                  )}&season=${encodeURIComponent(season)}`}
                  className={styles.teamCard}
                  style={{ "--card-index": index % 12 }}
                >
                  <div className={styles.cardTop}>
                    <span className={styles.clubNumber}>
                      {String(index + 1).padStart(2, "0")}
                    </span>

                    <span className={styles.arrow}>↗</span>
                  </div>

                  <div className={styles.logoWrap}>
                    {team.logo ? (
                      <img
                        src={team.logo}
                        alt={`${team.name || "Team"} logo`}
                        loading="lazy"
                      />
                    ) : (
                      <span className={styles.logoFallback}>⚽</span>
                    )}
                  </div>

                  <div className={styles.cardInfo}>
                    <h3>{team.name || "Unknown team"}</h3>
                    <p>{team.country || selectedLeague.country}</p>
                  </div>

                  <div className={styles.cardFooter}>
                    <span>VIEW TEAM PROFILE</span>
                    <span>→</span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </section>

        <footer className={styles.footer}>
          <span>SPORTS LIVE</span>
          <span>Every team. Every match. One place.</span>
        </footer>
      </div>
    </main>
  );
}
