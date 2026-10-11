
"use client";

import Link from "next/link";

const sections = [
  {
    title: "Top Scorers",
    description: "See the players scoring the most goals.",
    icon: "⚽",
    href: "/top-scorers",
    color: "#fbbf24",
  },
  {
    title: "Top Assists",
    description: "Find the best goal creators.",
    icon: "🎯",
    href: "/top-assists",
    color: "#34d399",
  },
  {
    title: "Clean Sheets",
    description: "Explore goalkeeper and defensive records.",
    icon: "🧤",
    href: "/stats/clean-sheets",
    color: "#60a5fa",
  },
  {
    title: "Yellow & Red Cards",
    description: "Review player disciplinary statistics.",
    icon: "🟨",
    href: "/stats/cards",
    color: "#fb923c",
  },
  {
    title: "Player Statistics",
    description: "Appearances, minutes, goals and ratings.",
    icon: "👤",
    href: "/stats/players",
    color: "#c084fc",
  },
  {
    title: "Team Statistics",
    description: "Compare team performance and records.",
    icon: "📊",
    href: "/stats/teams",
    color: "#2dd4bf",
  },
  {
    title: "Fixtures & Results",
    description: "View upcoming games and completed matches.",
    icon: "📅",
    href: "/fixtures",
    color: "#f472b6",
  },
];

export default function StatsPage() {
  return (
    <main style={styles.page}>
      <header style={styles.header}>
        <p style={styles.eyebrow}>SPORTS LIVE</p>
        <h1 style={styles.title}>Football Statistics</h1>
        <p style={styles.subtitle}>
          Your central hub for player rankings, team performance,
          and match information.
        </p>
      </header>

      <section style={styles.grid}>
        {sections.map((section) => (
          <Link
            href={section.href}
            key={section.title}
            style={styles.link}
          >
            <article style={styles.card}>
              <div
                style={{
                  ...styles.icon,
                  borderColor: `${section.color}55`,
                  background: `${section.color}15`,
                }}
              >
                {section.icon}
              </div>

              <div style={styles.cardContent}>
                <h2 style={styles.cardTitle}>{section.title}</h2>
                <p style={styles.description}>
                  {section.description}
                </p>
              </div>

              <span style={styles.arrow}>→</span>
            </article>
          </Link>
        ))}
      </section>

      <footer style={styles.footer}>
        Statistics are provided through the available football data API.
      </footer>
    </main>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    background: "#07111f",
    color: "#f1f5f9",
    padding: "30px 18px 100px",
    fontFamily: "Arial, sans-serif",
  },
  header: {
    maxWidth: "1000px",
    margin: "0 auto 28px",
  },
  eyebrow: {
    color: "#35d07f",
    fontSize: "12px",
    fontWeight: 700,
    letterSpacing: "2px",
  },
  title: {
    fontSize: "clamp(28px, 5vw, 42px)",
    margin: "12px 0",
  },
  subtitle: {
    maxWidth: "600px",
    color: "#9caec2",
    lineHeight: 1.7,
    fontSize: "15px",
  },
  grid: {
    maxWidth: "1000px",
    margin: "0 auto",
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 270px), 1fr))",
    gap: "14px",
  },
  link: {
    textDecoration: "none",
    color: "inherit",
    minWidth: 0,
  },
  card: {
    minHeight: "120px",
    height: "100%",
    boxSizing: "border-box",
    display: "flex",
    alignItems: "center",
    gap: "14px",
    padding: "18px",
    borderRadius: "14px",
    border: "1px solid #26374b",
    background: "#101d2d",
  },
  icon: {
    flexShrink: 0,
    width: "48px",
    height: "48px",
    display: "grid",
    placeItems: "center",
    border: "1px solid",
    borderRadius: "12px",
    fontSize: "23px",
  },
  cardContent: {
    flex: 1,
    minWidth: 0,
  },
  cardTitle: {
    margin: "0 0 8px",
    fontSize: "16px",
    fontWeight: 700,
  },
  description: {
    margin: 0,
    color: "#9caec2",
    fontSize: "12px",
    lineHeight: 1.6,
  },
  arrow: {
    color: "#8da0b5",
    fontSize: "23px",
    flexShrink: 0,
  },
  footer: {
    maxWidth: "1000px",
    margin: "24px auto 0",
    color: "#71849a",
    fontSize: "12px",
    lineHeight: 1.6,
  },
};
