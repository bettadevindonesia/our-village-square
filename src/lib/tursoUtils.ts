import { createClient } from "@libsql/client";

const turso = createClient({
  url: import.meta.env.VITE_DB_URL,
  authToken: import.meta.env.VITE_DB_ROA_TOKEN,
});

/**
 * Converts days to milliseconds.
 *
 * @param {number} days - The number of days to convert
 * @returns {number} The number of milliseconds equivalent to the input days
 */
function day2ms(days: number): number {
  return days * 24 * 60 * 60 * 1000;
}

// Cache key prefix for localStorage
const CACHE_PREFIX = "turso_cache_";
var CACHE_TTL = day2ms(7);

/**
 * Execute a query against the Turso database and cache the result.
 *
 * The query result is cached for the specified `ttl` (time to live) in milliseconds
 * in the browser's local storage. If `ttl` is not specified, the cache will expire
 * after 7 days.
 *
 * @param {string} query - The SQL query to execute
 * @param {any[]} [params] - Parameters to pass to the query
 * @param {number|null} [ttl] - Time to live in milliseconds (defaults to 7 days)
 * @returns {Promise<T>} The query result
 */
export async function useQuery<T = any>(
  query: string,
  params?: any[],
  ttl: number | null = null
): Promise<T> {
  const cacheKey = `${CACHE_PREFIX}${btoa(
    query + JSON.stringify(params || [])
  )}`;
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

/**
 * Execute a query against the Turso database, bypassing the cache.
 *
 * Unlike `useQuery`, this function always fetches fresh data from the database
 * and ignores any existing cache. The result is then cached for the specified
 * `ttl` (time to live) in milliseconds.
 *
 * @param {string} query - The SQL query to execute
 * @param {any[]} [params] - Parameters to pass to the query
 * @returns {Promise<T>} The query result
 */
export async function useFreshQuery<T = any>(
  query: string,
  params?: any[]
): Promise<T> {
  const cacheKey = `${CACHE_PREFIX}${btoa(
    query + JSON.stringify(params || [])
  )}`;
  localStorage.removeItem(cacheKey);

  // Fetch fresh data from Turso
  const result = await turso.execute(query, params);
  localStorage.setItem(
    cacheKey,
    JSON.stringify({ data: result, timestamp: Date.now() })
  );
  return result as T;
}

/**
 * Invalidates the cache for the specified query and parameters.
 *
 * This function removes the cache entry for the specified query and parameters,
 * forcing the next call to `useQuery` to fetch fresh data from the database.
 *
 * @param {string} query - The SQL query to invalidate
 * @param {any[]} [params] - Parameters to pass to the query
 * @returns {Promise<void>} A promise that resolves when the cache entry has been removed
 */
export async function invalidateCache(query: string, params?: any[]): Promise<void> {
  const cacheKey = `${CACHE_PREFIX}${btoa(
    query + JSON.stringify(params || [])
  )}`;
  localStorage.removeItem(cacheKey);
}
