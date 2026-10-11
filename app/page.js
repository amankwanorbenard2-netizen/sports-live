"use client";

import Link from "next/link";

export default function HomePage() {
  const cards = [
    {
      title: "Live Matches",
      link: "/live",
      color: "#22c55e",
      emoji: "🔴",
    },
    {
      title: "Fixtures",
      link: "/fixtures",
      color: "#3b82f6",
      emoji: "📅",
    },
    {
      title: "Finished Matches",
      link: "/finished",
      color: "#facc15",
      emoji: "✅",
    },
    {
      title: "League Tables",
      link: "/standings",
      color: "#a855f7",
      emoji: "🏆",
    },
    {
      title: "Football News",
      link: "/news",
      color: "#f43f5e",
      emoji: "📰",
    },
    {
      title: "Teams",
      link: "/teams",
      color: "#06d6a0",
      emoji: "⚽",
    },
  ];

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(to bottom, #071b2d, #0f172a)",
        color: "white",
        paddingBottom: "140px",
      }}
    >
      {/* HERO */}
      <div
        style={{
          textAlign: "center",
          padding: "90px 20px 60px",
        }}
      >
        {/* LIVE BADGE */}
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "10px",
            background: "rgba(34,197,94,0.15)",
            border: "1px solid rgba(34,197,94,0.4)",
            padding: "10px 18px",
            borderRadius: "999px",
            marginBottom: "30px",
          }}
        >
          <div
            style={{
              width: "12px",
              height: "12px",
              borderRadius: "50%",
              background: "#22c55e",
              animation: "pulse 1.2s infinite",
            }}
          />

          <span
            style={{
              color: "#22c55e",
              fontWeight: "bold",
              fontSize: "14px",
            }}
          >
            LIVE FOOTBALL
          </span>
        </div>

        {/* TITLE */}
        <h1
          style={{
            fontSize: "clamp(38px, 6vw, 72px)",
            fontWeight: "bold",
            color: "#84cc16",
            marginBottom: "20px",
            lineHeight: 1.15,
          }}
        >
          Football Live
          <br />
          Scores &amp; Stats
        </h1>

        {/* SUBTITLE */}
        <p
          style={{
            fontSize: "clamp(16px, 2vw, 24px)",
            color: "#cbd5e1",
            maxWidth: "850px",
            margin: "auto",
            lineHeight: 1.75,
            padding: "0 10px",
          }}
        >
          Follow live football matches, lineups, statistics, standings,
          commentary and real-time updates from leagues around the world.
        </p>
      </div>

      {/* HOMEPAGE CARDS */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
          gap: "25px",
          padding: "30px",
        }}
      >
        {cards.map((card) => (
          <Link
            key={card.title}
            href={card.link}
            style={{
              textDecoration: "none",
              color: "inherit",
            }}
          >
            <div
              style={{
                background: "#10263d",
                borderRadius: "25px",
                padding: "40px 24px",
                border: `2px solid ${card.color}`,
                cursor: "pointer",
                transition: "transform 0.3s ease, box-shadow 0.3s ease",
                textAlign: "center",
                minHeight: "230px",
                boxSizing: "border-box",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
              }}
              onMouseEnter={(event) => {
                event.currentTarget.style.transform =
                  "translateY(-8px) scale(1.02)";
                event.currentTarget.style.boxShadow =
                  `0 0 35px ${card.color}`;
              }}
              onMouseLeave={(event) => {
                event.currentTarget.style.transform =
                  "translateY(0) scale(1)";
                event.currentTarget.style.boxShadow = "none";
              }}
            >
              {/* ICON */}
              <div
                style={{
                  fontSize: "65px",
                  marginBottom: "18px",
                }}
              >
                {card.emoji}
              </div>

              {/* CARD TITLE */}
              <h2
                style={{
                  fontSize: "clamp(25px, 3vw, 34px)",
                  fontWeight: "bold",
                  color: card.color,
                  margin: 0,
                }}
              >
                {card.title}
              </h2>
            </div>
          </Link>
        ))}
      </div>

      {/* FOOTER */}
      <div
        style={{
          marginTop: "30px",
          padding: "0 20px",
          textAlign: "center",
          color: "#94a3b8",
          fontSize: "15px",
        }}
      >
        Real-time football scores, commentary and match statistics
      </div>

      {/* ANIMATION */}
      <style jsx>{`
        @keyframes pulse {
          0% {
            opacity: 1;
            transform: scale(1);
          }

          50% {
            opacity: 0.4;
            transform: scale(0.7);
          }

          100% {
            opacity: 1;
            transform: scale(1);
          }
        }
      `}</style>
    </div>
  );
}