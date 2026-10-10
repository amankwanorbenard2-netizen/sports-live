
"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";

const LIVE_STATUSES = [
  "1H", "2H", "HT", "ET", "BT", "P", "LIVE",
  "INT", "SUSP", "INTERRUPTED"
];

const FINISHED_STATUSES = ["FT", "AET", "PEN", "AWD", "WO"];

function getGhanaDateKey(date = new Date()) {
  const parts = new Intl.DateTimeFormat("en-GB", {
    timeZone: "Africa/Accra",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(date);

  const values = {};
  parts.forEach((part) => {
    if (part.type !== "literal") values[part.type] = part.value;
  });

  return `${values.year}-${values.month}-${values.day}`;
}

function addDays(dateKey, offset) {
  const date = new Date(`${dateKey}T12:00:00Z`);
  date.setUTCDate(date.getUTCDate() + offset);
  return date.toISOString().slice(0, 10);
}

function formatDate(date) {
  if (!date) return "Date unavailable";

  return new Date(`${date}T12:00:00Z`).toLocaleDateString("en-GB", {
    timeZone: "UTC",
    weekday: "long",
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}

function formatTime(date) {
  if (!date) return "--:--";

  return new Date(date).toLocaleTimeString("en-GB", {
    timeZone: "Africa/Accra",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
}

function getStatus(match) {
  return match.fixture?.status?.short || "NS";
}

function isLive(match) {
  return LIVE_STATUSES.includes(getStatus(match));
}

function isFinished(match) {
  return FINISHED_STATUSES.includes(getStatus(match));
}

function getStatusLabel(match) {
  const status = getStatus(match);
  const elapsed = match.fixture?.status?.elapsed;

  const labels = {
    HT: "HALF TIME",
    ET: "EXTRA TIME",
    BT: "BREAK",
    P: "PENALTIES",
    FT: "FULL TIME",
    AET: "AFTER EXTRA TIME",
    PEN: "AFTER PENALTIES",
    SUSP: "SUSPENDED",
    INT: "INTERRUPTED",
    INTERRUPTED: "INTERRUPTED",
    PST: "POSTPONED",
    CANC: "CANCELLED",
    ABD: "ABANDONED",
    AWD: "AWARDED",
    WO: "WALKOVER",
    NS: "UPCOMING",
  };

  if (labels[status]) return labels[status];
  return elapsed != null ? `${elapsed}' LIVE` : "LIVE";
}

export default function FixturesPage() {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedDate, setSelectedDate] = useState(() =>
    getGhanaDateKey()
  );
  const [today, setToday] = useState(() => getGhanaDateKey());
  const [search, setSearch] = useState("");
  const [lastUpdated, setLastUpdated] = useState(null);

  const fetchFixtures = useCallback(async (showLoading = false) => {
    if (showLoading) setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/fixtures");

      if (!response.ok) {
        throw new Error(`Fixtures request failed (${response.status}).`);
      }

      const data = await response.json();

      if (data.errors && Object.keys(data.errors).length > 0) {
        throw new Error(
          Object.values(data.errors).flat().join(" ") ||
          "The football API returned an error."
        );
      }

      if (data.success === false) {
        throw new Error(data.error || "Could not load football fixtures.");
      }

      const events = Array.isArray(data.events) ? [...data.events] : [];

      events.sort((a, b) => {
        if (isLive(a) && !isLive(b)) return -1;
        if (!isLive(a) && isLive(b)) return 1;

        return (
          new Date(a.fixture?.date || 0).getTime() -
          new Date(b.fixture?.date || 0).getTime()
        );
      });

      setMatches(events);
      setToday(getGhanaDateKey());
      setLastUpdated(new Date());

      if (data.warning) setError(data.warning);
    } catch (err) {
      console.error("Failed to fetch fixtures:", err);
      setError(err.message || "Unable to load fixtures.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchFixtures(true);

    const interval = setInterval(() => {
      fetchFixtures(false);
    }, 5 * 60 * 1000);

    return () => clearInterval(interval);
  }, [fetchFixtures]);

  const dates = useMemo(
    () =>
      Array.from({ length: 14 }, (_, offset) => {
        const key = addDays(today, offset);
        const date = new Date(`${key}T12:00:00Z`);

        return {
          key,
          offset,
          day: date.toLocaleDateString("en-GB", {
            timeZone: "UTC",
            weekday: "short",
          }),
          number: date.toLocaleDateString("en-GB", {
            timeZone: "UTC",
            day: "2-digit",
          }),
          month: date.toLocaleDateString("en-GB", {
            timeZone: "UTC",
            month: "short",
          }),
          label:
            offset === 0
              ? "TODAY"
              : offset === 1
                ? "TOMORROW"
                : date.toLocaleDateString("en-GB", {
                    timeZone: "UTC",
                    weekday: "short",
                  }).toUpperCase(),
        };
      }),
    [today]
  );

  const visibleMatches = useMemo(() => {
    const query = search.trim().toLowerCase();

    return matches.filter((match) => {
      const fixtureDate = match.fixture?.date;
      if (!fixtureDate) return false;

      const matchDate = getGhanaDateKey(new Date(fixtureDate));

      const matchesSelectedDate =
        matchDate === selectedDate ||
        (selectedDate === today && isLive(match));

      if (!matchesSelectedDate) return false;
      if (!query) return true;

      const searchable = [
        match.teams?.home?.name,
        match.teams?.away?.name,
        match.league?.name,
        match.league?.country,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      return searchable.includes(query);
    });
  }, [matches, selectedDate, today, search]);

  const groupedMatches = useMemo(() => {
    const groups = new Map();

    for (const match of visibleMatches) {
      const key = match.league?.id || match.league?.name || "Football";

      if (!groups.has(key)) {
        groups.set(key, {
          id: key,
          name: match.league?.name || "Football",
          country: match.league?.country || "",
          logo: match.league?.logo || "",
          matches: [],
        });
      }

      groups.get(key).matches.push(match);
    }

    return Array.from(groups.values());
  }, [visibleMatches]);

  const liveCount = matches.filter(isLive).length;
  const selectedDay = dates.find((date) => date.key === selectedDate);

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#080d18] px-5 text-white">
        <div className="text-center">
          <div className="mx-auto mb-5 h-12 w-12 animate-spin rounded-full border-4 border-slate-700 border-t-emerald-400" />
          <h1 className="text-2xl font-extrabold">
            Loading <span className="text-emerald-400">Fixtures</span>
          </h1>
          <p className="mt-2 text-sm text-slate-400">
            Getting the latest available football matches...
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#080d18] px-3 pb-28 pt-7 text-white sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <header className="mb-8 text-center">
          <p className="mb-3 text-xs font-bold tracking-[0.25em] text-emerald-400">
            SPORTS LIVE
          </p>

          <h1 className="text-4xl font-black tracking-tight sm:text-5xl">
            Fixtures <span className="text-emerald-400">&amp; Scores</span>
          </h1>

          <p className="mt-3 text-sm text-slate-300 sm:text-base">
            Football from your favourite leagues, all in one place.
          </p>

          <p className="mt-2 text-xs text-slate-500">
            All times shown in Ghana time (GMT)
          </p>

          <div className="mt-5 flex flex-wrap items-center justify-center gap-3">
            <span className="inline-flex items-center gap-2 rounded-full border border-red-400/20 bg-red-400/10 px-3 py-2 text-xs font-bold text-red-300">
              <span className="h-2 w-2 animate-pulse rounded-full bg-red-400" />
              {liveCount} LIVE
            </span>

            <span className="rounded-full border border-slate-700 bg-[#111a2a] px-3 py-2 text-xs font-bold text-slate-300">
              {matches.length} MATCHES LOADED
            </span>

            <button
              onClick={() => fetchFixtures(true)}
              disabled={loading}
              className="rounded-full border border-slate-700 bg-[#111a2a] px-4 py-2 text-xs font-bold text-slate-200 transition hover:border-emerald-400 hover:text-emerald-300 disabled:opacity-50"
            >
              ↻ Refresh
            </button>
          </div>
        </header>

        <section className="mb-7">
          <div className="mb-3 flex items-center justify-between gap-3">
            <h2 className="text-sm font-extrabold text-slate-200 sm:text-base">
              Choose a date
            </h2>
            <span className="text-xs text-slate-500">Next 14 days</span>
          </div>

          <div className="flex gap-2 overflow-x-auto pb-3">
            {dates.map((date) => {
              const active = selectedDate === date.key;

              return (
                <button
                  key={date.key}
                  onClick={() => setSelectedDate(date.key)}
                  aria-pressed={active}
                  className={`flex min-w-[76px] shrink-0 flex-col items-center rounded-2xl border px-3 py-3 transition sm:min-w-[88px] ${
                    active
                      ? "border-emerald-400 bg-emerald-400 text-slate-950 shadow-lg shadow-emerald-500/10"
                      : "border-slate-700 bg-[#111a2a] text-slate-300 hover:border-emerald-400/60 hover:text-white"
                  }`}
                >
                  <span className="text-[10px] font-extrabold tracking-wide">
                    {date.label}
                  </span>
                  <span className="my-1 text-2xl font-black">
                    {date.number}
                  </span>
                  <span className="text-xs font-semibold">
                    {date.month}
                  </span>
                </button>
              );
            })}
          </div>

          <label className="flex items-center gap-3 rounded-2xl border border-slate-700/70 bg-[#111a2a] px-4 py-3">
            <span className="text-xl text-slate-400">⌕</span>
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search team, league or country..."
              className="w-full bg-transparent text-sm text-white outline-none placeholder:text-slate-500"
            />
            {search && (
              <button
                onClick={() => setSearch("")}
                className="text-xs font-bold text-emerald-400"
              >
                Clear
              </button>
            )}
          </label>
        </section>

        {error && (
          <div className="mb-6 rounded-2xl border border-amber-400/20 bg-amber-400/10 p-4">
            <p className="break-words text-sm leading-6 text-amber-200">
              {error}
            </p>
          </div>
        )}

        <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-lg font-extrabold sm:text-xl">
              {selectedDay?.label || "SELECTED DATE"}
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              {formatDate(selectedDate)}
            </p>
          </div>

          <span className="rounded-full border border-slate-700 bg-[#111a2a] px-3 py-2 text-xs font-bold text-slate-300">
            {visibleMatches.length} MATCHES
          </span>
        </div>

        {visibleMatches.length === 0 ? (
          <div className="rounded-3xl border border-slate-700/70 bg-[#111a2a] px-6 py-16 text-center">
            <div className="mb-5 text-5xl">⚽</div>
            <h2 className="text-xl font-extrabold">No matches found</h2>
            <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-slate-400">
              There are no available matches for this date and search.
              Choose another date or clear your search.
            </p>
            {search && (
              <button
                onClick={() => setSearch("")}
                className="mt-5 rounded-xl bg-emerald-400 px-5 py-3 text-sm font-bold text-slate-950"
              >
                Clear search
              </button>
            )}
          </div>
        ) : (
          <div className="space-y-6">
            {groupedMatches.map((group) => (
              <section
                key={group.id}
                className="overflow-hidden rounded-3xl border border-slate-700/70 bg-[#111a2a] shadow-xl shadow-black/10"
              >
                <div className="flex items-center gap-3 border-b border-slate-700/70 bg-[#0d1524] px-4 py-4 sm:px-5">
                  {group.logo ? (
                    <img
                      src={group.logo}
                      alt=""
                      className="h-7 w-7 shrink-0 object-contain"
                    />
                  ) : (
                    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-slate-800">
                      ⚽
                    </span>
                  )}

                  <div className="min-w-0">
                    <h3 className="truncate text-sm font-extrabold text-slate-100">
                      {group.name}
                    </h3>
                    {group.country && (
                      <p className="mt-1 text-xs text-slate-500">
                        {group.country}
                      </p>
                    )}
                  </div>

                  <span className="ml-auto shrink-0 rounded-full bg-slate-800 px-3 py-1 text-xs font-bold text-slate-300">
                    {group.matches.length}
                  </span>
                </div>

                <div className="divide-y divide-slate-700/50">
                  {group.matches.map((match, index) => {
                    const live = isLive(match);
                    const finished = isFinished(match);
                    const home = match.teams?.home;
                    const away = match.teams?.away;
                    const fixtureId = match.fixture?.id;

                    return (
                      <Link
                        key={fixtureId || `${group.id}-${index}`}
                        href={`/match/${fixtureId || ""}`}
                        className="block transition hover:bg-slate-800/50"
                      >
                        <div className="grid grid-cols-[minmax(0,1fr)_94px_minmax(0,1fr)] items-center gap-2 px-3 py-5 sm:grid-cols-[minmax(0,1fr)_150px_minmax(0,1fr)] sm:gap-4 sm:px-5">
                          <div className="flex min-w-0 items-center gap-2 sm:gap-4">
                            {home?.logo ? (
                              <img
                                src={home.logo}
                                alt=""
                                className="h-8 w-8 shrink-0 object-contain sm:h-11 sm:w-11"
                              />
                            ) : (
                              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-slate-800 sm:h-11 sm:w-11">
                                ⚽
                              </span>
                            )}
                            <span className="min-w-0 break-words text-xs font-bold leading-5 text-slate-100 sm:text-sm">
                              {home?.name || "Home"}
                            </span>
                          </div>

                          <div className="min-w-0 text-center">
                            {live ? (
                              <span className="mb-2 inline-flex items-center gap-1 rounded-full bg-red-500/15 px-2 py-1 text-[9px] font-black text-red-300 sm:text-xs">
                                <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-red-400" />
                                {getStatusLabel(match)}
                              </span>
                            ) : finished ? (
                              <span className="mb-2 block text-[9px] font-bold text-slate-500 sm:text-xs">
                                {getStatusLabel(match)}
                              </span>
                            ) : (
                              <span className="mb-2 block whitespace-nowrap text-[10px] font-semibold text-slate-400 sm:text-xs">
                                {formatTime(match.fixture?.date)}
                              </span>
                            )}

                            <p
                              className={`whitespace-nowrap text-xl font-black sm:text-2xl ${
                                live
                                  ? "text-red-300"
                                  : finished
                                    ? "text-white"
                                    : "text-emerald-400"
                              }`}
                            >
                              {match.goals?.home ?? "-"}
                              <span className="mx-1 text-slate-500">:</span>
                              {match.goals?.away ?? "-"}
                            </p>

                            <p className="mt-1 text-[9px] text-slate-500 sm:text-[10px]">
                              {formatTime(match.fixture?.date)}
                            </p>
                          </div>

                          <div className="flex min-w-0 items-center justify-end gap-2 sm:gap-4">
                            <span className="min-w-0 break-words text-right text-xs font-bold leading-5 text-slate-100 sm:text-sm">
                              {away?.name || "Away"}
                            </span>
                            {away?.logo ? (
                              <img
                                src={away.logo}
                                alt=""
                                className="h-8 w-8 shrink-0 object-contain sm:h-11 sm:w-11"
                              />
                            ) : (
                              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-slate-800 sm:h-11 sm:w-11">
                                ⚽
                              </span>
                            )}
                          </div>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              </section>
            ))}
          </div>
        )}

        <footer className="mt-8 border-t border-slate-800 py-5 text-center text-xs text-slate-600">
          {lastUpdated
            ? `Last refreshed at ${formatTime(lastUpdated)} Ghana time`
            : "Sports Live · Football fixtures"}
        </footer>
      </div>
    </main>
  );
}
