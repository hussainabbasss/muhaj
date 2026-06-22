import type { PillarKey } from "@/lib/types";

const iconClass = "h-5 w-5";

export function PillarIcon({ pillar }: { pillar: PillarKey }) {
  switch (pillar) {
    case "flight":
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" className={iconClass}>
          <path d="M2 12h5l2-7 4 14 2-7h7" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );
    case "visa":
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" className={iconClass}>
          <rect x="3" y="5" width="18" height="14" rx="2" />
          <path d="M7 10h10M7 14h6" strokeLinecap="round" />
        </svg>
      );
    case "accommodation":
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" className={iconClass}>
          <path d="M3 10l9-7 9 7v10H3V10z" strokeLinejoin="round" />
          <path d="M9 20v-6h6v6" />
        </svg>
      );
    case "food":
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" className={iconClass}>
          <path d="M6 3v8M10 3v8M6 7h4" strokeLinecap="round" />
          <path d="M14 3v5c0 2 2 3 2 5v9M18 3v5c0 2-2 3-2 5" strokeLinecap="round" />
        </svg>
      );
    case "transit":
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" className={iconClass}>
          <rect x="4" y="6" width="16" height="12" rx="2" />
          <path d="M4 12h16M8 18v2M16 18v2" strokeLinecap="round" />
          <circle cx="8" cy="16" r="1" fill="currentColor" />
          <circle cx="16" cy="16" r="1" fill="currentColor" />
        </svg>
      );
  }
}
