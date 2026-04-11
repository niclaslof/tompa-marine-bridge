import type { SeasonConfig } from '@/types/marine'

// ─── Season support ─────────────────────────────────
export const SEASONS: SeasonConfig[] = [
  { id: 'spring', label: 'Vårtidtabell',    fromMonth: 3,  toMonth: 5 },
  { id: 'summer', label: 'Sommartidtabell',  fromMonth: 6,  toMonth: 8 },
  { id: 'autumn', label: 'Hösttidtabell',   fromMonth: 9,  toMonth: 11 },
  { id: 'winter', label: 'Vintertidtabell',  fromMonth: 12, toMonth: 2 },
]

export function getCurrentSeason(): SeasonConfig {
  const month = new Date().getMonth() + 1
  return SEASONS.find(s => {
    if (s.fromMonth <= s.toMonth) return month >= s.fromMonth && month <= s.toMonth
    return month >= s.fromMonth || month <= s.toMonth // winter wraps
  }) || SEASONS[0]
}

// ─── Pier definitions ────────────────────────────────

export interface Pier {
  id: string
  name: string
  narrow: boolean
}

export interface PierLeg {
  from: string
  to: string
  distanceNm: number
  transitMinutes: number
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
  startTime: string  // first departure HH:MM
  departures: CircuitDeparture[]
}

export interface CircuitDeparture {
  pierId: string
  time: string
}

// ─── Pier mapping: same physical pier across lines ───
// Used for cross-line meeting detection
const PIER_ALIASES: Record<string, string> = {
  nacka89: 'nacka',
  saltsjok89: 'saltsjok',
}

export function normalizePierId(id: string): string {
  return PIER_ALIASES[id] ?? id
}

// ─── Linje 80 ────────────────────────────────────────
const LINE_80_PIERS: Pier[] = [
  { id: 'nacka',    name: 'Nacka Strand',     narrow: true },
  { id: 'saltsjok', name: 'Saltsjökvarn',     narrow: false },
  { id: 'henriksd', name: 'Henriksdal',       narrow: false },
  { id: 'barnang',  name: 'Barnängen',        narrow: false },
  { id: 'ropsten',  name: 'Ropsten',          narrow: false },
  { id: 'moranna',  name: 'Mor Annas brygga', narrow: false },
]

const LINE_80_LEGS: PierLeg[] = [
  { from: 'nacka',    to: 'saltsjok', distanceNm: 0.35, transitMinutes: 2 },
  { from: 'saltsjok', to: 'henriksd', distanceNm: 0.25, transitMinutes: 2 },
  { from: 'henriksd', to: 'barnang',  distanceNm: 0.6,  transitMinutes: 3 },
  { from: 'barnang',  to: 'ropsten',  distanceNm: 1.8,  transitMinutes: 5 },
  { from: 'ropsten',  to: 'moranna',  distanceNm: 0.4,  transitMinutes: 3 },
  { from: 'moranna',  to: 'ropsten',  distanceNm: 0.4,  transitMinutes: 3 },
  { from: 'ropsten',  to: 'barnang',  distanceNm: 1.8,  transitMinutes: 5 },
  { from: 'barnang',  to: 'henriksd', distanceNm: 0.6,  transitMinutes: 3 },
  { from: 'henriksd', to: 'saltsjok', distanceNm: 0.25, transitMinutes: 2 },
  { from: 'saltsjok', to: 'nacka',    distanceNm: 0.35, transitMinutes: 2 },
]

// ─── Linje 89 ────────────────────────────────────────
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
  { from: 'saltsjok89', to: 'nacka89',    distanceNm: 0.35, transitMinutes: 3 },
  { from: 'nacka89',    to: 'blockhus',   distanceNm: 1.5,  transitMinutes: 8 },
  { from: 'blockhus',   to: 'djurgard',   distanceNm: 0.8,  transitMinutes: 5 },
  { from: 'djurgard',   to: 'nybroplan',  distanceNm: 0.9,  transitMinutes: 5 },
]

export const FERRY_LINES: FerryLine[] = [
  { id: 'L80', name: 'Linje 80', description: 'Nacka Strand – Ropsten – Mor Annas brygga', piers: LINE_80_PIERS, legs: LINE_80_LEGS },
  { id: 'L89', name: 'Linje 89', description: 'Nybroplan – Nacka Strand (Djurgården)', piers: LINE_89_PIERS, legs: LINE_89_LEGS },
]

// ─── All piers (both lines) for meeting resolution ───
const ALL_PIERS: Pier[] = [...LINE_80_PIERS, ...LINE_89_PIERS]

// ─── Schedules ───────────────────────────────────────

function fmt(h: number, m: number): string {
  const totalMin = h * 60 + m
  const hh = Math.floor(totalMin / 60) % 24
  const mm = totalMin % 60
  return `${String(hh).padStart(2, '0')}:${String(mm).padStart(2, '0')}`
}

