import "./globals.css";
import BottomNavWrapper from "../components/BottomNavWrapper";
export const metadata = {
  title: "BEN SPORTS",

  description:
    "Live scores, football news, fixtures and player statistics",

  icons: {
    icon: "/logo.png",
    shortcut: "/logo.png",
    apple: "/logo.png",
  },
};
export const viewport = {
  themeColor: "#111827",
};
export default function RootLayout({
  children,
}) {
  return (
    <html lang="en">
      <head>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1"
        />
      </head>

      <body
        style={{
          margin: 0,
          padding: 0,
          background: "#111827",
          color: "white",
          fontFamily:
            "Arial, sans-serif",
          overflowX: "hidden",
        }}
      >
        <div
          style={{
            maxWidth: "100vw",
            overflowX: "hidden",
            paddingBottom: "90px",
          }}
        >
          {children}
        </div>

        <BottomNavWrapper />
      </body>
    </html>
  );
}