import { NextResponse } from "next/server";

const API_KEY = "e3f7de2b8a8f97d91582c713eb9651a1";

export async function GET() {
  try {
    const leagues = [
      39,   // Premier League
      140,  // La Liga
      135,  // Serie A
      78,   // Bundesliga
      61,   // Ligue 1
      88,   // Eredivisie
      94,   // Portuguese League
      203,  // Turkish League
      307,  // Saudi League
      71,   // Brasileirão
      253,  // MLS
      262   // Liga MX
    ];

    let allMatches = [];

    for (const league of leagues) {
      const res = await fetch(
        `https://v3.football.api-sports.io/fixtures?league=${league}&season=2025&last=10`,
        {
          headers: {
            "x-apisports-key": API_KEY,
          },
          cache: "no-store",
        }
      );

      const data = await res.json();

      if (data.response) {
        allMatches.push(...data.response);
      }
    }

    return NextResponse.json({
      success: true,
      events: allMatches,
    });

  } catch (error) {
    return NextResponse.json({
      success: false,
      error: error.message,
    });
  }
}