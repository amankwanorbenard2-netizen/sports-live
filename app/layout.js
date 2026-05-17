"use client";

import "./globals.css";
import Link from "next/link";
import { usePathname } from "next/navigation";

function BottomNav() {
  const pathname = usePathname();

  const navItems = [
    {
      name: "Home",
      link: "/",
      icon: "🏠",
    },

    {
      name: "Live",
      link: "/live",
      icon: "🔴",
    },

    {
      name: "Fixtures",
      link: "/fixtures",
      icon: "📅",
    },

    {
      name: "Finished",
      link: "/finished",
      icon: "✅",
    },

    {
      name: "Tables",
      link: "/standings",
      icon: "🏆",
    },

    {
      name: "News",
      link: "/news",
      icon: "📰",
    },
  ];

  return (
    <div
      style={{
        position: "fixed",
        bottom: 0,
        left: 0,
        width: "100%",
        background: "#111827",
        borderTop: "1px solid #374151",
        display: "flex",
        justifyContent: "space-around",
        alignItems: "center",
        padding: "8px 0",
        zIndex: 999,
        backdropFilter: "blur(10px)",
      }}
    >
      {navItems.map((item) => {
        const active =
          pathname === item.link;

        return (
          <Link
            key={item.name}
            href={item.link}
            style={{
              textDecoration: "none",
            }}
          >
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                color: active
                  ? "#22c55e"
                  : "#9ca3af",
                fontSize: "11px",
                transition: "0.3s",
                cursor: "pointer",
                minWidth: "55px",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform =
                  "scale(1.08)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform =
                  "scale(1)";
              }}
            >
              <span
                style={{
                  fontSize: "20px",
                  marginBottom: "2px",
                }}
              >
                {item.icon}
              </span>

              <span>{item.name}</span>
            </div>
          </Link>
        );
      })}
    </div>
  );
}

export default function RootLayout({
  children,
}) {
  return (
    <html lang="en">
      <head>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1"
        />
      </head>

      <body
        style={{
          margin: 0,
          padding: 0,
          background: "#111827",
          color: "white",
          fontFamily:
            "Arial, sans-serif",
          overflowX: "hidden",
        }}
      >
        <div
          style={{
            maxWidth: "100vw",
            overflowX: "hidden",
          }}
        >
          {children}
        </div>

        <BottomNav />
      </body>
    </html>
  );
}