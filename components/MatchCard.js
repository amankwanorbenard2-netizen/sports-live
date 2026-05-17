"use client";

export default function MatchCard({ match }) {

  const homeTeam =
    match?.teams?.home?.name;

  const awayTeam =
    match?.teams?.away?.name;

  const homeLogo =
    match?.teams?.home?.logo;

  const awayLogo =
    match?.teams?.away?.logo;

  const homeGoals =
    match?.goals?.home;

  const awayGoals =
    match?.goals?.away;

  const league =
    match?.league?.name;

  const status =
    match?.fixture?.status?.short;

  return (

    <div
      style={{
        background: "#1f2937",
        padding: "20px",
        borderRadius: "20px",
        marginBottom: "20px",
      }}
    >

      <p
        style={{
          color: "#9ca3af",
        }}
      >
        {league}
      </p>

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginTop: "20px",
        }}
      >

        <div
          style={{
            textAlign: "center",
            width: "35%",
          }}
        >

          <img
            src={homeLogo}
            width="70"
            height="70"
            alt=""
          />

          <h2
            style={{
              color: "white",
              fontSize: "18px",
            }}
          >
            {homeTeam}
          </h2>

        </div>

        <div
          style={{
            textAlign: "center",
            width: "30%",
          }}
        >

          <h1
            style={{
              color: "#d4ff00",
              fontSize: "35px",
            }}
          >
            {homeGoals ?? 0}
            {" - "}
            {awayGoals ?? 0}
          </h1>

          <p
            style={{
              color: "red",
              fontWeight: "bold",
            }}
          >
            {status}
          </p>

        </div>

        <div
          style={{
            textAlign: "center",
            width: "35%",
          }}
        >

          <img
            src={awayLogo}
            width="70"
            height="70"
            alt=""
          />

          <h2
            style={{
              color: "white",
              fontSize: "18px",
            }}
          >
            {awayTeam}
          </h2>

        </div>

      </div>

    </div>

  );

}