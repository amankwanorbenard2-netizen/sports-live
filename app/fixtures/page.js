async function getFixtures() {
  try {

    const now = new Date();

    const ghanaDate = new Date(
      now.toLocaleString("en-US", {
        timeZone: "Africa/Accra",
      })
    );

    ghanaDate.setDate(ghanaDate.getDate() + 1);

    const year = ghanaDate.getFullYear();
    const month = String(ghanaDate.getMonth() + 1).padStart(2, "0");
    const day = String(ghanaDate.getDate()).padStart(2, "0");

    const nextDate = `${year}-${month}-${day}`;

    const res = await fetch(
      `https://v3.football.api-sports.io/fixtures?date=${nextDate}`,
      {
        headers: {
          "x-apisports-key":
            "76a878aeb39d96d56d9fbf38ba573654",
        },
        cache: "no-store",
      }
    );

    const data = await res.json();

    return (data.response || []).filter(
      (match) => match.fixture.status.short === "NS"
    );

  } catch (error) {
    console.log(error);
    return [];
  }
}

export default async function FixturesPage() {

  const matches = await getFixtures();

  return (
    <div className="min-h-screen bg-black text-white p-6">

      <h1 className="text-5xl font-bold text-green-400 mb-8">
        Tomorrow Fixtures
      </h1>

      {matches.length === 0 ? (

        <p className="text-gray-400">
          No upcoming fixtures found.
        </p>

      ) : (

        matches.map((match) => (

          <div
            key={match.fixture.id}
            className="bg-gray-900 p-5 rounded-2xl border border-gray-800 mb-4"
          >

            <h2 className="text-2xl font-bold">
              {match.teams.home.name} vs{" "}
              {match.teams.away.name}
            </h2>

            <p className="text-green-400 mt-2">
              {match.league.name}
            </p>

            <p className="text-gray-400 mt-2">
              {new Date(match.fixture.date).toLocaleString("en-GB", {
                timeZone: "Africa/Accra",
              })}
            </p>

          </div>

        ))

      )}

    </div>
  );
}