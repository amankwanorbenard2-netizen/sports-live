async function getMatch(id) {

  const response = await fetch(
    `https://www.thesportsdb.com/api/v1/json/3/lookupevent.php?id=${id}`,
    {
      cache: "no-store",
    }
  );

  const data = await response.json();

  return data.events?.[0];

}

export default async function MatchDetails({
  params,
}) {

  const match = await getMatch(params.id);

  if (!match) {

    return (

      <div style={{ padding: "20px" }}>

        <h1>Match Not Found</h1>

      </div>

    );

  }

  return (

    <div
      style={{
        padding: "20px",
        color: "white",
      }}
    >

      <h1
        style={{
          color: "#39ff14",
          marginBottom: "30px",
        }}
      >
        Match Details
      </h1>

      <div
        style={{
          background: "#1e293b",
          padding: "30px",
          borderRadius: "20px",
          border: "1px solid #334155",
        }}
      >

        {/* TEAMS */}

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "40px",
            gap: "20px",
          }}
        >

          {/* HOME */}

          <div
            style={{
              textAlign: "center",
              width: "35%",
            }}
          >

            <img
              src={
                match.strHomeTeamBadge ||
                "https://placehold.co/100?text=Team"
              }
              alt=""
              width="100"
              height="100"
            />

            <h2>{match.strHomeTeam}</h2>

          </div>

          {/* SCORE */}

          <div
            style={{
              textAlign: "center",
            }}
          >

            <h1
              style={{
                color: "#39ff14",
                fontSize: "50px",
                margin: 0,
              }}
            >
              {match.intHomeScore ?? 0}
              {" - "}
              {match.intAwayScore ?? 0}
            </h1>

            <p
              style={{
                color: "#facc15",
                fontWeight: "bold",
                fontSize: "20px",
              }}
            >
              {match.strStatus || "Finished"}
            </p>

          </div>

          {/* AWAY */}

          <div
            style={{
              textAlign: "center",
              width: "35%",
            }}
          >

            <img
              src={
                match.strAwayTeamBadge ||
                "https://placehold.co/100?text=Team"
              }
              alt=""
              width="100"
              height="100"
            />

            <h2>{match.strAwayTeam}</h2>

          </div>

        </div>

        {/* DETAILS */}

        <div
          style={{
            lineHeight: "2",
            fontSize: "18px",
          }}
        >

          <p>
            <strong>League:</strong>
            {" "}
            {match.strLeague || "Unknown"}
          </p>

          <p>
            <strong>Season:</strong>
            {" "}
            {match.strSeason || "Unknown"}
          </p>

          <p>
            <strong>Date:</strong>
            {" "}
            {match.dateEvent || "Unknown"}
          </p>

          <p>
            <strong>Time:</strong>
            {" "}
            {match.strTime || "Unknown"}
          </p>

          <p>
            <strong>Venue:</strong>
            {" "}
            {match.strVenue || "Unknown"}
          </p>

          <p>
            <strong>Country:</strong>
            {" "}
            {match.strCountry || "Unknown"}
          </p>

          <p>
            <strong>Referee:</strong>
            {" "}
            {match.strOfficial || "Unknown"}
          </p>

          <p>
            <strong>Status:</strong>
            {" "}
            {match.strStatus || "Finished"}
          </p>

        </div>

      </div>

    </div>

  );

}