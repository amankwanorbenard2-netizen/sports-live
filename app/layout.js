import "./globals.css";
import Link from "next/link";

export const metadata = {
  title: "Sports Live",
  description: "Football Live Scores App",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        style={{
          margin: 0,
          padding: 0,
          background: "#111827",
          fontFamily: "Arial",
        }}
      >
        {/* TOP NAVBAR */}
        <div
          style={{
            background: "#1f2937",
            padding: "20px",
            borderBottom: "1px solid #374151",
            position: "sticky",
            top: 0,
            zIndex: 1000,
          }}
        >
          <h1
            style={{
              color: "#84cc16",
              margin: 0,
              fontSize: "38px",
              fontWeight: "bold",
            }}
          >
            ⚽ Sports Live
          </h1>
        </div>

        {/* PAGE CONTENT */}
        <div>{children}</div>

        {/* BOTTOM NAVIGATION */}
        <div
          style={{
            position: "fixed",
            bottom: 0,
            left: 0,
            right: 0,
            background: "#1f2937",
            borderTop: "1px solid #374151",
            display: "flex",
            justifyContent: "space-around",
            alignItems: "center",
            padding: "15px 10px",
            zIndex: 1,
          }}
        >
          <Link
            href="/"
            style={{
              color: "white",
              textDecoration: "none",
              fontSize: "18px",
            }}
          >
            🏠 Home
          </Link>

          <Link
            href="/live"
            style={{
              color: "white",
              textDecoration: "none",
              fontSize: "18px",
            }}
          >
            🔴 Live
          </Link>

          <Link
            href="/fixtures"
            style={{
              color: "white",
              textDecoration: "none",
              fontSize: "18px",
            }}
          >
            📅 Fixtures
          </Link>

          <Link
            href="/finished"
            style={{
              color: "white",
              textDecoration: "none",
              fontSize: "18px",
            }}
          >
            ✅ Finished
          </Link>

          <Link
            href="/standings"
            style={{
              color: "white",
              textDecoration: "none",
              fontSize: "18px",
            }}
          >
            🏆 Tables
          </Link>
        </div>
      </body>
    </html>
  );
}