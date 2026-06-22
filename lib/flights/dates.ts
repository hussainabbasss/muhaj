export function formatDateISO(date: Date): string {
  return date.toISOString().slice(0, 10);
}

export function defaultOutboundDate(): string {
  const date = new Date();
  date.setDate(date.getDate() + 60);
  return formatDateISO(date);
}

export function defaultReturnDate(outboundDate?: string): string {
  const base = outboundDate ? new Date(`${outboundDate}T00:00:00`) : new Date();
  if (!outboundDate) {
    base.setDate(base.getDate() + 60);
  }
  base.setDate(base.getDate() + 8);
  return formatDateISO(base);
}

export function flightFetchKey(
  outboundDate: string,
  returnDate: string,
  destination: string,
  liteFare: boolean,
): string {
  return `${outboundDate}|${returnDate}|${destination}|${liteFare ? "lite" : "all"}`;
}

export function formatDuration(mins: number): string {
  const hours = Math.floor(mins / 60);
  const minutes = mins % 60;
  if (hours === 0) return `${minutes}m`;
  return minutes > 0 ? `${hours}h ${minutes}m` : `${hours}h`;
}
