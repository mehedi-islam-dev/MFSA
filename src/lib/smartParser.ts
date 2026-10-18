export interface ParsedRecord {
  species?: string;
  length?: number;
  weight?: number;
  [key: string]: string | number | undefined;
}

export interface ParseResult {
  records: ParsedRecord[];
  mappedColumns: {
    species?: string;
    length?: string;
    weight?: string;
  };
  errors: string[];
}

/**
 * Parses raw CSV/TSV text into an array of objects.
 * Handles basic quotes and commas inside quotes.
 */
function parseCSV(text: string): Record<string, string>[] {
  const lines = text.split(/\r?\n/).filter(line => line.trim() !== "");
  if (lines.length < 2) return [];

  const delimiter = text.includes("\t") ? "\t" : ",";
  
  // Basic CSV parser that respects quotes
  const splitLine = (line: string): string[] => {
    const result: string[] = [];
    let current = "";
    let inQuotes = false;
    for (let i = 0; i < line.length; i++) {
      const char = line[i];
      if (char === '"') {
        inQuotes = !inQuotes;
      } else if (char === delimiter && !inQuotes) {
        result.push(current.trim());
        current = "";
      } else {
        current += char;
      }
    }
    result.push(current.trim());
    return result.map(val => val.replace(/^"|"$/g, "").trim());
  };

  const headers = splitLine(lines[0]).map(h => h.toLowerCase());
  const data: Record<string, string>[] = [];

  for (let i = 1; i < lines.length; i++) {
    const values = splitLine(lines[i]);
    const record: Record<string, string> = {};
    headers.forEach((header, index) => {
      record[header] = values[index] || "";
    });
    data.push(record);
  }

  return data;
}

/**
 * Fuzzy matches headers to standard data fields.
 */
function fuzzyMapHeaders(headers: string[]) {
  const mapping: { species?: string; length?: string; weight?: string } = {};
  
  const speciesPatterns = ["species", "sp", "fish", "name", "taxa"];
  const lengthPatterns = ["length", "len", "l", "l (cm)", "tl", "sl"];
  const weightPatterns = ["weight", "wt", "w", "w (g)", "mass"];

  headers.forEach(originalHeader => {
    const header = originalHeader.toLowerCase().replace(/[^a-z]/g, "");
    
    if (!mapping.species && speciesPatterns.some(p => header.includes(p.replace(/[^a-z]/g, "")))) {
      mapping.species = originalHeader;
    } else if (!mapping.length && lengthPatterns.some(p => header.includes(p.replace(/[^a-z]/g, "")))) {
      mapping.length = originalHeader;
    } else if (!mapping.weight && weightPatterns.some(p => header.includes(p.replace(/[^a-z]/g, "")))) {
      mapping.weight = originalHeader;
    }
  });

  return mapping;
}

/**
 * Intelligently parses CSV text and auto-maps columns.
 */
export function smartParse(text: string): ParseResult {
  try {
    const rawData = parseCSV(text);
    if (rawData.length === 0) {
      return { records: [], mappedColumns: {}, errors: ["No valid data rows found."] };
    }

    const headers = Object.keys(rawData[0]);
    const mappedColumns = fuzzyMapHeaders(headers);
    
    const records: ParsedRecord[] = rawData.map(row => {
      const record: ParsedRecord = { ...row };
      
      if (mappedColumns.species) {
        record.species = row[mappedColumns.species];
      }
      
      if (mappedColumns.length) {
        const parsed = parseFloat(row[mappedColumns.length]);
        if (!isNaN(parsed)) record.length = parsed;
      }
      
      if (mappedColumns.weight) {
        const parsed = parseFloat(row[mappedColumns.weight]);
        if (!isNaN(parsed)) record.weight = parsed;
      }
      
      return record;
    });

    return { records, mappedColumns, errors: [] };
  } catch (error) {
    return { records: [], mappedColumns: {}, errors: ["Failed to parse file. Ensure it's valid CSV/TSV format."] };
  }
}
