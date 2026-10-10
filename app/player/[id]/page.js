
import BackButton from "@/components/BackButton";

const CURRENT_SEASON = 2026;
const OLDER_SEASONS_TO_TRY = 5;

async function getPlayer(id, season) {
  const response = await fetch(
    `http://localhost:3000/api/player/${id}?season=${season}`,
    { cache: "no-store" }
  );

  if (!response.ok) {
    throw new Error(`Player request failed (${response.status})`);
  }

  return response.json();
}

async function getTransfers(id) {
  try {
    const response = await fetch(
      `http://localhost:3000/api/player/${id}?type=transfers`,
      { cache: "no-store" }
    );

    if (!response.ok) return [];

    const data = await response.json();

    if (data.errors && Object.keys(data.errors).length > 0) {
      return [];
    }

    return data.response?.[0]?.transfers || [];
  } catch (error) {
    console.error("Transfer history error:", error);
    return [];
  }
}

export default async function PlayerPage({ params }) {
  const { id } = await params;

  if (!id || !/^\d+$/.test(String(id))) {
    return <Message text="Invalid player ID." />;
  }

  let data = null;
  let seasonUsed = CURRENT_SEASON;
  let fetchError = false;

  // Always try the current season first.
  try {
    data = await getPlayer(id, CURRENT_SEASON);

    if (data.errors && Object.keys(data.errors).length > 0) {
      throw new Error("The football API returned an error.");
    }

    // Try older seasons only if the player record is missing.
    for (
      let season = CURRENT_SEASON - 1;
      (!data.response || data.response.length === 0) &&
      season >= CURRENT_SEASON - OLDER_SEASONS_TO_TRY;
      season--
    ) {
      const olderData = await getPlayer(id, season);

      if (
        olderData.errors &&
        Object.keys(olderData.errors).length > 0
      ) {
        continue;
      }

      if (olderData.response?.length > 0) {
        data = olderData;
        seasonUsed = season;
        break;
      }
    }
  } catch (error) {
    console.error("Player profile error:", error);
    fetchError = true;
  }

  if (fetchError) {
    return (
      <Message text="Unable to load this player. Please try again later." />
    );
  }

  if (!data?.response?.length) {
    return (
      <Message text="No player data found for the current or recent seasons." />
    );
  }

  const player = data.response[0].player;
  const allStats = data.response.flatMap((item) =>
    (item.statistics || []).map((stat) => ({
      ...stat,
      profileSeason: item.league?.season || seasonUsed,
    }))
  );

  const transfers = await getTransfers(id);

  const activeStats = allStats.filter(
    (stat) => (stat.games?.appearences || 0) > 0
  );

  const currentTeam =
    activeStats[0]?.team?.name ||
    allStats[0]?.team?.name ||
    "Team unavailable";

  const position =
    activeStats[0]?.games?.position ||
    allStats[0]?.games?.position ||
    "N/A";

  return (
    <main style={styles.page}>
      <header style={styles.header}>
        <BackButton />
        <div>
          <h2 style={styles.headerName}>{player.name}</h2>
          <p style={styles.muted}>{currentTeam}</p>
        </div>
      </header>

      <div style={styles.container}>
        <section style={styles.hero}>
          <img
            src={player.photo}
            alt={player.name}
            width="190"
            height="190"
            style={styles.playerPhoto}
          />

          <div style={{ flex: 1, minWidth: 240 }}>
            <p style={styles.eyebrow}>PLAYER PROFILE</p>
            <h1 style={styles.playerName}>{player.name}</h1>
            <p style={styles.muted}>
              {player.nationality || "Nationality unavailable"} · {position}
            </p>

            <div style={styles.infoGrid}>
              <Info label="Age" value={player.age} />
              <Info label="Nationality" value={player.nationality} />
              <Info label="Birth date" value={player.birth?.date} />
              <Info label="Height" value={player.height} />
              <Info label="Weight" value={player.weight} />
              <Info label="Position" value={position} />
            </div>

            <p style={styles.seasonNotice}>
              Showing available profile data. Current season checked:{" "}
              {CURRENT_SEASON}. Statistics fallback season: {seasonUsed}.
            </p>
          </div>
        </section>

        <section style={styles.section}>
          <h2 style={styles.sectionTitle}>Competition statistics</h2>

          {allStats.length === 0 ? (
            <p style={styles.panel}>
              Player details were found, but competition statistics are
              unavailable.
            </p>
          ) : (
            <div style={styles.cards}>
              {allStats.map((stat, index) => (
                <article
                  key={`${stat.league?.id}-${stat.team?.id}-${index}`}
                  style={styles.panel}
                >
                  <div style={styles.teamRow}>
                    {stat.league?.logo && (
                      <img
                        src={stat.league.logo}
                        alt=""
                        width="48"
                        height="48"
                        style={styles.logo}
                      />
                    )}
                    <div>
                      <h3 style={styles.cardTitle}>
                        {stat.league?.name || "Competition"}
                      </h3>
                      <p style={styles.muted}>
                        {stat.league?.country || ""}
                        {stat.league?.season
                          ? ` · ${stat.league.season}`
                          : ""}
                      </p>
                    </div>
                  </div>

                  <div style={styles.teamRow}>
                    {stat.team?.logo && (
                      <img
                        src={stat.team.logo}
                        alt=""
                        width="42"
                        height="42"
                        style={styles.logo}
                      />
                    )}
                    <strong>{stat.team?.name || "Team unavailable"}</strong>
                  </div>

                  <div style={styles.statsGrid}>
                    <Stat label="Appearances" value={stat.games?.appearences} />
                    <Stat label="Minutes" value={stat.games?.minutes} />
                    <Stat label="Goals" value={stat.goals?.total} />
                    <Stat label="Assists" value={stat.goals?.assists} />
                    <Stat label="Rating" value={stat.games?.rating} />
                    <Stat label="Position" value={stat.games?.position} />
                    <Stat label="Yellow cards" value={stat.cards?.yellow} />
                    <Stat label="Red cards" value={stat.cards?.red} />
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>

        <section style={styles.section}>
          <h2 style={styles.sectionTitle}>Transfer history</h2>

          {transfers.length === 0 ? (
            <div style={styles.panel}>
              No transfer history was returned by the API.
            </div>
          ) : (
            transfers.map((transfer, index) => (
              <article
                key={`${transfer.date}-${index}`}
                style={styles.transferCard}
              >
                <div style={styles.transferRow}>
                  <Team
                    name={transfer.teams?.out?.name || "Previous club"}
                    logo={transfer.teams?.out?.logo}
                  />
                  <span style={styles.arrow}>→</span>
                  <Team
                    name={transfer.teams?.in?.name || "New club"}
                    logo={transfer.teams?.in?.logo}
                  />
                </div>

                <p style={styles.muted}>
                  Date: {transfer.date || "Unavailable"}
                </p>
                <p style={styles.muted}>
                  Type: {transfer.type || "Transfer"}
                </p>
              </article>
            ))
          )}
        </section>
      </div>
    </main>
  );
}

function Message({ text }) {
  return (
    <main style={styles.messagePage}>
      <BackButton />
      <h2>{text}</h2>
    </main>
  );
}

function Info({ label, value }) {
  return (
    <div style={styles.infoBox}>
      <p style={styles.muted}>{label}</p>
      <strong>{value || "N/A"}</strong>
    </div>
  );
}

function Stat({ label, value }) {
  return (
    <div style={styles.statBox}>
      <p style={styles.muted}>{label}</p>
      <strong>{value ?? "N/A"}</strong>
    </div>
  );
}

function Team({ name, logo }) {
  return (
    <div style={styles.team}>
      {logo ? (
        <img src={logo} alt="" width="64" height="64" style={styles.logo} />
      ) : (
        <div style={styles.logoPlaceholder}>FC</div>
      )}
      <strong>{name}</strong>
    </div>
  );
}

const styles = {
  page: {
    background: "linear-gradient(to bottom, #111827, #0f172a)",
    minHeight: "100vh",
    color: "#f8fafc",
    fontFamily: "Arial, sans-serif",
    paddingBottom: 100,
  },
  header: {
    position: "sticky",
    top: 0,
    zIndex: 10,
    display: "flex",
    alignItems: "center",
    gap: 18,
    padding: "16px 20px",
    background: "rgba(15,23,42,0.96)",
    borderBottom: "1px solid rgba(255,255,255,0.1)",
  },
  headerName: { margin: 0, fontSize: 24 },
  container: { maxWidth: 1300, margin: "0 auto", padding: 20 },
  hero: {
    display: "flex",
    alignItems: "center",
    flexWrap: "wrap",
    gap: 28,
    padding: 28,
    borderRadius: 24,
    background: "rgba(255,255,255,0.05)",
    border: "1px solid rgba(255,255,255,0.08)",
  },
  playerPhoto: {
    objectFit: "contain",
    borderRadius: 18,
    background: "rgba(255,255,255,0.05)",
  },
  eyebrow: { color: "#38bdf8", fontWeight: "bold", letterSpacing: 2 },
  playerName: { fontSize: 42, margin: "8px 0" },
  muted: { color: "#9ca3af", lineHeight: 1.6, margin: "4px 0 12px" },
  seasonNotice: { color: "#93c5fd", fontSize: 13, marginTop: 20 },
  infoGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))",
    gap: 12,
    marginTop: 20,
  },
  infoBox: {
    background: "rgba(255,255,255,0.05)",
    borderRadius: 12,
    padding: 14,
  },
  section: { marginTop: 42 },
  sectionTitle: { fontSize: 30, marginBottom: 20 },
  cards: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
    gap: 20,
  },
  panel: {
    background: "rgba(255,255,255,0.05)",
    border: "1px solid rgba(255,255,255,0.08)",
    borderRadius: 20,
    padding: 22,
    marginBottom: 16,
  },
  cardTitle: { margin: 0, fontSize: 20 },
  teamRow: {
    display: "flex",
    alignItems: "center",
    gap: 14,
    marginBottom: 22,
  },
  logo: { objectFit: "contain" },
  statsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
    gap: 10,
  },
  statBox: {
    padding: 12,
    borderRadius: 12,
    background: "rgba(255,255,255,0.04)",
  },
  transferCard: {
    background: "rgba(255,255,255,0.05)",
    border: "1px solid rgba(255,255,255,0.08)",
    borderRadius: 20,
    padding: 24,
    marginBottom: 18,
  },
  transferRow: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-around",
    gap: 20,
    flexWrap: "wrap",
    marginBottom: 20,
  },
  team: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: 10,
    textAlign: "center",
    maxWidth: 180,
  },
  arrow: { fontSize: 34, color: "#38bdf8" },
  logoPlaceholder: {
    width: 64,
    height: 64,
    borderRadius: 16,
    display: "grid",
    placeItems: "center",
    background: "#1e293b",
  },
  messagePage: {
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "column",
    gap: 20,
    padding: 24,
    background: "#0f172a",
    color: "white",
    textAlign: "center",
  },
};
