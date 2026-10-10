
"use client";

import { use, useCallback, useEffect, useState } from "react";
import "./match.css";

const API_BASE = "/api/match";

const TABS = [
  "overview",
  "lineups",
  "bench",
  "stats",
  "timeline",
  "commentary",
];

const LIVE_STATUSES = ["1H", "2H", "HT", "ET", "P", "LIVE", "INT"];

function getEventDescription(event) {
  const player = event.player?.name || "";
  const team = event.team?.name || "";
  const detail = event.detail || "";
  const comments = event.comments || "";
  const type = (event.type || "").toLowerCase();
  const detailLower = detail.toLowerCase();

  if (type === "goal") {
    if (detailLower.includes("own goal")) {
      return `⚽ Own goal${player ? ` by ${player}` : ""}${team ? ` (${team})` : ""}.`;
    }

    const penalty = detailLower.includes("penalty")
      ? " from the penalty spot"
      : "";
    const assist = event.assist?.name
      ? ` Assisted by ${event.assist.name}.`
      : "";

    return `⚽ GOAL${penalty}!${
      player ? ` ${player} scored` : " A goal was scored"
    }${team ? ` for ${team}` : ""}.${assist}`;
  }

  if (type === "card") {
    const icon = detailLower.includes("yellow")
      ? "🟨"
      : detailLower.includes("red")
      ? "🟥"
      : "🟨🟥";

    return `${icon} ${detail || "Card"}${
      player ? ` for ${player}` : ""
    }${team ? ` (${team})` : ""}.`;
  }

  if (type === "subst" || type === "substitution") {
    const otherPlayer = event.assist?.name;

    return `🔄 Substitution${team ? ` for ${team}` : ""}: ${
      player || "Player details unavailable"
    }${
      otherPlayer ? ` · other player: ${otherPlayer}` : ""
    }.`;
  }

  if (type === "var") {
    return `📺 VAR review${detail ? `: ${detail}` : ""}${
      comments ? ` — ${comments}` : ""
    }`;
  }

  if (detail || comments) {
    return `${detail || "Match update"}${
      player ? ` · ${player}` : ""
    }${team ? ` (${team})` : ""}${
      comments && comments !== detail ? ` — ${comments}` : ""
    }`;
  }

  return `Match event${player ? ` · ${player}` : ""}${
    team ? ` (${team})` : ""
  }.`;
}

