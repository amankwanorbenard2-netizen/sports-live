import "./globals.css";

import Link from "next/link";

import {
  FaHome,
  FaFutbol,
  FaCalendarAlt,
  FaCheckCircle,
  FaNewspaper,
  FaTable,
} from "react-icons/fa";

export const metadata = {
  title: "Sports Live",
  description: "Live football matches",
};

export default function RootLayout({
  children,
}) {

  return (

    <html lang="en">

      <body
        style={{
          margin: 0,
          background: "#0f172a",
          color: "white",
          fontFamily: "Arial",
          paddingBottom: "80px",
        }}
      >

        {/* HEADER */}

        <header
          style={{
            background: "#111827",
            padding: "20px",
            borderBottom: "1px solid #334155",
          }}
        >

          <h1
            style={{
              color: "#39ff14",
              margin: 0,
            }}
          >
            ⚽ Sports Live
          </h1>

        </header>

        {/* MAIN */}

        <main>

          {children}

        </main>

        {/* BOTTOM NAV */}

        <nav
          style={{
            position: "fixed",
            bottom: 0,
            left: 0,
            right: 0,
            background: "#1e293b",
            borderTop: "1px solid #334155",
            display: "flex",
            justifyContent: "space-around",
            padding: "12px 0",
            zIndex: 1000,
          }}
        >

          {/* HOME */}

          <Link
            href="/"
            style={navStyle}
          >
            <FaHome />
            <span>Home</span>
          </Link>

          {/* LIVE */}

          <Link
            href="/live"
            style={navStyle}
          >
            <FaFutbol />
            <span>Live</span>
          </Link>

          {/* FIXTURES */}

          <Link
            href="/fixtures"
            style={navStyle}
          >
            <FaCalendarAlt />
            <span>Fixtures</span>
          </Link>

          {/* FINISHED */}

          <Link
            href="/finished"
            style={navStyle}
          >
            <FaCheckCircle />
            <span>Finished</span>
          </Link>

          {/* NEWS */}

          <Link
            href="/news"
            style={navStyle}
          >
            <FaNewspaper />
            <span>News</span>
          </Link>

          {/* TABLES */}

          <Link
            href="/standings"
            style={navStyle}
          >
            <FaTable />
            <span>Tables</span>
          </Link>

        </nav>

      </body>

    </html>

  );

}

const navStyle = {

  color: "white",
  textDecoration: "none",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  gap: "5px",
  fontSize: "12px",

};