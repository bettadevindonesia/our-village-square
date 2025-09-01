import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { createClient } from "@libsql/client";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const turso = createClient({
  url: import.meta.env.VITE_DB_URL,
  authToken: import.meta.env.VITE_DB_ROA_TOKEN,
});

export function mapDatabaseResult(result: { columns: string[], rows: any[][] }) {
  return result.rows.map(row =>
    Object.fromEntries(row.map((value, idx) => [result.columns[idx], value]))
  );
}