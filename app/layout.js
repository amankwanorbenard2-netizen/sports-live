import "./globals.css";
import Link from "next/link";

export const metadata = {
  title: "Sports Live",
  description: "Football App",
};

export default function RootLayout({ children }) {

  return (

    <html lang="en">

      <body>

        <nav
          style={{
            background: "#111827",
            padding: "15px",
            borderBottom: "1px solid #334155",
            position: "sticky",
            top: 0,
            zIndex: 1000,
          }}
        >

          <div
            style={{
              display: "flex",
              gap: "20px",
              overflowX: "auto",
              whiteSpace: "nowrap",
            }}
          >

            <Link href="/">Home</Link>

            <Link href="/live">Live</Link>

            <Link href="/finished">Finished</Link>

            <Link href="/fixtures">Fixtures</Link>

            <Link href="/news">News</Link>

          </div>

        </nav>

        <main className="container">

          {children}

        </main>

      </body>

    </html>

  );

}