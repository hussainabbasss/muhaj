export interface ReligiousWindow {
  id: string;
  label: string;
  start: string;
  end: string;
}

export const RELIGIOUS_WINDOWS_2026: ReligiousWindow[] = [
  {
    id: "ashura",
    label: "Ashura Window (10 Muharram 1447 AH)",
    start: "2026-07-24",
    end: "2026-07-26",
  },
  {
    id: "arbaeen",
    label: "Arbaeen Window (20 Safar 1447 AH)",
    start: "2026-08-03",
    end: "2026-08-05",
  },
];

function parseDate(value: string): Date {
  const [year, month, day] = value.split("-").map(Number);
  return new Date(year, month - 1, day);
}

function rangesOverlap(
  tripStart: string,
  tripEnd: string,
  windowStart: string,
  windowEnd: string,
): boolean {
  const start = parseDate(tripStart);
  const end = parseDate(tripEnd);
  const wStart = parseDate(windowStart);
  const wEnd = parseDate(windowEnd);
  return start <= wEnd && end >= wStart;
}

export function detectPeakCrowd(
  outboundDate: string,
  returnDate: string,
): { isPeakCrowd: boolean; peakWindows: string[] } {
  const peakWindows = RELIGIOUS_WINDOWS_2026.filter((window) =>
    rangesOverlap(outboundDate, returnDate, window.start, window.end),
  ).map((window) => window.label);

  return {
    isPeakCrowd: peakWindows.length > 0,
    peakWindows,
  };
}
