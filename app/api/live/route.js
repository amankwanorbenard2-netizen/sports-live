
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const apiKey = process.env.API_FOOTBALL_KEY;

    if (!apiKey) {
      return NextResponse.json(
        {
          success: false,
          error: "API_FOOTBALL_KEY is missing from .env.local",
        },
        { status: 500 }
      );
    }

    const response = await fetch(
      "https://v3.football.api-sports.io/fixtures?live=all",
      {
        method: "GET",
        headers: {
          "x-apisports-key": apiKey,
        },
        cache: "no-store",
      }
    );

    const data = await response.json();

    if (
      !response.ok ||
      (data.errors && Object.keys(data.errors).length > 0)
    ) {
      return NextResponse.json(
        {
          success: false,
          error: "API-Football rejected the request.",
          status: response.status,
          details: data.errors,
        },
        { status: 502 }
      );
    }

    return NextResponse.json({
      success: true,
      events: Array.isArray(data.response) ? data.response : [],
      results: data.results ?? 0,
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: error.message || "An unexpected error occurred.",
      },
      { status: 500 }
    );
  }
}
