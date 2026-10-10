
"use client";

import { useEffect, useMemo, useState } from "react";

const CURRENT_SEASON = 2026;

const COLORS = {
  page: "#0b1120",
  panel: "#111c30",
  panelLight: "#18263d",
  border: "#253550",
  text: "#f1f5f9",
  muted: "#94a3b8",
  accent: "#38bdf8",
  green: "#22c55e",
  red: "#f87171",
};

export default function StandingsPage() {
  const [countries, setCountries] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedSeason, setSelectedSeason] = useState(CURRENT_SEASON);
  const [openedCountry, setOpenedCountry] = useState(null);
  const [openedLeague, setOpenedLeague] = useState(null);
  const [tables, setTables] = useState({});
  const [tableLoading, setTableLoading] = useState({});
  const [tableErrors, setTableErrors] = useState({});
  const [loading, setLoading] = useState(true);
  const [leagueError, setLeagueError] = useState("");

  useEffect(() => {
    let cancelled = false;

    async function loadLeagues() {
      setLoading(true);
      setLeagueError("");

      try {
        const response = await fetch("/api/leagues");
        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data?.error || "Unable to retrieve leagues."
          );
        }

        if (data?.errors && Object.keys(data.errors).length) {
          throw new Error(JSON.stringify(data.errors));
        }

        if (!Array.isArray(data.response)) {
          throw new Error("The leagues API returned an unexpected response.");
        }

        const grouped = {};

        for (const item of data.response) {
          const country =
            typeof item.country === "string"
              ? item.country
              : item.country?.name;

          if (!country || !item.league?.id) continue;

          if (!grouped[country]) grouped[country] = [];

          grouped[country].push(item);
        }

        const result = Object.entries(grouped)
          .map(([country, leagues]) => ({
            country,
            leagues: leagues.sort((a, b) =>
              (a.league?.name || "").localeCompare(
                b.league?.name || ""
              )
            ),
          }))
          .sort((a, b) => a.country.localeCompare(b.country));

        if (!cancelled) setCountries(result);
      } catch (error) {
        if (!cancelled) {
          setLeagueError(
            error instanceof Error
              ? error.message
              : "Unable to load leagues."
          );
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    loadLeagues();

    return () => {
      cancelled = true;
    };
  }, []);

  async function openLeague(league) {
    const leagueId = league.league.id;

    if (openedLeague === leagueId) {
      setOpenedLeague(null);
      return;
    }

    setOpenedLeague(leagueId);

    const cacheKey = `${leagueId}-${selectedSeason}`;

    if (tables[cacheKey]) return;

    setTableLoading((previous) => ({
      ...previous,
      [cacheKey]: true,
    }));

    setTableErrors((previous) => ({
      ...previous,
      [cacheKey]: "",
    }));

    try {
      const response = await fetch(
        `/api/standings?league=${leagueId}&season=${selectedSeason}`
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data?.error || "Unable to load this league's standings."
        );
      }

      if (data?.errors && Object.keys(data.errors).length) {
        throw new Error(JSON.stringify(data.errors));
      }

      const leagueData = data.response?.[0];
      const standings = leagueData?.league?.standings?.[0];

      if (!leagueData || !Array.isArray(standings)) {
        throw new Error(
          `No standings are available for the ${selectedSeason} season.`
        );
      }

      setTables((previous) => ({
        ...previous,
        [cacheKey]: leagueData,
      }));
    } catch (error) {
      setTableErrors((previous) => ({
        ...previous,
        [cacheKey]:
          error instanceof Error
            ? error.message
            : "Unable to load standings.",
      }));
    } finally {
      setTableLoading((previous) => ({
        ...previous,
        [cacheKey]: false,
      }));
    }
  }

  const filteredCountries = useMemo(() => {
    const query = search.trim().toLowerCase();

    if (!query) return countries;

    return countries
      .map((countryData) => {
        const countryMatches = countryData.country
          .toLowerCase()
          .includes(query);

        const matchingLeagues = countryData.leagues.filter((league) =>
          (league.league?.name || "").toLowerCase().includes(query)
        );

        if (countryMatches) return countryData;

        // Also search teams in standings tables already loaded.
        const matchingLoadedLeagues = countryData.leagues.filter(
          (league) => {
            const table = tables[
              `${league.league.id}-${selectedSeason}`
            ];

            return table?.league?.standings?.[0]?.some((team) =>
              (team.team?.name || "").toLowerCase().includes(query)
            );
          }
        );

        const combined = [
          ...matchingLeagues,
          ...matchingLoadedLeagues,
        ];

        const unique = Array.from(
          new Map(
            combined.map((league) => [
              league.league.id,
              league,
            ])
          ).values()
        );

        return unique.length
          ? { ...countryData, leagues: unique }
          : null;
      })
      .filter(Boolean);
  }, [countries, search, tables, selectedSeason]);

  const activeTable =
    openedLeague != null
      ? tables[`${openedLeague}-${selectedSeason}`]
      : null;

  const activeStandings =
    activeTable?.league?.standings?.[0] || [];

  const totalTeams = activeStandings.length;

  const leader = activeStandings[0];

  return (
    <main style={styles.page}>
      <header style={styles.header}>
        <div style={styles.headerInner}>
          <div style={styles.brand}>
            <div style={styles.brandIcon}>⚽</div>
            <div>
              <div style={styles.brandName}>SPORTS LIVE</div>
              <div style={styles.brandSubtitle}>
                FOOTBALL STANDINGS
              </div>
            </div>
          </div>

          <div style={styles.seasonControl}>
            <label htmlFor="season" style={styles.label}>
              SEASON
            </label>
            <select
              id="season"
              value={selectedSeason}
              onChange={(event) => {
                setSelectedSeason(Number(event.target.value));
                setOpenedLeague(null);
              }}
              style={styles.select}
            >
              {[2026, 2025, 2024, 2023, 2022].map((year) => (
                <option key={year} value={year}>
                  {year}/{String(year + 1).slice(-2)}
                </option>
              ))}
            </select>
          </div>
        </div>
      </header>

      <div style={styles.container}>
        <section style={styles.hero}>
          <div style={{ flex: 1 }}>
            <p style={styles.eyebrow}>THE NUMBERS THAT MATTER</p>
            <h1 style={styles.heroTitle}>League standings</h1>
            <p style={styles.heroDescription}>
              Explore leagues around the world, compare team
              performance and follow the race for the top.
            </p>
          </div>
          <div style={styles.heroBall}>⚽</div>
        </section>

        <section style={styles.summaryGrid}>
          <SummaryCard
            label="COUNTRIES"
            value={loading ? "…" : countries.length}
            icon="🌍"
          />
          <SummaryCard
            label="TEAMS IN TABLE"
            value={totalTeams || "—"}
            icon="👥"
          />
          <SummaryCard
            label="LEAGUE LEADER"
            value={leader?.team?.name || "Select a league"}
            icon="🏆"
          />
        </section>

        <section style={styles.searchPanel}>
          <div style={styles.searchInputWrap}>
            <span style={styles.searchIcon}>⌕</span>
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search country, league or loaded team..."
              aria-label="Search country, league or team"
              style={styles.searchInput}
            />
            {search && (
              <button
                type="button"
                onClick={() => setSearch("")}
                style={styles.clearButton}
              >
                Clear
              </button>
            )}
          </div>

          <p style={styles.searchHint}>
            Select a country, then choose a league to view its table.
            Team search includes standings you've already opened.
          </p>
        </section>

        {loading && (
          <div style={styles.notice}>
            <span style={styles.spinner}>◌</span>
            Loading leagues…
          </div>
        )}

        {!loading && leagueError && (
          <div style={styles.errorBox}>
            <strong>Unable to load leagues</strong>
            <p>{leagueError}</p>
            <button
              onClick={() => window.location.reload()}
              style={styles.retryButton}
            >
              Try again
            </button>
          </div>
        )}

        {!loading && !leagueError && filteredCountries.length === 0 && (
          <div style={styles.notice}>
            No matching countries or leagues found.
          </div>
        )}

        {!loading && !leagueError && (
          <div style={styles.contentGrid}>
            <section style={styles.leagueBrowser}>
              <div style={styles.sectionHeading}>
                <div>
                  <h2 style={styles.sectionTitle}>Browse competitions</h2>
                  <p style={styles.muted}>
                    {filteredCountries.length} countries
                  </p>
                </div>
              </div>

              {filteredCountries.map((countryData) => {
                const isCountryOpen =
                  openedCountry === countryData.country;

                return (
                  <div
                    key={countryData.country}
                    style={styles.countryCard}
                  >
                    <button
                      type="button"
                      onClick={() =>
                        setOpenedCountry(
                          isCountryOpen ? null : countryData.country
                        )
                      }
                      aria-expanded={isCountryOpen}
                      style={{
                        ...styles.countryButton,
                        background: isCountryOpen
                          ? "#1b2c45"
                          : "transparent",
                      }}
                    >
                      <span style={styles.countryIcon}>🌐</span>
                      <span style={styles.countryName}>
                        {countryData.country}
                        <small style={styles.countryCount}>
                          {countryData.leagues.length} competitions
                        </small>
                      </span>
                      <span style={styles.chevron}>
                        {isCountryOpen ? "−" : "+"}
                      </span>
                    </button>

                    {isCountryOpen && (
                      <div style={styles.leagueList}>
                        {countryData.leagues.map((league) => {
                          const leagueId = league.league.id;
                          const isSelected = openedLeague === leagueId;

                          return (
                            <button
                              type="button"
                              key={leagueId}
                              onClick={() => openLeague(league)}
                              style={{
                                ...styles.leagueButton,
                                background: isSelected
                                  ? "rgba(56,189,248,0.12)"
                                  : "transparent",
                                borderLeft: isSelected
                                  ? `3px solid ${COLORS.accent}`
                                  : "3px solid transparent",
                              }}
                            >
                              {league.league.logo ? (
                                <img
                                  src={league.league.logo}
                                  alt=""
                                  width={34}
                                  height={34}
                                  style={styles.leagueLogo}
                                />
                              ) : (
                                <span style={styles.leagueLogoFallback}>
                                  ⚽
                                </span>
                              )}

                              <span style={styles.leagueName}>
                                {league.league.name}
                              </span>
                              <span style={styles.leagueArrow}>
                                {isSelected ? "▾" : "›"}
                              </span>
                            </button>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              })}
            </section>

            <section style={styles.tablePanel}>
              {!openedLeague && (
                <div style={styles.emptyPanel}>
                  <div style={styles.emptyIcon}>🏆</div>
                  <h2 style={styles.sectionTitle}>
                    Choose a competition
                  </h2>
                  <p style={styles.muted}>
                    Open a country on the left and select a league
                    to see its standings for {selectedSeason}.
                  </p>
                </div>
              )}

              {openedLeague && (
                <>
                  <div style={styles.tableHeader}>
                    <div style={styles.tableLeagueIdentity}>
                      {activeTable?.league?.logo && (
                        <img
                          src={activeTable.league.logo}
                          alt=""
                          width={48}
                          height={48}
                          style={styles.leagueLogo}
                        />
                      )}
                      <div>
                        <h2 style={styles.tableTitle}>
                          {activeTable?.league?.name ||
                            countries
                              .flatMap((c) => c.leagues)
                              .find((l) => l.league.id === openedLeague)
                              ?.league?.name ||
                            "League standings"}
                        </h2>
                        <p style={styles.muted}>
                          {activeTable?.league?.country || "League table"}{" "}
                          · {selectedSeason}/{String(selectedSeason + 1).slice(-2)}
                        </p>
                      </div>
                    </div>
                    <span style={styles.tableBadge}>
                      {activeStandings.length} TEAMS
                    </span>
                  </div>

                  {tableLoading[
                    `${openedLeague}-${selectedSeason}`
                  ] && (
                    <div style={styles.notice}>
                      Loading standings…
                    </div>
                  )}

                  {tableErrors[
                    `${openedLeague}-${selectedSeason}`
                  ] && (
                    <div style={styles.errorBox}>
                      <strong>Standings unavailable</strong>
                      <p>
                        {tableErrors[
                          `${openedLeague}-${selectedSeason}`
                        ]}
                      </p>
                      <button
                        onClick={() => {
                          const league = countries
                            .flatMap((c) => c.leagues)
                            .find((l) => l.league.id === openedLeague);

                          if (league) {
                            setTables((previous) => {
                              const next = { ...previous };
                              delete next[
                                `${openedLeague}-${selectedSeason}`
                              ];
                              return next;
                            });
                            openLeague(league);
                          }
                        }}
                        style={styles.retryButton}
                      >
                        Retry standings
                      </button>
                    </div>
                  )}

                  {!tableLoading[
                    `${openedLeague}-${selectedSeason}`
                  ] &&
                    !tableErrors[
                      `${openedLeague}-${selectedSeason}`
                    ] &&
                    activeStandings.length > 0 && (
                      <div style={styles.tableScroll}>
                        <table style={styles.table}>
                          <thead>
                            <tr>
                              {[
                                "#",
                                "TEAM",
                                "P",
                                "W",
                                "D",
                                "L",
                                "GD",
                                "PTS",
                              ].map((heading) => (
                                <th
                                  key={heading}
                                  style={{
                                    ...styles.th,
                                    textAlign:
                                      heading === "TEAM" ? "left" : "center",
                                  }}
                                >
                                  {heading}
                                </th>
                              ))}
                            </tr>
                          </thead>

                          <tbody>
                            {activeStandings.map((row, index) => {
                              const rank = row.rank ?? index + 1;
                              const played = row.all?.played ?? 0;
                              const wins = row.all?.win ?? 0;
                              const draws = row.all?.draw ?? 0;
                              const losses = row.all?.lose ?? 0;
                              const goalDifference = row.goalsDiff ?? 0;

                              return (
                                <tr
                                  key={row.team?.id || rank}
                                  style={{
                                    ...styles.tr,
                                    background:
                                      rank === 1
                                        ? "rgba(34,197,94,0.055)"
                                        : "transparent",
                                  }}
                                >
                                  <td style={styles.td}>
                                    <div style={styles.rankCell}>
                                      <span
                                        style={{
                                          ...styles.rankIndicator,
                                          background:
                                            rank <= 4
                                              ? COLORS.green
                                              : rank >=
                                                  activeStandings.length - 2
                                                ? COLORS.red
                                                : "#475569",
                                        }}
                                      />
                                      {rank}
                                    </div>
                                  </td>

                                  <td style={styles.teamTd}>
                                    <div style={styles.teamCell}>
                                      {row.team?.logo && (
                                        <img
                                          src={row.team.logo}
                                          alt=""
                                          width={27}
                                          height={27}
                                          style={styles.teamLogo}
                                        />
                                      )}
                                      <span style={styles.teamName}>
                                        {row.team?.name || "Unknown team"}
                                      </span>
                                    </div>
                                  </td>

                                  {[played, wins, draws, losses].map(
                                    (value, i) => (
                                      <td
                                        key={i}
                                        style={styles.tdCenter}
                                      >
                                        {value}
                                      </td>
                                    )
                                  )}

                                  <td
                                    style={{
                                      ...styles.tdCenter,
                                      color:
                                        goalDifference > 0
                                          ? COLORS.green
                                          : goalDifference < 0
                                            ? COLORS.red
                                            : COLORS.muted,
                                    }}
                                  >
                                    {goalDifference > 0 ? "+" : ""}
                                    {goalDifference}
                                  </td>

                                  <td
                                    style={{
                                      ...styles.tdCenter,
                                      fontWeight: 800,
                                      color: COLORS.text,
                                    }}
                                  >
                                    {row.points ?? 0}
                                  </td>
                                </tr>
                              );
                            })}
                          </tbody>
                        </table>
                      </div>
                    )}

                  {!tableLoading[
                    `${openedLeague}-${selectedSeason}`
                  ] &&
                    !tableErrors[
                      `${openedLeague}-${selectedSeason}`
                    ] &&
                    activeStandings.length === 0 &&
                    !activeTable && (
                      <div style={styles.notice}>
                        Select a league to load its standings.
                      </div>
                    )}
                </>
              )}
            </section>
          </div>
        )}

        <footer style={styles.footer}>
          Sports Live · League tables and team performance
        </footer>
      </div>
    </main>
  );
}

function SummaryCard({ label, value, icon }) {
  return (
    <div style={styles.summaryCard}>
      <div style={styles.summaryTop}>
        <span style={styles.summaryLabel}>{label}</span>
        <span style={styles.summaryIcon}>{icon}</span>
      </div>
      <strong style={styles.summaryValue}>{value}</strong>
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    background: COLORS.page,
    color: COLORS.text,
    fontFamily: "Arial, Helvetica, sans-serif",
    paddingBottom: 110,
  },
  header: {
    background: "rgba(12,20,35,0.97)",
    borderBottom: `1px solid ${COLORS.border}`,
    position: "sticky",
    top: 0,
    zIndex: 30,
  },
  headerInner: {
    maxWidth: 1450,
    margin: "0 auto",
    padding: "15px 22px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 18,
    flexWrap: "wrap",
  },
  brand: {
    display: "flex",
    alignItems: "center",
    gap: 12,
  },
  brandIcon: {
    width: 43,
    height: 43,
    borderRadius: 13,
    display: "grid",
    placeItems: "center",
    background: "#12304a",
    fontSize: 24,
  },
  brandName: {
    fontSize: 17,
    fontWeight: 900,
    letterSpacing: 1.4,
  },
  brandSubtitle: {
    fontSize: 10,
    color: COLORS.muted,
    letterSpacing: 2,
    marginTop: 4,
  },
  seasonControl: {
    display: "flex",
    alignItems: "center",
    gap: 12,
  },
  label: {
    fontSize: 11,
    fontWeight: 700,
    color: COLORS.muted,
    letterSpacing: 1,
  },
  select: {
    background: COLORS.panelLight,
    border: `1px solid ${COLORS.border}`,
    color: COLORS.text,
    borderRadius: 10,
    padding: "10px 13px",
    fontSize: 14,
  },
  container: {
    maxWidth: 1450,
    margin: "0 auto",
    padding: "22px",
  },
  hero: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 20,
    padding: "34px 30px",
    border: `1px solid ${COLORS.border}`,
    borderRadius: 24,
    background:
      "radial-gradient(ellipse at 90% 10%, rgba(56,189,248,0.14), transparent 45%), linear-gradient(135deg,#142239,#101a2c)",
  },
  eyebrow: {
    color: COLORS.accent,
    fontSize: 11,
    fontWeight: 800,
    letterSpacing: 2,
  },
  heroTitle: {
    fontSize: "clamp(32px,4vw,48px)",
    letterSpacing: -1.4,
    margin: "10px 0",
  },
  heroDescription: {
    maxWidth: 570,
    color: COLORS.muted,
    lineHeight: 1.7,
    marginBottom: 0,
  },
  heroBall: {
    fontSize: "clamp(55px,8vw,100px)",
    opacity: 0.8,
  },
  summaryGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit,minmax(190px,1fr))",
    gap: 15,
    margin: "20px 0",
  },
  summaryCard: {
    background: COLORS.panel,
    border: `1px solid ${COLORS.border}`,
    borderRadius: 18,
    padding: 19,
    minWidth: 0,
  },
  summaryTop: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 10,
  },
  summaryLabel: {
    color: COLORS.muted,
    fontSize: 11,
    fontWeight: 700,
    letterSpacing: 1,
  },
  summaryIcon: {
    fontSize: 21,
  },
  summaryValue: {
    display: "block",
    marginTop: 14,
    fontSize: 24,
    overflowWrap: "anywhere",
  },
  searchPanel: {
    padding: 18,
    borderRadius: 18,
    border: `1px solid ${COLORS.border}`,
    background: COLORS.panel,
    marginBottom: 24,
  },
  searchInputWrap: {
    display: "flex",
    alignItems: "center",
    gap: 12,
    background: COLORS.page,
    border: `1px solid ${COLORS.border}`,
    borderRadius: 12,
    padding: "0 14px",
  },
  searchIcon: {
    fontSize: 25,
    color: COLORS.accent,
  },
  searchInput: {
    flex: 1,
    width: "100%",
    minWidth: 0,
    padding: "14px 0",
    border: 0,
    outline: 0,
    background: "transparent",
    color: COLORS.text,
    fontSize: 15,
  },
  clearButton: {
    border: 0,
    background: "transparent",
    color: COLORS.accent,
    cursor: "pointer",
    padding: 8,
  },
  searchHint: {
    fontSize: 12,
    color: COLORS.muted,
    margin: "12px 0 0",
    lineHeight: 1.6,
  },
  contentGrid: {
    display: "grid",
    gridTemplateColumns: "minmax(270px, 0.8fr) minmax(0, 1.7fr)",
    alignItems: "start",
    gap: 20,
  },
  leagueBrowser: {
    minWidth: 0,
  },
  sectionHeading: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 21,
    margin: "0 0 7px",
  },
  muted: {
    color: COLORS.muted,
    fontSize: 13,
    margin: 0,
    lineHeight: 1.6,
  },
  countryCard: {
    border: `1px solid ${COLORS.border}`,
    background: COLORS.panel,
    borderRadius: 15,
    overflow: "hidden",
    marginBottom: 10,
  },
  countryButton: {
    display: "flex",
    alignItems: "center",
    gap: 12,
    width: "100%",
    padding: 14,
    border: 0,
    color: COLORS.text,
    cursor: "pointer",
    textAlign: "left",
  },
  countryIcon: {
    fontSize: 22,
  },
  countryName: {
    flex: 1,
    fontSize: 14,
    fontWeight: 700,
    minWidth: 0,
    overflowWrap: "anywhere",
  },
  countryCount: {
    display: "block",
    fontSize: 11,
    fontWeight: 400,
    color: COLORS.muted,
    marginTop: 5,
  },
  chevron: {
    fontSize: 23,
    color: COLORS.accent,
  },
  leagueList: {
    borderTop: `1px solid ${COLORS.border}`,
    padding: "5px 0",
  },
  leagueButton: {
    display: "flex",
    alignItems: "center",
    gap: 10,
    width: "100%",
    padding: "11px 13px",
    borderTop: 0,
    borderRight: 0,
    borderBottom: 0,
    color: COLORS.text,
    cursor: "pointer",
    textAlign: "left",
  },
  leagueLogo: {
    objectFit: "contain",
    flexShrink: 0,
  },
  leagueLogoFallback: {
    width: 34,
    height: 34,
    display: "grid",
    placeItems: "center",
  },
  leagueName: {
    flex: 1,
    fontSize: 13,
    fontWeight: 600,
    lineHeight: 1.5,
    minWidth: 0,
  },
  leagueArrow: {
    color: COLORS.accent,
    fontSize: 20,
  },
  tablePanel: {
    minWidth: 0,
    background: COLORS.panel,
    border: `1px solid ${COLORS.border}`,
    borderRadius: 20,
    overflow: "hidden",
  },
  emptyPanel: {
    textAlign: "center",
    padding: "65px 25px",
  },
  emptyIcon: {
    fontSize: 54,
    marginBottom: 18,
  },
  tableHeader: {
    padding: 20,
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 14,
    flexWrap: "wrap",
    borderBottom: `1px solid ${COLORS.border}`,
  },
  tableLeagueIdentity: {
    display: "flex",
    alignItems: "center",
    gap: 13,
    minWidth: 0,
  },
  tableTitle: {
    fontSize: 19,
    margin: "0 0 7px",
  },
  tableBadge: {
    fontSize: 10,
    color: COLORS.accent,
    border: "1px solid #28516b",
    background: "#102a3d",
    padding: "7px 10px",
    borderRadius: 8,
    fontWeight: 800,
  },
  tableScroll: {
    width: "100%",
    overflowX: "auto",
  },
  table: {
    width: "100%",
    minWidth: 520,
    borderCollapse: "collapse",
    textAlign: "center",
  },
  th: {
    padding: "14px 9px",
    color: COLORS.muted,
    background: "#152239",
    fontSize: 10,
    letterSpacing: 0.7,
    fontWeight: 800,
    whiteSpace: "nowrap",
  },
  tr: {
    borderBottom: `1px solid ${COLORS.border}`,
  },
  td: {
    padding: "14px 9px",
    fontSize: 13,
    color: "#cbd5e1",
  },
  tdCenter: {
    padding: "14px 9px",
    fontSize: 13,
    color: "#cbd5e1",
    whiteSpace: "nowrap",
  },
  rankCell: {
    display: "flex",
    alignItems: "center",
    gap: 8,
    justifyContent: "center",
  },
  rankIndicator: {
    width: 3,
    height: 20,
    borderRadius: 4,
  },
  teamTd: {
    padding: "12px 9px",
    textAlign: "left",
  },
  teamCell: {
    display: "flex",
    alignItems: "center",
    gap: 10,
    minWidth: 150,
  },
  teamLogo: {
    objectFit: "contain",
    flexShrink: 0,
  },
  teamName: {
    fontSize: 13,
    fontWeight: 600,
    lineHeight: 1.5,
  },
  notice: {
    padding: 25,
    color: COLORS.muted,
    textAlign: "center",
    lineHeight: 1.7,
  },
  errorBox: {
    margin: 18,
    padding: 18,
    background: "#321b26",
    border: "1px solid #743448",
    borderRadius: 12,
    color: "#fecdd3",
    overflowWrap: "anywhere",
  },
  retryButton: {
    padding: "10px 14px",
    borderRadius: 9,
    border: "1px solid #3c647f",
    background: "#153149",
    color: "#e0f2fe",
    cursor: "pointer",
  },
  spinner: {
    fontSize: 23,
    marginRight: 8,
  },
  footer: {
    marginTop: 45,
    padding: "20px 0",
    borderTop: `1px solid ${COLORS.border}`,
    color: "#64748b",
    fontSize: 12,
    textAlign: "center",
  },
};

<style jsx global>{`
  @media (max-width: 850px) {
    .unused {
      display: none;
    }
  }
`}</style>
