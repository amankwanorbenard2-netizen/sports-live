import {
  getLiveMatches,
} from "@/lib/football-api";

export async function GET() {

  try {

    const matches =
      await getLiveMatches();

    return Response.json({
      success: true,
      events: matches,
    });

  } catch (error) {

    return Response.json({
      success: false,
      error: error.message,
    });

  }

}