function generateLine80Circuits(): Circuit[] {
  const startTimes = [
    '06:20', '07:00', '07:40', '08:20', '09:00', '09:40',
    '10:30', '11:30', '12:30', '13:30', '14:30', '15:20',
    '16:00', '16:40', '17:20', '18:00', '18:40', '19:30',
  ]

  return startTimes.map((start, i) => {
    const [sh, sm] = start.split(':').map(Number)
    return {
      id: `L80-${i + 1}`,
      label: `Omlopp ${i + 1}`,
      startTime: start,
      departures: [
        { pierId: 'nacka',    time: start },
        { pierId: 'saltsjok', time: fmt(sh, sm + 2) },
        { pierId: 'henriksd', time: fmt(sh, sm + 4) },
        { pierId: 'barnang',  time: fmt(sh, sm + 7) },
        { pierId: 'ropsten',  time: fmt(sh, sm + 12) },
        { pierId: 'moranna',  time: fmt(sh, sm + 15) },
        { pierId: 'moranna',  time: fmt(sh, sm + 18) },
        { pierId: 'ropsten',  time: fmt(sh, sm + 21) },
        { pierId: 'barnang',  time: fmt(sh, sm + 26) },
        { pierId: 'henriksd', time: fmt(sh, sm + 29) },
        { pierId: 'saltsjok', time: fmt(sh, sm + 31) },
        { pierId: 'nacka',    time: fmt(sh, sm + 33) },
      ],
    }
  })
}

function generateLine89Circuits(): Circuit[] {
  const startTimes = [
    '07:10', '08:10', '09:10', '10:30', '12:00',
    '14:00', '15:30', '16:30', '17:30', '18:30',
  ]

  return startTimes.map((start, i) => {
    const [sh, sm] = start.split(':').map(Number)
    return {
      id: `L89-${i + 1}`,
      label: `Omlopp ${i + 1}`,
      startTime: start,
      departures: [
        { pierId: 'nybroplan',  time: start },
        { pierId: 'djurgard',   time: fmt(sh, sm + 5) },
        { pierId: 'blockhus',   time: fmt(sh, sm + 10) },
        { pierId: 'nacka89',    time: fmt(sh, sm + 18) },
        { pierId: 'saltsjok89', time: fmt(sh, sm + 21) },
        { pierId: 'saltsjok89', time: fmt(sh, sm + 25) },
        { pierId: 'nacka89',    time: fmt(sh, sm + 28) },
        { pierId: 'blockhus',   time: fmt(sh, sm + 36) },
        { pierId: 'djurgard',   time: fmt(sh, sm + 41) },
        { pierId: 'nybroplan',  time: fmt(sh, sm + 46) },
      ],
    }
  })
}

export const LINE_80_CIRCUITS = generateLine80Circuits()
export const LINE_89_CIRCUITS = generateLine89Circuits()

export function getCircuitsForLine(lineId: string): Circuit[] {
  return lineId === 'L80' ? LINE_80_CIRCUITS : LINE_89_CIRCUITS
}

// ─── Meeting detection ───────────────────────────────
// Detects meetings both within same line AND cross-line at shared piers

export interface Meeting {
  pierName: string
  myCircuitLabel: string
  myTime: string
  otherCircuitLabel: string
  otherLineId: string
  otherTime: string
  isNarrow: boolean
}

export function findMeetings(
  myLineId: string,
  myCircuit: Circuit,
): Meeting[] {
  const meetings: Meeting[] = []
  const seen = new Set<string>()

  // Check against ALL circuits from ALL lines
  const linesToCheck = FERRY_LINES.map(line => ({
    lineId: line.id,
    circuits: getCircuitsForLine(line.id),
  }))

  for (const { lineId: otherLineId, circuits } of linesToCheck) {
    for (const other of circuits) {
      // Skip self
      if (otherLineId === myLineId && other.id === myCircuit.id) continue

      for (const myDep of myCircuit.departures) {
        for (const otherDep of other.departures) {
          // Normalize pier IDs to detect same physical pier
          const myNorm = normalizePierId(myDep.pierId)
          const otherNorm = normalizePierId(otherDep.pierId)
          if (myNorm !== otherNorm) continue

          const myMin = parseTimeToMinutes(myDep.time)
          const otherMin = parseTimeToMinutes(otherDep.time)

          // Wider window for narrow piers (8 min), normal (5 min)
          const pier = ALL_PIERS.find(p => normalizePierId(p.id) === myNorm)
          const window = pier?.narrow ? 8 : 5
          if (Math.abs(myMin - otherMin) > window) continue

          const key = `${myNorm}-${myDep.time}-${other.id}-${otherDep.time}`
          if (seen.has(key)) continue
          seen.add(key)

          const pierName = pier?.name ?? myNorm

          meetings.push({
            pierName,
            myCircuitLabel: myCircuit.label,
            myTime: myDep.time,
            otherCircuitLabel: `${otherLineId === myLineId ? '' : otherLineId + ' '}${other.label}`,
            otherLineId,
            otherTime: otherDep.time,
            isNarrow: pier?.narrow ?? false,
          })
        }
      }
    }
  }

  // Sort by my time
  meetings.sort((a, b) => parseTimeToMinutes(a.myTime) - parseTimeToMinutes(b.myTime))
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
