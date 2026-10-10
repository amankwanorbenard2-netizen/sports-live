
"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";

const LIVE_STATUSES = ["1H", "2H", "HT", "ET", "BT", "P", "LIVE", "INT", "SUSP"];
const FINISHED_STATUSES = ["FT", "AET", "PEN", "AWD", "WO"];
const CANCELLED_STATUSES = ["CANC", "PST", "ABD", "SUSP"];

function getGhanaDate(date) {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Africa/Accra",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(date);

  const get = (type) => parts.find((part) => part.type === type)?.value;
  return `${get("year")}-${get("month")}-${get("day")}`;
}

function getDateKey(offset) {
  const date = new Date(`${getGhanaDate(new Date())}T12:00:00Z`);
  date.setUTCDate(date.getUTCDate() + offset);
  return date.toISOString().slice(0, 10);
}

function formatKickoff(date) {
  return new Intl.DateTimeFormat("en-GB", {
    timeZone: "Africa/Accra",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).format(new Date(date));
}

function formatDate(dateKey) {
  return new Date(`${dateKey}T12:00:00Z`).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    timeZone: "UTC",
  });
}

function MatchCard({ match }) {
  const fixture = match.fixture || {};
  const home = match.teams?.home || {};
  const away = match.teams?.away || {};
  const status = fixture.status?.short;
  const finished = FINISHED_STATUSES.includes(status);
  const hasScore = match.goals?.home != null && match.goals?.away != null;

  let timeLabel = fixture.date ? formatKickoff(fixture.date) : "TBD";

  if (status === "PST") timeLabel = "Postponed";
  if (status === "CANC") timeLabel = "Cancelled";
  if (status === "FT") timeLabel = "Finished";
  if (status === "AET") timeLabel = "After extra time";
  if (status === "PEN") timeLabel = "Penalties";

  return (
    <Link
      href={fixture.id ? `/match/${fixture.id}` : "/fixtures"}
      className="fixture-match"
    >
      <div className="fixture-kickoff">
        {timeLabel}
        {finished && <small>FULL TIME</small>}
      </div>

      <div className="fixture-teams">
        <div className="fixture-team">
          {home.logo && <img src={home.logo} alt="" loading="lazy" />}
          <span>{home.name || "Home team"}</span>
        </div>
        <div className="fixture-team">
          {away.logo && <img src={away.logo} alt="" loading="lazy" />}
          <span>{away.name || "Away team"}</span>
        </div>
      </div>

      <div className="fixture-scores">
        <strong>{hasScore ? match.goals.home : "–"}</strong>
        <strong>{hasScore ? match.goals.away : "–"}</strong>
      </div>
    </Link>
  );
}

function LeagueGroup({ matches }) {
  const leagues = new Map();

  matches.forEach((match) => {
    const league = match.league || {};
    const key = league.id ?? league.name ?? "other";

    if (!leagues.has(key)) {
      leagues.set(key, { league, matches: [] });
    }

    leagues.get(key).matches.push(match);
  });

  return [...leagues.values()].map((group, index) => (
    <section
      className="fixture-league"
      key={`${group.league.id ?? group.league.name ?? "league"}-${index}`}
    >
      <header className="fixture-league-header">
        {(group.league.flag || group.league.logo) && (
          <img
            src={group.league.flag || group.league.logo}
            alt=""
            loading="lazy"
          />
        )}

        <div>
          <strong>{group.league.name || "Football"}</strong>
          <small>{group.league.country || "International"}</small>
        </div>

        <span className="fixture-league-count">
          {group.matches.length} matches
        </span>
      </header>

      {group.matches.map((match, index) => (
        <MatchCard
          key={match.fixture?.id || `${match.teams?.home?.name}-${index}`}
          match={match}
        />
      ))}
    </section>
  ));
}

