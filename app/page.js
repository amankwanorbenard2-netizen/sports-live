async function getMatches() {
  const res = await fetch(
    "https://api.football-data.org/v4/matches",
    {
      headers: {
        "X-Auth-Token": "8f3cf00e60fc4b80a12f18e26b85b3c2"
      },
      cache: "no-store"
    }
  );

  const data = await res.json();

  return data.matches;
}

export default async function Home() {
  const matches = await getMatches();

  const liveMatches = matches.filter(
    (match) =>
      match.status === "LIVE" ||
      match.status === "IN_PLAY" ||
      match.status === "PAUSED"
  );

  const finishedMatches = matches.filter(
    (match) => match.status === "FINISHED"
  );

  return (
    <main className="bg-[#0b0e11] min-h-screen text-white">

      {/* TOP NAVBAR */}
      <nav className="flex justify-between items-center px-8 py-5 border-b border-gray-800 bg-black sticky top-0 z-50">

        <h1 className="text-3xl font-black text-green-400">
          Sports Live
        </h1>

        <div className="flex gap-8 text-gray-400 font-semibold">

          <button className="hover:text-green-400 transition">
            Home
          </button>

          <button className="hover:text-green-400 transition">
            Live
          </button>

          <button className="hover:text-green-400 transition">
            Finished
          </button>

          <button className="hover:text-green-400 transition">
            News
          </button>

        </div>

      </nav>

      {/* HERO */}
      <section className="px-8 py-16 border-b border-gray-800">

        <h2 className="text-6xl font-black mb-6">
          Live Football Scores
        </h2>

        <p className="text-gray-400 text-xl max-w-2xl">
          Follow matches from Premier League, La Liga, Bundesliga, Serie A and more.
        </p>

      </section>

      {/* LIVE MATCHES */}
      <section className="px-8 py-12">

        <div className="flex items-center gap-3 mb-8">

          <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>

          <h2 className="text-4xl font-black">
            Live Matches
          </h2>

        </div>

        {liveMatches.length === 0 ? (
          <p className="text-gray-500">
            No live matches currently.
          </p>
        ) : (

          <div className="space-y-6">

            {liveMatches.map((match) => (

              <div
                key={match.id}
                className="bg-[#161b22] hover:bg-[#1d232c] transition border border-gray-800 rounded-2xl p-6"
              >

                <div className="flex justify-between items-center mb-5">

                  <div>

                    <p className="text-green-400 font-bold text-sm">
                      {match.competition.name}
                    </p>

                    <p className="text-gray-500 text-sm">
                      LIVE
                    </p>

                  </div>

                  <p className="text-red-500 font-bold animate-pulse">
                    {match.status}
                  </p>

                </div>

                <div className="flex justify-between items-center">

                  <div>

                    <h3 className="text-2xl font-bold">
                      {match.homeTeam.name}
                    </h3>

                    <p className="text-gray-400 mt-2">
                      vs {match.awayTeam.name}
                    </p>

                  </div>

                  <p className="text-5xl font-black text-green-400">
                    {match.score.fullTime.home ?? 0}
                    {" - "}
                    {match.score.fullTime.away ?? 0}
                  </p>

                </div>

              </div>

            ))}

          </div>

        )}

      </section>

      {/* FINISHED MATCHES */}
      <section className="px-8 py-12 border-t border-gray-800">

        <h2 className="text-4xl font-black mb-8">
          Finished Matches
        </h2>

        <div className="space-y-4">

          {finishedMatches.slice(0, 10).map((match) => (

            <div
              key={match.id}
              className="bg-[#161b22] hover:bg-[#1d232c] transition border border-gray-800 rounded-2xl p-5"
            >

              <div className="flex justify-between items-center">

                <div>

                  <p className="text-green-400 text-sm font-bold mb-2">
                    {match.competition.name}
                  </p>

                  <h3 className="text-xl font-bold">
                    {match.homeTeam.name}
                  </h3>

                  <p className="text-gray-400">
                    vs {match.awayTeam.name}
                  </p>

                </div>

                <div className="text-right">

                  <p className="text-4xl font-black text-white">
                    {match.score.fullTime.home ?? 0}
                    {" - "}
                    {match.score.fullTime.away ?? 0}
                  </p>

                  <p className="text-gray-500 mt-2">
                    FT
                  </p>

                </div>

              </div>

            </div>

          ))}

        </div>

      </section>

    </main>
  );
}