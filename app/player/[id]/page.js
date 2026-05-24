import BackButton from "@/components/BackButton";

export default async function PlayerPage(
  { params }
) {

  const { id } =
    await params;

  const response =
    await fetch(
      `http://localhost:3000/api/player/${id}`,
      {
        cache: "no-store",
      }
    );

  const data =
    await response.json();

  if (
    !data.response ||
    data.response.length === 0
  ) {

    return (

      <div
        style={{
          background: "#0f172a",
          color: "white",
          minHeight: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          fontSize: "32px",
          fontWeight: "bold",
        }}
      >

        No player found

      </div>

    );

  }

  const player =
    data.response[0]
      .player;

  const allStats =
    data.response[0]
      .statistics
      ?.filter(
        (stat) =>
          stat.games
            ?.appearences > 0
      ) || [];
const transferResponse =
  await fetch(
    `http://localhost:3000/api/transfers?player=${id}`,
    {
      cache: "no-store",
    }
  );

const transferData =
  await transferResponse.json();

const transfers =
  transferData.response?.[0]
    ?.transfers || [];
    const injuryResponse =
  await fetch(
    `http://localhost:3000/api/injuries?player=${id}`,
    {
      cache: "no-store",
    }
  );

const injuryData =
  await injuryResponse.json();

const injuries =
  injuryData.response || [];
  return (

    <div
      style={{
        background:
          "linear-gradient(to bottom, #111827, #0f172a)",
        minHeight: "100vh",
        color: "white",
        fontFamily:
          "Arial, sans-serif",
        paddingBottom: "120px",
      }}
    >

      {/* HEADER */}

      <div
        style={{
          position: "sticky",
          top: 0,
          zIndex: 100,
          background:
            "rgba(15,23,42,0.95)",
          backdropFilter:
            "blur(12px)",
          padding: "16px 20px",
          borderBottom:
            "1px solid rgba(255,255,255,0.1)",
          display: "flex",
          alignItems: "center",
          gap: "18px",
        }}
      >

        <BackButton />

        <div>

          <h2
            style={{
              margin: 0,
              fontSize: "26px",
            }}
          >
            {player.name}
          </h2>

          <p
            style={{
              margin: 0,
              color: "#9ca3af",
            }}
          >
            {
              allStats[0]?.team
                ?.name
            }
          </p>

        </div>

      </div>

      <div
        style={{
          maxWidth: "1300px",
          margin: "auto",
          padding: "20px",
        }}
      >

        {/* PLAYER CARD */}

        <div
          style={{
            background:
              "rgba(255,255,255,0.05)",
            borderRadius: "28px",
            padding: "30px",
            display: "flex",
            gap: "30px",
            flexWrap: "wrap",
            alignItems: "center",
            marginBottom: "35px",
            border:
              "1px solid rgba(255,255,255,0.08)",
            boxShadow:
              "0 10px 40px rgba(0,0,0,0.4)",
          }}
        >

          <img
            src={player.photo}
            alt={player.name}
            width="230"
            style={{
              borderRadius: "22px",
              objectFit: "cover",
            }}
          />

          <div
            style={{
              flex: 1,
            }}
          >

            <h1
              style={{
                fontSize: "56px",
                marginBottom: "25px",
                lineHeight: 1,
              }}
            >
              {player.name}
            </h1>

            <div
              style={{
                display: "grid",
                gridTemplateColumns:
                  "repeat(auto-fit, minmax(170px, 1fr))",
                gap: "18px",
              }}
            >

              <Info
                label="Age"
                value={player.age}
              />

              <Info
                label="Nationality"
                value={
                  player.nationality
                }
              />

              <Info
                label="Birth Date"
                value={
                  player.birth?.date
                }
              />

              <Info
                label="Height"
                value={
                  player.height ||
                  "N/A"
                }
              />

              <Info
                label="Weight"
                value={
                  player.weight ||
                  "N/A"
                }
              />

              <Info
                label="Position"
                value={
                  allStats[0]?.games
                    ?.position ||
                  "N/A"
                }
              />

            </div>

          </div>

        </div>

        {/* ALL COMPETITIONS */}

        <h2
          style={{
            fontSize: "36px",
            marginBottom: "25px",
          }}
        >
          All Competitions
        </h2>

        <div
          style={{
            display: "grid",
            gridTemplateColumns:
              "repeat(auto-fit, minmax(340px, 1fr))",
            gap: "25px",
          }}
        >

          {allStats.map(
            (
              stat,
              index
            ) => (

              <div
                key={index}
                style={{
                  background:
                    "rgba(255,255,255,0.05)",
                  borderRadius:
                    "25px",
                  padding: "25px",
                  border:
                    "1px solid rgba(255,255,255,0.08)",
                  boxShadow:
                    "0 10px 30px rgba(0,0,0,0.3)",
                }}
              >

                {/* LEAGUE */}

                <div
                  style={{
                    display: "flex",
                    alignItems:
                      "center",
                    gap: "16px",
                    marginBottom:
                      "22px",
                  }}
                >

                  <img
                    src={
                      stat.league
                        ?.logo
                    }
                    width="65"
                  />

                  <div>

                    <h3
                      style={{
                        margin: 0,
                        fontSize:
                          "23px",
                      }}
                    >
                      {
                        stat
                          .league
                          ?.name
                      }
                    </h3>

                    <p
                      style={{
                        margin: 0,
                        color:
                          "#9ca3af",
                      }}
                    >
                      Season:
                      {
                        stat
                          .league
                          ?.season
                      }
                    </p>

                  </div>

                </div>

                {/* TEAM */}

                <div
                  style={{
                    display: "flex",
                    alignItems:
                      "center",
                    gap: "14px",
                    marginBottom:
                      "25px",
                  }}
                >

                  <img
                    src={
                      stat.team
                        ?.logo
                    }
                    width="55"
                  />

                  <div>

                    <h4
                      style={{
                        margin: 0,
                        fontSize:
                          "21px",
                      }}
                    >
                      {
                        stat.team
                          ?.name
                      }
                    </h4>

                    <p
                      style={{
                        margin: 0,
                        color:
                          "#9ca3af",
                      }}
                    >
                      {
                        stat.league
                          ?.country
                      }
                    </p>

                  </div>

                </div>

                {/* STATS */}

                <div
                  style={{
                    display:
                      "grid",
                    gridTemplateColumns:
                      "1fr 1fr",
                    gap: "15px",
                  }}
                >

                  <Stat
                    label="Matches"
                    value={
                      stat.games
                        ?.appearences ||
                      0
                    }
                  />

                  <Stat
                    label="Minutes"
                    value={
                      stat.games
                        ?.minutes ||
                      0
                    }
                  />

                  <Stat
                    label="Goals"
                    value={
                      stat.goals
                        ?.total ||
                      0
                    }
                  />

                  <Stat
                    label="Assists"
                    value={
                      stat.goals
                        ?.assists ||
                      0
                    }
                  />

                  <Stat
                    label="Rating"
                    value={
                      stat.games
                        ?.rating ||
                      "N/A"
                    }
                  />

                  <Stat
                    label="Position"
                    value={
                      stat.games
                        ?.position ||
                      "N/A"
                    }
                  />

                  <Stat
                    label="Yellow Cards"
                    value={
                      stat.cards
                        ?.yellow ||
                      0
                    }
                  />

                  <Stat
                    label="Red Cards"
                    value={
                      stat.cards
                        ?.red || 0
                    }
                  />

                </div>

              </div>

            )
          )}

        </div>

      </div>
{/* TRANSFER HISTORY */}

<div
  style={{
    marginTop: "60px",
  }}
>

  <h2
    style={{
      fontSize: "40px",
      marginBottom: "30px",
      color: "white",
    }}
  >
    Transfer History
  </h2>

  {transfers.length === 0 ? (

    <div
      style={{
        background:
          "rgba(255,255,255,0.05)",

        borderRadius: "20px",

        padding: "25px",

        color: "#cbd5e1",
      }}
    >
      No transfer history found.
    </div>

  ) : (

    transfers.map(
      (
        transfer,
        index
      ) => (

        <div
          key={index}
          style={{
            background:
              "rgba(255,255,255,0.05)",

            borderRadius: "28px",

            padding: "25px",

            marginBottom: "22px",

            border:
              "1px solid rgba(255,255,255,0.08)",
          }}
        >

          <div
            style={{
              display: "flex",

              justifyContent:
                "space-between",

              alignItems:
                "center",

              flexWrap: "wrap",

              gap: "20px",
            }}
          >

            {/* FROM CLUB */}

            <div
              style={{
                textAlign: "center",
              }}
            >

              <img
                src={
                  transfer.teams
                    ?.out?.logo
                }
                width="70"
              />

              <h3>
                {
                  transfer.teams
                    ?.out?.name
                }
              </h3>

            </div>

            {/* ARROW */}

            <div
              style={{
                fontSize: "45px",
                fontWeight:
                  "bold",
              }}
            >
              →
            </div>

            {/* TO CLUB */}

            <div
              style={{
                textAlign: "center",
              }}
            >

              <img
                src={
                  transfer.teams
                    ?.in?.logo
                }
                width="70"
              />

              <h3>
                {
                  transfer.teams
                    ?.in?.name
                }
              </h3>

            </div>

          </div>

          <div
            style={{
              marginTop: "20px",

              lineHeight: 1.9,

              color: "#cbd5e1",
            }}
          >

            <p>
              Transfer Date:
              {" "}
              {
                transfer.date
              }
            </p>

            <p>
              Transfer Type:
              {" "}
              {
                transfer.type ||
                "Transfer"
              }
            </p>

          </div>

        </div>

      )
    )

  )}

</div>
    </div>

  );

}

function Info({
  label,
  value,
}) {

  return (

    <div
      style={{
        background:
          "rgba(255,255,255,0.05)",
        padding: "16px",
        borderRadius: "18px",
      }}
    >

      <p
        style={{
          color: "#9ca3af",
          marginBottom: "6px",
          fontSize: "14px",
        }}
      >
        {label}
      </p>

      <h3
        style={{
          margin: 0,
          fontSize: "20px",
        }}
      >
        {value || "N/A"}
      </h3>

    </div>

  );

}

function Stat({
  label,
  value,
}) {

  return (

    <div
      style={{
        background:
          "rgba(255,255,255,0.04)",
        padding: "16px",
        borderRadius: "18px",
      }}
    >

      <p
        style={{
          color: "#9ca3af",
          marginBottom: "6px",
          fontSize: "14px",
        }}
      >
        {label}
      </p>

      <h3
        style={{
          margin: 0,
          fontSize: "25px",
        }}
      >
        {value}
      </h3>

    </div>

  );

}