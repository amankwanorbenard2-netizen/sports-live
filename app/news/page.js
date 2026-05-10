async function getNews() {
  const res = await fetch(
    "https://newsapi.org/v2/everything?q=football&language=en&sortBy=publishedAt&pageSize=10&apiKey=8f3cf00e60fc4b80a12f18e26b85b3c2",
    { cache: "no-store" }
  );

  const data = await res.json();
  return data.articles || [];
}

export default async function NewsPage() {
  const news = await getNews();

  return (
    <div className="p-6">
      <h1 className="text-5xl font-bold mb-4 text-white">
        Football News
      </h1>

      <p className="text-gray-400 mb-8">
        Latest football headlines from around the world.
      </p>

      <div className="grid gap-6">
        {news.map((article, index) => (
          <a
            key={index}
            href={article.url}
            target="_blank"
            className="bg-gray-900 p-6 rounded-xl border border-gray-800 block"
          >
            {article.urlToImage && (
              <img
                src={article.urlToImage}
                alt=""
                className="w-full h-64 object-cover rounded-lg mb-4"
              />
            )}

            <h2 className="text-2xl font-bold mb-3 text-white">
              {article.title}
            </h2>

            <p className="text-gray-400">
              {article.description}
            </p>

            <p className="text-gray-500 mt-4 text-sm">
              {new Date(article.publishedAt).toLocaleString()}
            </p>
          </a>
        ))}
      </div>
    </div>
  );
}