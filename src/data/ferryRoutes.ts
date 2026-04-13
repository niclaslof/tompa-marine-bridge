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
    return month >= s.fromMonth || month <= s.toMonth
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
}

export interface FerryLine {
  id: string
  name: string
  description: string
  piers: Pier[]
  legs: PierLeg[]
}

// A single departure at a pier
export interface Stop {
  pierId: string
  time: string  // HH:MM
}

// A trip is one direction (e.g. Nybroplan→Ropsten or Ropsten→Nybroplan)
export interface Trip {
  stops: Stop[]
  waitAfter: number | null  // minutes wait at terminal before next trip
}

// An omlopp is a full day's work: multiple trips alternating direction
export interface Circuit {
  id: string
  label: string
  weekdays: string  // "Måndag-Torsdag", "Fredag", etc.
  season: string    // "Vår 2026"
  startTime: string // first departure
  trips: Trip[]
}

// Flat list of all departures for easy lookup
export interface FlatDeparture {
  pierId: string
  pierName: string
  time: string
  tripIndex: number
}

// ─── Linje 89 piers (REAL — alla 10 bryggor) ────────

const LINE_89_PIERS: Pier[] = [
  { id: 'nybroplan',  name: 'Nybroplan',          narrow: false },
  { id: 'allgrand',   name: 'Allmänna Gränd',     narrow: false },
  { id: 'saltsjok',   name: 'Saltsjökvarn',       narrow: false },
  { id: 'finnboda',   name: 'Finnboda',           narrow: false },
  { id: 'kvarnholm',  name: 'Kvarnholmen',        narrow: false },
  { id: 'blockhus',   name: 'Blockhusudden',      narrow: false },
  { id: 'nacka',      name: 'Nacka Strand',       narrow: true },
  { id: 'dalenum',    name: 'Dalenum / Lidingö',  narrow: false },
  { id: 'frihamnen',  name: 'Frihamnen',          narrow: false },
  { id: 'ropsten',    name: 'Ropsten',            narrow: false },
]

// Real navigational distances between consecutive piers
const LINE_89_LEGS: PierLeg[] = [
  { from: 'nybroplan', to: 'allgrand',  distanceNm: 0.5 },
  { from: 'allgrand',  to: 'saltsjok',  distanceNm: 0.6 },
  { from: 'saltsjok',  to: 'finnboda',  distanceNm: 0.3 },
  { from: 'finnboda',  to: 'kvarnholm', distanceNm: 0.3 },
  { from: 'kvarnholm', to: 'blockhus',  distanceNm: 0.4 },
  { from: 'blockhus',  to: 'nacka',     distanceNm: 0.5 },
  { from: 'nacka',     to: 'dalenum',   distanceNm: 0.8 },
  { from: 'dalenum',   to: 'frihamnen', distanceNm: 0.4 },
  { from: 'frihamnen', to: 'ropsten',   distanceNm: 0.5 },
  // Return (same distances)
  { from: 'ropsten',   to: 'frihamnen', distanceNm: 0.5 },
  { from: 'frihamnen', to: 'dalenum',   distanceNm: 0.4 },
  { from: 'dalenum',   to: 'nacka',     distanceNm: 0.8 },
  { from: 'nacka',     to: 'blockhus',  distanceNm: 0.5 },
  { from: 'blockhus',  to: 'kvarnholm', distanceNm: 0.4 },
  { from: 'kvarnholm', to: 'finnboda',  distanceNm: 0.3 },
  { from: 'finnboda',  to: 'saltsjok',  distanceNm: 0.3 },
  { from: 'saltsjok',  to: 'allgrand',  distanceNm: 0.6 },
  { from: 'allgrand',  to: 'nybroplan', distanceNm: 0.5 },
]

export const FERRY_LINES: FerryLine[] = [
  { id: 'L89', name: 'Linje 89', description: 'Nybroplan – Ropsten (via Nacka Strand)', piers: LINE_89_PIERS, legs: LINE_89_LEGS },
]

// ─── REAL TIMETABLE: Omlopp 2, Måndag-Torsdag, Vår 2026 ───

