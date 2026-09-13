export function formatLongDate(isoDate: string): string {
  if (!isoDate) return "";
  const [year, month, day] = isoDate.split("-").map(Number);
  if (!year || !month || !day) return isoDate;
  const date = new Date(year, month - 1, day);
  return date.toLocaleDateString("en-GB", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export function formatShortDate(isoDate: string): string {
  if (!isoDate) return "";
  const [year, month, day] = isoDate.split("-").map(Number);
  if (!year || !month || !day) return isoDate;
  const date = new Date(year, month - 1, day);
  return date.toLocaleDateString("en-GB", {
    weekday: "short",
    day: "numeric",
    month: "short",
  });
}

export function formatTime12h(time: string): string {
  if (!time) return "";
  const [hourStr, minute] = time.split(":");
  const hour = Number(hourStr);
  if (Number.isNaN(hour)) return time;
  const suffix = hour >= 12 ? "pm" : "am";
  const hour12 = hour % 12 === 0 ? 12 : hour % 12;
  return minute === "00" ? `${hour12}${suffix}` : `${hour12}:${minute}${suffix}`;
}

export function sortByDateTime(a: { date: string; time: string }, b: { date: string; time: string }): number {
  const aKey = `${a.date}T${a.time}`;
  const bKey = `${b.date}T${b.time}`;
  return aKey.localeCompare(bKey);
}
