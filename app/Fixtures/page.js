async function getFixtures() {
  try {
    const today = new Date();

    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const day = String(today.getDate()).padStart(2, "0");

    const currentDate = `${year}-${month}-${day}`;

    const res = await fetch(
      `https://v3.football.api-sports.io/fixtures?date=${currentDate}`,
      {
        headers: {
          "x-apisports-key":
            "76a878aeb39d96d56d9fbf38ba573654",
        },
        cache: "no-store",
      }
    );

    const data = await res.json();

    return data.response || [];
  } catch (error) {
    console.log(error);
    return [];
  }
}

export default async function FixturesPage() {
  const matches = await getFixtures();

  return (
    <div
      style={{
        backgroundColor: "black",
        minHeight: "100vh",
        color: "white",
        padding: "20px",
      }}
    >
      <h1
        style={{
          color: "#39ff14",
          fontSize: "40px",
          marginBottom: "30px",
        }}
      >
        Fixtures
      </h1>

      {matches.length === 0 ? (
        <p>No fixtures found.</p>
      ) : (
        matches.map((match) => (
          <div
            key={match.fixture.id}
            style={{
              backgroundColor: "#111",
              padding: "20px",
              marginBottom: "20px",
              borderRadius: "15px",
              border: "1px solid #333",
            }}
          >
            <h2>
              {match.teams.home.name} vs{" "}
              {match.teams.away.name}
            </h2>

            <p style={{ color: "#39ff14" }}>
              {match.league.name}
            </p>

            <p style={{ color: "gray" }}>
              {new Date(match.fixture.date).toLocaleString()}
            </p>

            <p style={{ color: "orange" }}>
              {match.fixture.status.long}
            </p>
          </div>
        ))
      )}
    </div>
  );
}