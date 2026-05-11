async function getFixtures() {
  const res = await fetch(
    "https://api.football-data.org/v4/matches?status=SCHEDULED",
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

export default async function FixturesPage() {
  const matches = await getFixtures();

  return (
    <main className="min-h-screen bg-black text-white p-6">

      <div className="mb-10">

        <h1 className="text-5xl font-black mb-4">
          Upcoming Fixtures
        </h1>

        <p className="text-gray-400 text-xl">
          Upcoming football matches from different leagues.
        </p>

      </div>

      <div className="space-y-6">

        {matches.map((match) => (

          <div
            key={match.id}
            className="bg-gray-900 border border-gray-800 rounded-3xl p-6 hover:border-green-500 transition"
          >

            <p className="text-green-400 font-bold mb-3">
              {match.competition.name}
            </p>

            <h2 className="text-3xl font-black">
              {match.homeTeam.name}
            </h2>

            <p className="text-gray-400 mt-2 mb-4">
              vs {match.awayTeam.name}
            </p>

            <p className="text-gray-500">
              {new Date(match.utcDate).toLocaleString()}
            </p>

          </div>

        ))}

      </div>

    </main>
  );
}