"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function BottomNav() {

  const pathname = usePathname();

  const navItems = [
    {
      name: "Live",
      href: "/live",
    },
    {
      name: "Fixtures",
      href: "/fixtures",
    },
    {
      name: "Finished",
      href: "/finished",
    },
    {
      name: "Tables",
      href: "/standings",
    },
  ];

  return (

    <div
      style={{
        position: "fixed",
        bottom: 0,
        left: 0,
        width: "100%",
        background: "#1f2937",
        borderTop: "1px solid #374151",
        display: "flex",
        justifyContent: "space-around",
        padding: "14px 0",
        zIndex: 999,
      }}
    >

      {navItems.map((item) => (

        <Link
          key={item.href}
          href={item.href}
          style={{
            color:
              pathname === item.href
                ? "#d4ff00"
                : "#9ca3af",

            textDecoration: "none",

            fontWeight:
              pathname === item.href
                ? "bold"
                : "normal",

            fontSize: "15px",
          }}
        >
          {item.name}
        </Link>

      ))}

    </div>

  );

}