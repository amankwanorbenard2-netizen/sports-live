"use client";

export default function BackButton() {

  return (

    <button
      onClick={() =>
        window.history.back()
      }
      style={{
        background: "none",
        border: "none",
        color: "white",
        fontSize: "32px",
        fontWeight: "bold",
        cursor: "pointer",
      }}
    >
      ←
    </button>

  );

}