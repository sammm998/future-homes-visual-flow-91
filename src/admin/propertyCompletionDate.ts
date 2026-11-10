/** Convert a typed completion month/date to the database's full ISO date. */
export function propertyCompletionDate(value: string): string | null {
  const input = value.trim();
  if (!input) return null;
  const monthFirst = input.match(/^(\d{1,2})[/.](\d{4})$/);
  const normalized = monthFirst ? `${monthFirst[2]}-${monthFirst[1].padStart(2, "0")}` : input;
  const match = normalized.match(/^(\d{4})-(\d{2})(?:-(\d{2}))?$/);
  if (!match) throw new Error("Enter a completion month as YYYY-MM or a date as YYYY-MM-DD.");
  const year = Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3] ?? "1");
  const date = new Date(0);
  date.setUTCFullYear(year, month - 1, day);
  if (year < 1 || date.getUTCFullYear() !== year || date.getUTCMonth() !== month - 1 || date.getUTCDate() !== day) {
    throw new Error("Enter a valid completion month or date.");
  }
  return `${match[1]}-${match[2]}-${String(day).padStart(2, "0")}`;
}