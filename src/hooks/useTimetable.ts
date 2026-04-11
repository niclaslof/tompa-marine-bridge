import { useState, useEffect, useCallback, useMemo } from 'react'
import {
  FERRY_LINES, LINE_80_CIRCUITS, LINE_89_CIRCUITS,
  OTHER_VESSELS, pierDistance,
  type Circuit, type CircuitDeparture, type Pier, type FerryLine
} from '@/data/ferryRoutes'

export interface TimetableState {
  selectedLine: FerryLine
  selectedCircuit: Circuit
  currentStop: DepartureInfo | null
  nextStop: DepartureInfo | null
  upcomingStops: DepartureInfo[]
  countdown: { minutes: number; seconds: number; isOverdue: boolean }
  meetings: MeetingInfo[]
  suggestedSpeed: number | null
  progress: number  // 0-1 through current circuit
  gpsClock: string
  selectLine: (lineId: string) => void
  selectCircuit: (circuitId: string) => void
}

export interface DepartureInfo {
  pier: Pier
  departure: CircuitDeparture
  distanceNm: number
}

export interface MeetingInfo {
  vesselName: string
  pierName: string
  time: string
  isNarrow: boolean
}

function parseTime(t: string): number {
  const [h, m] = t.split(':').map(Number)
  return h * 60 + m
}

function nowMinutes(): number {
  const now = new Date()
  return now.getHours() * 60 + now.getMinutes() + now.getSeconds() / 60
}

function getCircuitsForLine(lineId: string): Circuit[] {
  return lineId === 'L80' ? LINE_80_CIRCUITS : LINE_89_CIRCUITS
}

function findBestCircuit(circuits: Circuit[]): Circuit {
  const now = nowMinutes()
  // Find circuit with the nearest upcoming departure
  for (const circuit of circuits) {
    const lastDep = circuit.departures[circuit.departures.length - 1]
    if (parseTime(lastDep.time) >= now - 5) {
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

  const circuits = useMemo(() => getCircuitsForLine(lineId), [lineId])

  const selectedCircuit = useMemo(() => {
    if (circuitId) {
      const found = circuits.find(c => c.id === circuitId)
      if (found) return found
    }
    return findBestCircuit(circuits)
  }, [circuitId, circuits])

  useEffect(() => {
    const iv = setInterval(() => {
      setTick(t => t + 1)
      const now = new Date()
      setGpsClock(
        now.toLocaleTimeString('sv-SE', {
          hour: '2-digit', minute: '2-digit', second: '2-digit',
        })
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

  const { currentStop, nextStop, upcomingStops, countdown, progress, suggestedSpeed } = useMemo(() => {
    const now = nowMinutes()
    const deps = selectedCircuit.departures
    const piers = selectedLine.piers

    // Build departure info list
    const depInfos: DepartureInfo[] = deps.map((d, i) => {
      const pier = piers.find(p => p.id === d.pierId) || piers[0]
      const prevPier = i > 0 ? (piers.find(p => p.id === deps[i - 1].pierId) || piers[0]) : pier
      return {
        pier,
        departure: d,
        distanceNm: i > 0 ? pierDistance(prevPier, pier) : 0,
      }
    })

    // Find current and next stop
    let currentIdx = -1
    for (let i = 0; i < depInfos.length; i++) {
      const depTime = parseTime(depInfos[i].departure.time)
      if (depTime >= now - 2) {
        currentIdx = i
        break
      }
    }
    if (currentIdx === -1) currentIdx = 0

    const current = depInfos[currentIdx] || null
    const next = depInfos[currentIdx + 1] || null
    const upcoming = depInfos.slice(currentIdx + 2, currentIdx + 5)

    // Countdown to current departure
    let countdownVal = { minutes: 0, seconds: 0, isOverdue: false }
    if (current) {
      const depTime = parseTime(current.departure.time)
      const diffSec = Math.round((depTime - now) * 60)
      countdownVal = {
        minutes: Math.abs(Math.floor(diffSec / 60)),
        seconds: Math.abs(diffSec % 60),
        isOverdue: diffSec < 0,
      }
    }

    // Progress through circuit
    const prog = deps.length > 0 ? currentIdx / deps.length : 0

    // Suggested speed to next stop
    let speed: number | null = null
    if (next && current) {
      const timeDiffMin = parseTime(next.departure.time) - now
      if (timeDiffMin > 0 && next.distanceNm > 0) {
        speed = Math.round((next.distanceNm / (timeDiffMin / 60)) * 10) / 10
      }
    }

    return { currentStop: current, nextStop: next, upcomingStops: upcoming, countdown: countdownVal, progress: prog, suggestedSpeed: speed }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedCircuit, selectedLine, tick])

  // Meeting predictions
  const meetings = useMemo(() => {
    const now = nowMinutes()
    const result: MeetingInfo[] = []

    OTHER_VESSELS.forEach(vessel => {
      if (vessel.lineId !== lineId) return
      const vesselCircuits = getCircuitsForLine(vessel.lineId)
      const vc = vesselCircuits.find(c => c.id === vessel.circuitId)
      if (!vc) return

      vc.departures.forEach(vDep => {
        const vTime = parseTime(vDep.time)
        if (vTime < now || vTime > now + 30) return

        // Check if we're at the same pier at similar time
        selectedCircuit.departures.forEach(myDep => {
          if (myDep.pierId === vDep.pierId || myDep.pierId.replace('89', '') === vDep.pierId) {
            const myTime = parseTime(myDep.time)
            if (Math.abs(myTime - vTime) < 5) {
              const pier = selectedLine.piers.find(p => p.id === vDep.pierId || p.id === myDep.pierId)
              if (pier) {
                result.push({
                  vesselName: vessel.name,
                  pierName: pier.name,
                  time: vDep.time,
                  isNarrow: pier.narrow,
                })
              }
            }
          }
        })
      })
    })

    return result
  }, [selectedCircuit, selectedLine, lineId, tick]) // eslint-disable-line react-hooks/exhaustive-deps

  return {
    selectedLine,
    selectedCircuit,
    currentStop,
    nextStop,
    upcomingStops,
    countdown,
    meetings,
    suggestedSpeed,
    progress,
    gpsClock,
    selectLine,
    selectCircuit,
  }
}
