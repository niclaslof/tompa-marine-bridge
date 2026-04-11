import type { TimetableState } from '@/hooks/useTimetable'
import { CountdownDisplay } from './CountdownDisplay'
import { NextStopCard } from './NextStopCard'
import { SuggestedSpeed } from './SuggestedSpeed'
import { MeetingWarning } from './MeetingWarning'
import { CircuitSwitcher } from './CircuitSwitcher'

interface TimetableTabProps {
  tt: TimetableState
  onSwitchCircuit: (circuitId: string) => void
}

export function TimetableTab({ tt, onSwitchCircuit }: TimetableTabProps) {
  return (
    <div className="max-w-lg mx-auto p-3 space-y-3 relative">
      {/* GPS clock — top right, always visible */}
      <div className="flex items-center justify-between">
        <CircuitSwitcher
          line={tt.selectedLine}
          currentCircuit={tt.selectedCircuit}
          onSwitch={onSwitchCircuit}
        />
        <div className="flex items-center gap-2">
          <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-2xl font-mono font-bold text-marine-text-bright tabular-nums tracking-wider">
            {tt.gpsClock}
          </span>
        </div>
      </div>

      {/* THE countdown — center stage */}
      {tt.currentStop && (
        <CountdownDisplay
          minutes={tt.countdown.minutes}
          seconds={tt.countdown.seconds}
          isLate={tt.countdown.isLate}
          pierName={tt.currentStop.pier.name}
          departureTime={tt.currentStop.departure.time}
        />
      )}

      {/* "There after" — next stop */}
      <NextStopCard stop={tt.nextStop} />

      {/* Suggested speed — prominent */}
      <SuggestedSpeed
        speed={tt.suggestedSpeed}
        distanceNm={tt.nextStop?.distanceNm ?? 0}
      />

      {/* Meetings — critical operational info */}
      <MeetingWarning meetings={tt.meetings} />
    </div>
  )
}
