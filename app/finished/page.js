"use client";

import { useEffect, useState } from "react";

export default function FinishedPage() {

  const [todayMatches, setTodayMatches] = useState([]);
  const [yesterdayMatches, setYesterdayMatches] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {

    async function fetchFinishedMatches() {

      try {

        const today = new Date();

        const yesterday = new Date();

        yesterday.setDate(today.getDate() - 1);

        const todayDate =
          today.toISOString().split("T")[0];

        const yesterdayDate =
          yesterday.toISOString().split("T")[0];

        // TODAY

        const todayResponse = await fetch(
          `https://www.thesportsdb.com/api/v1/json/3/eventsday.php?d=${todayDate}&s=Soccer`
        );

        const todayData = await todayResponse.json();

        // YESTERDAY

        const yesterdayResponse = await fetch(
          `https://www.thesportsdb.com/api/v1/json/3/eventsday.php?d=${yesterdayDate}&s=Soccer`
        );

        const yesterdayData = await yesterdayResponse.json();

        // FILTER FINISHED MATCHES

        const filterFinished = (matches) => {

          return matches.filter((match) => {

            return (

              match.strStatus === "Match Finished" ||

              (
                match.intHomeScore !== null &&
                match.intAwayScore !== null
              )

            );

          });

        };

        setTodayMatches(
          filterFinished(todayData.events || [])
        );

        setYesterdayMatches(
          filterFinished(yesterdayData.events || [])
        );

      } catch (error) {

        console.log(error);

      } finally {

        setLoading(false);

      }

    }

    fetchFinishedMatches();

  }, []);

  // GROUP BY LEAGUE

  const groupByLeague = (matches) => {

    return matches.reduce((groups, match) => {

      const league =
        match.strLeague || "Other League";

      if (!groups[league]) {

        groups[league] = [];

      }

      groups[league].push(match);

      return groups;

    }, {});

  };

  const todayGrouped =
    groupByLeague(todayMatches);

  const yesterdayGrouped =
    groupByLeague(yesterdayMatches);

  if (loading) {

    return (

      <div
        style={{
          background: "#0f172a",
          color: "white",
          minHeight: "100vh",
          padding: "20px",
        }}
      >

        <h1>Loading Finished Matches...</h1>

      </div>

    );

  }

  const renderLeagueSection = (groupedMatches) => {

    return Object.keys(groupedMatches).map((league) => (

      <div key={league}>

        <h2
          style={{
            color: "#22c55e",
            marginTop: "30px",
            marginBottom: "20px",
          }}
        >
          {league}
        </h2>

        {groupedMatches[league].map((match) => (

          <div
            key={match.idEvent}
            style={{
              background: "#1e293b",
              padding: "20px",
              borderRadius: "15px",
              marginBottom: "15px",
              border: "1px solid #334155",
            }}
          >

            <p
              style={{
                color: "#ef4444",
                fontWeight: "bold",
              }}
            >
              FULL TIME
            </p>

            <h2>
              {match.strHomeTeam}
              {" vs "}
              {match.strAwayTeam}
            </h2>

            <h1
              style={{
                color: "#22c55e",
              }}
            >
              {match.intHomeScore || 0}
              {" - "}
              {match.intAwayScore || 0}
            </h1>

          </div>

        ))}

      </div>

    ));

  };

  return (

    <div
      style={{
        background: "#0f172a",
        color: "white",
        minHeight: "100vh",
        padding: "20px",
      }}
    >

      <h1
        style={{
          fontSize: "40px",
          marginBottom: "30px",
          color: "#22c55e",
        }}
      >
        Finished Matches
      </h1>

      <h1
        style={{
          marginTop: "20px",
          marginBottom: "20px",
        }}
      >
        Today
      </h1>

      {renderLeagueSection(todayGrouped)}

      <h1
        style={{
          marginTop: "50px",
          marginBottom: "20px",
        }}
      >
        Yesterday
      </h1>

      {renderLeagueSection(yesterdayGrouped)}

    </div>

  );

}