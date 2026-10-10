
"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";

const LIVE_STATUSES = [
  "1H", "2H", "HT", "ET", "BT", "P",
  "LIVE", "INT", "SUSP", "INTERRUPTED"
];

function getStatus(match) {
  return match.fixture?.status?.short || "NS";
}

function getStatusLabel(match) {
  const status = getStatus(match);
  const elapsed = match.fixture?.status?.elapsed;

  const labels = {
    "1H": "FIRST HALF",
    "2H": "SECOND HALF",
    HT: "HALF TIME",
    ET: "EXTRA TIME",
    BT: "BREAK",
    P: "PENALTIES",
    INT: "INTERRUPTED",
    INTERRUPTED: "INTERRUPTED",
    SUSP: "SUSPENDED",
  };

  return labels[status] ||
    (elapsed != null ? `${elapsed}' LIVE` : "LIVE");
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

export default function LivePage() {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [lastUpdated, setLastUpdated] = useState(null);

  const fetchLiveMatches = useCallback(async () => {
    try {
      setError("");

      const response = await fetch("/api/fixtures");

      if (!response.ok) {
        throw new Error(`Request failed (${response.status}).`);
      }

      const data = await response.json();

      if (data.success === false) {
        throw new Error(data.error || "Could not load matches.");
      }

      const allMatches = Array.isArray(data.events)
        ? data.events
        : [];

      const liveMatches = allMatches
        .filter((match) => LIVE_STATUSES.includes(getStatus(match)))
        .sort(
          (a, b) =>
            new Date(a.fixture?.date || 0) -
            new Date(b.fixture?.date || 0)
        );

      setMatches(liveMatches);
      setLastUpdated(new Date());
    } catch (err) {
      console.error("Failed to load live matches:", err);
      setError(err.message || "Could not load live matches.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchLiveMatches();

    const interval = setInterval(fetchLiveMatches, 60 * 1000);

    return () => clearInterval(interval);
  }, [fetchLiveMatches]);

  return (
    <main className="min-h-screen bg-[#080d18] px-3 pb-28 pt-7 text-white sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl">
        <header className="mb-8">
          <div className="flex items-center gap-3">
            <span className="relative flex h-4 w-4">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-400 opacity-60" />
              <span className="relative inline-flex h-4 w-4 rounded-full bg-red-500" />
            </span>

            <h1 className="text-3xl font-black sm:text-4xl">
              Live <span className="text-emerald-400">Matches</span>
            </h1>
          </div>

          <p className="mt-3 text-sm text-slate-400">
            Follow football matches currently in progress.
          </p>

          <div className="mt-5 flex flex-wrap items-center gap-3">
            <span className="rounded-full border border-red-400/20 bg-red-400/10 px-3 py-2 text-xs font-bold text-red-300">
              {matches.length} LIVE MATCHES
            </span>

            <button
              onClick={fetchLiveMatches}
              className="rounded-full border border-slate-700 bg-[#111a2a] px-4 py-2 text-xs font-bold text-slate-200 transition hover:border-emerald-400 hover:text-emerald-300"
            >
              ↻ Refresh
            </button>
          </div>
        </header>

        {error && (
          <div className="mb-5 rounded-2xl border border-red-400/20 bg-red-400/10 p-4 text-sm text-red-200">
            {error}
          </div>
        )}

        {loading ? (
          <div className="rounded-2xl border border-slate-700 bg-[#111a2a] p-12 text-center">
            <div className="mx-auto mb-4 h-9 w-9 animate-spin rounded-full border-4 border-slate-700 border-t-emerald-400" />
            <p className="text-slate-300">Checking live matches...</p>
          </div>
        ) : matches.length === 0 ? (
          <div className="rounded-2xl border border-slate-700/70 bg-[#111a2a] px-5 py-14 text-center">
            <div className="mb-4 text-5xl">⚽</div>
            <h2 className="text-xl font-extrabold">
              No live matches right now
            </h2>
            <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-slate-400">
              No matches in the available fixtures data are currently marked
              as live. Upcoming matches will appear here when they start.
            </p>
            <Link
              href="/fixtures"
              className="mt-6 inline-flex rounded-xl bg-emerald-400 px-5 py-3 text-sm font-bold text-slate-950 transition hover:bg-emerald-300"
            >
              View upcoming fixtures
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {matches.map((match, index) => {
              const id = match.fixture?.id;
              const home = match.teams?.home;
              const away = match.teams?.away;

              return (
                <Link
                  key={id || index}
                  href={`/match/${id || ""}`}
                  className="block rounded-2xl border border-slate-700/70 bg-[#111a2a] p-4 transition hover:border-emerald-400/50 hover:bg-[#152136] sm:p-6"
                >
                  <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
                    <div className="flex min-w-0 items-center gap-2">
                      {match.league?.logo && (
                        <img
                          src={match.league.logo}
                          alt=""
                          className="h-6 w-6 object-contain"
                        />
                      )}

                      <div className="min-w-0">
                        <p className="truncate text-sm font-bold text-slate-200">
                          {match.league?.name || "Football"}
                        </p>
                        <p className="text-xs text-slate-500">
                          {match.league?.country || ""}
                        </p>
                      </div>
                    </div>

                    <span className="inline-flex items-center gap-2 rounded-full bg-red-500/15 px-3 py-2 text-[10px] font-black text-red-300 sm:text-xs">
                      <span className="h-2 w-2 animate-pulse rounded-full bg-red-400" />
                      {getStatusLabel(match)}
                    </span>
                  </div>

                  <div className="grid grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] items-center gap-2 sm:gap-5">
                    <div className="flex min-w-0 flex-col items-center gap-3 text-center">
                      {home?.logo ? (
                        <img
                          src={home.logo}
                          alt=""
                          className="h-12 w-12 object-contain sm:h-16 sm:w-16"
                        />
                      ) : (
                        <span className="text-3xl">⚽</span>
                      )}

                      <span className="break-words text-xs font-bold sm:text-sm">
                        {home?.name || "Home"}
                      </span>
                    </div>

                    <div className="min-w-[76px] text-center sm:min-w-[100px]">
                      <p className="whitespace-nowrap text-3xl font-black text-white sm:text-4xl">
                        {match.goals?.home ?? 0}
                        <span className="mx-2 text-emerald-400">:</span>
                        {match.goals?.away ?? 0}
                      </p>

                      <p className="mt-2 text-xs font-semibold text-slate-400">
                        {formatTime(match.fixture?.date)} GMT
                      </p>
                    </div>

                    <div className="flex min-w-0 flex-col items-center gap-3 text-center">
                      {away?.logo ? (
                        <img
                          src={away.logo}
                          alt=""
                          className="h-12 w-12 object-contain sm:h-16 sm:w-16"
                        />
                      ) : (
                        <span className="text-3xl">⚽</span>
                      )}

                      <span className="break-words text-xs font-bold sm:text-sm">
                        {away?.name || "Away"}
                      </span>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}

        <footer className="mt-8 border-t border-slate-800 py-5 text-center text-xs text-slate-500">
          {lastUpdated
            ? `Last checked at ${formatTime(lastUpdated)} Ghana time`
            : "Sports Live · Live scores"}
        </footer>
      </div>
    </main>
  );
}
