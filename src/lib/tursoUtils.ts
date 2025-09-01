import { turso } from "@/lib/utils";

// Cache key prefix for localStorage
const CACHE_PREFIX = 'turso_cache_';
const CACHE_TTL = 7 * 24 * 60 * 60 * 1000; // 1 week in ms

export async function useQuery(query: string, params?: any[]): Promise<any> {
  const cacheKey = `${CACHE_PREFIX}${btoa(query + JSON.stringify(params || []))}`;
  const cached = localStorage.getItem(cacheKey);
  if (cached) {
    try {
      const { data, timestamp } = JSON.parse(cached);
      if (Date.now() - timestamp < CACHE_TTL) {
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
  return result;
}

export default turso;
