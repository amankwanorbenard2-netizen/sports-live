import "./globals.css";
import Link from "next/link";

export const metadata = {
  title: "Sports Live",
  description: "Live football scores and football news",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-black text-white">
        <nav className="flex gap-6 p-4 border-b border-gray-800">
          <Link href="/">Home</Link>
          <Link href="/live">Live</Link>
          <Link href="/finished">Finished</Link>
          <Link href="/news">News</Link>
        </nav>

        <main>{children}</main>
      </body>
    </html>
  );
}