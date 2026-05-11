async function getFixtures() {
  const res = await fetch(
    "https://api.football-data.org/v4/matches?status=SCHEDULED",
    {
      headers: {
        "X-Auth-Token": "8f3cf00e60fc4b80a12f18e26b85b3c2",
      },
      cache: "no-store",
    }
  );

  const data = await res.json();

  return data.matches || [];
}

export default async function HomePage() {
  const matches = await getFixtures();

  return (
    <div className="min-h-screen bg-black text-white p-6">
      <h1 className="text-5xl font-bold text-green-400 mb-8">
        Sports Live
      </h1>

      <h2 className="text-3xl font-bold mb-6">
        Upcoming Fixtures
      </h2>

      <div className="space-y-4">
        {matches.slice(0, 10).map((match) => (
          <div
            key={match.id}
            className="bg-gray-900 p-4 rounded-xl"
          >
            <p className="text-xl font-bold">
              {match.homeTeam.name} vs {match.awayTeam.name}
            </p>

            <p className="text-gray-400 mt-2">
              {new Date(match.utcDate).toLocaleString()}
            </p>

            <p className="text-green-400 mt-2">
              {match.competition.name}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}