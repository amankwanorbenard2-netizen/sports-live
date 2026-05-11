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

export default async function FixturesPage() {
  const matches = await getFixtures();

  return (
    <div className="p-6 text-white">
      <h1 className="text-4xl font-bold mb-6">Upcoming Fixtures</h1>

      <div className="grid gap-4">
        {matches.slice(0, 20).map((match) => (
          <div
            key={match.id}
            className="bg-gray-900 p-4 rounded-xl border border-gray-800"
          >
            <p className="text-lg font-semibold">
              {match.homeTeam.name} vs {match.awayTeam.name}
            </p>

            <p className="text-gray-400 mt-2">
              {new Date(match.utcDate).toLocaleString()}
            </p>
            <p className="text-blue-400 mt-2">
              {match.competition.name}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}