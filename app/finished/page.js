"use client";

import { useEffect, useState } from "react";

export default function FinishedPage() {

  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {

    async function fetchFinishedMatches() {

      try {

        const response = await fetch("/api/finished");

        const data = await response.json();

        setMatches(data.matches || []);

      } catch (error) {

        console.log(error);

      } finally {

        setLoading(false);

      }

    }

    fetchFinishedMatches();

  }, []);

  if (loading) {

    return (

      <div style={{ padding: "20px" }}>

        <h1>Loading Finished Matches...</h1>

      </div>

    );

  }

  return (

    <div style={{ padding: "20px" }}>

      <h1
        style={{
          color: "#22c55e",
          fontSize: "40px",
          marginBottom: "30px",
        }}
      >
        Finished Matches
      </h1>

      {matches.length === 0 && (

        <h2>No Finished Matches</h2>

      )}

      {matches.map((match) => (

        <div
          key={match.idEvent}
          style={{
            background: "#1e293b",
            borderRadius: "15px",
            padding: "20px",
            marginBottom: "15px",
            border: "1px solid #334155",
          }}
        >

          <p
            style={{
              color: "#22c55e",
              fontWeight: "bold",
            }}
          >
            FINISHED
          </p>

          <h2>
            {match.strHomeTeam}
            {" "}
            {match.intHomeScore}
            {" - "}
            {match.intAwayScore}
            {" "}
            {match.strAwayTeam}
          </h2>

          <p>{match.strLeague}</p>

          <p>{match.dateEvent}</p>

        </div>

      ))}

    </div>

  );

}