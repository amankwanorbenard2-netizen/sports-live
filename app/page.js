export default function HomePage() {
  return (
    <div className="min-h-screen bg-black text-white p-6">
      <h1 className="text-5xl font-bold mb-8 text-green-400">
        Sports Live
      </h1>

      <div className="bg-gray-900 p-4 rounded-xl mb-4">
        <h2 className="text-2xl font-bold mb-2">
          Live Matches
        </h2>

        <p className="text-gray-300">
          Live football scores will appear here.
        </p>
      </div>

      <div className="bg-gray-900 p-4 rounded-xl mb-4">
        <h2 className="text-2xl font-bold mb-2">
          Finished Matches
        </h2>

        <p className="text-gray-300">
          Finished football results will appear here.
        </p>
      </div>

      <div className="mt-10">
        <h2 className="text-3xl font-bold text-white mb-4">
          Upcoming Fixtures
        </h2>

        <div className="bg-gray-900 p-4 rounded-xl mb-4">
          <p className="text-white">
            Arsenal vs Chelsea
          </p>

          <p className="text-gray-400">
            Tomorrow - 7:00 PM
          </p>
        </div>

        <div className="bg-gray-900 p-4 rounded-xl mb-4">
          <p className="text-white">
            Barcelona vs Real Madrid
          </p>

          <p className="text-gray-400">
            Sunday - 8:00 PM
          </p>
        </div>
      </div>
    </div>
  );
}