import { useState, useEffect, useCallback, useMemo } from 'react'
import {
  FERRY_LINES, LINE_80_CIRCUITS, LINE_89_CIRCUITS,
  findMeetings, parseTimeToMinutes, getLegDistance,
  type Circuit, type CircuitDeparture, type Pier, type FerryLine, type Meeting
} from '@/data/ferryRoutes'

export interface TimetableState {
  selectedLine: FerryLine
  selectedCircuit: Circuit
  currentStop: StopInfo | null
  nextStop: StopInfo | null
  countdown: CountdownInfo
  meetings: Meeting[]
  suggestedSpeed: number | null
  progress: number
  gpsClock: string
  allStops: StopInfo[]
  selectLine: (lineId: string) => void
  selectCircuit: (circuitId: string) => void
}

export interface StopInfo {
  pier: Pier
  departure: CircuitDeparture
  distanceNm: number  // real navigational distance to this stop from previous
  isPast: boolean
  isCurrent: boolean
}

export interface CountdownInfo {
  minutes: number
  seconds: number
  isLate: boolean  // not "overdue" — no stress language
  totalSeconds: number
}

function nowMinutes(): number {
  const now = new Date()
  return now.getHours() * 60 + now.getMinutes() + now.getSeconds() / 60
}

function getCircuits(lineId: string): Circuit[] {
  return lineId === 'L80' ? LINE_80_CIRCUITS : LINE_89_CIRCUITS
}

function findActiveCircuit(circuits: Circuit[]): Circuit {
  const now = nowMinutes()
  for (const circuit of circuits) {
    const lastDep = circuit.departures[circuit.departures.length - 1]
    if (parseTimeToMinutes(lastDep.time) >= now - 5) {
      return circuit
    }
  }
  return circuits[0]
}

export function useTimetable(): TimetableState {
  const [lineId, setLineId] = useState('L80')
  const [circuitId, setCircuitId] = useState<string | null>(null)
  const [gpsClock, setGpsClock] = useState('')
  const [tick, setTick] = useState(0)

  const selectedLine = useMemo(
    () => FERRY_LINES.find(l => l.id === lineId) || FERRY_LINES[0],
    [lineId]
  )

  const circuits = useMemo(() => getCircuits(lineId), [lineId])

  const selectedCircuit = useMemo(() => {
    if (circuitId) {
      const found = circuits.find(c => c.id === circuitId)
      if (found) return found
    }
    return findActiveCircuit(circuits)
  }, [circuitId, circuits])

  useEffect(() => {
    const iv = setInterval(() => {
      setTick(t => t + 1)
      const now = new Date()
      setGpsClock(
        `${String(now.getHours()).padStart(2, '0')}.${String(now.getMinutes()).padStart(2, '0')}.${String(now.getSeconds()).padStart(2, '0')}`
      )
    }, 1000)
    return () => clearInterval(iv)
  }, [])

  const selectLine = useCallback((id: string) => {
    setLineId(id)
    setCircuitId(null)
  }, [])

  const selectCircuit = useCallback((id: string) => {
    setCircuitId(id)
  }, [])

  const computed = useMemo(() => {
    const now = nowMinutes()
    const deps = selectedCircuit.departures
    const piers = selectedLine.piers
    const legs = selectedLine.legs

    // Build stop info list with real distances
    const allStops: StopInfo[] = deps.map((d, i) => {
      const pier = piers.find(p => p.id === d.pierId) || piers[0]
      const prevDep = i > 0 ? deps[i - 1] : null
      const dist = prevDep ? getLegDistance(legs, prevDep.pierId, d.pierId) : 0
      const depTime = parseTimeToMinutes(d.time)

      return {
        pier,
        departure: d,
        distanceNm: dist,
        isPast: depTime < now - 1,
        isCurrent: false,
      }
    })

    // Find current stop (first non-past)
    let currentIdx = allStops.findIndex(s => !s.isPast)
    if (currentIdx === -1) currentIdx = allStops.length - 1

    allStops[currentIdx].isCurrent = true

    const currentStop = allStops[currentIdx]
    const nextStop = allStops[currentIdx + 1] || null

    // Countdown to current departure
    const depTime = parseTimeToMinutes(currentStop.departure.time)
    const diffSec = Math.round((depTime - now) * 60)
    const countdown: CountdownInfo = {
      minutes: Math.abs(Math.floor(diffSec / 60)),
      seconds: Math.abs(diffSec % 60),
      isLate: diffSec < 0,
      totalSeconds: diffSec,
    }

    // Progress
    const progress = deps.length > 1 ? currentIdx / (deps.length - 1) : 0

    // Suggested speed (using real navigational distance)
    let suggestedSpeed: number | null = null
    if (nextStop && nextStop.distanceNm > 0) {
      const nextDepTime = parseTimeToMinutes(nextStop.departure.time)
      const timeAvailableHours = (nextDepTime - now) / 60
      if (timeAvailableHours > 0) {
        suggestedSpeed = Math.round((nextStop.distanceNm / timeAvailableHours) * 10) / 10
      }
    }

    return { currentStop, nextStop, allStops, countdown, progress, suggestedSpeed }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedCircuit, selectedLine, tick])

  // Meeting predictions — find where circuits overlap at piers
  const meetings = useMemo(() => {
    return findMeetings(lineId, selectedCircuit, circuits, selectedLine.piers, 5)
      .filter(m => {
        // Only show upcoming meetings (within next 30 min)
        const now = nowMinutes()
        const meetTime = parseTimeToMinutes(m.myTime)
        return meetTime >= now - 2 && meetTime <= now + 30
      })
      .slice(0, 4) // max 4 meetings shown
  }, [selectedCircuit, circuits, selectedLine.piers, lineId, tick]) // eslint-disable-line react-hooks/exhaustive-deps

  return {
    selectedLine,
    selectedCircuit,
    currentStop: computed.currentStop,
    nextStop: computed.nextStop,
    countdown: computed.countdown,
    meetings,
    suggestedSpeed: computed.suggestedSpeed,
    progress: computed.progress,
    gpsClock,
    allStops: computed.allStops,
    selectLine,
    selectCircuit,
  }
}
