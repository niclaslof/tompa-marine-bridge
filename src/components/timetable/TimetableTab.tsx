import { useTimetable } from '@/hooks/useTimetable'
import { CountdownDisplay } from './CountdownDisplay'
import { NextStopCard } from './NextStopCard'
import { MeetingWarning } from './MeetingWarning'
import { CircuitProgress } from './CircuitProgress'
import { RouteSelector } from './RouteSelector'

export function TimetableTab() {
  const tt = useTimetable()

  return (
    <div className="max-w-5xl mx-auto p-3 grid grid-cols-1 lg:grid-cols-3 gap-3">
      {/* ─── Main column: what you glance at ─── */}
      <div className="lg:col-span-2 space-y-3">
        {/* GPS clock — always visible, always accurate */}
        <div className="flex items-center justify-end gap-2">
          <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-2xl font-mono font-bold text-marine-text-bright tabular-nums tracking-wider">
            {tt.gpsClock}
          </span>
        </div>

        {/* THE countdown — the one thing you look at */}
        {tt.currentStop && (
          <CountdownDisplay
            minutes={tt.countdown.minutes}
            seconds={tt.countdown.seconds}
            isLate={tt.countdown.isLate}
            pierName={tt.currentStop.pier.name}
            departureTime={tt.currentStop.departure.time}
          />
        )}

        {/* Next stop — glanceable */}
        <NextStopCard stop={tt.nextStop} suggestedSpeed={tt.suggestedSpeed} />

        {/* Meetings — the critical operational info */}
        <MeetingWarning meetings={tt.meetings} />
      </div>

      {/* ─── Side column: details on demand ─── */}
      <div className="space-y-3">
        <RouteSelector
          selectedLine={tt.selectedLine}
          selectedCircuit={tt.selectedCircuit}
          onSelectLine={tt.selectLine}
          onSelectCircuit={tt.selectCircuit}
        />
        <CircuitProgress stops={tt.allStops} />
      </div>
    </div>
  )
}
