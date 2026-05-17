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
  ];

  return (
    <div
      style={{
        minHeight: "100vh",
        background:
          "linear-gradient(to bottom, #0f172a, #111827)",
        color: "white",
        paddingBottom: "180px",
      }}
    >
      {/* HERO */}
      <div
        style={{
          textAlign: "center",
          padding: "80px 20px 60px",
        }}
      >
        <h1
          style={{
            fontSize: "72px",
            fontWeight: "bold",
            color: "#84cc16",
            marginBottom: "20px",
          }}
        >
          Football Live Scores
        </h1>

        <p
          style={{
            fontSize: "24px",
            color: "#cbd5e1",
            maxWidth: "850px",
            margin: "auto",
            lineHeight: "40px",
          }}
        >
          Follow live football matches,
          fixtures, standings, lineups,
          statistics and real-time updates
          from leagues around the world.
        </p>
      </div>

      {/* CARDS */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns:
            "repeat(auto-fit, minmax(280px, 1fr))",
          gap: "25px",
          padding: "30px",
        }}
      >
        {cards.map((card, index) => (
          <Link
            key={index}
            href={card.link}
            style={{
              textDecoration: "none",
              display: "block",
            }}
          >
            <div
              style={{
                background: "#1f2937",
                borderRadius: "25px",
                padding: "40px",
                border: `2px solid ${card.color}`,
                cursor: "pointer",
                transition: "0.3s",
                textAlign: "center",
                minHeight: "230px",

                position: "relative",
                zIndex: 999,

                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform =
                  "translateY(-10px) scale(1.03)";

                e.currentTarget.style.boxShadow =
                  `0 0 35px ${card.color}`;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform =
                  "translateY(0px) scale(1)";

                e.currentTarget.style.boxShadow =
                  "none";
              }}
            >
              <div
                style={{
                  fontSize: "65px",
                  marginBottom: "20px",
                }}
              >
                {card.emoji}
              </div>

              <h2
                style={{
                  fontSize: "34px",
                  fontWeight: "bold",
                  color: card.color,
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
          textAlign: "center",
          padding: "40px",
          color: "#94a3b8",
          fontSize: "18px",
        }}
      >
        Powered by Sports Live ⚽
      </div>
    </div>
  );
}