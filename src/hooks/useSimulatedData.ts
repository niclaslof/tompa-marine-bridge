import { useState, useEffect, useRef } from 'react'
import type { BoatData } from '@/types/marine'
import { ROUTE_WAYPOINTS, jitter, interpolatePosition, bearing } from '@/data/simulation'

const TICK_MS = 1000
const SPEED_BASE = 7.5 // knots
const ROUTE_DURATION_TICKS = 1800 // 30 min to complete route

function generatePressureHistory(): number[] {
  let p = 1013
  const history: number[] = []
  for (let i = 0; i < 36; i++) {
    p += (Math.random() - 0.48) * 0.5
    history.push(Math.round(p * 10) / 10)
  }
  return history
}

export function useSimulatedData(): BoatData {
  const tickRef = useRef(0)
  const pressureHistoryRef = useRef(generatePressureHistory())

  const [data, setData] = useState<BoatData>(() => buildData(0, pressureHistoryRef.current))

  useEffect(() => {
    const interval = setInterval(() => {
      tickRef.current += 1
      // Add a pressure reading every ~60 ticks (1 min)
      if (tickRef.current % 60 === 0) {
        const hist = pressureHistoryRef.current
        const last = hist[hist.length - 1]
        hist.push(Math.round((last + (Math.random() - 0.48) * 0.5) * 10) / 10)
        if (hist.length > 36) hist.shift()
      }
      setData(buildData(tickRef.current, pressureHistoryRef.current))
    }, TICK_MS)

    return () => clearInterval(interval)
  }, [])

  return data
}

function buildData(tick: number, pressureHistory: number[]): BoatData {
  const totalWaypoints = ROUTE_WAYPOINTS.length - 1
  const progress = (tick % ROUTE_DURATION_TICKS) / ROUTE_DURATION_TICKS
  const segmentFloat = progress * totalWaypoints
  const segmentIndex = Math.min(Math.floor(segmentFloat), totalWaypoints - 1)
  const segmentT = segmentFloat - segmentIndex

  const from = ROUTE_WAYPOINTS[segmentIndex]
  const to = ROUTE_WAYPOINTS[segmentIndex + 1] || ROUTE_WAYPOINTS[segmentIndex]
  const position = interpolatePosition(from, to, segmentT)
  const cog = bearing(from, to)

  const sog = jitter(SPEED_BASE, 0.3)
  const stw = jitter(sog - 0.4, 0.2)
  const heading = jitter(cog, 2)

  const twd = jitter(220, 5) // SW wind
  const tws = jitter(12, 1.5)
  const gust = jitter(tws + 4, 1)
  const awaRad = ((twd - heading + 360) % 360)
  const awa = awaRad > 180 ? awaRad - 360 : awaRad

  const depth = jitter(18, 3)
  const pressure = pressureHistory[pressureHistory.length - 1]

  const distToMarstrand = Math.sqrt(
    Math.pow((57.887 - position.lat) * 60, 2) +
    Math.pow((11.584 - position.lon) * 60 * Math.cos(position.lat * Math.PI / 180), 2)
  )

  const etaHours = distToMarstrand / sog
  const etaDate = new Date(Date.now() + etaHours * 3600000)
  const etaStr = `${etaDate.getHours().toString().padStart(2, '0')}:${etaDate.getMinutes().toString().padStart(2, '0')}`

  return {
    navigation: {
      position,
      sog: Math.round(sog * 10) / 10,
      cog: Math.round(cog * 10) / 10,
      stw: Math.round(stw * 10) / 10,
      heading: ((Math.round(heading) % 360) + 360) % 360,
    },
    wind: {
      twd: Math.round(twd) % 360,
      tws: Math.round(tws * 10) / 10,
      aws: Math.round(jitter(tws + 2, 1) * 10) / 10,
      awa: Math.round(awa),
      gust: Math.round(gust * 10) / 10,
    },
    depth: {
      depth: Math.round(Math.max(depth, 2) * 10) / 10,
      alarm: depth < 5,
      alarmThreshold: 5,
    },
    environment: {
      airTemp: jitter(14, 0.3),
      waterTemp: jitter(11, 0.2),
      pressure: Math.round(pressure * 10) / 10,
      pressureHistory: [...pressureHistory],
      humidity: jitter(72, 2),
    },
    gnss: {
      satellites: Math.round(jitter(12, 1)),
      hdop: Math.round(jitter(0.8, 0.1) * 10) / 10,
      fixType: '3D',
    },
    autopilot: {
      mode: 'auto',
      targetHeading: Math.round(cog),
      rudderAngle: Math.round(jitter(0, 3)),
    },
    anchor: {
      active: false,
      position: null,
      radius: 30,
      currentDrift: 0,
      alarm: false,
    },
    nextHarbor: {
      name: 'Marstrand',
      eta: etaStr,
      distance: Math.round(distToMarstrand * 10) / 10,
      status: 'open',
    },
    timestamp: Date.now(),
  }
}
