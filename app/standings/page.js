
"use client";

import { useEffect, useMemo, useState } from "react";

const SEASONS = [2026, 2025, 2024, 2023, 2022, 2021, 2020];

const POPULAR_LEAGUES = [
  { country: "England", id: 39, name: "Premier League" },
  { country: "Spain", id: 140, name: "La Liga" },
  { country: "Germany", id: 78, name: "Bundesliga" },
  { country: "Italy", id: 135, name: "Serie A" },
  { country: "France", id: 61, name: "Ligue 1" },
];

export default function StandingsPage() {
  const [leagues, setLeagues] = useState([]);
  const [search, setSearch] = useState("");
  const [season, setSeason] = useState(2026);
  const [selected, setSelected] = useState(null);
  const [table, setTable] = useState([]);
  const [loadingLeagues, setLoadingLeagues] = useState(true);
  const [loadingTable, setLoadingTable] = useState(false);
  const [error, setError] = useState("");
  const [expandedCountry, setExpandedCountry] = useState("England");

  useEffect(() => {
    let active = true;

    async function loadLeagues() {
      try {
        const res = await fetch("/api/leagues");
        const data = await res.json();

        if (!res.ok || !Array.isArray(data.response) ||
            data.response.length === 0) {
          throw new Error("League list unavailable");
        }

        if (active) {
          setLeagues(data.response.map((item) => ({
            country: item.country?.name || "Other",
            id: item.league?.id,
            name: item.league?.name,
            logo: item.league?.logo || "",
          })).filter((item) => item.id && item.name));
        }
      } catch {
        if (active) {
          setLeagues(POPULAR_LEAGUES);
        }
      } finally {
        if (active) setLoadingLeagues(false);
      }
    }

    loadLeagues();
    return () => { active = false; };
  }, []);

  const countries = useMemo(() => {
    const groups = {};

    for (const league of leagues) {
      if (!groups[league.country]) groups[league.country] = [];
      if (!groups[league.country].some((item) => item.id === league.id)) {
        groups[league.country].push(league);
      }
    }

    return Object.entries(groups)
      .map(([name, items]) => ({
        name,
        leagues: items.sort((a, b) => a.name.localeCompare(b.name)),
      }))
      .sort((a, b) => a.name.localeCompare(b.name));
  }, [leagues]);

  const filteredCountries = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return countries;

    return countries.map((country) => ({
      ...country,
      leagues: country.leagues.filter((league) =>
        league.name.toLowerCase().includes(query) ||
        country.name.toLowerCase().includes(query)
      ),
    })).filter((country) =>
      country.name.toLowerCase().includes(query) ||
      country.leagues.length > 0
    );
  }, [countries, search]);

  async function loadTable(league, chosenSeason = season) {
    setSelected(league);
    setExpandedCountry(league.country);
    setTable([]);
    setError("");
    setLoadingTable(true);

    try {
      const res = await fetch(
        `/api/standings?league=${league.id}&season=${chosenSeason}`
      );
      const data = await res.json();

      if (!res.ok) {
        throw new Error("The standings request failed.");
      }

      if (data.errors && Object.keys(data.errors).length > 0) {
        const messages = Object.values(data.errors).flat().join(" ");
        throw new Error(messages || "The football API returned an error.");
      }

      const rows = data.response?.[0]?.league?.standings?.[0];

      if (!Array.isArray(rows) || rows.length === 0) {
        throw new Error(
          `No standings are available for ${league.name} in ${chosenSeason}.`
        );
      }

      setTable(rows);
    } catch (err) {
      setError(err.message || "Unable to load standings.");
    } finally {
      setLoadingTable(false);
    }
  }

  function changeSeason(value) {
    const next = Number(value);
    setSeason(next);
    if (selected) loadTable(selected, next);
  }

  const visibleRows = table.filter((item) =>
    (item.team?.name || "").toLowerCase().includes(search.trim().toLowerCase())
  );

  return (
    <main className="min-h-screen bg-[#080d18] px-4 pb-24 pt-7 text-white sm:px-6">
      <div className="mx-auto max-w-7xl">
        <header className="mb-8 text-center">
          <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl">
            League <span className="text-emerald-400">Tables</span>
          </h1>
          <p className="mt-3 text-base text-slate-300">
            Football standings and league positions
          </p>
          <p className="mt-2 text-xs text-slate-500">
            Select a league to view the table
          </p>
        </header>

        <div className="mb-6 flex flex-col gap-3 sm:flex-row">
          <div className="flex min-w-0 flex-1 items-center gap-3 rounded-2xl border border-slate-700/70 bg-[#111a2a] px-4 py-3">
            <span className="text-xl text-slate-400">⌕</span>
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={selected ? "Search for a team..." : "Search countries or leagues..."}
              className="w-full bg-transparent text-sm text-white outline-none placeholder:text-slate-500"
            />
            {search && (
              <button onClick={() => setSearch("")} className="text-xs text-emerald-400">
                Clear
              </button>
            )}
          </div>

          <label className="flex items-center justify-between gap-4 rounded-2xl border border-slate-700/70 bg-[#111a2a] px-4 py-3">
            <span className="text-sm text-slate-400">Season</span>
            <select
              value={season}
              onChange={(e) => changeSeason(e.target.value)}
              className="bg-transparent text-sm font-bold text-white outline-none"
            >
              {SEASONS.map((year) => (
                <option key={year} value={year} className="bg-slate-900">
                  {year}
                </option>
              ))}
            </select>
          </label>
        </div>

        <div className="grid items-start gap-6 lg:grid-cols-[300px_minmax(0,1fr)]">
          <aside className="overflow-hidden rounded-3xl border border-slate-700/70 bg-[#111a2a]">
            <div className="border-b border-slate-700/70 px-5 py-4">
              <h2 className="font-bold">Countries & Leagues</h2>
              <p className="mt-1 text-xs text-slate-500">
                {leagues.length} available league entries
              </p>
            </div>

            {loadingLeagues ? (
              <p className="p-5 text-sm text-slate-400">Loading leagues...</p>
            ) : (
              <div className="max-h-[620px] overflow-y-auto p-2">
                {filteredCountries.map((country) => {
                  const expanded =
                    expandedCountry === country.name || search.length > 0;

                  return (
                    <div key={country.name} className="mb-1">
                      <button
                        onClick={() =>
                          setExpandedCountry(expanded ? "" : country.name)
                        }
                        className="flex w-full items-center justify-between rounded-xl px-3 py-3 text-left transition hover:bg-slate-800/80"
                      >
                        <span className="flex items-center gap-3">
                          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-800">
                            ⚽
                          </span>
                          <span className="text-sm font-semibold">{country.name}</span>
                        </span>
                        <span className="text-slate-500">
                          {expanded ? "−" : "+"}
                        </span>
                      </button>

                      {expanded && (
                        <div className="ml-4 border-l border-slate-700 pl-2">
                          {country.leagues.map((league) => {
                            const active = selected?.id === league.id;

                            return (
                              <button
                                key={league.id}
                                onClick={() => loadTable(league)}
                                className={`mb-1 flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left text-sm transition ${
                                  active
                                    ? "bg-emerald-500/15 font-bold text-emerald-300"
                                    : "text-slate-300 hover:bg-slate-800"
                                }`}
                              >
                                {league.logo ? (
                                  <img src={league.logo} alt="" className="h-6 w-6 object-contain" />
                                ) : (
                                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-slate-800 text-xs">⚽</span>
                                )}
                                <span>{league.name}</span>
                              </button>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </aside>

          <section className="min-w-0 overflow-hidden rounded-3xl border border-slate-700/70 bg-[#111a2a]">
            {!selected ? (
              <div className="flex min-h-[380px] flex-col items-center justify-center p-8 text-center">
                <div className="mb-5 flex h-20 w-20 items-center justify-center rounded-3xl border border-slate-700 bg-slate-800/70 text-4xl">
                  🏆
                </div>
                <h2 className="text-2xl font-extrabold">Choose your league</h2>
                <p className="mt-3 max-w-sm text-sm leading-6 text-slate-400">
                  Select a country and league on the left to view team positions,
                  wins, draws, losses and points.
                </p>
                <div className="mt-6 flex flex-wrap justify-center gap-2">
                  {POPULAR_LEAGUES.slice(0, 3).map((league) => (
                    <button
                      key={league.id}
                      onClick={() => loadTable(league)}
                      className="rounded-xl border border-slate-700 bg-slate-800/70 px-4 py-2 text-xs font-semibold transition hover:border-emerald-400 hover:text-emerald-300"
                    >
                      {league.name}
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <>
                <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-700/70 p-5 sm:p-6">
                  <div className="flex items-center gap-4">
                    {selected.logo ? (
                      <img src={selected.logo} alt="" className="h-12 w-12 object-contain" />
                    ) : (
                      <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-800 text-2xl">⚽</span>
                    )}
                    <div>
                      <p className="text-xs text-slate-400">{selected.country}</p>
                      <h2 className="text-xl font-extrabold sm:text-2xl">{selected.name}</h2>
                      <p className="mt-1 text-xs text-slate-500">{season} season</p>
                    </div>
                  </div>
                  <span className="rounded-full border border-emerald-400/30 bg-emerald-400/10 px-3 py-2 text-xs font-bold text-emerald-300">
                    LEAGUE TABLE
                  </span>
                </div>

                {loadingTable ? (
                  <div className="flex min-h-64 flex-col items-center justify-center gap-3 p-8">
                    <div className="h-9 w-9 animate-spin rounded-full border-2 border-slate-700 border-t-emerald-400" />
                    <p className="font-semibold">Loading standings...</p>
                    <p className="text-xs text-slate-500">Contacting football data provider</p>
                  </div>
                ) : error ? (
                  <div className="p-5 sm:p-7">
                    <div className="rounded-2xl border border-red-400/20 bg-red-400/10 p-5">
                      <h3 className="font-bold text-red-300">Standings unavailable</h3>
                      <p className="mt-2 break-words text-sm leading-6 text-slate-300">{error}</p>
                      <button
                        onClick={() => loadTable(selected)}
                        className="mt-4 rounded-xl bg-emerald-400 px-4 py-2 text-sm font-bold text-slate-950 transition hover:bg-emerald-300"
                      >
                        Try again
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="overflow-x-auto">
                      <table className="w-full min-w-[600px] text-left text-sm">
                        <thead className="bg-[#0b1220] text-[11px] uppercase tracking-wider text-slate-400">
                          <tr>
                            <th className="px-4 py-4 text-center">Pos</th>
                            <th className="px-3 py-4">Club</th>
                            <th className="px-3 py-4 text-center">P</th>
                            <th className="px-3 py-4 text-center">W</th>
                            <th className="px-3 py-4 text-center">D</th>
                            <th className="px-3 py-4 text-center">L</th>
                            <th className="px-3 py-4 text-center">GD</th>
                            <th className="px-4 py-4 text-center">Pts</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-700/50">
                          {visibleRows.map((item, index) => {
                            const pos = Number(item.rank) || index + 1;
                            const total = table.length;
                            const qualification = pos <= 4;
                            const relegation = pos > total - 3 && total >= 10;

                            return (
                              <tr key={item.team?.id || index} className="transition hover:bg-slate-800/50">
                                <td className="px-4 py-4 text-center">
                                  <span className={`inline-flex h-7 min-w-7 items-center justify-center rounded-lg px-1 text-xs font-bold ${
                                    qualification ? "bg-emerald-400/15 text-emerald-300" :
                                    relegation ? "bg-red-400/10 text-red-300" :
                                    "text-slate-400"
                                  }`}>
                                    {pos}
                                  </span>
                                </td>
                                <td className="px-3 py-4">
                                  <div className="flex items-center gap-3">
                                    {item.team?.logo ? (
                                      <img src={item.team.logo} alt="" className="h-7 w-7 shrink-0 object-contain" />
                                    ) : (
                                      <span className="flex h-7 w-7 items-center justify-center rounded-full bg-slate-800 text-xs">⚽</span>
                                    )}
                                    <span className="font-semibold text-slate-100">{item.team?.name || "Unknown team"}</span>
                                  </div>
                                </td>
                                <td className="px-3 py-4 text-center text-slate-300">{item.all?.played ?? 0}</td>
                                <td className="px-3 py-4 text-center text-slate-300">{item.all?.win ?? 0}</td>
                                <td className="px-3 py-4 text-center text-slate-300">{item.all?.draw ?? 0}</td>
                                <td className="px-3 py-4 text-center text-slate-300">{item.all?.lose ?? 0}</td>
                                <td className={`px-3 py-4 text-center ${
                                  (item.goalsDiff ?? 0) > 0 ? "text-emerald-300" :
                                  (item.goalsDiff ?? 0) < 0 ? "text-red-300" :
                                  "text-slate-400"
                                }`}>
                                  {(item.goalsDiff ?? 0) > 0 ? "+" : ""}{item.goalsDiff ?? 0}
                                </td>
                                <td className="px-4 py-4 text-center font-extrabold text-white">{item.points ?? 0}</td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>

                    {visibleRows.length === 0 && (
                      <p className="p-8 text-center text-sm text-slate-400">No teams match your search.</p>
                    )}

                    <div className="border-t border-slate-700/70 px-5 py-4 text-xs text-slate-500">
                      P: Played · W: Won · D: Drawn · L: Lost · GD: Goal difference · Pts: Points
                    </div>
                  </>
                )}
              </>
            )}
          </section>
        </div>

        <footer className="mt-8 border-t border-slate-800 py-5 text-center text-xs text-slate-600">
          Sports Live · Football standings
        </footer>
      </div>
    </main>
  );
}
