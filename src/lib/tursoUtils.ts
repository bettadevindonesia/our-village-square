import { createClient } from "@libsql/client";

const turso = createClient({
  url: import.meta.env.VITE_DB_URL,
  authToken: import.meta.env.VITE_DB_ROA_TOKEN,
});

function day2ms(days: number): number {
  return days * 24 * 60 * 60 * 1000;
}

// Cache key prefix for localStorage
const CACHE_PREFIX = 'turso_cache_';
var CACHE_TTL = day2ms(7);

export async function useQuery<T = any>(query: string, params?: any[], ttl: number | null = null): Promise<T> {
  const cacheKey = `${CACHE_PREFIX}${btoa(query + JSON.stringify(params || []))}`;
  const cached = localStorage.getItem(cacheKey);
  if (cached) {
    try {
      const { data, timestamp } = JSON.parse(cached);
      if (Date.now() - timestamp < (day2ms(ttl) || CACHE_TTL)) {
        return data;
      }
    } catch (e) {
      // Ignore parse errors, fetch fresh
    }
  }

  // Fetch fresh data from Turso
  const result = await turso.execute(query, params);
  localStorage.setItem(
    cacheKey,
    JSON.stringify({ data: result, timestamp: Date.now() })
  );
  return result as T;
}
