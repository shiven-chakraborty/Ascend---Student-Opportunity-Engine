// Calendar event helpers — no OAuth required.
// Generates a Google Calendar "add event" URL and a downloadable .ics file.
// Architecture is ready for full OAuth: swap buildCalendarEvent for a backend
// function that calls the Google Calendar API once a connector is connected.

function pad(n) {
  return String(n).padStart(2, "0");
}

function allDayRange(dateStr) {
  const d = new Date(dateStr + "T00:00:00");
  const next = new Date(d);
  next.setDate(next.getDate() + 1);
  const fmt = (dt) => `${dt.getFullYear()}${pad(dt.getMonth() + 1)}${pad(dt.getDate())}`;
  return { start: fmt(d), end: fmt(next) };
}

function icsStamp() {
  const d = new Date();
  return `${d.getFullYear()}${pad(d.getMonth() + 1)}${pad(d.getDate())}T${pad(d.getHours())}${pad(d.getMinutes())}${pad(d.getSeconds())}Z`;
}

function slugify(s) {
  return s.replace(/[^a-z0-9]+/gi, "-").replace(/^-+|-+$/g, "").toLowerCase() || "event";
}

export function buildCalendarEvent({ title, date, description = "", location = "", url = "" }) {
  const { start, end } = allDayRange(date);
  const details = [description, url ? `Link: ${url}` : ""].filter(Boolean).join("\n");

  const googleUrl =
    "https://calendar.google.com/calendar/render?action=TEMPLATE" +
    `&text=${encodeURIComponent(title)}` +
    `&dates=${start}/${end}` +
    `&details=${encodeURIComponent(details)}` +
    `&location=${encodeURIComponent(location)}`;

  const ics = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Ascend//Deadline Alerts//EN",
    "CALSCALE:GREGORIAN",
    "BEGIN:VEVENT",
    `UID:ascend-${start}-${slugify(title)}@ascend.app`,
    `DTSTAMP:${icsStamp()}`,
    `DTSTART;VALUE=DATE:${start}`,
    `DTEND;VALUE=DATE:${end}`,
    `SUMMARY:${title}`,
    `DESCRIPTION:${details}`,
    `LOCATION:${location}`,
    "END:VEVENT",
    "END:VCALENDAR",
  ].join("\r\n");

  return { googleUrl, ics, filename: `${slugify(title)}.ics` };
}

export function downloadIcs(filename, icsContent) {
  const blob = new Blob([icsContent], { type: "text/calendar;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}