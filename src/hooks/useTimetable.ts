import { useState, useEffect, useMemo } from 'react'
import {
  FERRY_LINES, ALL_CIRCUITS, flattenCircuit,
  parseTimeToMinutes, getLegDistance, findMeetings,
  type Circuit, type FerryLine, type Meeting
} from '@/data/ferryRoutes'

export interface TimetableState {
  selectedLine: FerryLine
  selectedCircuit: Circuit
  currentStop: StopInfo | null
  nextStop: StopInfo | null
  afterStop: StopInfo | null
  upcomingStops: StopInfo[]
  countdown: CountdownInfo
  meetings: Meeting[]
  allMeetings: Meeting[]
  suggestedSpeed: number | null
  gpsClock: string
  allStops: StopInfo[]
  simulatedTime: number | null  // override time for simulation (minutes)
  setSimulatedTime: (t: number | null) => void
}

export interface StopInfo {
  pierId: string
  pierName: string
  time: string
  distanceNm: number
  isPast: boolean
  isCurrent: boolean
  tripIndex: number
}

export interface CountdownInfo {
  minutes: number
  seconds: number
  isLate: boolean
  totalSeconds: number
}

function nowMinutes(simulated: number | null): number {
  if (simulated !== null) return simulated
  const now = new Date()
  return now.getHours() * 60 + now.getMinutes() + now.getSeconds() / 60
}

export function useTimetable(lineId: string, circuitId: string): TimetableState {
  const [gpsClock, setGpsClock] = useState('')
  const [tick, setTick] = useState(0)
  const [simulatedTime, setSimulatedTime] = useState<number | null>(null)

  const selectedLine = useMemo(
    () => FERRY_LINES.find(l => l.id === lineId) || FERRY_LINES[0],
    [lineId]
  )

  const selectedCircuit = useMemo(
    () => ALL_CIRCUITS.find(c => c.id === circuitId) || ALL_CIRCUITS[0],
    [circuitId]
  )

  useEffect(() => {
    const iv = setInterval(() => {
      setTick(t => t + 1)
      if (simulatedTime !== null) {
        // Show simulated time
        const h = Math.floor(simulatedTime / 60) % 24
        const m = Math.floor(simulatedTime % 60)
        const s = Math.floor((simulatedTime * 60) % 60)
        setGpsClock(`${String(h).padStart(2, '0')}.${String(m).padStart(2, '0')}.${String(s).padStart(2, '0')}`)
      } else {
        const now = new Date()
        setGpsClock(`${String(now.getHours()).padStart(2, '0')}.${String(now.getMinutes()).padStart(2, '0')}.${String(now.getSeconds()).padStart(2, '0')}`)
      }
    }, 1000)
    return () => clearInterval(iv)
  }, [simulatedTime])

  const computed = useMemo(() => {
    const now = nowMinutes(simulatedTime)
    const flat = flattenCircuit(selectedCircuit, selectedLine.piers)
    const legs = selectedLine.legs

    const allStops: StopInfo[] = flat.map((d, i) => {
      const prev = i > 0 ? flat[i - 1] : null
      const dist = prev ? getLegDistance(legs, prev.pierId, d.pierId) : 0
      const depTime = parseTimeToMinutes(d.time)
      return {
        pierId: d.pierId,
        pierName: d.pierName,
        time: d.time,
        distanceNm: dist,
        isPast: depTime < now - 0.5,
        isCurrent: false,
        tripIndex: d.tripIndex,
      }
    })

    // Current = first non-past
    let currentIdx = allStops.findIndex(s => !s.isPast)
    if (currentIdx === -1) currentIdx = allStops.length - 1
    allStops[currentIdx].isCurrent = true

    const currentStop = allStops[currentIdx]
    const nextStop = allStops[currentIdx + 1] || null
    const afterStop = allStops[currentIdx + 2] || null
    const upcomingStops = allStops.slice(currentIdx + 3, currentIdx + 8)

    // Countdown
    const depTime = parseTimeToMinutes(currentStop.time)
    const diffSec = Math.round((depTime - now) * 60)
    const countdown: CountdownInfo = {
      minutes: Math.abs(Math.floor(diffSec / 60)),
      seconds: Math.abs(diffSec % 60),
      isLate: diffSec < 0,
      totalSeconds: diffSec,
    }

    // Suggested speed
    let suggestedSpeed: number | null = null
    if (nextStop && nextStop.distanceNm > 0) {
      const nextDepTime = parseTimeToMinutes(nextStop.time)
      const timeHours = (nextDepTime - now) / 60
      if (timeHours > 0) {
        suggestedSpeed = Math.round((nextStop.distanceNm / timeHours) * 10) / 10
      }
    }

    return { currentStop, nextStop, afterStop, upcomingStops, allStops, countdown, suggestedSpeed }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedCircuit, selectedLine, tick, simulatedTime])

  const allMeetings = useMemo(() => findMeetings(lineId, selectedCircuit), [lineId, selectedCircuit])
  const meetings = useMemo(() => {
    const now = nowMinutes(simulatedTime)
    return allMeetings.filter(m => {
      const t = parseTimeToMinutes(m.myTime)
      return t >= now - 2 && t <= now + 30
    }).slice(0, 4)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [allMeetings, tick, simulatedTime])

  return {
    selectedLine,
    selectedCircuit,
    ...computed,
    meetings,
    allMeetings,
    gpsClock,
    simulatedTime,
    setSimulatedTime,
  }
}
