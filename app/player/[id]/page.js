
import BackButton from "@/components/BackButton";

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

async function fetchJson(url) {
  try {
    const response = await fetch(url, { cache: "no-store" });
    const data = await response.json();

    if (!response.ok) {
      console.error("API request failed:", response.status, data);
      return null;
    }

    return data;
  } catch (error) {
    console.error("API request failed:", error);
    return null;
  }
}

function hasErrors(data) {
  return Boolean(
    data?.error ||
      (data?.errors && Object.keys(data.errors).length > 0)
  );
}

export default async function PlayerPage({ params }) {
  const { id } = await params;

  if (!id || !/^\d+$/.test(String(id))) {
    return <Message text="Invalid player ID." />;
  }

  const season = new Date().getFullYear();

  const data = await fetchJson(
    `${SITE_URL}/api/player/${id}?season=${season}`
  );

  if (!data || hasErrors(data)) {
    return (
      <Message text="Unable to load player information. Check the API response and try again." />
    );
  }

  // Support both the old and new API response formats.
  const playerEntry = data.response?.[0];
  const player = data.player || playerEntry?.player;

  const statistics = data.statistics || playerEntry?.statistics || [];

  if (!player) {
    return <Message text="No player information was found." />;
  }

  // Keep competitions with actual appearances.
  const allStats = statistics.filter(
    (stat) => Number(stat.games?.appearences || 0) > 0
  );

  // The updated player route can return transfers directly.
  // The separate transfers endpoint may use response[0].transfers.
  const transferResponse = data.transfers;

  const transfers = Array.isArray(transferResponse)
    ? transferResponse.flatMap((item) =>
        Array.isArray(item?.transfers) ? item.transfers : [item]
      )
    : [];

  const injuryResponse = data.injuries;
  const injuries = Array.isArray(injuryResponse)
    ? injuryResponse
    : [];

  const firstStat = allStats[0] || statistics[0];

  const total = (selector) =>
    allStats.reduce(
      (sum, stat) => sum + Number(selector(stat) || 0),
      0
    );

  const totalAppearances = total((s) => s.games?.appearences);
  const totalMinutes = total((s) => s.games?.minutes);
  const totalGoals = total((s) => s.goals?.total);
  const totalAssists = total((s) => s.goals?.assists);

  const formatDate = (value) => {
    if (!value) return "Not available";

    const date = new Date(value);

    return Number.isNaN(date.getTime())
      ? value
      : date.toLocaleDateString("en-GB", {
          day: "numeric",
          month: "short",
          year: "numeric",
        });
  };

  return (
    <main style={styles.main}>
      <header style={styles.header}>
        <BackButton />
        <div>
          <h2 style={{ margin: 0, fontSize: 24 }}>
            {player.name}
          </h2>
          <p style={styles.muted}>
            {firstStat?.team?.name || "Player profile"}
          </p>
        </div>
      </header>

      <div style={styles.container}>
        {/* PLAYER PROFILE */}
        <section style={styles.profile}>
          <img
            src={player.photo || ""}
            alt={player.name || "Player"}
            width={210}
            height={240}
            style={styles.playerPhoto}
          />

          <div style={{ flex: 1, minWidth: 240 }}>
            <p style={styles.eyebrow}>PLAYER PROFILE</p>
            <h1 style={styles.playerName}>{player.name}</h1>

            <p style={styles.muted}>
              {player.nationality || "Nationality unavailable"}
              {firstStat?.games?.position
                ? ` · ${firstStat.games.position}`
                : ""}
            </p>

            <div style={styles.infoGrid}>
              <Info label="Age" value={player.age} />
              <Info
                label="Nationality"
                value={player.nationality}
              />
              <Info
                label="Date of birth"
                value={player.birth?.date}
              />
              <Info
                label="Birthplace"
                value={player.birth?.place}
              />
              <Info label="Height" value={player.height} />
              <Info label="Weight" value={player.weight} />
              <Info
                label="Current club"
                value={firstStat?.team?.name}
              />
              <Info
                label="Shirt number"
                value={firstStat?.games?.number}
              />
              <Info
                label="Injury status"
                value={player.injured ? "Injured" : "Not listed as injured"}
              />
            </div>
          </div>
        </section>

        {/* SEASON SUMMARY */}
        <section style={styles.section}>
          <SectionTitle>Season Summary</SectionTitle>

          <div style={styles.statsGrid}>
            <Stat label="Appearances" value={totalAppearances} />
            <Stat label="Minutes" value={totalMinutes} />
            <Stat label="Goals" value={totalGoals} />
            <Stat label="Assists" value={totalAssists} />
          </div>
        </section>

        {/* COMPETITION STATISTICS */}
        <section style={styles.section}>
          <SectionTitle>Competition Statistics</SectionTitle>

          {allStats.length === 0 ? (
            <EmptyState text="No appearances recorded for this season." />
          ) : (
            <div style={styles.cardsGrid}>
              {allStats.map((stat, index) => (
                <article
                  key={`${stat.league?.id}-${stat.team?.id}-${index}`}
                  style={styles.card}
                >
                  <div style={styles.clubHeading}>
                    {stat.league?.logo && (
                      <img
                        src={stat.league.logo}
                        alt=""
                        width={48}
                        height={48}
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

                  <div style={styles.clubHeading}>
                    {stat.team?.logo && (
                      <img
                        src={stat.team.logo}
                        alt=""
                        width={42}
                        height={42}
                        style={styles.logo}
                      />
                    )}
                    <strong>{stat.team?.name || "Unknown club"}</strong>
                  </div>

                  <div style={styles.statsGrid}>
                    <Stat label="Appearances" value={stat.games?.appearences} />
                    <Stat label="Starts" value={stat.games?.lineups} />
                    <Stat label="Minutes" value={stat.games?.minutes} />
                    <Stat label="Goals" value={stat.goals?.total} />
                    <Stat label="Assists" value={stat.goals?.assists} />
                    <Stat label="Rating" value={stat.games?.rating} />
                    <Stat label="Shots" value={stat.shots?.total} />
                    <Stat label="Shots on target" value={stat.shots?.on} />
                    <Stat label="Key passes" value={stat.passes?.key} />
                    <Stat
                      label="Pass accuracy"
                      value={
                        stat.passes?.accuracy != null
                          ? `${stat.passes.accuracy}%`
                          : null
                      }
                    />
                    <Stat label="Tackles" value={stat.tackles?.total} />
                    <Stat
                      label="Interceptions"
                      value={stat.tackles?.interceptions}
                    />
                    <Stat
                      label="Successful dribbles"
                      value={stat.dribbles?.success}
                    />
                    <Stat label="Duels won" value={stat.duels?.won} />
                    <Stat label="Yellow cards" value={stat.cards?.yellow} />
                    <Stat label="Red cards" value={stat.cards?.red} />
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>

        {/* TRANSFER HISTORY */}
        <section style={styles.section}>
          <SectionTitle>Transfer History</SectionTitle>

          {transfers.length === 0 ? (
            <EmptyState text="Transfer history is unavailable or no transfers were returned by the API." />
          ) : (
            <div style={styles.timeline}>
              {transfers.map((transfer, index) => (
                <article
                  key={`${transfer.date || "transfer"}-${index}`}
                  style={styles.card}
                >
                  <p style={styles.eyebrow}>
                    {formatDate(transfer.date)}
                  </p>

                  <div style={styles.transferRow}>
                    <Club
                      name={transfer.teams?.out?.name}
                      logo={transfer.teams?.out?.logo}
                      label="FROM"
                    />

                    <span style={styles.arrow}>→</span>

                    <Club
                      name={transfer.teams?.in?.name}
                      logo={transfer.teams?.in?.logo}
                      label="TO"
                    />
                  </div>

                  <div style={styles.transferDetails}>
                    <p>
                      <strong>Transfer type:</strong>{" "}
                      {transfer.type || "Not provided"}
                    </p>
                    <p>
                      <strong>Date:</strong>{" "}
                      {formatDate(transfer.date)}
                    </p>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>

        {/* INJURY HISTORY */}
        <section style={styles.section}>
          <SectionTitle>Injury History</SectionTitle>

          {injuries.length === 0 ? (
            <EmptyState text="No injury records were returned for this player and season." />
          ) : (
            <div style={styles.cardsGrid}>
              {injuries.map((injury, index) => (
                <article
                  key={`${injury.fixture?.id || "injury"}-${index}`}
                  style={styles.card}
                >
                  <h3 style={styles.cardTitle}>
                    {injury.type || "Injury record"}
                  </h3>
                  <p>
                    <strong>Player:</strong>{" "}
                    {injury.player?.name || player.name}
                  </p>
                  <p>
                    <strong>Team:</strong>{" "}
                    {injury.team?.name || "Not available"}
                  </p>
                  <p>
                    <strong>Reason:</strong>{" "}
                    {injury.reason || "Not provided"}
                  </p>
                  <p>
                    <strong>Fixture date:</strong>{" "}
                    {formatDate(injury.fixture?.date)}
                  </p>
                </article>
              ))}
            </div>
          )}
        </section>

        <p style={styles.footer}>
          Statistics and history depend on the information returned by
          API-Sports. Missing values are not assumed to be zero.
        </p>
      </div>
    </main>
  );
}

function SectionTitle({ children }) {
  return <h2 style={styles.sectionTitle}>{children}</h2>;
}

function Info({ label, value }) {
  return (
    <div style={styles.infoBox}>
      <p style={styles.label}>{label}</p>
      <strong>{value ?? "Not available"}</strong>
    </div>
  );
}

function Stat({ label, value }) {
  return (
    <div style={styles.statBox}>
      <p style={styles.label}>{label}</p>
      <strong style={styles.statValue}>{value ?? "—"}</strong>
    </div>
  );
}

function Club({ name, logo, label }) {
  return (
    <div style={styles.club}>
      {logo ? (
        <img src={logo} alt="" width={58} height={58} style={styles.logo} />
      ) : (
        <div style={styles.logoPlaceholder}>⚽</div>
      )}
      <p style={styles.label}>{label}</p>
      <strong>{name || "Unknown club"}</strong>
    </div>
  );
}

function EmptyState({ text }) {
  return <div style={styles.empty}>{text}</div>;
}

function Message({ text }) {
  return (
    <main style={styles.message}>
      <p>{text}</p>
      <BackButton />
    </main>
  );
}

const styles = {
  main: {
    background: "linear-gradient(135deg, #0b1120, #111827 55%, #0f172a)",
    minHeight: "100vh",
    color: "#f8fafc",
    fontFamily: "Arial, sans-serif",
    paddingBottom: 80,
  },
  header: {
    position: "sticky",
    top: 0,
    zIndex: 10,
    background: "rgba(15,23,42,0.96)",
    backdropFilter: "blur(12px)",
    padding: "16px 22px",
    borderBottom: "1px solid #263247",
    display: "flex",
    alignItems: "center",
    gap: 18,
  },
  container: {
    maxWidth: 1250,
    margin: "0 auto",
    padding: 22,
  },
  profile: {
    display: "flex",
    gap: 28,
    flexWrap: "wrap",
    alignItems: "center",
    padding: 28,
    marginTop: 16,
    background: "rgba(255,255,255,0.045)",
    border: "1px solid #263247",
    borderRadius: 24,
  },
  playerPhoto: {
    width: 210,
    height: 240,
    objectFit: "contain",
    borderRadius: 18,
    background: "#172033",
  },
  playerName: {
    fontSize: "clamp(32px, 5vw, 52px)",
    margin: "8px 0",
  },
  eyebrow: {
    color: "#38bdf8",
    fontSize: 12,
    fontWeight: 700,
    letterSpacing: 1.5,
  },
  muted: {
    color: "#94a3b8",
    margin: "6px 0 18px",
  },
  section: {
    marginTop: 48,
  },
  sectionTitle: {
    fontSize: "clamp(26px, 4vw, 36px)",
    marginBottom: 22,
  },
  infoGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(145px, 1fr))",
    gap: 12,
    marginTop: 22,
  },
  statsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(105px, 1fr))",
    gap: 10,
  },
  cardsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 330px), 1fr))",
    gap: 20,
  },
  card: {
    background: "rgba(255,255,255,0.045)",
    border: "1px solid #263247",
    borderRadius: 20,
    padding: 22,
    minWidth: 0,
  },
  infoBox: {
    background: "#172033",
    borderRadius: 12,
    padding: 13,
    overflowWrap: "anywhere",
  },
  statBox: {
    background: "#172033",
    borderRadius: 12,
    padding: 12,
    minWidth: 0,
  },
  label: {
    color: "#94a3b8",
    fontSize: 12,
    margin: "0 0 7px",
  },
  statValue: {
    fontSize: 20,
    overflowWrap: "anywhere",
  },
  cardTitle: {
    fontSize: 20,
    margin: "0 0 8px",
  },
  clubHeading: {
    display: "flex",
    alignItems: "center",
    gap: 12,
    marginBottom: 18,
  },
  logo: {
    objectFit: "contain",
    flexShrink: 0,
  },
  logoPlaceholder: {
    width: 58,
    height: 58,
    display: "grid",
    placeItems: "center",
    background: "#172033",
    borderRadius: 12,
  },
  timeline: {
    display: "grid",
    gap: 16,
  },
  transferRow: {
    display: "flex",
    justifyContent: "space-around",
    alignItems: "center",
    gap: 12,
    flexWrap: "wrap",
    marginTop: 20,
  },
  club: {
    textAlign: "center",
    flex: "1 1 110px",
    overflowWrap: "anywhere",
  },
  arrow: {
    fontSize: 30,
    color: "#38bdf8",
    fontWeight: 700,
  },
  transferDetails: {
    marginTop: 20,
    paddingTop: 12,
    borderTop: "1px solid #263247",
    color: "#cbd5e1",
  },
  empty: {
    background: "rgba(255,255,255,0.04)",
    border: "1px solid #263247",
    borderRadius: 16,
    padding: 22,
    color: "#cbd5e1",
  },
  footer: {
    color: "#64748b",
    fontSize: 12,
    lineHeight: 1.7,
    marginTop: 36,
  },
  message: {
    background: "#0f172a",
    color: "white",
    minHeight: "100vh",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
    textAlign: "center",
    gap: 16,
  },
};
