import Link from "next/link";

async function getLiveMatches() {
  const res = await fetch(
    "https://api.football-data.org/v4/matches?status=LIVE",
    {
      headers: {
        "X-Auth-Token": "8f3cf00e60fc4b80a12f18e26b85b3c2"
      },
      cache: "no-store"
    }
  );

  const data = await res.json();

  return data.matches || [];
}

export default async function LivePage() {
  const matches = await getLiveMatches();

  return (
    <main className="min-h-screen bg-[#0b0e11] text-white">

      {/* NAVBAR */}
      <nav className="flex justify-between items-center px-8 py-5 border-b border-gray-800 bg-black">

        <h1 className="text-3xl font-black text-green-400">
          Sports Live
        </h1>

        <div className="flex gap-8 text-gray-300 font-semibold">

          <Link href="/">Home</Link>
          <Link href="/live">Live</Link>
          <Link href="/finished">Finished</Link>
          <Link href="/news">News</Link>

        </div>

      </nav>

      {/* HEADER */}
      <section className="px-8 py-12 border-b border-gray-800">

        <div className="flex items-center gap-3 mb-4">

          <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>

          <p className="text-red-500 font-bold">
            LIVE NOW
          </p>

        </div>

        <h1 className="text-6xl font-black">
          Live Football Matches
        </h1>

      </section>

      {/* MATCHES */}
      <section className="px-8 py-10">

        {matches.length === 0 ? (

          <div className="bg-[#161b22] border border-gray-800 rounded-3xl p-10 text-center">

            <h2 className="text-3xl font-bold mb-4">
              No Live Matches Right Now
            </h2>

            <p className="text-gray-400">
              Check again later when matches are live.
            </p>

          </div>

        ) : (

          <div className="space-y-6">

            {matches.map((match) => (

              <div
                key={match.id}
                className="bg-[#161b22] border border-gray-800 rounded-3xl p-8 hover:border-green-500 transition"
              >

                <div className="flex justify-between items-center mb-6">

                  <div>

                    <p className="text-green-400 font-bold text-sm mb-2">
                      {match.competition.name}
                    </p>

                    <h2 className="text-3xl font-black">
                      {match.homeTeam.name}
                    </h2>

                    <p className="text-gray-400 mt-2">
                      vs {match.awayTeam.name}
                    </p>

                  </div>

                  <div className="text-right">

                    <p className="text-5xl font-black text-green-400">
                      {match.score.fullTime.home ?? 0}
                      {" - "}
                      {match.score.fullTime.away ?? 0}
                    </p>

                    <p className="text-red-500 font-bold mt-3 animate-pulse">
                      LIVE
                    </p>

                  </div>

                </div>

              </div>

            ))}

          </div>

        )}

      </section>

    </main>
  );
}