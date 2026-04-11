export interface Pier {
  id: string
  name: string
  narrow: boolean  // tight approach, meeting risk
}

export interface PierLeg {
  from: string
  to: string
  distanceNm: number  // real navigational distance, NOT crow-fly
  transitMinutes: number  // typical transit time
}

export interface FerryLine {
  id: string
  name: string
  description: string
  piers: Pier[]
  legs: PierLeg[]
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

// ─── Linje 80: Nacka Strand ↔ Ropsten ↔ Mor Annas brygga ───
const LINE_80_PIERS: Pier[] = [
  { id: 'nacka',    name: 'Nacka Strand',     narrow: true },
  { id: 'saltsjok', name: 'Saltsjökvarn',     narrow: false },
  { id: 'henriksd', name: 'Henriksdal',       narrow: false },
  { id: 'barnang',  name: 'Barnängen',        narrow: false },
  { id: 'ropsten',  name: 'Ropsten',          narrow: false },
  { id: 'moranna',  name: 'Mor Annas brygga', narrow: false },
]

// Real navigational distances (manual, not crow-fly)
const LINE_80_LEGS: PierLeg[] = [
  { from: 'nacka',    to: 'saltsjok', distanceNm: 0.35, transitMinutes: 2 },
  { from: 'saltsjok', to: 'henriksd', distanceNm: 0.25, transitMinutes: 2 },
  { from: 'henriksd', to: 'barnang',  distanceNm: 0.6,  transitMinutes: 3 },
  { from: 'barnang',  to: 'ropsten',  distanceNm: 1.8,  transitMinutes: 5 },
  { from: 'ropsten',  to: 'moranna',  distanceNm: 0.4,  transitMinutes: 3 },
  // Return legs (same distance)
  { from: 'moranna',  to: 'ropsten',  distanceNm: 0.4,  transitMinutes: 3 },
  { from: 'ropsten',  to: 'barnang',  distanceNm: 1.8,  transitMinutes: 5 },
  { from: 'barnang',  to: 'henriksd', distanceNm: 0.6,  transitMinutes: 3 },
  { from: 'henriksd', to: 'saltsjok', distanceNm: 0.25, transitMinutes: 2 },
  { from: 'saltsjok', to: 'nacka',    distanceNm: 0.35, transitMinutes: 2 },
]

// ─── Linje 89: Nybroplan ↔ Nacka Strand (via Djurgården) ───
const LINE_89_PIERS: Pier[] = [
  { id: 'nybroplan', name: 'Nybroplan',      narrow: false },
  { id: 'djurgard',  name: 'Allmänna gränd', narrow: false },
  { id: 'blockhus',  name: 'Blockhusudden', narrow: false },
  { id: 'nacka89',   name: 'Nacka Strand',   narrow: true },
  { id: 'saltsjok89',name: 'Saltsjökvarn',   narrow: false },
]

const LINE_89_LEGS: PierLeg[] = [
  { from: 'nybroplan',  to: 'djurgard',   distanceNm: 0.9,  transitMinutes: 5 },
  { from: 'djurgard',   to: 'blockhus',   distanceNm: 0.8,  transitMinutes: 5 },
  { from: 'blockhus',   to: 'nacka89',    distanceNm: 1.5,  transitMinutes: 8 },
  { from: 'nacka89',    to: 'saltsjok89', distanceNm: 0.35, transitMinutes: 3 },
  // Return
  { from: 'saltsjok89', to: 'nacka89',    distanceNm: 0.35, transitMinutes: 3 },
  { from: 'nacka89',    to: 'blockhus',   distanceNm: 1.5,  transitMinutes: 8 },
  { from: 'blockhus',   to: 'djurgard',   distanceNm: 0.8,  transitMinutes: 5 },
  { from: 'djurgard',   to: 'nybroplan',  distanceNm: 0.9,  transitMinutes: 5 },
]

export const FERRY_LINES: FerryLine[] = [
  { id: 'L80', name: 'Linje 80', description: 'Nacka Strand – Ropsten – Mor Annas brygga', piers: LINE_80_PIERS, legs: LINE_80_LEGS },
  { id: 'L89', name: 'Linje 89', description: 'Nybroplan – Nacka Strand (Djurgården)', piers: LINE_89_PIERS, legs: LINE_89_LEGS },
]

// ─── Schedules ───

function fmt(h: number, m: number): string {
  const totalMin = h * 60 + m
  const hh = Math.floor(totalMin / 60) % 24
  const mm = totalMin % 60
  return `${String(hh).padStart(2, '0')}:${String(mm).padStart(2, '0')}`
}

function generateLine80Circuits(): Circuit[] {
  const circuits: Circuit[] = []
  const startTimes = [
    '06:20', '07:00', '07:40', '08:20', '09:00', '09:40',
    '10:30', '11:30', '12:30', '13:30', '14:30', '15:20',
    '16:00', '16:40', '17:20', '18:00', '18:40', '19:30',
  ]

  startTimes.forEach((start, i) => {
    const [sh, sm] = start.split(':').map(Number)
    const departures: CircuitDeparture[] = [
      // Outbound
      { pierId: 'nacka',    time: start },
      { pierId: 'saltsjok', time: fmt(sh, sm + 2) },
      { pierId: 'henriksd', time: fmt(sh, sm + 4) },
      { pierId: 'barnang',  time: fmt(sh, sm + 7) },
      { pierId: 'ropsten',  time: fmt(sh, sm + 12) },
      { pierId: 'moranna',  time: fmt(sh, sm + 15) },
      // Return
      { pierId: 'moranna',  time: fmt(sh, sm + 18) },
      { pierId: 'ropsten',  time: fmt(sh, sm + 21) },
      { pierId: 'barnang',  time: fmt(sh, sm + 26) },
      { pierId: 'henriksd', time: fmt(sh, sm + 29) },
      { pierId: 'saltsjok', time: fmt(sh, sm + 31) },
      { pierId: 'nacka',    time: fmt(sh, sm + 33) },
    ]
    circuits.push({
      id: `L80-${i + 1}`,
      label: `Omlopp ${i + 1}`,
      departures,
    })
  })

  return circuits
}

function generateLine89Circuits(): Circuit[] {
  const circuits: Circuit[] = []
  const startTimes = [
    '07:10', '08:10', '09:10', '10:30', '12:00',
    '14:00', '15:30', '16:30', '17:30', '18:30',
  ]

  startTimes.forEach((start, i) => {
    const [sh, sm] = start.split(':').map(Number)
    const departures: CircuitDeparture[] = [
      // Outbound
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
      label: `Omlopp ${i + 1}`,
      departures,
    })
  })

