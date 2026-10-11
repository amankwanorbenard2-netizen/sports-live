
"use client";

import { useCallback, useEffect, useState } from "react";
import { useParams, useSearchParams } from "next/navigation";
import Link from "next/link";

function formatDate(date) {
  if (!date) return "Date unavailable";

  const parsed = new Date(date);

  if (Number.isNaN(parsed.getTime())) {
    return "Date unavailable";
  }

  return parsed.toLocaleString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function MatchCard({ match }) {
  const home = match.home || {};
  const away = match.away || {};
  const goals = match.goals || {};

  const hasScore =
    goals.home !== null &&
    goals.home !== undefined &&
    goals.away !== null &&
    goals.away !== undefined;

  return (
    <article className="profile-match">
      <div className="profile-match-league">
        {match.leagueLogo && (
          <img src={match.leagueLogo} alt="" />
        )}
        <span>{match.league || "Football match"}</span>
      </div>

      <p className="profile-match-date">
        {formatDate(match.date)}
      </p>

      <div className="profile-match-teams">
        <div className="profile-match-team">
          {home.logo && <img src={home.logo} alt="" />}
          <span>{home.name || "Home team"}</span>
        </div>

        <strong className="profile-match-score">
          {hasScore
            ? `${goals.home} - ${goals.away}`
            : "VS"}
        </strong>

        <div className="profile-match-team">
          {away.logo && <img src={away.logo} alt="" />}
          <span>{away.name || "Away team"}</span>
        </div>
      </div>

      <p className="profile-match-status">
        {match.statusLong || match.status || "Status unavailable"}
      </p>
    </article>
  );
}

export default function TeamProfilePage() {
  const params = useParams();
  const searchParams = useSearchParams();

  const rawId = params?.id;
  const teamId = Array.isArray(rawId)
    ? rawId[0]
    : rawId
      ? String(rawId)
      : "";

  const season = searchParams.get("season") || "2026";
  const league = searchParams.get("league") || "39";

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [retry, setRetry] = useState(0);

  const loadTeam = useCallback(
    async (signal) => {
      if (!teamId || !/^\d+$/.test(teamId)) {
        setData(null);
        setError("The team ID in the URL is invalid.");
        setLoading(false);
        return;
      }

      setLoading(true);
      setError("");
      setData(null);

      try {
        const query = new URLSearchParams({
          season,
          league,
        });

        const response = await fetch(
          `/api/team/${encodeURIComponent(teamId)}?${query.toString()}`,
          {
            cache: "no-store",
            signal,
          }
        );

        const result = await response.json();

        if (!response.ok) {
          throw new Error(
            result?.error ||
              `Unable to load team (HTTP ${response.status}).`
          );
        }

        if (!result?.team?.id) {
          throw new Error("The API returned no valid team information.");
        }

        // Guard against an unexpected team being returned by the API.
        if (String(result.team.id) !== teamId) {
          throw new Error("The returned team does not match the selected team.");
        }

        if (!signal.aborted) {
          setData(result);
        }
      } catch (err) {
        if (err.name === "AbortError") return;

        console.error("Team profile error:", err);

        if (!signal.aborted) {
          setData(null);
          setError(
            err.message || "Unable to load the team profile."
          );
        }
      } finally {
        if (!signal.aborted) {
          setLoading(false);
        }
      }
    },
    [teamId, season, league]
  );

  useEffect(() => {
    const controller = new AbortController();

    loadTeam(controller.signal);

    return () => controller.abort();
  }, [loadTeam, retry]);

  if (loading) {
    return (
      <main className="team-profile-page">
        <Link href="/teams" className="team-back-link">
          ← Back to teams
        </Link>
        <p className="team-profile-message">
          Loading team profile and matches...
        </p>
      </main>
    );
  }

  if (error || !data?.team) {
    return (
      <main className="team-profile-page">
        <Link href="/teams" className="team-back-link">
          ← Back to teams
        </Link>

        <div className="team-profile-error">
          <h1>Unable to load team</h1>
          <p>{error || "Team information is unavailable."}</p>

          <button
            type="button"
            onClick={() => setRetry((value) => value + 1)}
          >
            Try again
          </button>
        </div>
      </main>
    );
  }

  const team = data.team;
  const upcoming = data.upcoming || [];
  const recent = data.recent || [];
  const players = data.players || [];

  return (
    <main className="team-profile-page">
      <Link href="/teams" className="team-back-link">
        ← Back to teams
      </Link>

      <header className="team-profile-header">
        {team.logo && (
          <img
            src={team.logo}
            alt={`${team.name} logo`}
            className="team-profile-logo"
          />
        )}

        <div>
          <p className="team-profile-eyebrow">
            SPORTS LIVE · TEAM PROFILE
          </p>
          <h1>{team.name}</h1>
          <p>{team.country || "Country unavailable"}</p>
        </div>
      </header>

      <section className="team-info-grid">
        <article className="team-info-card">
          <span>Founded</span>
          <strong>{team.founded || "Unavailable"}</strong>
        </article>

        <article className="team-info-card">
          <span>Stadium</span>
          <strong>{team.venue || "Unavailable"}</strong>
        </article>

        <article className="team-info-card">
          <span>City</span>
          <strong>{team.city || "Unavailable"}</strong>
        </article>

        <article className="team-info-card">
          <span>Capacity</span>
          <strong>
            {team.capacity
              ? Number(team.capacity).toLocaleString()
              : "Unavailable"}
          </strong>
        </article>
      </section>

      {data.warnings?.fixtures && (
        <p className="team-profile-warning">
          {data.warnings.fixtures}
        </p>
      )}

      <section className="team-profile-section">
        <div className="team-section-heading">
          <h2>Upcoming Matches</h2>
          <span>{upcoming.length}</span>
        </div>

        {upcoming.length > 0 ? (
          <div className="team-matches-grid">
            {upcoming.map((match) => (
              <MatchCard key={match.id} match={match} />
            ))}
          </div>
        ) : (
          <p className="team-profile-message">
            No upcoming matches were found for this team and season.
          </p>
        )}
      </section>

      <section className="team-profile-section">
        <div className="team-section-heading">
          <h2>Recent Results</h2>
          <span>{recent.length}</span>
        </div>

        {recent.length > 0 ? (
          <div className="team-matches-grid">
            {recent.map((match) => (
              <MatchCard key={match.id} match={match} />
            ))}
          </div>
        ) : (
          <p className="team-profile-message">
            No completed matches were found for this team and season.
          </p>
        )}
      </section>

      <section className="team-profile-section">
        <div className="team-section-heading">
          <h2>Squad</h2>
          <span>{players.length}</span>
        </div>

        {data.warnings?.players && (
          <p className="team-profile-warning">
            {data.warnings.players}
          </p>
        )}

        {players.length > 0 ? (
          <div className="team-squad-grid">
            {players.map((player) => (
              <article className="team-player-card" key={player.id}>
                {player.photo ? (
                  <img
                    src={player.photo}
                    alt={player.name}
                    loading="lazy"
                  />
                ) : (
                  <div className="team-player-placeholder">
                    {player.name?.charAt(0) || "?"}
                  </div>
                )}

                <div>
                  <h3>{player.name}</h3>
                  <p>
                    {player.position || "Position unavailable"}
                    {player.number ? ` · #${player.number}` : ""}
                  </p>
                  <p>
                    {player.nationality || "Nationality unavailable"}
                  </p>
                  <p>
                    Apps: {player.appearances ?? 0} · Goals:{" "}
                    {player.goals ?? 0} · Assists: {player.assists ?? 0}
                  </p>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <p className="team-profile-message">
            Squad information is unavailable for this season or API plan.
          </p>
        )}
      </section>
    </main>
  );
}
