import Link from "next/link";

async function getNews() {
  const res = await fetch(
    "https://gnews.io/api/v4/search?q=football&lang=en&max=10&apikey=679c08a9e0790162951d756ad3fd2693",
    {
      cache: "no-store"
    }
  );

  const data = await res.json();

  return data.articles || [];
}

export default async function NewsPage() {
  const news = await getNews();

  return (
    <main className="min-h-screen bg-[#0b0e11] text-white">

      {/* NAVBAR */}
      <nav className="flex justify-between items-center px-8 py-5 border-b border-gray-800 bg-black">

        <h1 className="text-3xl font-black text-green-400">
          Sports Live
        </h1>

        <div className="flex gap-8 text-gray-300 font-semibold">

          <Link href="/">Home</Link>
          <Link href="/live">Live</Link>
          <Link href="/finished">Finished</Link>
          <Link href="/news">News</Link>

        </div>

      </nav>

      {/* HEADER */}
      <section className="px-8 py-12 border-b border-gray-800">

        <h1 className="text-6xl font-black mb-4">
          Football News
        </h1>

        <p className="text-gray-400 text-xl">
          Latest football headlines from around the world.
        </p>

      </section>

      {/* NEWS */}
      <section className="px-8 py-10">

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

          {news.map((article, index) => (

            <a
              key={index}
              href={article.url}
              target="_blank"
              className="bg-[#161b22] border border-gray-800 rounded-3xl overflow-hidden hover:border-green-500 transition"
            >

              <img
                src={article.image}
                alt={article.title}
                className="w-full h-64 object-cover"
              />

              <div className="p-6">

                <p className="text-green-400 text-sm font-bold mb-3">
                  {article.source.name}
                </p>

                <h2 className="text-3xl font-black mb-4">
                  {article.title}
                </h2>

                <p className="text-gray-400 leading-7">
                  {article.description}
                </p>

                <p className="text-gray-500 mt-6 text-sm">
                  {new Date(article.publishedAt).toLocaleString()}
                </p>

              </div>

            </a>

          ))}

        </div>

      </section>

    </main>
  );
}