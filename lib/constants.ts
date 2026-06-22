export const PKR_PER_USD = 278;

export const VISA_FEE_USD = 80;

export const BAGGAGE_FEE_USD = 35;

export const DEFAULT_TRIP_DAYS = 8;

export interface FlightOption {
  id: string;
  airline: string;
  route: string;
  priceUsd: number;
  departure: string;
  notes?: string;
}

export interface LocationEntry {
  id: string;
  name: string;
  address: string;
  contact: string;
  lat: number;
  lng: number;
}

export interface TransitRoute {
  id: string;
  label: string;
  transportType: "coaster" | "gara";
  fareUsd: number;
  fareIqd: number;
}

export interface FoodSpot {
  id: string;
  name: string;
  specialty: string;
  lat: number;
  lng: number;
  near: string;
}

export const CACHED_FLIGHTS: FlightOption[] = [
  {
    id: "air-arabia-khi-njf",
    airline: "Air Arabia",
    route: "Karachi → Sharjah → Najaf (2-way)",
    priceUsd: 420,
    departure: "2026-07-12",
    notes: "Via Sharjah hub, budget carrier routing",
  },
  {
    id: "flydubai-khi-dxb-njf",
    airline: "Flydubai",
    route: "Karachi → Dubai → Najaf (2-way)",
    priceUsd: 465,
    departure: "2026-07-14",
    notes: "Multi-city split leg option",
  },
  {
    id: "gulf-air-khi-bgw",
    airline: "Gulf Air",
    route: "Karachi → Baghdad (2-way)",
    priceUsd: 510,
    departure: "2026-07-10",
    notes: "Direct to Baghdad, onward by coaster",
  },
];

export const HUSSEINIYA_LOCATIONS: LocationEntry[] = [
  {
    id: "husseiniya-karbala-1",
    name: "Madinat al-Zairin — Karbala",
    address: "Near Imam Husayn Shrine, Karbala",
    contact: "+964 780 123 4567",
    lat: 32.616,
    lng: 44.024,
  },
  {
    id: "husseiniya-najaf-1",
    name: "Ataba Pilgrim Hall — Najaf",
    address: "Bab al-Taqwa Street, Najaf",
    contact: "+964 780 234 5678",
    lat: 32.0,
    lng: 44.341,
  },
  {
    id: "husseiniya-kazmain-1",
    name: "Communal Mawkib — Kazmain",
    address: "Near Imam Musa al-Kadhim Shrine",
    contact: "+964 780 345 6789",
    lat: 33.381,
    lng: 44.081,
  },
];

export const FOOD_SPOTS: FoodSpot[] = [
  {
    id: "food-karbala-falafel",
    name: "Bab al-Qibla Falafel Stand",
    specialty: "Falafel & chai",
    lat: 32.6158,
    lng: 44.0239,
    near: "Imam Husayn Shrine — Bab al-Qibla gate",
  },
  {
    id: "food-karbala-shawarma",
    name: "Shrine Perimeter Shawarma",
    specialty: "Shawarma wraps",
    lat: 32.6165,
    lng: 44.0251,
    near: "Outer ring road, Karbala Haram",
  },
  {
    id: "food-najaf-kahi",
    name: "Old City Kahi Cart",
    specialty: "Kahi & qaymar breakfast",
    lat: 32.0012,
    lng: 44.3405,
    near: "Najaf old bazaar entrance",
  },
];

export const TRANSIT_ROUTES: TransitRoute[] = [
  {
    id: "najaf-karbala",
    label: "Najaf → Karbala",
    transportType: "coaster",
    fareUsd: 8,
    fareIqd: 10000,
  },
  {
    id: "karbala-kazmain",
    label: "Karbala → Kazmain",
    transportType: "gara",
    fareUsd: 12,
    fareIqd: 15000,
  },
  {
    id: "karbala-samarra",
    label: "Karbala → Samarra",
    transportType: "coaster",
    fareUsd: 18,
    fareIqd: 22000,
  },
  {
    id: "kazmain-samarra",
    label: "Kazmain → Samarra",
    transportType: "gara",
    fareUsd: 15,
    fareIqd: 18000,
  },
];

export const VISA_DOCUMENTS = [
  "Valid passport (6+ months validity)",
  "Passport-size photograph (white background)",
  "Confirmed return flight itinerary",
  "Hotel or accommodation address in Iraq",
  "Completed e-visa application form",
];

export const PILLAR_LABELS: Record<
  import("./types").PillarKey,
  string
> = {
  flight: "Flight Cost Monitor",
  visa: "Official E-Visa Fee",
  accommodation: "Accommodations & Lodging",
  food: "Food & Chai Budget",
  transit: "Inter-City Public Transit",
};

export function mapsLink(lat: number, lng: number): string {
  return `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`;
}
