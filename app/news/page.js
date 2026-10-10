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
    <main className="min-h-screen bg-black text-white p-6">

      <div className="mb-10">

        <h1 className="text-5xl font-black mb-4">
          Football News
        </h1>

        <p className="text-gray-400 text-xl">
          Latest football headlines from around the world.
        </p>

      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

        {news.map((article, index) => (

          <a
            key={index}
            href={article.url}
            target="_blank"
            className="bg-gray-900 rounded-3xl overflow-hidden border border-gray-800 hover:border-green-500 transition"
          >

            {article.image && (

              <img
                src={article.image}
                alt={article.title}
                className="w-full h-64 object-cover"
              />

            )}

            <div className="p-6">

              <p className="text-green-400 text-sm font-bold mb-3">
                {article.source.name}
              </p>

              <h2 className="text-2xl font-black mb-4">
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

    </main>
  );
}