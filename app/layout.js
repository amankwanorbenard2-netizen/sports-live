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
          backgroundColor: "#000",
          color: "#fff",
          fontFamily: "Arial",
        }}
      >
        <nav
          style={{
            display: "flex",
            gap: "30px",
            padding: "20px",
            backgroundColor: "black",
            borderBottom: "1px solid #222",
          }}
        >
          <Link href="/" style={{ color: "white", textDecoration: "none" }}>
            Home
          </Link>

          <Link href="/live" style={{ color: "white", textDecoration: "none" }}>
            Live
          </Link>

          <Link
            href="/finished"
            style={{ color: "white", textDecoration: "none" }}
          >
            Finished
          </Link>

          <Link
            href="/fixtures"
            style={{ color: "white", textDecoration: "none" }}
          >
            Fixtures
          </Link>

          <Link href="/news" style={{ color: "white", textDecoration: "none" }}>
            News
          </Link>
        </nav>

        <main>{children}</main>
      </body>
    </html>
  );
}