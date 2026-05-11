async function getFixtures() {

  const today = new Date();

  const tomorrow = new Date();
  tomorrow.setDate(today.getDate() + 1);

  const nextWeek = new Date();
  nextWeek.setDate(today.getDate() + 7);

  const fromDate = tomorrow.toISOString().split("T")[0];
  const toDate = nextWeek.toISOString().split("T")[0];

  const res = await fetch(
    `https://api.football-data.org/v4/matches?dateFrom=${fromDate}&dateTo=${toDate}`,
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
    <div className="min-h-screen bg-black text-white p-6">

      <h1 className="text-5xl font-bold text-green-400 mb-8">
        Upcoming Fixtures
      </h1>

      <div className="space-y-4">

        {matches.length === 0 ? (
          <p>No upcoming fixtures found.</p>
        ) : (
          matches.map((match) => (

            <div
              key={match.id}
              className="bg-gray-900 p-5 rounded-2xl border border-gray-800"
            >

              <p className="text-2xl font-bold">
                {match.homeTeam?.name} vs {match.awayTeam?.name}
              </p>

              <p className="text-green-400 mt-3">
                {match.competition?.name}
              </p>

              <p className="text-gray-400 mt-2">
                {new Date(match.utcDate).toLocaleString()}
              </p>

            </div>

          ))
        )}

      </div>

    </div>
  );
}