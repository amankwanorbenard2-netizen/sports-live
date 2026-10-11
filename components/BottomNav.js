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
    { name: "Tables", link: "/standings", icon: "🏆" },
    { name: "Teams", link: "/teams", icon: "⚽" },
    { name: "News", link: "/news", icon: "📰" },
  ];

  return (
    <nav
      aria-label="Main navigation"
      style={{
        position: "fixed",
        bottom: 0,
        left: 0,
        width: "100%",
        boxSizing: "border-box",
        background: "#111827",
        borderTop: "1px solid #374151",
        display: "flex",
        justifyContent: "space-around",
        alignItems: "center",
        padding: "8px 2px calc(8px + env(safe-area-inset-bottom))",
        zIndex: 999,
        backdropFilter: "blur(10px)",
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
              flex: "1 1 0",
              minWidth: 0,
              textDecoration: "none",
              color: active ? "#22c55e" : "#9ca3af",
            }}
          >
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                gap: "3px",
                fontSize: "10px",
                fontWeight: active ? "700" : "500",
                cursor: "pointer",
              }}
            >
              <span style={{ fontSize: "19px", lineHeight: 1.3 }}>
                {item.icon}
              </span>
              <span>{item.name}</span>
            </div>
          </Link>
        );
      })}
    </nav>
  );
}