
"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";

const LEAGUE_PRIORITY = [
  // International
  "FIFA World Cup",
  "World Cup",
  "UEFA European Championship",
  "Euro Championship",
  "Copa America",
  "Africa Cup of Nations",
  "Asian Cup",
  "CONCACAF Gold Cup",
  "CONCACAF Nations League",
  "UEFA Nations League",
  "World Cup - Qualification Europe",
  "World Cup - Qualification Africa",
  "World Cup - Qualification Asia",
  "World Cup - Qualification South America",
  "World Cup - Qualification CONCACAF",

  // Europe
  "UEFA Champions League",
  "UEFA Europa League",
  "UEFA Europa Conference League",
  "UEFA Super Cup",
  "Premier League",
  "Championship",
  "League One",
  "League Two",
  "FA Cup",
  "EFL Cup",
  "La Liga",
  "La Liga 2",
  "Copa del Rey",
  "Serie A",
  "Serie B",
  "Coppa Italia",
  "Bundesliga",
  "2. Bundesliga",
  "DFB Pokal",
  "Ligue 1",
  "Ligue 2",
  "Coupe de France",
  "Eredivisie",
  "Eerste Divisie",
  "Primeira Liga",
  "Liga Portugal",
  "Liga Portugal 2",
  "Belgian Pro League",
  "Jupiler Pro League",
  "Scottish Premiership",
  "Swiss Super League",
  "Austrian Bundesliga",
  "Turkish Super Lig",
  "Süper Lig",
  "Greek Super League",
  "Super League Greece",
  "Danish Superliga",
  "Eliteserien",
  "Allsvenskan",
  "Ekstraklasa",
  "Czech Liga",
  "Croatian HNL",
  "Serbian Super Liga",
  "Ukrainian Premier League",
  "Russian Premier League",

  // Africa
  "CAF Champions League",
  "CAF Confederation Cup",
  "Premier League - Ghana",
  "Ghana Premier League",
  "Egyptian Premier League",
  "Premier League - Egypt",
  "Botola Pro",
  "Ligue 1 - Algeria",
  "Ligue 1 - Tunisia",
  "South African Premier Soccer League",
  "Premier Soccer League",
  "Nigeria Professional Football League",
  "Kenya Premier League",
  "Uganda Premier League",
  "Tanzanian Premier League",
  "Moroccan Throne Cup",

  // Americas
  "Major League Soccer",
  "MLS",
  "Liga MX",
  "Leagues Cup",
  "US Open Cup",
  "Brazilian Serie A",
  "Serie A - Brazil",
  "Brazilian Serie B",
  "Copa do Brasil",
  "Argentine Primera Division",
  "Liga Profesional Argentina",
  "Copa Libertadores",
  "Copa Sudamericana",
  "Primera A",
  "Liga BetPlay",
  "Chilean Primera Division",
  "Uruguayan Primera Division",
  "Primera Division - Uruguay",
  "Ecuadorian Serie A",
  "Peruvian Primera Division",

  // Asia and Oceania
  "Saudi Pro League",
  "AFC Champions League",
  "AFC Champions League Elite",
  "UAE Pro League",
  "Qatar Stars League",
  "Qatar Stars League",
  "Indian Super League",
  "J1 League",
  "K League 1",
  "Chinese Super League",
  "A-League",
  "A-League Men",
];

const STATUS_LABELS = {
  "1H": "FIRST HALF",
  HT: "HALF-TIME",
  "2H": "SECOND HALF",
  ET: "EXTRA TIME",
  BT: "BREAK",
  P: "PENALTIES",
  FT: "FULL-TIME",
  AET: "AFTER EXTRA TIME",
  PEN: "AFTER PENALTIES",
  LIVE: "LIVE",
};

function getStatus(match) {
  const status = match?.fixture?.status;
  const code = status?.short;
  const elapsed = status?.elapsed;

  if (STATUS_LABELS[code]) {
    if (["1H", "2H", "ET", "LIVE"].includes(code) && elapsed != null) {
      return `${elapsed}'`;
    }

    return STATUS_LABELS[code];
  }

  if (elapsed != null) return `${elapsed}'`;
  return code || "LIVE";
}

