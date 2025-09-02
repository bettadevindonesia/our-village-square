import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Maps a database result to an array of objects.
 * If the result is not an object with columns and rows, or if the rows are not an array of arrays, an empty array is returned.
 * If the first row is not an array (i.e. it is an object), the rows are returned as-is.
 * Otherwise, the function maps each row to an object with keys from the columns array and values from the row.
 * @param result The database result.
 * @returns An array of objects.
 */
export function mapDatabaseResult<T = any>(result: { columns: string[], rows: any[][] } | any): T[] {
  if (!result || !Array.isArray(result.rows) || !Array.isArray(result.columns)) {
    return [];
  }

  if (result.rows.length > 0 && !Array.isArray(result.rows[0])) {
    return result.rows;
  }

  return result.rows.map(row => {
    if (!Array.isArray(row)) {
      return row;
    }
    return Object.fromEntries(
      row.map((value, idx) => {
        const key = result.columns[idx] || idx;
        return [key, value];
      })
    );
  });
}

export function slugify(text: string): string {
  // Convert to lowercase
  text = text.toLowerCase();

  // Replace accented characters with their non-accented equivalents
  const replacements = {
    'à': 'a', 'á': 'a', 'â': 'a', 'ä': 'a', 'æ': 'ae', 'ã': 'a', 'å': 'a',
    'ç': 'c', 'č': 'c',
    'è': 'e', 'é': 'e', 'ê': 'e', 'ë': 'e', 'ē': 'e', 'ė': 'e', 'ę': 'e',
    'ğ': 'g',
    'ḧ': 'h',
    'î': 'i', 'ï': 'i', 'í': 'i', 'ī': 'i', 'į': 'i', 'ì': 'i',
    'ł': 'l',
    'ḿ': 'm',
    'ñ': 'n', 'ń': 'n', 'ǹ': 'n', 'ň': 'n',
    'ô': 'o', 'ö': 'o', 'ò': 'o', 'ó': 'o', 'œ': 'oe', 'ø': 'o', 'ō': 'o', 'õ': 'o', 'ő': 'o',
    'ṕ': 'p',
    'ŕ': 'r', 'ř': 'r',
    'ß': 'ss', 'ś': 's', 'š': 's', 'ş': 's', 'ș': 's',
    'ť': 't', 'ț': 't',
    'û': 'u', 'ü': 'u', 'ù': 'u', 'ú': 'u', 'ū': 'u', 'ǘ': 'u', 'ů': 'u', 'ű': 'u', 'ų': 'u',
    'ẃ': 'w',
    'ẍ': 'x',
    'ÿ': 'y', 'ý': 'y',
    'ž': 'z', 'ź': 'z', 'ż': 'z'
  };

  for (const char in replacements) {
    text = text.replace(new RegExp(char, 'g'), replacements[char]);
  }

  // Remove non-alphanumeric characters (except spaces and hyphens)
  text = text.replace(/[^a-z0-9\s-]/g, '');

  // Replace spaces with hyphens
  text = text.replace(/\s+/g, '-');

  // Remove multiple consecutive hyphens
  text = text.replace(/-+/g, '-');

  // Trim leading/trailing hyphens
  text = text.replace(/^-+|-+$/g, '');

  return text;
}