import type { Position } from '@/types/marine'

// Simulated route: Gothenburg → Marstrand along Swedish west coast
export const ROUTE_WAYPOINTS: Position[] = [
  { lat: 57.6880, lon: 11.9340 },  // Göteborgs hamninlopp
  { lat: 57.6950, lon: 11.8900 },  // Rivö fjord
  { lat: 57.7100, lon: 11.8200 },  // Björkö
  { lat: 57.7300, lon: 11.7800 },  // Knippla
  { lat: 57.7500, lon: 11.7400 },  // Rörö
  { lat: 57.7700, lon: 11.7000 },  // Instö ränna
  { lat: 57.8100, lon: 11.6600 },  // Kalvsund
  { lat: 57.8500, lon: 11.6200 },  // Nordre älv
  { lat: 57.8800, lon: 11.5800 },  // Marstrand approach
  { lat: 57.8870, lon: 11.5840 },  // Marstrand hamn
]

export const HARBORS = [
  { name: 'Marstrand', lat: 57.887, lon: 11.584, vhf: 'Ch 16/12', status: 'open' as const },
  { name: 'Göteborg', lat: 57.688, lon: 11.934, vhf: 'Ch 16/14', status: 'open' as const },
  { name: 'Kungälv', lat: 57.871, lon: 11.973, vhf: 'Ch 16', status: 'restricted' as const },
]

// Jitter helper for realistic instrument readings
export function jitter(base: number, amount: number): number {
  return base + (Math.random() - 0.5) * 2 * amount
}

// Interpolate between two positions
export function interpolatePosition(a: Position, b: Position, t: number): Position {
  return {
    lat: a.lat + (b.lat - a.lat) * t,
    lon: a.lon + (b.lon - a.lon) * t,
  }
}

// Calculate bearing between two points
export function bearing(from: Position, to: Position): number {
  const dLon = ((to.lon - from.lon) * Math.PI) / 180
  const lat1 = (from.lat * Math.PI) / 180
  const lat2 = (to.lat * Math.PI) / 180
  const y = Math.sin(dLon) * Math.cos(lat2)
  const x = Math.cos(lat1) * Math.sin(lat2) - Math.sin(lat1) * Math.cos(lat2) * Math.cos(dLon)
  return ((Math.atan2(y, x) * 180) / Math.PI + 360) % 360
}
