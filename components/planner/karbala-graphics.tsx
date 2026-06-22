"use client";

import { useId } from "react";

export function KarbalaShrineSilhouette({ className = "" }: { className?: string }) {
  const uid = useId().replace(/:/g, "");

  return (
    <svg
      viewBox="0 0 480 280"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden
      role="img"
    >
      <title>Imam Husayn Shrine, Karbala</title>

      {/* Plaza */}
      <ellipse cx="240" cy="268" rx="210" ry="10" fill={`url(#${uid}-plaza)`} />

      {/* Left outer minaret (Al-Hadba style) */}
      <g>
        <rect x="44" y="88" width="28" height="168" fill={`url(#${uid}-minaretBody)`} rx="1" />
        {/* Muqarnas balcony tiers */}
        <path d="M40 88 L76 88 L72 98 L44 98 Z" fill={`url(#${uid}-minaretGold)`} />
        <rect x="42" y="130" width="32" height="6" fill={`url(#${uid}-minaretGold)`} rx="1" />
        <rect x="42" y="168" width="32" height="6" fill={`url(#${uid}-minaretGold)`} rx="1" />
        {/* Spire */}
        <rect x="54" y="52" width="8" height="38" fill={`url(#${uid}-minaretGold)`} />
        <path d="M58 38 L66 52 L50 52 Z" fill="#f0d060" />
        <circle cx="58" cy="36" r="5" fill="#ffe566" />
        {/* Tile bands on minaret */}
        <rect x="46" y="108" width="24" height="4" fill="#1a8a7a" opacity="0.7" />
        <rect x="46" y="148" width="24" height="4" fill="#1a8a7a" opacity="0.7" />
        <rect x="46" y="188" width="24" height="4" fill="#1a8a7a" opacity="0.7" />
      </g>

      {/* Right outer minaret */}
      <g transform="translate(408, 0) scale(-1, 1)">
        <rect x="44" y="88" width="28" height="168" fill={`url(#${uid}-minaretBody)`} rx="1" />
        <path d="M40 88 L76 88 L72 98 L44 98 Z" fill={`url(#${uid}-minaretGold)`} />
        <rect x="42" y="130" width="32" height="6" fill={`url(#${uid}-minaretGold)`} rx="1" />
        <rect x="42" y="168" width="32" height="6" fill={`url(#${uid}-minaretGold)`} rx="1" />
        <rect x="54" y="52" width="8" height="38" fill={`url(#${uid}-minaretGold)`} />
        <path d="M58 38 L66 52 L50 52 Z" fill="#f0d060" />
        <circle cx="58" cy="36" r="5" fill="#ffe566" />
        <rect x="46" y="108" width="24" height="4" fill="#1a8a7a" opacity="0.7" />
        <rect x="46" y="148" width="24" height="4" fill="#1a8a7a" opacity="0.7" />
        <rect x="46" y="188" width="24" height="4" fill="#1a8a7a" opacity="0.7" />
      </g>

      {/* Inner left minaret (closer to dome) */}
      <rect x="108" y="108" width="18" height="148" fill={`url(#${uid}-minaretBody)`} rx="1" />
      <rect x="104" y="108" width="26" height="8" fill={`url(#${uid}-minaretGold)`} rx="1" />
      <rect x="112" y="72" width="10" height="38" fill={`url(#${uid}-minaretGold)`} />
      <path d="M117 60 L125 72 L109 72 Z" fill="#f0d060" />
      <circle cx="117" cy="58" r="4" fill="#ffe566" />

      {/* Inner right minaret */}
      <rect x="354" y="108" width="18" height="148" fill={`url(#${uid}-minaretBody)`} rx="1" />
      <rect x="350" y="108" width="26" height="8" fill={`url(#${uid}-minaretGold)`} rx="1" />
      <rect x="358" y="72" width="10" height="38" fill={`url(#${uid}-minaretGold)`} />
      <path d="M363 60 L371 72 L355 72 Z" fill="#f0d060" />
      <circle cx="363" cy="58" r="4" fill="#ffe566" />

      {/* Main shrine building — tile facade */}
      <rect x="88" y="188" width="304" height="72" fill={`url(#${uid}-facadeBase)`} />
      <rect x="88" y="188" width="304" height="72" fill={`url(#${uid}-tilePattern)`} opacity="0.85" />

      {/* Iwan arches — Bab al-Qibla style triple arcade */}
      <path
        d="M128 260 L128 210 Q152 188 176 210 L176 260 Z"
        fill="#0a3d35"
        stroke="#c9a227"
        strokeWidth="2"
      />
      <path
        d="M208 260 L208 198 Q240 168 272 198 L272 260 Z"
        fill="#082e28"
        stroke="#d4af37"
        strokeWidth="2.5"
      />
      <path
        d="M304 260 L304 210 Q328 188 352 210 L352 260 Z"
        fill="#0a3d35"
        stroke="#c9a227"
        strokeWidth="2"
      />

      {/* Gold lattice hint on central arch */}
      <rect x="222" y="218" width="36" height="42" rx="2" fill="none" stroke="#d4af37" strokeWidth="1.5" opacity="0.6" />
      <path d="M222 230 H258 M222 242 H258 M222 254 H258 M234 218 V260 M246 218 V260" stroke="#d4af37" strokeWidth="0.8" opacity="0.45" />

      {/* Upper tile band below dome drum */}
      <rect x="98" y="178" width="284" height="14" fill={`url(#${uid}-tileBand)`} />
      <rect x="98" y="178" width="284" height="4" fill="#d4af37" opacity="0.5" />

      {/* Dome drum (cylinder) with windows */}
      <rect x="148" y="138" width="184" height="42" fill={`url(#${uid}-drum)`} />
      {[168, 200, 232, 264, 296].map((x) => (
        <rect key={x} x={x} y="146" width="12" height="26" rx="6" fill="#0a2e26" stroke="#c9a227" strokeWidth="1" opacity="0.9" />
      ))}

      {/* Main golden dome — bulb profile like real shrine */}
      <path
        d="M148 138
           C148 80, 190 42, 240 38
           C290 42, 332 80, 332 138
           L148 138 Z"
        fill={`url(#${uid}-domeMain)`}
      />
      {/* Dome highlight */}
      <path
        d="M175 130
           C185 75, 215 52, 240 50
           C265 52, 295 75, 305 130
           Z"
        fill={`url(#${uid}-domeHighlight)`}
        opacity="0.55"
      />
      {/* Dome rib lines */}
      <path d="M240 38 Q210 90 175 135" stroke="#a88620" strokeWidth="0.8" opacity="0.35" fill="none" />
      <path d="M240 38 Q240 90 240 135" stroke="#a88620" strokeWidth="0.8" opacity="0.25" fill="none" />
      <path d="M240 38 Q270 90 305 135" stroke="#a88620" strokeWidth="0.8" opacity="0.35" fill="none" />

      {/* Finial — crescent and sphere */}
      <line x1="240" y1="38" x2="240" y2="22" stroke="#d4af37" strokeWidth="2" />
      <circle cx="240" cy="18" r="4" fill="#ffe566" />
      <path
        d="M240 12 Q248 8 240 4 Q232 8 240 12"
        fill="#ffe566"
        stroke="#d4af37"
        strokeWidth="0.5"
      />

      {/* Small flanking domes (characteristic of the ha'ir complex) */}
      <ellipse cx="118" cy="172" rx="22" ry="14" fill={`url(#${uid}-smallDome)`} />
      <ellipse cx="362" cy="172" rx="22" ry="14" fill={`url(#${uid}-smallDome)`} />

      <defs>
        <linearGradient id={`${uid}-plaza`} x1="30" y1="268" x2="450" y2="268" gradientUnits="userSpaceOnUse">
          <stop stopColor="#c9a227" stopOpacity="0" />
          <stop offset="0.5" stopColor="#c9a227" stopOpacity="0.2" />
          <stop offset="1" stopColor="#c9a227" stopOpacity="0" />
        </linearGradient>

        <linearGradient id={`${uid}-domeMain`} x1="148" y1="38" x2="332" y2="138" gradientUnits="userSpaceOnUse">
          <stop stopColor="#ffe566" />
          <stop offset="0.35" stopColor="#e8c547" />
          <stop offset="0.7" stopColor="#c9a227" />
          <stop offset="1" stopColor="#9a7a18" />
        </linearGradient>

        <linearGradient id={`${uid}-domeHighlight`} x1="240" y1="50" x2="240" y2="130" gradientUnits="userSpaceOnUse">
          <stop stopColor="#fff8dc" stopOpacity="0.7" />
          <stop offset="1" stopColor="#fff8dc" stopOpacity="0" />
        </linearGradient>

        <linearGradient id={`${uid}-smallDome`} x1="0" y1="0" x2="0" y2="1">
          <stop stopColor="#e8c547" />
          <stop offset="1" stopColor="#b8922a" />
        </linearGradient>

        <linearGradient id={`${uid}-minaretBody`} x1="0" y1="88" x2="0" y2="256" gradientUnits="userSpaceOnUse">
          <stop stopColor="#1a7a68" />
          <stop offset="0.5" stopColor="#145c4a" />
          <stop offset="1" stopColor="#0a3d35" />
        </linearGradient>

        <linearGradient id={`${uid}-minaretGold`} x1="0" y1="0" x2="0" y2="1">
          <stop stopColor="#f0d060" />
          <stop offset="1" stopColor="#c9a227" />
        </linearGradient>

        <linearGradient id={`${uid}-facadeBase`} x1="88" y1="188" x2="392" y2="260" gradientUnits="userSpaceOnUse">
          <stop stopColor="#1a8a7a" />
          <stop offset="0.5" stopColor="#145c4a" />
          <stop offset="1" stopColor="#0a3d35" />
        </linearGradient>

        <linearGradient id={`${uid}-drum`} x1="148" y1="138" x2="332" y2="180" gradientUnits="userSpaceOnUse">
          <stop stopColor="#1a7a68" />
          <stop offset="1" stopColor="#0d4a3e" />
        </linearGradient>

        <pattern id={`${uid}-tilePattern`} width="16" height="16" patternUnits="userSpaceOnUse">
          <rect width="16" height="16" fill="#145c4a" />
          <path d="M0 0 L8 8 L0 16" fill="none" stroke="#1a8a7a" strokeWidth="0.5" opacity="0.6" />
          <path d="M16 0 L8 8 L16 16" fill="none" stroke="#1a8a7a" strokeWidth="0.5" opacity="0.6" />
          <circle cx="8" cy="8" r="1.5" fill="#c9a227" opacity="0.35" />
        </pattern>

        <pattern id={`${uid}-tileBand`} width="20" height="14" patternUnits="userSpaceOnUse">
          <rect width="20" height="14" fill="#1a7a68" />
          <rect x="0" y="0" width="10" height="7" fill="#c9a227" opacity="0.25" />
          <rect x="10" y="7" width="10" height="7" fill="#c9a227" opacity="0.25" />
          <path d="M0 7 H20" stroke="#d4af37" strokeWidth="0.5" opacity="0.4" />
        </pattern>
      </defs>
    </svg>
  );
}

