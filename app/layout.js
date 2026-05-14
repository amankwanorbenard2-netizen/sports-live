import "./globals.css";

import Link from "next/link";

export const metadata = {
  title: "Sports Live",
  description: "Live football matches",
};

export default function RootLayout({ children }) {

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

        <main>

          {children}

        </main>

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
            padding: "15px 0",
          }}
        >

          <Link
            href="/"
            style={{
              color: "white",
              textDecoration: "none",
            }}
          >
            Home
          </Link>

          <Link
            href="/live"
            style={{
              color: "#39ff14",
              textDecoration: "none",
            }}
          >
            Live
          </Link>

          <Link
            href="/fixtures"
            style={{
              color: "white",
              textDecoration: "none",
            }}
          >
            Fixtures
          </Link>

          <Link
            href="/finished"
            style={{
              color: "white",
              textDecoration: "none",
            }}
          >
            Finished
          </Link>

          <Link
            href="/news"
            style={{
              color: "white",
              textDecoration: "none",
            }}
          >
            News
          </Link>

        </nav>

      </body>

    </html>

  );

}