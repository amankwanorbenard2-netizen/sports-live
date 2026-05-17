import { NextResponse } from "next/server";

export async function GET(request) {
  const { searchParams } =
    new URL(request.url);

  const id = searchParams.get("id");

  try {
    const response = await fetch(
      `https://v3.football.api-sports.io/fixtures?id=${id}`,
      {
        headers: {
          "x-apisports-key":
            "e3f7de2b8a8f97d91582c713eb9651a1",
        },
      }
    );

    const data =
      await response.json();

    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({
      error:
        "Failed to fetch match",
    });
  }
}