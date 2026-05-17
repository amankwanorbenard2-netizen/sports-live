import { NextResponse } from "next/server";

const API_KEY = "e3f7de2b8a8f97d91582c713eb9651a1";

const LEAGUES = [
  39,   // Premier League
  140,  // La Liga
  135,  // Serie A
  78,   // Bundesliga
  61,   // Ligue 1
  88,   // Eredivisie
  94,   // Portugal
  203,  // Turkey
  253,  // MLS
  307,  // Saudi Pro League
  71,   // Brazil Serie A
  128   // Argentina Liga
];

export async function GET() {
  try {
    let allTables = [];

    for (const league of LEAGUES) {
      const response = await fetch(
        `https://v3.football.api-sports.io/standings?league=${league}&season=2025`,
        {
          method: "GET",
          headers: {
            "x-apisports-key": API_KEY,
          },
          cache: "no-store",
        }
      );

      const data = await response.json();

      if (data.response && data.response.length > 0) {
        allTables.push(...data.response);
      }
    }

    return NextResponse.json({
      success: true,
      response: allTables,
    });

  } catch (error) {
    return NextResponse.json({
      success: false,
      message: error.message,
    });
  }
}