function formatDate(date) {
  if (!date) return "Date unavailable";

  return new Date(date).toLocaleString("en-GB", {
    weekday: "short",
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function getPlayerPhoto(player) {
  if (player?.photo) return player.photo;

  if (player?.id) {
    return `https://media.api-sports.io/football/players/${player.id}.png`;
  }

  return null;
}

function getRating(player) {
  const value = player?.statistics?.[0]?.games?.rating;
  const rating = Number(value);

  return Number.isFinite(rating) && rating > 0
    ? rating.toFixed(1)
    : null;
}

function formatStat(value) {
  if (value === null || value === undefined || value === "") {
    return "—";
  }

  return String(value);
}

function PlayerCard({ item, onSelect }) {
  const player = item?.player || item;
  const photo = getPlayerPhoto(player);
  const rating = getRating(item?.player ? item : player);

  return (
    <button
      type="button"
      className="match-player-card"
      onClick={() => onSelect(player)}
      title={`View ${player?.name || "player"} details`}
    >
      <span className="match-player-photo-wrap">
        {photo ? (
          <img
            src={photo}
            alt={player?.name || "Player"}
            className="match-player-photo"
            loading="lazy"
            onError={(event) => {
              event.currentTarget.style.display = "none";

              if (event.currentTarget.nextElementSibling) {
                event.currentTarget.nextElementSibling.style.display = "flex";
              }
            }}
          />
        ) : null}

        <span
          className="match-player-photo-fallback"
          style={{ display: photo ? "none" : "flex" }}
        >
          ⚽
        </span>

        {player?.number !== undefined && player?.number !== null && (
          <span className="match-player-number">{player.number}</span>
        )}
      </span>

      <span className="match-player-name">
        {player?.name || "Unknown player"}
      </span>

      {rating && <span className="match-player-rating">{rating}</span>}
    </button>
  );
}

function PlayerList({ players, onSelect }) {
  if (!players?.length) {
    return (
      <p className="match-empty">
        Player information is not available.
      </p>
    );
  }

  return (
    <div className="match-player-list">
      {players.map((item, index) => (
        <PlayerCard
          key={item?.player?.id || item?.id || index}
          item={item}
          onSelect={onSelect}
        />
      ))}
    </div>
  );
}

function FootballPitch({ lineup, onSelect, reverse = false }) {
  const players = lineup?.startXI || [];

  if (!players.length) {
    return (
      <div className="match-pitch-empty">
        <p>Lineup has not been supplied for this team.</p>
      </div>
    );
  }

  const rows = {};

  players.forEach((item) => {
    const player = item.player || {};
    const grid = player.grid || "1:1";
    const [row] = grid.split(":");
    const rowNumber = Number(row) || 1;

    if (!rows[rowNumber]) rows[rowNumber] = [];
    rows[rowNumber].push(item);
  });

  const rowNumbers = Object.keys(rows)
    .map(Number)
    .sort((a, b) => (reverse ? b - a : a - b));

  return (
    <div className="match-pitch">
      <div className="match-pitch-line match-pitch-halfway" />
      <div className="match-pitch-circle" />
      <div className="match-pitch-box match-pitch-box-top" />
      <div className="match-pitch-box match-pitch-box-bottom" />

      <div className="match-pitch-players">
        {rowNumbers.map((rowNumber) => (
          <div className="match-pitch-row" key={rowNumber}>
            {rows[rowNumber]
              .slice()
              .sort((a, b) => {
                const colA = Number(
                  (a.player?.grid || "1:1").split(":")[1]
                );
                const colB = Number(
                  (b.player?.grid || "1:1").split(":")[1]
                );

                return colA - colB;
              })
              .map((item, index) => (
                <PlayerCard
                  key={item.player?.id || index}
                  item={item}
                  onSelect={onSelect}
                />
              ))}
          </div>
        ))}
      </div>
    </div>
  );
}

function StatBar({ label, home, away }) {
  const numericHome = Number(String(home ?? "").replace("%", ""));
  const numericAway = Number(String(away ?? "").replace("%", ""));

  const hasNumbers =
    Number.isFinite(numericHome) &&
    Number.isFinite(numericAway) &&
    (numericHome !== 0 || numericAway !== 0);

  const total = hasNumbers ? numericHome + numericAway : 0;
  const homeWidth = total > 0 ? (numericHome / total) * 100 : 50;

  return (
    <div className="match-stat-row">
      <div className="match-stat-values">
        <strong>{formatStat(home)}</strong>
        <span>{label}</span>
        <strong>{formatStat(away)}</strong>
      </div>

      <div className="match-stat-track">
        <span
          className="match-stat-home"
          style={{ width: `${homeWidth}%` }}
        />
        <span
          className="match-stat-away"
          style={{ width: `${100 - homeWidth}%` }}
        />
      </div>
    </div>
  );
}

export default function MatchPage({ params }) {
  const resolvedParams = use(params);
  const fixtureId = resolvedParams.id;

  const [match, setMatch] = useState(null);
  const [statistics, setStatistics] = useState([]);
  const [lineups, setLineups] = useState([]);
  const [events, setEvents] = useState([]);
  const [playerData, setPlayerData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState("overview");

  const [selectedPlayer, setSelectedPlayer] = useState(null);
  const [playerProfile, setPlayerProfile] = useState(null);
  const [playerSeason, setPlayerSeason] = useState(null);
  const [playerTransfers, setPlayerTransfers] = useState([]);
  const [playerLoading, setPlayerLoading] = useState(false);
  const [playerError, setPlayerError] = useState("");

  const fetchMatch = useCallback(async () => {
    try {
      const requests = await Promise.all(
        ["match", "statistics", "lineups", "events", "players"].map(
          async (type) => {
            const response = await fetch(
              `${API_BASE}?id=${encodeURIComponent(fixtureId)}&type=${type}`,
              { cache: "no-store" }
            );

            const data = await response.json();

            if (!response.ok || data.error) {
              return {
                type,
                response: [],
                error: data.error || "Request failed",
              };
            }

            return {
              type,
              response: data.response || [],
            };
          }
        )
      );

      const results = Object.fromEntries(
        requests.map((result) => [result.type, result])
      );

      const matchResult = results.match;

      if (matchResult?.response?.length) {
        setMatch(matchResult.response[0]);
        setError("");
      } else {
        setMatch(null);
        setError(
          matchResult?.error ||
            "Match information could not be loaded. Check the fixture ID and API response."
        );
      }

      setStatistics(results.statistics?.response || []);
      setLineups(results.lineups?.response || []);
      setEvents(results.events?.response || []);
      setPlayerData(results.players?.response || []);
    } catch (err) {
      console.error("Could not load match:", err);
      setError("Unable to connect to the match service.");
    } finally {
      setLoading(false);
    }
  }, [fixtureId]);

  useEffect(() => {
    setLoading(true);
    fetchMatch();
  }, [fetchMatch]);

  const status = match?.fixture?.status?.short;

  useEffect(() => {
    if (!LIVE_STATUSES.includes(status)) return;

    const timer = setInterval(fetchMatch, 60000);
    return () => clearInterval(timer);
  }, [status, fetchMatch]);

  async function openPlayer(player) {
    if (!player?.id) {
      setSelectedPlayer(player);
      setPlayerProfile(null);
      setPlayerSeason(null);
      setPlayerTransfers([]);
      setPlayerError(
        "A player ID was not supplied, so extra details cannot be loaded."
      );
      return;
    }

    setSelectedPlayer(player);
    setPlayerProfile(null);
    setPlayerSeason(null);
    setPlayerTransfers([]);
    setPlayerError("");
    setPlayerLoading(true);

    try {
      const season = match?.league?.season || new Date().getFullYear();

      const requests = await Promise.allSettled([
        fetch(
          `${API_BASE}?type=profile&player=${player.id}`
        ).then((r) => r.json()),

        fetch(
          `${API_BASE}?type=season&player=${player.id}&season=${season}`
        ).then((r) => r.json()),

        fetch(
          `${API_BASE}?type=transfers&player=${player.id}`
        ).then((r) => r.json()),
      ]);

      const profile =
        requests[0].status === "fulfilled" ? requests[0].value : null;

      const seasonData =
        requests[1].status === "fulfilled" ? requests[1].value : null;

      const transferData =
        requests[2].status === "fulfilled" ? requests[2].value : null;

      setPlayerProfile(profile?.response?.[0] || null);
      setPlayerSeason(seasonData?.response?.[0] || null);
      setPlayerTransfers(
        transferData?.response?.[0]?.transfers || []
      );

      if (
        !profile?.response?.length &&
        !seasonData?.response?.length &&
        !transferData?.response?.length
      ) {
        setPlayerError(
          "The API did not return extra profile information. The player may still appear in the match lineup."
        );
      }
    } catch (err) {
      console.error("Could not load player details:", err);
      setPlayerError("Could not load this player's additional details.");
    } finally {
      setPlayerLoading(false);
    }
  }

  const homeTeam = lineups.find(
    (team) => team.team?.id === match?.teams?.home?.id
  );

  const awayTeam = lineups.find(
    (team) => team.team?.id === match?.teams?.away?.id
  );

  const homeStats = statistics.find(
    (team) => team.team?.id === match?.teams?.home?.id
  );

  const awayStats = statistics.find(
    (team) => team.team?.id === match?.teams?.away?.id
  );

  const homePlayers = playerData.find(
    (team) => team.team?.id === match?.teams?.home?.id
  );

  const awayPlayers = playerData.find(
    (team) => team.team?.id === match?.teams?.away?.id
  );

  const isLive = LIVE_STATUSES.includes(status);

  if (loading) {
    return (
      <main className="match-page">
        <div className="match-loading">
          <div className="match-spinner" />
          <h2>Loading match centre…</h2>
          <p>Getting the score, lineups and available statistics.</p>
        </div>
      </main>
    );
  }

  if (!match) {
    return (
      <main className="match-page">
        <div className="match-error">
          <h1>Match unavailable</h1>
          <p>{error || "No match was returned by the API."}</p>
          <button type="button" onClick={fetchMatch}>
            Try again
          </button>
        </div>
      </main>
    );
  }

  const home = match.teams?.home;
  const away = match.teams?.away;
  const goalsHome = match.goals?.home ?? 0;
  const goalsAway = match.goals?.away ?? 0;

  const allStatTypes = [
    ...new Set([
      ...(homeStats?.statistics || []).map((stat) => stat.type),
      ...(awayStats?.statistics || []).map((stat) => stat.type),
    ]),
  ];

  const allStats = allStatTypes.map((type) => ({
    label: type,
    home:
      homeStats?.statistics?.find((stat) => stat.type === type)?.value ??
      null,
    away:
      awayStats?.statistics?.find((stat) => stat.type === type)?.value ??
      null,
  }));

  const eventsSorted = events.slice().sort((a, b) => {
    const minuteA = a.time?.elapsed ?? 0;
    const minuteB = b.time?.elapsed ?? 0;
    const extraA = a.time?.extra ?? 0;
    const extraB = b.time?.extra ?? 0;

    return minuteA - minuteB || extraA - extraB;
  });

  const timelineEvents = eventsSorted.filter((event) =>
    ["Goal", "Card", "subst", "Var"].includes(event.type)
  );

  return (
    <main className="match-page">
      <div className="match-container">
        <header className="match-competition">
          <div className="match-league">
            {match.league?.logo && (
              <img src={match.league.logo} alt="" />
            )}

            <div>
              <strong>{match.league?.name || "Football match"}</strong>
              <span>
                {match.league?.country || ""}
                {match.league?.round
                  ? ` · ${match.league.round}`
                  : ""}
              </span>
            </div>
          </div>

          <div className={`match-status ${isLive ? "is-live" : ""}`}>
            {isLive && <span className="match-live-dot" />}
            {match.fixture?.status?.long || "Status unavailable"}
            {match.fixture?.status?.elapsed != null &&
              ` · ${match.fixture.status.elapsed}'`}
          </div>
        </header>

        <section className="match-scoreboard">
          <div className="match-team">
            {home?.logo && <img src={home.logo} alt="" />}
            <h2>{home?.name || "Home team"}</h2>
            <span>{home?.winner ? "Winner" : "Home"}</span>
          </div>

          <div className="match-score">
            <div>
              <strong>{goalsHome}</strong>
              <span>:</span>
              <strong>{goalsAway}</strong>
            </div>

            <p>{formatDate(match.fixture?.date)}</p>

            {match.fixture?.venue?.name && (
              <small>
                {match.fixture.venue.name}
                {match.fixture.venue.city
                  ? `, ${match.fixture.venue.city}`
                  : ""}
              </small>
            )}
          </div>

          <div className="match-team">
            {away?.logo && <img src={away.logo} alt="" />}
            <h2>{away?.name || "Away team"}</h2>
            <span>{away?.winner ? "Winner" : "Away"}</span>
          </div>
        </section>

        <nav className="match-tabs" aria-label="Match information">
          {TABS.map((tab) => (
            <button
              type="button"
              key={tab}
              className={activeTab === tab ? "active" : ""}
              onClick={() => setActiveTab(tab)}
            >
              {tab === "stats"
                ? "Statistics"
                : tab === "bench"
                ? "Substitutes"
                : tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </nav>

        {activeTab === "overview" && (
          <section className="match-content-grid">
            <div className="match-panel">
              <h3>Match timeline</h3>

              {timelineEvents.length ? (
                <div className="match-timeline">
                  {timelineEvents.map((event, index) => (
                    <article
                      className="match-timeline-event"
                      key={`${event.time?.elapsed}-${event.type}-${index}`}
                    >
                      <span className="match-event-minute">
                        {event.time?.elapsed ?? "—"}'
                        {event.time?.extra
                          ? `+${event.time.extra}`
                          : ""}
                      </span>

                      <div>
                        <strong>{getEventDescription(event)}</strong>

                        {event.team?.name && (
                          <small>{event.team.name}</small>
                        )}

                        {event.comments && (
                          <p>{event.comments}</p>
                        )}
                      </div>
                    </article>
                  ))}
                </div>
              ) : (
                <p className="match-empty">
                  No goal, card, substitution or VAR events are available yet.
                </p>
              )}

              <button
                className="match-secondary-button"
                type="button"
                onClick={() => setActiveTab("timeline")}
              >
                View all match events
              </button>
            </div>

            <div className="match-panel">
              <h3>Match statistics</h3>

              {allStats.length ? (
                allStats.slice(0, 8).map((stat) => (
                  <StatBar
                    key={stat.label}
                    label={stat.label}
                    home={stat.home}
                    away={stat.away}
                  />
                ))
              ) : (
                <p className="match-empty">
                  Statistics have not been supplied for this match yet.
                </p>
              )}

              {allStats.length > 8 && (
                <button
                  className="match-secondary-button"
                  type="button"
                  onClick={() => setActiveTab("stats")}
                >
                  View all statistics
                </button>
              )}
            </div>
          </section>
        )}

        {activeTab === "lineups" && (
          <section className="match-content-grid">
            <div className="match-panel">
              <h3>
                {home?.name} ·{" "}
                {homeTeam?.formation || "Formation unavailable"}
              </h3>

              <FootballPitch lineup={homeTeam} onSelect={openPlayer} />

              <h4>Starting XI</h4>
              <PlayerList
                players={homeTeam?.startXI}
                onSelect={openPlayer}
              />
            </div>

            <div className="match-panel">
              <h3>
                {away?.name} ·{" "}
                {awayTeam?.formation || "Formation unavailable"}
              </h3>

              <FootballPitch
                lineup={awayTeam}
                onSelect={openPlayer}
                reverse
              />

              <h4>Starting XI</h4>
              <PlayerList
                players={awayTeam?.startXI}
                onSelect={openPlayer}
              />
            </div>
          </section>
        )}

        {activeTab === "bench" && (
          <section className="match-content-grid">
            <div className="match-panel">
              <h3>{home?.name} · Substitutes</h3>
              <PlayerList
                players={homeTeam?.substitutes}
                onSelect={openPlayer}
              />
            </div>

            <div className="match-panel">
              <h3>{away?.name} · Substitutes</h3>
              <PlayerList
                players={awayTeam?.substitutes}
                onSelect={openPlayer}
              />
            </div>
          </section>
        )}

        {activeTab === "stats" && (
          <section className="match-panel">
            <h3>Full match statistics</h3>

            {allStats.length ? (
              allStats.map((stat) => (
                <StatBar
                  key={stat.label}
                  label={stat.label}
                  home={stat.home}
                  away={stat.away}
                />
              ))
            ) : (
              <p className="match-empty">
                No statistics are available. Some matches do not provide stats
                until later or after the match.
              </p>
            )}
          </section>
        )}

        {activeTab === "timeline" && (
          <section className="match-panel">
            <h3>All match events</h3>

            {eventsSorted.length ? (
              <div className="match-timeline">
                {eventsSorted.map((event, index) => (
                  <article
                    className="match-timeline-event"
                    key={`${event.time?.elapsed}-${event.type}-${index}`}
                  >
                    <span className="match-event-minute">
                      {event.time?.elapsed ?? "—"}'
                      {event.time?.extra
                        ? `+${event.time.extra}`
                        : ""}
                    </span>

                    <div>
                      <strong>{getEventDescription(event)}</strong>

                      {event.team?.name && (
                        <small>{event.team.name}</small>
                      )}

                      {event.comments && <p>{event.comments}</p>}
                    </div>
                  </article>
                ))}
              </div>
            ) : (
              <p className="match-empty">
                No match events are available.
              </p>
            )}
          </section>
        )}

        {activeTab === "commentary" && (
          <section className="match-panel">
            <h3>Match commentary</h3>

            {eventsSorted.length ? (
              <div className="match-commentary">
                {eventsSorted.map((event, index) => (
                  <article
                    key={`${event.time?.elapsed}-${event.type}-${index}`}
                  >
                    <time>
                      {event.time?.elapsed ?? "—"}'
                      {event.time?.extra
                        ? `+${event.time.extra}`
                        : ""}
                    </time>

                    <div>
                      <strong>
                        {event.detail || event.type || "Match update"}
                      </strong>

                      <p>
                        {event.comments || getEventDescription(event)}
                      </p>

                      {event.team?.name && (
                        <small>{event.team.name}</small>
                      )}
                    </div>
                  </article>
                ))}
              </div>
            ) : (
              <p className="match-empty">
                Text commentary is not provided by this match endpoint.
                Available match events will appear here when supplied by the API.
              </p>
            )}
          </section>
        )}

        {error && (
          <p className="match-inline-error" role="status">
            {error}
          </p>
        )}
      </div>

      {selectedPlayer && (
        <div
          className="match-modal-backdrop"
          role="presentation"
          onClick={() => setSelectedPlayer(null)}
        >
          <section
            className="match-player-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="match-player-title"
            onClick={(event) => event.stopPropagation()}
          >
            <button
              type="button"
              className="match-modal-close"
              onClick={() => setSelectedPlayer(null)}
              aria-label="Close player details"
            >
              ×
            </button>

            <div className="match-player-profile-heading">
              {getPlayerPhoto(selectedPlayer) && (
                <img
                  src={getPlayerPhoto(selectedPlayer)}
                  alt=""
                  onError={(event) => {
                    event.currentTarget.style.display = "none";
                  }}
                />
              )}

              <div>
                <h2 id="match-player-title">
                  {selectedPlayer.name || "Player details"}
                </h2>

                <p>
                  {selectedPlayer.position || "Position unavailable"}
                  {selectedPlayer.number != null
                    ? ` · Shirt ${selectedPlayer.number}`
                    : ""}
                </p>
              </div>
            </div>

            {playerLoading ? (
              <p className="match-empty">
                Loading profile and transfer history…
              </p>
            ) : (
              <>
                {playerError && (
                  <p className="match-inline-error">{playerError}</p>
                )}

                {playerProfile?.player && (
                  <div className="match-player-detail-section">
                    <h3>Player profile</h3>

                    <div className="match-player-detail-grid">
                      <span>Nationality</span>
                      <strong>
                        {playerProfile.player.nationality || "—"}
                      </strong>

                      <span>Age</span>
                      <strong>{playerProfile.player.age ?? "—"}</strong>

                      <span>Height</span>
                      <strong>{playerProfile.player.height || "—"}</strong>

                      <span>Weight</span>
                      <strong>{playerProfile.player.weight || "—"}</strong>

                      <span>Birth date</span>
                      <strong>
                        {playerProfile.player.birth?.date || "—"}
                      </strong>
                    </div>
                  </div>
                )}

                {playerSeason?.statistics?.length > 0 && (
                  <div className="match-player-detail-section">
                    <h3>Season statistics</h3>

                    {playerSeason.statistics.map((stat, index) => (
                      <div
                        className="match-player-detail-grid"
                        key={`${stat.team?.id || index}-${index}`}
                      >
                        <span>Team</span>
                        <strong>{stat.team?.name || "—"}</strong>

                        <span>League</span>
                        <strong>{stat.league?.name || "—"}</strong>

                        <span>Appearances</span>
                        <strong>{stat.games?.appearences ?? "—"}</strong>

                        <span>Goals</span>
                        <strong>{stat.goals?.total ?? "—"}</strong>

                        <span>Assists</span>
                        <strong>{stat.goals?.assists ?? "—"}</strong>

                        <span>Yellow cards</span>
                        <strong>{stat.cards?.yellow ?? "—"}</strong>

                        <span>Red cards</span>
                        <strong>{stat.cards?.red ?? "—"}</strong>
                      </div>
                    ))}
                  </div>
                )}

                <div className="match-player-detail-section">
                  <h3>Transfer history</h3>

                  {playerTransfers.length ? (
                    <div className="match-transfer-list">
                      {playerTransfers.map((transfer, index) => (
                        <article
                          key={`${transfer.date}-${index}`}
                        >
                          <time>
                            {transfer.date || "Date unavailable"}
                          </time>

                          <p>
                            <strong>
                              {transfer.teams?.out?.name || "Previous club"}
                            </strong>
                            {" → "}
                            <strong>
                              {transfer.teams?.in?.name || "New club"}
                            </strong>
                          </p>

                          <small>
                            {transfer.type || "Transfer details unavailable"}
                          </small>
                        </article>
                      ))}
                    </div>
                  ) : (
                    <p className="match-empty">
                      No transfer history was returned for this player.
                    </p>
                  )}
                </div>
              </>
            )}
          </section>
        </div>
      )}
    </main>
  );
}
