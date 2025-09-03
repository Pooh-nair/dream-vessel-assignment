export function addDaysISO(dateISO: string, days: number): string {
  const d = new Date(dateISO);
  d.setUTCDate(d.getUTCDate() + days);
  return d.toISOString();
}

export function daysBetweenDates(fromISO: string, toISO: string): number {
  const from = new Date(fromISO);
  const to = new Date(toISO);
  const diffMs = to.getTime() - from.getTime();
  return Math.ceil(diffMs / (1000 * 60 * 60 * 24));
}

export function formatDateISOToYMD(iso: string): string {
  const d = new Date(iso);
  const yyyy = d.getUTCFullYear();
  const mm = String(d.getUTCMonth() + 1).padStart(2, "0");
  const dd = String(d.getUTCDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}