/** Minimalist line-art shrine for sidebar branding */
export function ShrineLineArt({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 200 120"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden
      role="img"
    >
      <title>Shrine line art</title>
      <line x1="28" y1="108" x2="28" y2="42" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
      <line x1="22" y1="42" x2="34" y2="42" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
      <path d="M28 36 L32 42 L24 42 Z" stroke="currentColor" strokeWidth="1" fill="none" />
      <line x1="20" y1="68" x2="36" y2="68" stroke="currentColor" strokeWidth="0.8" strokeOpacity="0.6" />
      <line x1="172" y1="108" x2="172" y2="42" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
      <line x1="166" y1="42" x2="178" y2="42" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
      <path d="M172 36 L176 42 L168 42 Z" stroke="currentColor" strokeWidth="1" fill="none" />
      <line x1="164" y1="68" x2="180" y2="68" stroke="currentColor" strokeWidth="0.8" strokeOpacity="0.6" />
      <path
        d="M60 78 C60 48, 85 28, 100 26 C115 28, 140 48, 140 78"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
      />
      <line x1="58" y1="78" x2="142" y2="78" stroke="currentColor" strokeWidth="1" strokeOpacity="0.7" />
      <path
        d="M82 108 L82 86 Q100 68 118 86 L118 108"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinejoin="round"
      />
      <path d="M62 108 L62 92 Q72 82 82 92" stroke="currentColor" strokeWidth="0.9" strokeOpacity="0.55" />
      <path d="M138 108 L138 92 Q128 82 118 92" stroke="currentColor" strokeWidth="0.9" strokeOpacity="0.55" />
      <line x1="40" y1="108" x2="160" y2="108" stroke="currentColor" strokeWidth="0.8" strokeOpacity="0.4" />
      <line x1="100" y1="26" x2="100" y2="16" stroke="currentColor" strokeWidth="1" />
      <circle cx="100" cy="14" r="2" stroke="currentColor" strokeWidth="0.8" fill="none" />
    </svg>
  );
}

export function GeometricBorder({ className = "" }: { className?: string }) {
  const uid = useId().replace(/:/g, "");

  return (
    <svg
      viewBox="0 0 320 12"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden
      preserveAspectRatio="none"
    >
      <pattern id={`${uid}-geoBorder`} width="20" height="12" patternUnits="userSpaceOnUse">
        <path d="M10 0 L12 6 L10 12 L8 6 Z" fill="#c9a227" opacity="0.5" />
        <circle cx="10" cy="6" r="1.5" fill="#c9a227" opacity="0.8" />
      </pattern>
      <rect width="320" height="12" fill={`url(#${uid}-geoBorder)`} />
    </svg>
  );
}

export function KarbalaStar({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden>
      <path d="M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.4L12 17l-6.2 4.3 2.4-7.4L2 9.4h7.6z" opacity="0.9" />
    </svg>
  );
}
