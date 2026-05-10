export default function Home() {
  return (
    <main className="p-6">
      <div className="mb-10">
        <h1 className="text-5xl font-bold mb-4">Sports Live</h1>

        <p className="text-gray-400 text-xl">
          Live football scores and latest football news.
        </p>
      </div>

      <div className="bg-gray-900 p-6 rounded-xl border border-gray-800">
        <h2 className="text-3xl font-bold mb-4">Welcome</h2>

        <p className="text-gray-400">
          Use the navigation above to check live matches, finished matches,
          and football news.
        </p>
      </div>
    </main>
  );
}