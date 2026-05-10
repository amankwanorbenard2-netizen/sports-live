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

        {/* NAVBAR */}
        <nav className="flex gap-6 p-4 border-b border-gray-800 bg-black text-white">

          <Link href="/" className="hover:text-green-400">
            Home
          </Link>

          <Link href="/live" className="hover:text-green-400">
            Live
          </Link>

          <Link href="/finished" className="hover:text-green-400">
            Finished
          </Link>

          <Link href="/news" className="hover:text-green-400">
            News
          </Link>

        </nav>

        <main>{children}</main>

      </body>
    </html>
  );
}