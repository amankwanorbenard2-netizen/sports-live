
import { NextResponse } from "next/server";
import { fetchFootball } from "@/lib/football-api";

export async function GET(request, { params }) {
  try {
    const { id } = await params;
    const { searchParams } = new URL(request.url);

    if (!id || !/^\d+$/.test(String(id))) {
      return NextResponse.json(
        { error: "A valid player ID is required." },
        { status: 400 }
      );
    }

    const season =
      searchParams.get("season") ||
      String(new Date().getFullYear());

    const playerData = await fetchFootball(
      `players?id=${encodeURIComponent(id)}&season=${encodeURIComponent(season)}`
    );

    if (
      playerData?.errors &&
      Object.keys(playerData.errors).length > 0
    ) {
      return NextResponse.json(
        {
          error: "Unable to retrieve player information.",
          details: playerData.errors,
        },
        { status: 502 }
      );
    }

    const playerEntry = playerData?.response?.[0];

    if (!playerEntry?.player) {
      return NextResponse.json(
        { error: "No player information was found." },
        { status: 404 }
      );
    }

    const additionalDataErrors = {};
    let transfers = [];
    let injuries = [];

    // Transfers are optional: do not fail the whole profile
    // if the provider limits or rejects this request.
    try {
      const transferData = await fetchFootball(
        `transfers?player=${encodeURIComponent(id)}`
      );

      if (
        transferData?.errors &&
        Object.keys(transferData.errors).length > 0
      ) {
        additionalDataErrors.transfers = transferData.errors;
      } else {
        transfers = (transferData?.response || []).flatMap(
          (item) => Array.isArray(item?.transfers)
            ? item.transfers
            : []
        );
      }
    } catch (error) {
      additionalDataErrors.transfers =
        error instanceof Error ? error.message : "Request failed";
    }

    // Injuries are also optional.
    try {
      const injuryData = await fetchFootball(
        `injuries?player=${encodeURIComponent(id)}&season=${encodeURIComponent(season)}`
      );

      if (
        injuryData?.errors &&
        Object.keys(injuryData.errors).length > 0
      ) {
        additionalDataErrors.injuries = injuryData.errors;
      } else {
        injuries = injuryData?.response || [];
      }
    } catch (error) {
      additionalDataErrors.injuries =
        error instanceof Error ? error.message : "Request failed";
    }

    return NextResponse.json({
      ...playerData,
      player: playerEntry.player,
      statistics: playerEntry.statistics || [],
      transfers,
      injuries,
      season,
      additionalDataErrors,
    });
  } catch (error) {
    console.error("Player route error:", error);

    return NextResponse.json(
      {
        error: "Unable to retrieve player information.",
        details:
          error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