  return circuits
}

export const LINE_80_CIRCUITS = generateLine80Circuits()
export const LINE_89_CIRCUITS = generateLine89Circuits()

// ─── Meeting detection ───
// Find where two circuits from the same line are at the same pier within a time window
export interface Meeting {
  pierName: string
  myCircuitLabel: string
  myTime: string
  otherCircuitLabel: string
  otherTime: string
  isNarrow: boolean
}

export function findMeetings(
  _lineId: string,
  myCircuit: Circuit,
  allCircuits: Circuit[],
  piers: Pier[],
  windowMinutes: number = 5
): Meeting[] {
  const meetings: Meeting[] = []
  const seen = new Set<string>()

  for (const other of allCircuits) {
    if (other.id === myCircuit.id) continue

    for (const myDep of myCircuit.departures) {
      for (const otherDep of other.departures) {
        // Same pier (normalize id for cross-line)
        const myPierId = myDep.pierId.replace('89', '')
        const otherPierId = otherDep.pierId.replace('89', '')
        if (myPierId !== otherPierId) continue

        const myMin = parseTimeToMinutes(myDep.time)
        const otherMin = parseTimeToMinutes(otherDep.time)
        if (Math.abs(myMin - otherMin) > windowMinutes) continue

        const key = `${myDep.pierId}-${myDep.time}-${other.id}-${otherDep.time}`
        if (seen.has(key)) continue
        seen.add(key)

        const pier = piers.find(p => p.id === myDep.pierId || p.id === otherDep.pierId)
        if (!pier) continue

        meetings.push({
          pierName: pier.name,
          myCircuitLabel: myCircuit.label,
          myTime: myDep.time,
          otherCircuitLabel: other.label,
          otherTime: otherDep.time,
          isNarrow: pier.narrow,
        })
      }
    }
  }

  return meetings
}

export function parseTimeToMinutes(t: string): number {
  const [h, m] = t.split(':').map(Number)
  return h * 60 + m
}

export function getLegDistance(legs: PierLeg[], fromId: string, toId: string): number {
  const leg = legs.find(l => l.from === fromId && l.to === toId)
  return leg?.distanceNm ?? 0
}
