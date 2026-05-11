import "./globals.css";
import Link from "next/link";

export const metadata = {
  title: "Sports Live",
  description: "Live football scores and fixtures",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body style={{ margin: 0, background: "#000", color: "#fff" }}>
        <nav
          style={{
            display: "flex",
            gap: "30px",
            padding: "20px",
            background: "#000",
            borderBottom: "1px solid #222",
          }}
        >
          <Link
            href="/"
            style={{ color: "white", textDecoration: "none", fontWeight: "bold" }}
          >
            Home
          </Link>

          <Link
            href="/live"
            style={{ color: "white", textDecoration: "none", fontWeight: "bold" }}
          >
            Live
          </Link>

          <Link
            href="/finished"
            style={{ color: "white", textDecoration: "none", fontWeight: "bold" }}
          >
            Finished
          </Link>

          <Link
            href="/fixtures"
            style={{ color: "white", textDecoration: "none", fontWeight: "bold" }}
          >
            Fixtures
          </Link>

          <Link
            href="/news"
            style={{ color: "white", textDecoration: "none", fontWeight: "bold" }}
          >
            News
          </Link>
        </nav>

        <main>{children}</main>
      </body>
    </html>
  );
}