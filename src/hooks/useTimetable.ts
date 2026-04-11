import { useState, useEffect, useMemo } from 'react'
import {
  FERRY_LINES, getCircuitsForLine,
  findMeetings, parseTimeToMinutes, getLegDistance,
  type Circuit, type Pier, type FerryLine, type Meeting
} from '@/data/ferryRoutes'

export interface TimetableState {
  selectedLine: FerryLine
  selectedCircuit: Circuit
  currentStop: StopInfo | null
  nextStop: StopInfo | null
  countdown: CountdownInfo
  meetings: Meeting[]        // upcoming meetings (next 30 min)
  allMeetings: Meeting[]     // all meetings for this circuit
  suggestedSpeed: number | null
  progress: number
  gpsClock: string
  allStops: StopInfo[]
}

export interface StopInfo {
  pier: Pier
  departure: { pierId: string; time: string }
  distanceNm: number
  isPast: boolean
  isCurrent: boolean
}

export interface CountdownInfo {
  minutes: number
  seconds: number
  isLate: boolean
  totalSeconds: number
}

function nowMinutes(): number {
  const now = new Date()
  return now.getHours() * 60 + now.getMinutes() + now.getSeconds() / 60
}

// Controlled hook: receives lineId and circuitId from parent
export function useTimetable(lineId: string, circuitId: string): TimetableState {
  const [gpsClock, setGpsClock] = useState('')
  const [tick, setTick] = useState(0)

  const selectedLine = useMemo(
    () => FERRY_LINES.find(l => l.id === lineId) || FERRY_LINES[0],
    [lineId]
  )

  const circuits = useMemo(() => getCircuitsForLine(lineId), [lineId])

  const selectedCircuit = useMemo(() => {
    return circuits.find(c => c.id === circuitId) || circuits[0]
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

  const computed = useMemo(() => {
    const now = nowMinutes()
    const deps = selectedCircuit.departures
    const piers = selectedLine.piers
    const legs = selectedLine.legs

    const allStops: StopInfo[] = deps.map((d, i) => {
      const pier = piers.find(p => p.id === d.pierId) || piers[0]
      const prevDep = i > 0 ? deps[i - 1] : null
      const dist = prevDep ? getLegDistance(legs, prevDep.pierId, d.pierId) : 0
      const depTime = parseTimeToMinutes(d.time)
      return { pier, departure: d, distanceNm: dist, isPast: depTime < now - 1, isCurrent: false }
    })

    let currentIdx = allStops.findIndex(s => !s.isPast)
    if (currentIdx === -1) currentIdx = allStops.length - 1
    allStops[currentIdx].isCurrent = true

    const currentStop = allStops[currentIdx]
    const nextStop = allStops[currentIdx + 1] || null

    const depTime = parseTimeToMinutes(currentStop.departure.time)
    const diffSec = Math.round((depTime - now) * 60)
    const countdown: CountdownInfo = {
      minutes: Math.abs(Math.floor(diffSec / 60)),
      seconds: Math.abs(diffSec % 60),
      isLate: diffSec < 0,
      totalSeconds: diffSec,
    }

    const progress = deps.length > 1 ? currentIdx / (deps.length - 1) : 0

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

  // All meetings for this circuit (cross-line enabled)
  const allMeetings = useMemo(() => {
    return findMeetings(lineId, selectedCircuit)
  }, [lineId, selectedCircuit])

  // Upcoming meetings only (next 30 min, max 4)
  const meetings = useMemo(() => {
    const now = nowMinutes()
    return allMeetings
      .filter(m => {
        const meetTime = parseTimeToMinutes(m.myTime)
        return meetTime >= now - 2 && meetTime <= now + 30
      })
      .slice(0, 4)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [allMeetings, tick])

  return {
    selectedLine,
    selectedCircuit,
    currentStop: computed.currentStop,
    nextStop: computed.nextStop,
    countdown: computed.countdown,
    meetings,
    allMeetings,
    suggestedSpeed: computed.suggestedSpeed,
    progress: computed.progress,
    gpsClock,
    allStops: computed.allStops,
  }
}
