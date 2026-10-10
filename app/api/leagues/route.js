
import { NextResponse } from "next/server";

export const revalidate = 3600;

export async function GET() {
  try {
    const apiKey = process.env.API_FOOTBALL_KEY;

    if (!apiKey) {
      return NextResponse.json(
        { errors: ["API_FOOTBALL_KEY is not configured."], response: [] },
        { status: 500 }
      );
    }

    const response = await fetch(
      "https://v3.football.api-sports.io/leagues?current=true",
      {
        method: "GET",
        headers: {
          "x-apisports-key": apiKey,
          Accept: "application/json",
        },
        next: { revalidate: 3600 },
      }
    );

    const data = await response.json();

    if (!response.ok || data.errors?.requests) {
      console.error("Leagues API error:", response.status, data.errors);

      return NextResponse.json(
        {
          errors: data.errors || ["Unable to retrieve leagues."],
          response: [],
        },
        { status: response.status || 502 }
      );
    }

    return NextResponse.json(data, {
      headers: {
        "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
      },
    });
  } catch (error) {
    console.error("Leagues route error:", error);

    return NextResponse.json(
      { errors: ["Unable to retrieve leagues."], response: [] },
      { status: 500 }
    );
  }
}
