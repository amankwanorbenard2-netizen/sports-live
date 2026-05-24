import { NextResponse }
from "next/server";

import {
  fetchFootball,
}
from "@/lib/football-api";

export async function GET(
  request,
  { params }
) {

  const { id } =
    await params;

  try {

    const data =
      await fetchFootball(
        `players?id=${id}&season=2025`
      );

    return NextResponse.json(
      data
    );

  } catch (error) {

    console.log(error);

    return NextResponse.json(
      {
        error:
          "Something went wrong",
      },
      {
        status: 500,
      }
    );

  }

}