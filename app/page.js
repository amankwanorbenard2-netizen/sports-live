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

  ];

  return (

    <div
      style={{
        minHeight: "100vh",

        background:
          "linear-gradient(to bottom,#071b2d,#0f172a)",

        color: "white",

        paddingBottom:
          "140px",
      }}
    >

      {/* HERO */}
      <div
        style={{
          textAlign: "center",

          padding:
            window.innerWidth < 600
              ? "60px 20px 40px"
              : "90px 20px 60px",
        }}
      >

        {/* LIVE BADGE */}
        <div
          style={{
            display:
              "inline-flex",

            alignItems:
              "center",

            gap: "10px",

            background:
              "rgba(34,197,94,0.15)",

            border:
              "1px solid rgba(34,197,94,0.4)",

            padding:
              "10px 18px",

            borderRadius:
              "999px",

            marginBottom:
              "30px",
          }}
        >

          {/* LIVE DOT */}
          <div
            style={{
              width: "12px",
              height: "12px",
              borderRadius:
                "50%",
              background:
                "#22c55e",

              animation:
                "pulse 1.2s infinite",
            }}
          />

          <span
            style={{
              color: "#22c55e",
              fontWeight:
                "bold",
              fontSize:
                "14px",
            }}
          >
            LIVE FOOTBALL
          </span>

        </div>

        {/* TITLE */}
        <h1
          style={{
            fontSize:
              window.innerWidth < 600
                ? "42px"
                : "72px",

            fontWeight:
              "bold",

            color:
              "#84cc16",

            marginBottom:
              "20px",

            lineHeight:
              window.innerWidth < 600
                ? "52px"
                : "82px",
          }}
        >
          Football Live
          <br />
          Scores & Stats
        </h1>

        {/* SUBTITLE */}
        <p
          style={{
            fontSize:
              window.innerWidth < 600
                ? "17px"
                : "24px",

            color:
              "#cbd5e1",

            maxWidth:
              "850px",

            margin:
              "auto",

            lineHeight:
              window.innerWidth < 600
                ? "30px"
                : "42px",

            padding:
              "0 10px",
          }}
        >
          Follow live football matches,
          lineups, statistics, standings,
          commentary and real-time updates
          from leagues around the world.
        </p>

      </div>

      {/* CARDS */}
      <div
        style={{
          display: "grid",

          gridTemplateColumns:
            "repeat(auto-fit,minmax(260px,1fr))",

          gap:
            window.innerWidth < 600
              ? "18px"
              : "25px",

          padding:
            window.innerWidth < 600
              ? "18px"
              : "30px",
        }}
      >

        {cards.map(
          (card, index) => (

            <Link
              key={index}
              href={card.link}
              style={{
                textDecoration:
                  "none",
              }}
            >

              <div
                style={{
                  background:
                    "#10263d",

                  borderRadius:
                    "25px",

                  padding:
                    window.innerWidth < 600
                      ? "30px 20px"
                      : "40px",

                  border:
                    `2px solid ${card.color}`,

                  cursor:
                    "pointer",

                  transition:
                    "0.3s ease",

                  textAlign:
                    "center",

                  minHeight:
                    window.innerWidth < 600
                      ? "190px"
                      : "230px",

                  display:
                    "flex",

                  flexDirection:
                    "column",

                  justifyContent:
                    "center",

                  alignItems:
                    "center",
                }}
                onMouseEnter={(
                  e
                ) => {

                  e.currentTarget.style.transform =
                    "translateY(-8px) scale(1.02)";

                  e.currentTarget.style.boxShadow =
                    `0 0 35px ${card.color}`;

                }}
                onMouseLeave={(
                  e
                ) => {

                  e.currentTarget.style.transform =
                    "translateY(0px) scale(1)";

                  e.currentTarget.style.boxShadow =
                    "none";

                }}
              >

                {/* EMOJI */}
                <div
                  style={{
                    fontSize:
                      window.innerWidth < 600
                        ? "52px"
                        : "65px",

                    marginBottom:
                      "18px",
                  }}
                >
                  {card.emoji}
                </div>

                {/* TITLE */}
                <h2
                  style={{
                    fontSize:
                      window.innerWidth < 600
                        ? "26px"
                        : "34px",

                    fontWeight:
                      "bold",

                    color:
                      card.color,

                    margin: 0,
                  }}
                >
                  {card.title}
                </h2>

              </div>

            </Link>

          )
        )}

      </div>

      {/* FOOTER */}
      <div
        style={{
          marginTop: "30px",
          textAlign: "center",
          color: "#94a3b8",
          fontSize:
            window.innerWidth < 600
              ? "13px"
              : "15px",
        }}
      >
        Real-time football scores,
        commentary and match statistics
      </div>

      {/* ANIMATION */}
      <style>
        {`

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

        `}
      </style>

    </div>

  );

}