const OMLOPP_2: Circuit = {
  id: 'L89-O2',
  label: 'Omlopp 2',
  weekdays: 'Måndag-Torsdag',
  season: 'Vår 2026',
  startTime: '06:13',
  trips: [
    // Trip 1: Ropsten → Nybroplan (06:13-07:20)
    { stops: [
      { pierId: 'ropsten',   time: '06:13' },
      { pierId: 'frihamnen', time: '06:21' },
      { pierId: 'dalenum',   time: '06:28' },
      { pierId: 'nacka',     time: '06:41' },
      { pierId: 'blockhus',  time: '06:45' },
      { pierId: 'kvarnholm', time: '06:51' },
      { pierId: 'finnboda',  time: '06:56' },
      { pierId: 'saltsjok',  time: '07:03' },
      { pierId: 'allgrand',  time: '07:12' },
      { pierId: 'nybroplan', time: '07:20' },
    ], waitAfter: 11 },

    // Trip 2: Nybroplan → Ropsten (07:31-08:35)
    { stops: [
      { pierId: 'nybroplan', time: '07:31' },
      { pierId: 'allgrand',  time: '07:39' },
      { pierId: 'saltsjok',  time: '07:47' },
      { pierId: 'finnboda',  time: '07:52' },
      { pierId: 'kvarnholm', time: '07:57' },
      { pierId: 'blockhus',  time: '08:02' },
      { pierId: 'nacka',     time: '08:09' },
      { pierId: 'dalenum',   time: '08:22' },
      { pierId: 'frihamnen', time: '08:27' },
      { pierId: 'ropsten',   time: '08:35' },
    ], waitAfter: 8 },

    // Trip 3: Ropsten → Nybroplan (08:43-09:50)
    { stops: [
      { pierId: 'ropsten',   time: '08:43' },
      { pierId: 'frihamnen', time: '08:51' },
      { pierId: 'dalenum',   time: '08:58' },
      { pierId: 'nacka',     time: '09:11' },
      { pierId: 'blockhus',  time: '09:15' },
      { pierId: 'kvarnholm', time: '09:21' },
      { pierId: 'finnboda',  time: '09:26' },
      { pierId: 'saltsjok',  time: '09:33' },
      { pierId: 'allgrand',  time: '09:42' },
      { pierId: 'nybroplan', time: '09:50' },
    ], waitAfter: 41 },

    // Trip 4: Nybroplan → Ropsten (10:31-11:35)
    { stops: [
      { pierId: 'nybroplan', time: '10:31' },
      { pierId: 'allgrand',  time: '10:39' },
      { pierId: 'saltsjok',  time: '10:47' },
      { pierId: 'finnboda',  time: '10:52' },
      { pierId: 'kvarnholm', time: '10:57' },
      { pierId: 'blockhus',  time: '11:02' },
      { pierId: 'nacka',     time: '11:09' },
      { pierId: 'dalenum',   time: '11:22' },
      { pierId: 'frihamnen', time: '11:27' },
      { pierId: 'ropsten',   time: '11:35' },
    ], waitAfter: 11 },

    // Trip 5: Ropsten → Nybroplan (11:46-12:50)
    { stops: [
      { pierId: 'ropsten',   time: '11:46' },
      { pierId: 'frihamnen', time: '11:54' },
      { pierId: 'dalenum',   time: '12:00' },
      { pierId: 'nacka',     time: '12:13' },
      { pierId: 'blockhus',  time: '12:17' },
      { pierId: 'kvarnholm', time: '12:22' },
      { pierId: 'finnboda',  time: '12:26' },
      { pierId: 'saltsjok',  time: '12:33' },
      { pierId: 'allgrand',  time: '12:42' },
      { pierId: 'nybroplan', time: '12:50' },
    ], waitAfter: 11 },

    // Trip 6: Nybroplan → Ropsten (13:01-14:05)
    { stops: [
      { pierId: 'nybroplan', time: '13:01' },
      { pierId: 'allgrand',  time: '13:09' },
      { pierId: 'saltsjok',  time: '13:17' },
      { pierId: 'finnboda',  time: '13:22' },
      { pierId: 'kvarnholm', time: '13:27' },
      { pierId: 'blockhus',  time: '13:32' },
      { pierId: 'nacka',     time: '13:39' },
      { pierId: 'dalenum',   time: '13:52' },
      { pierId: 'frihamnen', time: '13:57' },
      { pierId: 'ropsten',   time: '14:05' },
    ], waitAfter: 11 },

    // Trip 7: Ropsten → Nybroplan (14:16-15:20)
    { stops: [
      { pierId: 'ropsten',   time: '14:16' },
      { pierId: 'frihamnen', time: '14:24' },
      { pierId: 'dalenum',   time: '14:30' },
      { pierId: 'nacka',     time: '14:43' },
      { pierId: 'blockhus',  time: '14:47' },
      { pierId: 'kvarnholm', time: '14:52' },
      { pierId: 'finnboda',  time: '14:56' },
      { pierId: 'saltsjok',  time: '15:03' },
      { pierId: 'allgrand',  time: '15:12' },
      { pierId: 'nybroplan', time: '15:20' },
    ], waitAfter: 21 },

    // Trip 8: Nybroplan → Nacka Strand ONLY (15:41-16:20)
    { stops: [
      { pierId: 'nybroplan', time: '15:41' },
      { pierId: 'allgrand',  time: '15:49' },
      { pierId: 'saltsjok',  time: '15:57' },
      { pierId: 'finnboda',  time: '16:03' },
      { pierId: 'kvarnholm', time: '16:09' },
      { pierId: 'blockhus',  time: '16:14' },
      { pierId: 'nacka',     time: '16:20' },
    ], waitAfter: 1 },

    // Trip 9: Nacka Strand → Nybroplan SHORT (16:21-16:45)
    { stops: [
      { pierId: 'nacka',     time: '16:21' },
      { pierId: 'nybroplan', time: '16:45' },
    ], waitAfter: 6 },

    // Trip 10: Nybroplan → Nacka Strand ONLY (16:51-17:30)
    { stops: [
      { pierId: 'nybroplan', time: '16:51' },
      { pierId: 'allgrand',  time: '16:59' },
      { pierId: 'saltsjok',  time: '17:07' },
      { pierId: 'finnboda',  time: '17:13' },
      { pierId: 'kvarnholm', time: '17:19' },
      { pierId: 'blockhus',  time: '17:24' },
      { pierId: 'nacka',     time: '17:30' },
    ], waitAfter: 1 },

    // Trip 11: Nacka Strand → Nybroplan SHORT (17:31-17:55)
    { stops: [
      { pierId: 'nacka',     time: '17:31' },
      { pierId: 'nybroplan', time: '17:55' },
    ], waitAfter: 6 },

    // Trip 12: Nybroplan → Ropsten FULL (18:01-19:08)
    { stops: [
      { pierId: 'nybroplan', time: '18:01' },
      { pierId: 'allgrand',  time: '18:09' },
      { pierId: 'saltsjok',  time: '18:17' },
      { pierId: 'finnboda',  time: '18:23' },
      { pierId: 'kvarnholm', time: '18:29' },
      { pierId: 'blockhus',  time: '18:34' },
      { pierId: 'nacka',     time: '18:41' },
      { pierId: 'dalenum',   time: '18:54' },
      { pierId: 'frihamnen', time: '19:00' },
      { pierId: 'ropsten',   time: '19:08' },
    ], waitAfter: 8 },

    // Trip 13: Ropsten → Nybroplan (19:16-20:20)
    { stops: [
      { pierId: 'ropsten',   time: '19:16' },
      { pierId: 'frihamnen', time: '19:24' },
      { pierId: 'dalenum',   time: '19:30' },
      { pierId: 'nacka',     time: '19:43' },
      { pierId: 'blockhus',  time: '19:47' },
      { pierId: 'kvarnholm', time: '19:52' },
      { pierId: 'finnboda',  time: '19:56' },
      { pierId: 'saltsjok',  time: '20:03' },
      { pierId: 'allgrand',  time: '20:12' },
      { pierId: 'nybroplan', time: '20:20' },
    ], waitAfter: 11 },

    // Trip 14: Nybroplan → Ropsten (20:31-21:31)
    { stops: [
      { pierId: 'nybroplan', time: '20:31' },
      { pierId: 'allgrand',  time: '20:39' },
      { pierId: 'saltsjok',  time: '20:47' },
      { pierId: 'finnboda',  time: '20:52' },
      { pierId: 'kvarnholm', time: '20:57' },
      { pierId: 'blockhus',  time: '21:01' },
      { pierId: 'nacka',     time: '21:07' },
      { pierId: 'dalenum',   time: '21:20' },
      { pierId: 'frihamnen', time: '21:25' },
      { pierId: 'ropsten',   time: '21:31' },
    ], waitAfter: 15 },

    // Trip 15: Ropsten → Nybroplan (21:46-22:47)
    { stops: [
      { pierId: 'ropsten',   time: '21:46' },
      { pierId: 'frihamnen', time: '21:54' },
      { pierId: 'dalenum',   time: '22:00' },
      { pierId: 'nacka',     time: '22:13' },
      { pierId: 'blockhus',  time: '22:17' },
      { pierId: 'kvarnholm', time: '22:21' },
      { pierId: 'finnboda',  time: '22:26' },
      { pierId: 'saltsjok',  time: '22:32' },
      { pierId: 'allgrand',  time: '22:40' },
      { pierId: 'nybroplan', time: '22:47' },
    ], waitAfter: 14 },

    // Trip 16: Nybroplan → Ropsten LAST (23:01-00:01)
    { stops: [
      { pierId: 'nybroplan', time: '23:01' },
      { pierId: 'allgrand',  time: '23:09' },
      { pierId: 'saltsjok',  time: '23:17' },
      { pierId: 'finnboda',  time: '23:22' },
      { pierId: 'kvarnholm', time: '23:27' },
      { pierId: 'blockhus',  time: '23:31' },
      { pierId: 'nacka',     time: '23:37' },
      { pierId: 'dalenum',   time: '23:50' },
      { pierId: 'frihamnen', time: '23:55' },
      { pierId: 'ropsten',   time: '00:01' },
    ], waitAfter: null },
  ],
}

