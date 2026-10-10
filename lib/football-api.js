
const API_BASE = "https://v3.football.api-sports.io";

const CACHE_TTL = 60 * 1000;
const MIN_REQUEST_INTERVAL = 1000;

const cache = new Map();

let lastRequestTime = 0;
let requestQueue = Promise.resolve();

export async function fetchFootball(endpoint) {
  const apiKey = process.env.API_FOOTBALL_KEY;

  if (!apiKey) {
    throw new Error("API_FOOTBALL_KEY is missing from .env.local");
  }

  const normalizedEndpoint = endpoint.replace(/^\/+/, "");
  const url = `${API_BASE}/${normalizedEndpoint}`;

  const cached = cache.get(url);

  if (cached && Date.now() - cached.time < CACHE_TTL) {
    return cached.data;
  }

  const request = requestQueue.then(async () => {
    const cachedAgain = cache.get(url);

    if (cachedAgain && Date.now() - cachedAgain.time < CACHE_TTL) {
      return cachedAgain.data;
    }

    const wait = Math.max(
      0,
      MIN_REQUEST_INTERVAL - (Date.now() - lastRequestTime)
    );

    if (wait > 0) {
      await new Promise((resolve) => setTimeout(resolve, wait));
    }

    lastRequestTime = Date.now();

    const response = await fetch(url, {
      method: "GET",
      headers: {
        "x-apisports-key": apiKey,
      },
      cache: "no-store",
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(`API-Sports HTTP ${response.status}`);
    }

    if (data.errors && Object.keys(data.errors).length > 0) {
      console.error("API-Sports errors:", data.errors);
      throw new Error(JSON.stringify(data.errors));
    }

    cache.set(url, {
      time: Date.now(),
      data,
    });

    return data;
  });

  requestQueue = request.then(
    () => undefined,
    () => undefined
  );

  return request;
}
