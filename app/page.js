export default function Home() {
  return (
    <div
      style={{
        backgroundColor: "black",
        color: "white",
        minHeight: "100vh",
        padding: "20px",
      }}
    >
      <h1
        style={{
          color: "#39ff14",
          fontSize: "50px",
          fontWeight: "bold",
        }}
      >
        Sports Live
      </h1>

      <p style={{ fontSize: "20px", marginTop: "20px" }}>
        Live matches, fixtures and football news.
      </p>
    </div>
  );
}