export default function FixturesPage() {
  const [matches, setMatches] = useState([]);
  const [selectedDate, setSelectedDate] = useState(getDateKey(0));
  const [filter, setFilter] = useState("upcoming");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");

  const dates = useMemo(
    () =>
      Array.from({ length: 14 }, (_, index) => {
        const key = getDateKey(index);
        const date = new Date(`${key}T12:00:00Z`);

        return {
          key,
          day:
            index === 0
              ? "TODAY"
              : new Intl.DateTimeFormat("en-GB", {
                  weekday: "short",
                  timeZone: "UTC",
                })
                  .format(date)
                  .toUpperCase(),
          label: formatDate(key),
        };
      }),
    []
  );

  const loadFixtures = useCallback(async (manual = false) => {
    if (manual) setRefreshing(true);
    else setLoading(true);

    try {
      const response = await fetch("/api/fixtures", {
        cache: "no-store",
      });

      const data = await response.json();

      if (!response.ok || data.success === false) {
        throw new Error(data.error || "Unable to load fixtures.");
      }

      setMatches(Array.isArray(data.events) ? data.events : []);
      setError("");
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Could not load fixtures."
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    loadFixtures();

    const timer = setInterval(() => {
      loadFixtures(true);
    }, 5 * 60 * 1000);

    return () => clearInterval(timer);
  }, [loadFixtures]);

  // Fixtures page only: never display live matches here.
  const dateMatches = useMemo(
    () =>
      matches.filter((match) => {
        const status = match?.fixture?.status?.short;

        return (
          match?.fixture?.date &&
          getGhanaDate(new Date(match.fixture.date)) === selectedDate &&
          !LIVE_STATUSES.includes(status)
        );
      }),
    [matches, selectedDate]
  );

  const filteredMatches = useMemo(
    () =>
      dateMatches.filter((match) => {
        const status = match?.fixture?.status?.short;
        const query = search.trim().toLowerCase();

        const searchableText = [
          match.teams?.home?.name,
          match.teams?.away?.name,
          match.league?.name,
          match.league?.country,
        ]
          .filter(Boolean)
          .join(" ")
          .toLowerCase();

        const matchesSearch = !query || searchableText.includes(query);

        const matchesFilter =
          filter === "all" ||
          (filter === "upcoming" &&
            !FINISHED_STATUSES.includes(status) &&
            !CANCELLED_STATUSES.includes(status)) ||
          (filter === "finished" && FINISHED_STATUSES.includes(status));

        return matchesSearch && matchesFilter;
      }),
    [dateMatches, filter, search]
  );

  const selected = dates.find((date) => date.key === selectedDate);

  return (
    <main className="fixtures-page">
      <style jsx global>{`
        * { box-sizing: border-box; }

        body {
          margin: 0;
          background: #080d17;
          color: #f5f7fb;
          font-family: Arial, Helvetica, sans-serif;
        }

        .fixtures-page {
          min-height: 100vh;
          padding: 24px 0 55px;
          background: radial-gradient(ellipse at top, #14223a, #080d17 48%);
        }

        .fixture-container {
          max-width: 1100px;
          padding: 0 16px;
          margin: auto;
        }

        .fixture-top {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 12px;
          border-bottom: 1px solid #26344a;
          padding-bottom: 18px;
        }

        .fixture-brand {
          font-size: 22px;
          font-weight: 900;
          letter-spacing: -.7px;
        }

        .fixture-brand span { color: #c7f36b; }

        .fixture-timezone {
          border: 1px solid #29374c;
          background: #101827;
          padding: 9px 12px;
          border-radius: 30px;
          color: #b9c5d6;
          font-size: 11px;
          font-weight: 800;
        }

        .fixture-hero { padding: 26px 0 16px; }

        .fixture-eyebrow {
          color: #c7f36b;
          font-size: 10px;
          letter-spacing: 2px;
          font-weight: 900;
        }

        .fixture-hero h1 {
          font-size: clamp(29px, 5vw, 42px);
          margin: 9px 0;
          letter-spacing: -1.5px;
        }

        .fixture-muted {
          color: #94a3b8;
          font-size: 13px;
          line-height: 1.6;
        }

        .fixture-date-panel {
          background: #101827;
          border: 1px solid #29374c;
          border-radius: 15px;
          padding: 14px;
          margin: 15px 0 20px;
        }

        .fixture-panel-title {
          font-size: 13px;
          font-weight: 800;
          margin-bottom: 12px;
          display: flex;
          justify-content: space-between;
          gap: 10px;
        }

        .fixture-date-strip {
          display: flex;
          gap: 7px;
          overflow-x: auto;
          padding-bottom: 5px;
        }

        .fixture-date-button {
          min-width: 70px;
          padding: 12px 5px;
          border-radius: 10px;
          border: 1px solid #29374c;
          background: #0a1220;
          color: #a9b6c8;
          cursor: pointer;
        }

        .fixture-date-button span { display: block; }

        .fixture-date-button .date-day {
          font-size: 10px;
          font-weight: 900;
          margin-bottom: 7px;
        }

        .fixture-date-button .date-number {
          font-size: 13px;
          font-weight: 800;
          color: #f5f7fb;
        }

        .fixture-date-button.active {
          background: #c7f36b;
          border-color: #c7f36b;
          color: #14200b;
        }

        .fixture-date-button.active .date-number { color: #14200b; }

        .fixture-tools {
          display: flex;
          flex-wrap: wrap;
          align-items: center;
          gap: 8px;
          margin: 18px 0;
        }

        .fixture-filter-button,
        .fixture-refresh {
          cursor: pointer;
          padding: 10px 12px;
          border-radius: 9px;
          border: 1px solid #29374c;
          background: #101827;
          color: #c2cddd;
          font-size: 12px;
          font-weight: 800;
        }

        .fixture-filter-button.active {
          background: #c7f36b;
          border-color: #c7f36b;
          color: #14200b;
        }

        .fixture-search {
          flex: 1;
          min-width: 180px;
          padding: 11px 12px;
          border: 1px solid #29374c;
          border-radius: 9px;
          background: #101827;
          color: white;
          outline: none;
        }

        .fixture-search:focus { border-color: #c7f36b; }
        .fixture-refresh:disabled { opacity: .5; }

        .fixture-section-heading {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 12px;
          margin: 26px 0 12px;
        }

        .fixture-section-heading h2 {
          margin: 0;
          font-size: 19px;
        }

        .fixture-count {
          font-size: 11px;
          color: #a3b0c3;
          background: #152033;
          padding: 7px 10px;
          border-radius: 8px;
        }

        .fixture-league {
          overflow: hidden;
          border: 1px solid #29374c;
          border-radius: 13px;
          background: #0e1624;
          margin-bottom: 13px;
        }

        .fixture-league-header {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 12px 14px;
          background: #152033;
          border-bottom: 1px solid #29374c;
        }

        .fixture-league-header img {
          width: 25px;
          height: 25px;
          object-fit: contain;
        }

        .fixture-league-header strong,
        .fixture-league-header small { display: block; }

        .fixture-league-header strong { font-size: 12px; }

        .fixture-league-header small {
          margin-top: 4px;
          color: #91a0b6;
          font-size: 10px;
        }

        .fixture-league-count {
          margin-left: auto;
          color: #91a0b6;
          font-size: 10px;
        }

        .fixture-match {
          display: grid;
          grid-template-columns: 100px minmax(0, 1fr) 55px;
          align-items: center;
          gap: 12px;
          padding: 13px 14px;
          border-bottom: 1px solid #202d40;
          text-decoration: none;
          color: inherit;
        }

        .fixture-match:last-child { border-bottom: 0; }
        .fixture-match:hover { background: #162238; }

        .fixture-kickoff {
          text-align: center;
          font-size: 11px;
          color: #c7f36b;
          font-weight: 800;
        }

        .fixture-kickoff small {
          display: block;
          margin-top: 4px;
          color: #718198;
          font-size: 9px;
        }

        .fixture-teams,
        .fixture-scores {
          display: grid;
          gap: 9px;
        }

        .fixture-team {
          display: flex;
          align-items: center;
          gap: 8px;
          min-width: 0;
          font-size: 12px;
          font-weight: 700;
        }

        .fixture-team img {
          width: 22px;
          height: 22px;
          object-fit: contain;
          flex-shrink: 0;
        }

        .fixture-team span {
          overflow: hidden;
          white-space: nowrap;
          text-overflow: ellipsis;
        }

        .fixture-scores {
          text-align: center;
          font-size: 13px;
          color: #aab6c8;
        }

        .fixture-empty {
          text-align: center;
          padding: 38px 18px;
          border: 1px dashed #30405a;
          border-radius: 13px;
          background: #0e1624;
        }

        .fixture-empty h3 { font-size: 16px; margin: 0 0 8px; }

        .fixture-empty p {
          color: #94a3b8;
          font-size: 12px;
          line-height: 1.6;
        }

        .fixture-error {
          margin: 14px 0;
          background: #2b171e;
          color: #ffc6cc;
          padding: 13px;
          border-radius: 9px;
          font-size: 12px;
        }

        .fixture-footer {
          text-align: center;
          padding-top: 24px;
          color: #718198;
          font-size: 11px;
        }

        @media (max-width: 600px) {
          .fixtures-page { padding-top: 15px; }

          .fixture-match {
            grid-template-columns: 68px minmax(0, 1fr) 35px;
            gap: 7px;
            padding: 12px 8px;
          }

          .fixture-team { font-size: 11px; gap: 6px; }
          .fixture-team img { width: 19px; height: 19px; }
          .fixture-kickoff { font-size: 10px; }
          .fixture-search { flex-basis: 100%; }
          .fixture-section-heading h2 { font-size: 16px; }
          .fixture-panel-title { font-size: 12px; }
        }
      `}</style>

      <div className="fixture-container">
        <header className="fixture-top">
          <div className="fixture-brand">
            ⚽ FOOTBALL <span>FIXTURES</span>
          </div>
          <div className="fixture-timezone">GHANA TIME · GMT</div>
        </header>

        <section className="fixture-hero">
          <div className="fixture-eyebrow">PLAN YOUR MATCH DAY</div>
          <h1>Upcoming Fixtures</h1>
          <div className="fixture-muted">
            Browse scheduled matches over the next 14 days, organised by
            league. All kick-off times are shown in Ghana time.
          </div>
        </section>

        {error && (
          <div className="fixture-error">
            {error}{" "}
            <button
              className="fixture-refresh"
              onClick={() => loadFixtures(true)}
              type="button"
            >
              Try again
            </button>
          </div>
        )}

        <section className="fixture-date-panel">
          <div className="fixture-panel-title">
            <span>Select a date</span>
            <span className="fixture-muted">Next 14 days</span>
          </div>

          <div className="fixture-date-strip">
            {dates.map((date) => (
              <button
                key={date.key}
                className={`fixture-date-button ${
                  selectedDate === date.key ? "active" : ""
                }`}
                onClick={() => setSelectedDate(date.key)}
                type="button"
              >
                <span className="date-day">{date.day}</span>
                <span className="date-number">{date.label}</span>
              </button>
            ))}
          </div>
        </section>

        <div className="fixture-tools">
          {[
            ["upcoming", "Upcoming"],
            ["all", "All statuses"],
            ["finished", "Finished"],
          ].map(([value, label]) => (
            <button
              key={value}
              className={`fixture-filter-button ${
                filter === value ? "active" : ""
              }`}
              onClick={() => setFilter(value)}
              type="button"
            >
              {label}
            </button>
          ))}

          <input
            className="fixture-search"
            type="search"
            placeholder="Search team or league..."
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            aria-label="Search fixtures"
          />

          <button
            className="fixture-refresh"
            type="button"
            disabled={refreshing}
            onClick={() => loadFixtures(true)}
          >
            {refreshing ? "Refreshing..." : "↻ Refresh"}
          </button>
        </div>

        <div className="fixture-section-heading">
          <h2>
            {selected?.day === "TODAY"
              ? "Today's Fixtures"
              : `Fixtures · ${selected?.day}, ${selected?.label}`}
          </h2>
          <span className="fixture-count">
            {filteredMatches.length} matches
          </span>
        </div>

        {loading ? (
          <div className="fixture-empty">
            <h3>Loading fixtures...</h3>
            <p>Getting the match schedule.</p>
          </div>
        ) : filteredMatches.length > 0 ? (
          <LeagueGroup matches={filteredMatches} />
        ) : (
          <div className="fixture-empty">
            <h3>No fixtures found for this date</h3>
            <p>
              Try another date or change your search. Matches are displayed
              only when the API returns fixtures for the selected day.
            </p>
          </div>
        )}

        <footer className="fixture-footer">
          Fixture times are displayed in Ghana time. Schedules can change.
        </footer>
      </div>
    </main>
  );
}