function isLive(match) {
  return ["1H", "HT", "2H", "ET", "BT", "P", "LIVE"].includes(
    match?.fixture?.status?.short
  );
}

function getLeagueRank(name) {
  const index = LEAGUE_PRIORITY.findIndex(
    (league) => league.toLowerCase() === name.toLowerCase()
  );

  return index === -1 ? Number.MAX_SAFE_INTEGER : index;
}

export default function LivePage() {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");
  const [lastUpdated, setLastUpdated] = useState(null);
  const [search, setSearch] = useState("");
  const [selectedCountry, setSelectedCountry] = useState("All Countries");
  const [showAllLeagues, setShowAllLeagues] = useState(true);

  const fetchLiveMatches = useCallback(async (background = false) => {
    if (background) {
      setRefreshing(true);
    } else {
      setLoading(true);
    }

    try {
      const response = await fetch("/api/live", {
        cache: "no-store",
      });

      const data = await response.json();

      if (!response.ok || data.success === false) {
        throw new Error(
          data.details
            ? JSON.stringify(data.details)
            : data.error || "Could not load live matches."
        );
      }

      setMatches(Array.isArray(data.events) ? data.events : []);
      setError("");
      setLastUpdated(new Date());
    } catch (err) {
      console.error("Live matches error:", err);
      setError(err.message || "Unable to connect to live scores.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchLiveMatches();

    const interval = setInterval(() => {
      fetchLiveMatches(true);
    }, 30000);

    return () => clearInterval(interval);
  }, [fetchLiveMatches]);

  const countries = useMemo(() => {
    const values = [...new Set(
      matches.map((match) => match?.country?.name || match?.league?.country)
        .filter(Boolean)
    )].sort((a, b) => a.localeCompare(b));

    return ["All Countries", ...values];
  }, [matches]);

  const filteredMatches = useMemo(() => {
    const query = search.trim().toLowerCase();

    return matches.filter((match) => {
      const country =
        match?.country?.name || match?.league?.country || "";

      const countryMatches =
        selectedCountry === "All Countries" ||
        country === selectedCountry;

      const searchMatches =
        !query ||
        [
          match?.teams?.home?.name,
          match?.teams?.away?.name,
          match?.league?.name,
          country,
        ]
          .filter(Boolean)
          .some((value) => value.toLowerCase().includes(query));

      return countryMatches && searchMatches;
    });
  }, [matches, search, selectedCountry]);

  const groupedMatches = useMemo(() => {
    const groups = {};

    filteredMatches.forEach((match) => {
      const league = match?.league?.name || "Other Competitions";

      if (!groups[league]) {
        groups[league] = [];
      }

      groups[league].push(match);
    });

    return Object.entries(groups).sort(([a], [b]) => {
      const rankA = getLeagueRank(a);
      const rankB = getLeagueRank(b);

      if (rankA !== rankB) return rankA - rankB;
      return a.localeCompare(b);
    });
  }, [filteredMatches]);

  return (
    <main className="live-page">
      <header className="live-header">
        <div>
          <div className="eyebrow">
            <span className="live-dot" />
            FOOTBALL CENTRE
          </div>
          <h1>Live Scores</h1>
          <p>Live football from leagues and competitions around the world.</p>
        </div>

        <button
          className="refresh-button"
          onClick={() => fetchLiveMatches(true)}
          disabled={refreshing || loading}
        >
          <span className={refreshing ? "refresh-symbol spinning" : "refresh-symbol"}>
            ↻
          </span>
          {refreshing ? "Updating..." : "Refresh"}
        </button>
      </header>

      <section className="score-summary">
        <div className="summary-live">
          <span className="live-dot" />
          LIVE NOW
        </div>
        <div className="summary-number">
          <strong>{matches.length}</strong>
          <span>matches</span>
        </div>
        <div className="summary-updated">
          {lastUpdated
            ? `Updated ${lastUpdated.toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })}`
            : "Connecting to scores"}
        </div>
      </section>

      <section className="filter-panel">
        <div className="search-box">
          <span>⌕</span>
          <input
            type="search"
            placeholder="Search teams, leagues or countries..."
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />
        </div>

        <select
          value={selectedCountry}
          onChange={(event) => setSelectedCountry(event.target.value)}
          aria-label="Filter by country"
        >
          {countries.map((country) => (
            <option key={country} value={country}>
              {country}
            </option>
          ))}
        </select>
      </section>

      {loading ? (
        <section className="state-card">
          <div className="spinner" />
          <h2>Loading live scores</h2>
          <p>Connecting to the football data service...</p>
        </section>
      ) : error ? (
        <section className="state-card">
          <div className="state-icon error-icon">!</div>
          <h2>Unable to load live matches</h2>
          <p>{error}</p>
          <button className="retry-button" onClick={() => fetchLiveMatches()}>
            Try again
          </button>
        </section>
      ) : matches.length === 0 ? (
        <section className="state-card">
          <div className="state-icon">⚽</div>
          <h2>No live matches right now</h2>
          <p>
            The API returned no live fixtures. This does not mean these leagues
            are unavailable; it means there are no live games in the current response.
          </p>
          <Link href="/fixtures" className="retry-button">
            View Fixtures
          </Link>
        </section>
      ) : filteredMatches.length === 0 ? (
        <section className="state-card">
          <div className="state-icon">⌕</div>
          <h2>No matches found</h2>
          <p>Try another team name or select a different country.</p>
          <button
            className="retry-button"
            onClick={() => {
              setSearch("");
              setSelectedCountry("All Countries");
            }}
          >
            Clear filters
          </button>
        </section>
      ) : (
        <div className="league-list">
          <div className="league-list-header">
            <h2>Competitions</h2>
            <button onClick={() => setShowAllLeagues((value) => !value)}>
              {showAllLeagues ? "Collapse all" : "Expand all"}
            </button>
          </div>

          {groupedMatches.map(([league, leagueMatches]) => (
            <section className="league-section" key={league}>
              <div className="league-heading">
                {leagueMatches[0]?.league?.logo && (
                  <img
                    src={leagueMatches[0].league.logo}
                    alt=""
                    className="league-logo"
                  />
                )}

                <div className="league-info">
                  <h3>{league}</h3>
                  <span>
                    {leagueMatches[0]?.league?.country || "International"}
                  </span>
                </div>

                <span className="league-count">{leagueMatches.length}</span>

                <button
                  className="collapse-button"
                  aria-label={`${showAllLeagues ? "Collapse" : "Expand"} ${league}`}
                  onClick={() => {
                    setShowAllLeagues((value) => !value);
                  }}
                >
                  {showAllLeagues ? "−" : "+"}
                </button>
              </div>

              {showAllLeagues && (
                <div className="match-grid">
                  {leagueMatches.map((match) => {
                    const id = match?.fixture?.id;
                    const live = isLive(match);

                    return (
                      <Link
                        key={id}
                        href={`/match/${id}`}
                        className={`match-card ${live ? "match-live" : ""}`}
                      >
                        <div className="match-meta">
                          <span className={live ? "match-status live-status" : "match-status"}>
                            {live && <span className="live-dot" />}
                            {getStatus(match)}
                          </span>
                          <span className="match-round">
                            {match?.league?.round || "Match Centre"}
                          </span>
                        </div>

                        <div className="teams-row">
                          <div className="team">
                            <img
                              src={match?.teams?.home?.logo || "/logo.png"}
                              alt=""
                              className="team-logo"
                            />
                            <span>{match?.teams?.home?.name || "Home"}</span>
                          </div>

                          <div className="score">
                            <strong>
                              {match?.goals?.home ?? 0}
                              <span>:</span>
                              {match?.goals?.away ?? 0}
                            </strong>
                          </div>

                          <div className="team">
                            <img
                              src={match?.teams?.away?.logo || "/logo.png"}
                              alt=""
                              className="team-logo"
                            />
                            <span>{match?.teams?.away?.name || "Away"}</span>
                          </div>
                        </div>

                        <div className="match-footer">
                          <span>Open match centre</span>
                          <span className="arrow">→</span>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              )}
            </section>
          ))}
        </div>
      )}

      <style jsx>{`
        .live-page {
          min-height: 100vh;
          padding: 28px 24px 130px;
          color: #f8fafc;
          background:
            radial-gradient(ellipse at top, rgba(24, 91, 76, 0.2), transparent 48%),
            #081321;
        }

        .live-header {
          max-width: 1400px;
          margin: 0 auto 25px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 18px;
        }

        .eyebrow {
          display: flex;
          align-items: center;
          gap: 9px;
          margin-bottom: 12px;
          color: #3ee4a0;
          font-size: 12px;
          font-weight: 800;
          letter-spacing: 2px;
        }

        .live-dot {
          width: 8px;
          height: 8px;
          flex-shrink: 0;
          display: inline-block;
          border-radius: 50%;
          background: #2de59a;
          box-shadow: 0 0 11px rgba(45, 229, 154, 0.65);
          animation: pulse 1.4s ease-in-out infinite;
        }

        .live-header h1 {
          margin: 0 0 12px;
          font-size: clamp(32px, 5vw, 48px);
          letter-spacing: -1.5px;
        }

        .live-header p {
          color: #98aec3;
          font-size: 15px;
          line-height: 1.6;
        }

        .refresh-button {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          padding: 12px 16px;
          border: 1px solid #294156;
          border-radius: 12px;
          background: #122438;
          color: #edf6ff;
          font-weight: 700;
          cursor: pointer;
        }

        .refresh-button:disabled {
          opacity: 0.6;
          cursor: wait;
        }

        .refresh-symbol {
          font-size: 20px;
        }

        .spinning {
          animation: spin 0.8s linear infinite;
        }

        .score-summary {
          max-width: 1400px;
          margin: 0 auto 20px;
          padding: 16px 20px;
          display: flex;
          align-items: center;
          flex-wrap: wrap;
          gap: 22px;
          border: 1px solid #1d354a;
          border-radius: 16px;
          background: #102237;
        }

        .summary-live {
          display: flex;
          align-items: center;
          gap: 8px;
          color: #3ee4a0;
          font-size: 12px;
          font-weight: 800;
        }

        .summary-number {
          display: flex;
          align-items: baseline;
          gap: 7px;
          color: #a8bacb;
          font-size: 13px;
        }

        .summary-number strong {
          color: white;
          font-size: 23px;
        }

        .summary-updated {
          margin-left: auto;
          color: #859bb1;
          font-size: 12px;
        }

        .filter-panel {
          max-width: 1400px;
          margin: 0 auto 24px;
          display: flex;
          gap: 12px;
        }

        .search-box {
          flex: 1;
          min-width: 0;
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 0 14px;
          border: 1px solid #243c50;
          border-radius: 12px;
          background: #0e1d2e;
          color: #8fa6bb;
        }

        .search-box input {
          width: 100%;
          min-width: 0;
          padding: 13px 0;
          border: 0;
          outline: 0;
          background: transparent;
          color: white;
          font-size: 13px;
        }

        .filter-panel select {
          max-width: 230px;
          padding: 0 12px;
          border: 1px solid #243c50;
          border-radius: 12px;
          background: #0e1d2e;
          color: #e4edf6;
          font-size: 13px;
        }

        .state-card {
          max-width: 700px;
          margin: 50px auto;
          padding: 42px 24px;
          border: 1px solid #20374a;
          border-radius: 22px;
          background: #0e1e30;
          text-align: center;
        }

        .spinner {
          width: 38px;
          height: 38px;
          margin: 0 auto 20px;
          border: 3px solid #293e50;
          border-top-color: #39dfa0;
          border-radius: 50%;
          animation: spin 0.8s linear infinite;
        }

        .state-icon {
          margin-bottom: 17px;
          font-size: 36px;
        }

        .error-icon {
          color: #ff8c8c;
        }

        .state-card h2 {
          margin: 0 0 12px;
          font-size: 22px;
        }

        .state-card p {
          color: #99aec2;
          font-size: 14px;
          line-height: 1.7;
          overflow-wrap: anywhere;
        }

        .retry-button {
          display: inline-flex;
          margin-top: 20px;
          padding: 11px 17px;
          border: 0;
          border-radius: 10px;
          background: #22c55e;
          color: #07170f;
          font-weight: 800;
          text-decoration: none;
          cursor: pointer;
        }

        .league-list {
          max-width: 1400px;
          margin: 0 auto;
        }

        .league-list-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 14px;
        }

        .league-list-header h2 {
          font-size: 18px;
        }

        .league-list-header button {
          border: 0;
          background: transparent;
          color: #40dda0;
          cursor: pointer;
          font-size: 12px;
        }

        .league-section {
          margin-bottom: 18px;
          overflow: hidden;
          border: 1px solid #1d3448;
          border-radius: 16px;
          background: rgba(12, 28, 44, 0.86);
        }

        .league-heading {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 16px 18px;
          border-bottom: 1px solid #21394d;
          background: #112438;
        }

        .league-logo {
          width: 35px;
          height: 35px;
          object-fit: contain;
        }

        .league-info {
          flex: 1;
          min-width: 0;
        }

        .league-info h3 {
          margin: 0 0 5px;
          font-size: 14px;
        }

        .league-info span {
          color: #8fa6bb;
          font-size: 11px;
        }

        .league-count {
          min-width: 28px;
          padding: 7px;
          border-radius: 8px;
          background: #1b3548;
          color: #e1edf7;
          font-size: 11px;
          font-weight: 800;
          text-align: center;
        }

        .collapse-button {
          width: 28px;
          height: 28px;
          border: 1px solid #2b455a;
          border-radius: 8px;
          background: #142c40;
          color: #dce9f4;
          font-size: 19px;
          cursor: pointer;
        }

        .match-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(min(100%, 330px), 1fr));
          gap: 12px;
          padding: 13px;
        }

        .match-card {
          min-width: 0;
          padding: 16px;
          border: 1px solid #213a4f;
          border-radius: 14px;
          background: linear-gradient(145deg, #132a40, #0c1d2e);
          color: white;
          text-decoration: none;
          transition: transform 0.2s, border-color 0.2s, box-shadow 0.2s;
        }

        .match-card:hover {
          transform: translateY(-3px);
          border-color: #35d99a;
          box-shadow: 0 9px 25px rgba(0, 0, 0, 0.22);
        }

        .match-live {
          border-color: rgba(47, 218, 147, 0.4);
        }

        .match-meta,
        .match-footer {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 9px;
        }

        .match-meta {
          margin-bottom: 19px;
        }

        .match-status {
          display: flex;
          align-items: center;
          gap: 7px;
          color: #a1b4c7;
          font-size: 10px;
          font-weight: 800;
        }

        .live-status {
          color: #40e3a0;
        }

        .match-round {
          max-width: 60%;
          overflow: hidden;
          color: #8198ad;
          font-size: 10px;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .teams-row {
          display: grid;
          grid-template-columns: minmax(0, 1fr) auto minmax(0, 1fr);
          align-items: center;
          gap: 9px;
        }

        .team {
          min-width: 0;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 9px;
          text-align: center;
        }

        .team-logo {
          width: 43px;
          height: 43px;
          object-fit: contain;
        }

        .team span {
          width: 100%;
          overflow-wrap: anywhere;
          color: #e0eaf4;
          font-size: 12px;
          font-weight: 700;
          line-height: 1.4;
        }

        .score strong {
          display: flex;
          gap: 8px;
          color: #fff;
          font-size: 29px;
          font-variant-numeric: tabular-nums;
        }

        .score strong span {
          color: #7b90a5;
        }

        .match-footer {
          margin-top: 18px;
          padding-top: 12px;
          border-top: 1px solid #223b4e;
          color: #91a7bc;
          font-size: 11px;
        }

        .arrow {
          color: #42e3a2;
          font-size: 18px;
        }

        @keyframes pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.45; transform: scale(0.75); }
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        @media (max-width: 600px) {
          .live-page {
            padding: 22px 12px 120px;
          }

          .live-header {
            align-items: flex-start;
          }

          .live-header p {
            font-size: 13px;
          }

          .refresh-button {
            padding: 10px;
            font-size: 12px;
          }

          .score-summary {
            gap: 12px;
            padding: 13px;
          }

          .summary-updated {
            width: 100%;
            margin-left: 0;
          }

          .filter-panel {
            flex-direction: column;
          }

          .filter-panel select {
            max-width: none;
            min-height: 42px;
          }

          .match-grid {
            grid-template-columns: minmax(0, 1fr);
            padding: 9px;
          }

          .league-heading {
            padding: 13px;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .live-dot,
          .spinner,
          .spinning {
            animation: none;
          }

          .match-card,
          .refresh-button {
            transition: none;
          }
        }
      `}</style>
    </main>
  );
}
