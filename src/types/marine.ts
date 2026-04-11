export type TabId = 'timetable' | 'overview' | 'safety' | 'log'

export type AppMode = 'home' | 'operating'

export type Season = 'spring' | 'summer' | 'autumn' | 'winter'

export interface SeasonConfig {
  id: Season
  label: string        // "Vårtidtabell"
  fromMonth: number    // 1-12
  toMonth: number      // 1-12
}

export interface ScheduleLogEntry {
  date: string            // ISO date
  lineId: string
  circuitId: string
  pierId: string
  pierName: string
  scheduledTime: string   // HH:MM
  actualTime: string      // HH:MM:SS
  deviationSeconds: number  // positive = late, negative = early
}
