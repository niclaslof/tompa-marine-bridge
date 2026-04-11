import { useEffect, useRef, useCallback } from 'react'
import type { ScheduleLogEntry } from '@/types/marine'
import type { StopInfo } from './useTimetable'

const STORAGE_KEY = 'tompa_schedule_log'

function loadLog(): ScheduleLogEntry[] {
  try {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved) return JSON.parse(saved)
  } catch { /* ignore */ }
  return []
}

function saveLog(entries: ScheduleLogEntry[]) {
  // Keep last 500 entries
  const trimmed = entries.slice(-500)
  localStorage.setItem(STORAGE_KEY, JSON.stringify(trimmed))
}

export function useScheduleTracking(
  lineId: string,
  circuitId: string,
  currentStop: StopInfo | null
) {
  const lastLoggedRef = useRef<string>('')

  // Auto-detect: when currentStop changes, log the transition
  useEffect(() => {
    if (!currentStop) return
    const key = `${circuitId}-${currentStop.departure.pierId}-${currentStop.departure.time}`
    if (key === lastLoggedRef.current) return
    lastLoggedRef.current = key

    // Only log if stop is current (not past, not future)
    if (!currentStop.isCurrent) return

    const now = new Date()
    const actualTime = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}`

    const [sh, sm] = currentStop.departure.time.split(':').map(Number)
    const scheduledSec = sh * 3600 + sm * 60
    const actualSec = now.getHours() * 3600 + now.getMinutes() * 60 + now.getSeconds()
    const deviation = actualSec - scheduledSec

    const entry: ScheduleLogEntry = {
      date: now.toISOString().split('T')[0],
      lineId,
      circuitId,
      pierId: currentStop.departure.pierId,
      pierName: currentStop.pier.name,
      scheduledTime: currentStop.departure.time,
      actualTime,
      deviationSeconds: deviation,
    }

    const log = loadLog()
    log.push(entry)
    saveLog(log)
  }, [currentStop, lineId, circuitId])

  // Manual departure confirmation
  const confirmDeparture = useCallback(() => {
    if (!currentStop) return

    const now = new Date()
    const actualTime = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}`

    const [sh, sm] = currentStop.departure.time.split(':').map(Number)
    const scheduledSec = sh * 3600 + sm * 60
    const actualSec = now.getHours() * 3600 + now.getMinutes() * 60 + now.getSeconds()

    const entry: ScheduleLogEntry = {
      date: now.toISOString().split('T')[0],
      lineId,
      circuitId,
      pierId: currentStop.departure.pierId,
      pierName: currentStop.pier.name,
      scheduledTime: currentStop.departure.time,
      actualTime,
      deviationSeconds: actualSec - scheduledSec,
    }

    // Replace auto-logged entry with manual confirmation (more accurate)
    const log = loadLog()
    const existingIdx = log.findIndex(
      e => e.date === entry.date && e.circuitId === entry.circuitId && e.pierId === entry.pierId && e.scheduledTime === entry.scheduledTime
    )
    if (existingIdx >= 0) {
      log[existingIdx] = entry
    } else {
      log.push(entry)
    }
    saveLog(log)
  }, [currentStop, lineId, circuitId])

  return { confirmDeparture }
}

// Analytics functions
export function getScheduleLog(): ScheduleLogEntry[] {
  return loadLog()
}

export interface PierStats {
  pierName: string
  count: number
  avgDeviation: number
  onTimePercent: number  // within ±60 sec
}

export function computeAnalytics(log: ScheduleLogEntry[]): {
  pierStats: PierStats[]
  overallOnTime: number
  avgDeviation: number
  totalEntries: number
} {
  if (log.length === 0) return { pierStats: [], overallOnTime: 0, avgDeviation: 0, totalEntries: 0 }

  const byPier = new Map<string, ScheduleLogEntry[]>()
  for (const e of log) {
    const arr = byPier.get(e.pierName) || []
    arr.push(e)
    byPier.set(e.pierName, arr)
  }

  const pierStats: PierStats[] = []
  for (const [pierName, entries] of byPier) {
    const avg = entries.reduce((s, e) => s + e.deviationSeconds, 0) / entries.length
    const onTime = entries.filter(e => Math.abs(e.deviationSeconds) <= 60).length
    pierStats.push({
      pierName,
      count: entries.length,
      avgDeviation: Math.round(avg),
      onTimePercent: Math.round((onTime / entries.length) * 100),
    })
  }

  const totalOnTime = log.filter(e => Math.abs(e.deviationSeconds) <= 60).length
  const totalAvg = log.reduce((s, e) => s + e.deviationSeconds, 0) / log.length

  return {
    pierStats: pierStats.sort((a, b) => b.count - a.count),
    overallOnTime: Math.round((totalOnTime / log.length) * 100),
    avgDeviation: Math.round(totalAvg),
    totalEntries: log.length,
  }
}