export const ALL_CIRCUITS: Circuit[] = [OMLOPP_2]

// ─── Flatten circuit into chronological departures ───

export function flattenCircuit(circuit: Circuit, piers: Pier[]): FlatDeparture[] {
  const result: FlatDeparture[] = []
  circuit.trips.forEach((trip, tripIdx) => {
    trip.stops.forEach(stop => {
      const pier = piers.find(p => p.id === stop.pierId)
      result.push({
        pierId: stop.pierId,
        pierName: pier?.name ?? stop.pierId,
        time: stop.time,
        tripIndex: tripIdx,
      })
    })
  })
  return result
}

// ─── Helpers ─────────────────────────────────────────

export function parseTimeToMinutes(t: string): number {
  const [h, m] = t.split(':').map(Number)
  // Handle midnight crossing (00:01 = 1440+1)
  return h === 0 && m < 30 ? 24 * 60 + m : h * 60 + m
}

export function getLegDistance(legs: PierLeg[], fromId: string, toId: string): number {
  const leg = legs.find(l => l.from === fromId && l.to === toId)
  return leg?.distanceNm ?? 0
}

export function getCircuitsForLine(_lineId: string): Circuit[] {
  return ALL_CIRCUITS
}

// ─── Meeting detection ───────────────────────────────

export interface Meeting {
  pierName: string
  myTime: string
  otherCircuitLabel: string
  otherTime: string
  isNarrow: boolean
}

export function findMeetings(
  _myLineId: string,
  _myCircuit: Circuit,
): Meeting[] {
  // With only one omlopp we can't detect meetings yet.
  // When more omlopp are added, compare flat departures at same pier within window.
  return []
}
