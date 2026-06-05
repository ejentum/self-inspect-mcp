// Deterministic, zero-dependency CSV parser (RFC 4180-ish).
//
// Handles double-quoted fields, escaped quotes (""), and commas / CR / LF inside
// quotes. Returns an array of plain objects keyed by the header row. Used by the
// selector at runtime, by the generator, and by the tests, so parsing can never
// drift between surfaces.

export function parseCSV(text) {
  const records = [];
  let field = "";
  let record = [];
  let inQuotes = false;
  let i = 0;
  const pushField = () => {
    record.push(field);
    field = "";
  };
  const pushRecord = () => {
    records.push(record);
    record = [];
  };

  while (i < text.length) {
    const c = text[i];
    if (inQuotes) {
      if (c === '"') {
        if (text[i + 1] === '"') {
          field += '"';
          i += 2;
          continue;
        }
        inQuotes = false;
        i++;
        continue;
      }
      field += c;
      i++;
      continue;
    }
    if (c === '"') {
      inQuotes = true;
      i++;
      continue;
    }
    if (c === ",") {
      pushField();
      i++;
      continue;
    }
    if (c === "\r") {
      i++;
      continue;
    }
    if (c === "\n") {
      pushField();
      pushRecord();
      i++;
      continue;
    }
    field += c;
    i++;
  }
  // Flush trailing field/record if the file did not end with a newline.
  if (field.length > 0 || record.length > 0) {
    pushField();
    pushRecord();
  }

  if (records.length === 0) return [];
  const header = records[0];
  const out = [];
  for (let r = 1; r < records.length; r++) {
    const rec = records[r];
    // Skip blank lines.
    if (rec.length === 1 && rec[0] === "") continue;
    const obj = {};
    for (let c = 0; c < header.length; c++) {
      obj[header[c]] = rec[c] !== undefined ? rec[c] : "";
    }
    out.push(obj);
  }
  return out;
}
