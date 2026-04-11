export interface Pier {
  id: string
  name: string
  lat: number
  lon: number
  narrow: boolean  // tight approach, meeting risk
}

export interface FerryLine {
  id: string
  name: string
  color: string
  piers: Pier[]
}

export interface Circuit {
  id: string
  label: string
  departures: CircuitDeparture[]
}

export interface CircuitDeparture {
  pierId: string
  time: string  // HH:MM
}

// Linje 80: Nacka Strand – Ropsten – Mor Annas brygga
const LINE_80_PIERS: Pier[] = [
  { id: 'nacka',    name: 'Nacka Strand',    lat: 59.3190, lon: 18.1090, narrow: true },
  { id: 'saltsjok', name: 'Saltsjökvarn',    lat: 59.3175, lon: 18.1010, narrow: false },
  { id: 'henriksd', name: 'Henriksdal',      lat: 59.3160, lon: 18.0960, narrow: false },
  { id: 'barnang', name: 'Barnängen',        lat: 59.3140, lon: 18.0830, narrow: false },
  { id: 'ropsten',  name: 'Ropsten',         lat: 59.3565, lon: 18.1015, narrow: false },
  { id: 'moranna',  name: 'Mor Annas brygga',lat: 59.3600, lon: 18.1080, narrow: false },
]

// Linje 89: Nybroplan – Nacka Strand (via Djurgården)
const LINE_89_PIERS: Pier[] = [
  { id: 'nybroplan', name: 'Nybroplan',          lat: 59.3310, lon: 18.0770, narrow: false },
  { id: 'djurgard',  name: 'Allmänna gränd',     lat: 59.3245, lon: 18.0950, narrow: false },
  { id: 'blockhus',  name: 'Blockhusudden',      lat: 59.3270, lon: 18.1170, narrow: false },
  { id: 'nacka89',   name: 'Nacka Strand',       lat: 59.3190, lon: 18.1090, narrow: true },
  { id: 'saltsjok89',name: 'Saltsjökvarn',       lat: 59.3175, lon: 18.1010, narrow: false },
]

export const FERRY_LINES: FerryLine[] = [
  { id: 'L80', name: 'Linje 80', color: '#e8891c', piers: LINE_80_PIERS },
  { id: 'L89', name: 'Linje 89', color: '#3498db', piers: LINE_89_PIERS },
]

// Generate realistic circuit schedules
// Linje 80: ~12 min round-trip Nacka→Ropsten, runs every 20 min peak
function generateLine80Circuits(): Circuit[] {
  const circuits: Circuit[] = []

  // Omlopp 1-6 (early morning to evening)
  const startTimes = ['06:20', '07:00', '07:40', '08:20', '09:00', '09:40',
    '10:30', '11:30', '12:30', '13:30', '14:30', '15:20',
    '16:00', '16:40', '17:20', '18:00', '18:40', '19:30']

  startTimes.forEach((start, i) => {
    const [sh, sm] = start.split(':').map(Number)
    const departures: CircuitDeparture[] = [
      { pierId: 'nacka',    time: start },
      { pierId: 'saltsjok', time: fmt(sh, sm + 2) },
      { pierId: 'henriksd', time: fmt(sh, sm + 4) },
      { pierId: 'barnang',  time: fmt(sh, sm + 6) },
      { pierId: 'ropsten',  time: fmt(sh, sm + 10) },
      { pierId: 'moranna',  time: fmt(sh, sm + 13) },
      // Return
      { pierId: 'moranna',  time: fmt(sh, sm + 16) },
      { pierId: 'ropsten',  time: fmt(sh, sm + 19) },
      { pierId: 'barnang',  time: fmt(sh, sm + 23) },
      { pierId: 'henriksd', time: fmt(sh, sm + 25) },
      { pierId: 'saltsjok', time: fmt(sh, sm + 27) },
      { pierId: 'nacka',    time: fmt(sh, sm + 30) },
    ]
    circuits.push({
      id: `L80-${i + 1}`,
      label: `Omlopp ${i + 1} (avg. ${start})`,
      departures,
    })
  })

  return circuits
}

function generateLine89Circuits(): Circuit[] {
  const circuits: Circuit[] = []
  const startTimes = ['07:10', '08:10', '09:10', '10:30', '12:00',
    '14:00', '15:30', '16:30', '17:30', '18:30']

  startTimes.forEach((start, i) => {
    const [sh, sm] = start.split(':').map(Number)
    const departures: CircuitDeparture[] = [
      { pierId: 'nybroplan',  time: start },
      { pierId: 'djurgard',   time: fmt(sh, sm + 5) },
      { pierId: 'blockhus',   time: fmt(sh, sm + 10) },
      { pierId: 'nacka89',    time: fmt(sh, sm + 18) },
      { pierId: 'saltsjok89', time: fmt(sh, sm + 21) },
      // Return
      { pierId: 'saltsjok89', time: fmt(sh, sm + 25) },
      { pierId: 'nacka89',    time: fmt(sh, sm + 28) },
      { pierId: 'blockhus',   time: fmt(sh, sm + 36) },
      { pierId: 'djurgard',   time: fmt(sh, sm + 41) },
      { pierId: 'nybroplan',  time: fmt(sh, sm + 46) },
    ]
    circuits.push({
      id: `L89-${i + 1}`,
      label: `Omlopp ${i + 1} (avg. ${start})`,
      departures,
    })
  })

  return circuits
}

function fmt(h: number, m: number): string {
  const totalMin = h * 60 + m
  const hh = Math.floor(totalMin / 60) % 24
  const mm = totalMin % 60
  return `${String(hh).padStart(2, '0')}:${String(mm).padStart(2, '0')}`
}

export const LINE_80_CIRCUITS = generateLine80Circuits()
export const LINE_89_CIRCUITS = generateLine89Circuits()

// Other vessels for meeting prediction
export interface OtherVessel {
  name: string
  lineId: string
  circuitId: string
}

export const OTHER_VESSELS: OtherVessel[] = [
  { name: 'M/S Emelie', lineId: 'L80', circuitId: 'L80-2' },
  { name: 'M/S Gurli', lineId: 'L80', circuitId: 'L80-4' },
  { name: 'M/S Lisen', lineId: 'L89', circuitId: 'L89-1' },
]

// Calculate distance between two piers in nautical miles
export function pierDistance(a: Pier, b: Pier): number {
  const R = 3440.065 // Earth radius in nm
  const dLat = (b.lat - a.lat) * Math.PI / 180
  const dLon = (b.lon - a.lon) * Math.PI / 180
  const lat1 = a.lat * Math.PI / 180
  const lat2 = b.lat * Math.PI / 180
  const x = Math.sin(dLat / 2) ** 2 + Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLon / 2) ** 2
  return 2 * R * Math.asin(Math.sqrt(x))
}
