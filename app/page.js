export default function HomePage() {
  return (
    <div
      style={{
        backgroundColor: "#000",
        color: "#fff",
        minHeight: "100vh",
        padding: "20px",
      }}
    >
      <h1
        style={{
          color: "#39ff14",
          fontSize: "48px",
          fontWeight: "bold",
          marginBottom: "30px",
        }}
      >
        Sports Live
      </h1>

      <h2 style={{ marginBottom: "20px" }}>
        Welcome to Sports Live
      </h2>

      <p>
        Live matches, finished matches, fixtures and football news.
      </p>
    </div>
  );
}