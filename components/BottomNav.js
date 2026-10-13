
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function BottomNav() {
  const pathname = usePathname();

  const navItems = [
    { name: "Home", link: "/", icon: "🏠" },
    { name: "Live", link: "/live", icon: "🔴" },
    { name: "Fixtures", link: "/fixtures", icon: "📅" },
    { name: "Finished", link: "/finished", icon: "✅" },
    { name: "Teams", link: "/teams", icon: "⚽" },
    { name: "Stats", link: "/stats", icon: "📊" },
    { name: "News", link: "/news", icon: "📰" },
  ];

  return (
    <nav
      aria-label="Main navigation"
      style={{
        position: "fixed",
        bottom: 0,
        left: 0,
        right: 0,
        background: "#111827",
        borderTop: "1px solid #374151",
        display: "flex",
        justifyContent: "space-around",
        alignItems: "center",
        padding: "10px 4px calc(10px + env(safe-area-inset-bottom))",
        zIndex: 99999,
        boxSizing: "border-box",
      }}
    >
      {navItems.map((item) => {
        const active =
          item.link === "/"
            ? pathname === "/"
            : pathname === item.link ||
              pathname.startsWith(`${item.link}/`);

        return (
          <Link
            key={item.name}
            href={item.link}
            aria-current={active ? "page" : undefined}
            style={{
              flex: 1,
              minWidth: 0,
              textAlign: "center",
              textDecoration: "none",
              color: active ? "#22c55e" : "#9ca3af",
            }}
          >
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
              <span style={{ fontSize: 20 }}>{item.icon}</span>
              <span style={{ fontSize: 10, fontWeight: active ? 700 : 500 }}>
                {item.name}
              </span>
            </div>
          </Link>
        );
      })}
    </nav>
  );
}
