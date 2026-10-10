
import { NextResponse } from "next/server";

const API_BASE = "https://v3.football.api-sports.io";

const ENDPOINTS = {
  match: "fixtures",
  statistics: "fixtures/statistics",
  lineups: "fixtures/lineups",
  events: "fixtures/events",
  players: "fixtures/players",
  profile: "players/profiles",
  transfers: "transfers",
  season: "players",
};

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);

    const id = searchParams.get("id");
    const type = searchParams.get("type") || "match";
    const playerId = searchParams.get("player");
    const season = searchParams.get("season");

    const apiKey = process.env.API_FOOTBALL_KEY;

    if (!apiKey) {
      return NextResponse.json(
        { error: "API_FOOTBALL_KEY is missing from .env.local" },
        { status: 500 }
      );
    }

    if (!ENDPOINTS[type]) {
      return NextResponse.json(
        { error: "Unsupported request type" },
        { status: 400 }
      );
    }

    const params = new URLSearchParams();

    if (["match", "statistics", "lineups", "events", "players"].includes(type)) {
      if (!id || !/^\d+$/.test(id)) {
        return NextResponse.json(
          { error: "A valid fixture ID is required" },
          { status: 400 }
        );
      }

      if (type === "match") {
        params.set("id", id);
      } else {
        params.set("fixture", id);
      }
    }

    if (["profile", "transfers", "season"].includes(type)) {
      if (!playerId || !/^\d+$/.test(playerId)) {
        return NextResponse.json(
          { error: "A valid player ID is required" },
          { status: 400 }
        );
      }

      if (type === "season") {
        params.set("id", playerId);

        if (!season || !/^\d{4}$/.test(season)) {
          return NextResponse.json(
            { error: "A valid season is required" },
            { status: 400 }
          );
        }

        params.set("season", season);
      } else {
        params.set("player", playerId);
      }
    }

    const response = await fetch(
      `${API_BASE}/${ENDPOINTS[type]}?${params.toString()}`,
      {
        headers: {
          "x-apisports-key": apiKey,
        },
        cache: "no-store",
      }
    );

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        {
          error: "Football API request failed",
          details: data.errors || data.message || null,
        },
        { status: response.status }
      );
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error("Match API error:", error);

    return NextResponse.json(
      { error: "Unable to retrieve football data" },
      { status: 500 }
    );
  }
}
