import { NextResponse } from "next/server";

const API_KEY = "e3f7de2b8a8f97d91582c713eb9651a1";

export async function GET(request) {
  const { searchParams } = new URL(request.url);

  const id = searchParams.get("id");

  try {
    // MATCH DETAILS
    const matchRes = await fetch(
      `https://v3.football.api-sports.io/fixtures?id=${id}`,
      {
        headers: {
          "x-apisports-key": API_KEY,
        },
      }
    );

    const matchData = await matchRes.json();

    // STATISTICS
    const statsRes = await fetch(
      `https://v3.football.api-sports.io/fixtures/statistics?fixture=${id}`,
      {
        headers: {
          "x-apisports-key": API_KEY,
        },
      }
    );

    const statsData = await statsRes.json();

    // LINEUPS
    const lineupRes = await fetch(
      `https://v3.football.api-sports.io/fixtures/lineups?fixture=${id}`,
      {
        headers: {
          "x-apisports-key": API_KEY,
        },
      }
    );

    const lineupData = await lineupRes.json();

    // EVENTS
    const eventsRes = await fetch(
      `https://v3.football.api-sports.io/fixtures/events?fixture=${id}`,
      {
        headers: {
          "x-apisports-key": API_KEY,
        },
      }
    );

    const eventsData = await eventsRes.json();

    return NextResponse.json({
      success: true,
      event: matchData.response[0],
      statistics: statsData.response,
      lineups: lineupData.response,
      events: eventsData.response,
    });
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: error.message,
    });
  }
}