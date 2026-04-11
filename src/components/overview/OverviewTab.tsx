import type { TimetableState } from '@/hooks/useTimetable'
import { parseTimeToMinutes } from '@/data/ferryRoutes'
import { CircuitProgress } from '@/components/timetable/CircuitProgress'

interface OverviewTabProps {
  tt: TimetableState
}

export function OverviewTab({ tt }: OverviewTabProps) {
  const now = new Date()
  const nowMin = now.getHours() * 60 + now.getMinutes()

  return (
    <div className="max-w-3xl mx-auto p-3 space-y-3">
      {/* Current selection */}
      <div className="text-center py-2">
        <div className="text-sm font-mono text-marine-text-dim">
          {tt.selectedLine.name} — {tt.selectedCircuit.label}
        </div>
      </div>

      {/* Full timetable */}
      <div className="bg-marine-panel rounded-xl border border-marine-border overflow-hidden">
        <div className="px-4 py-2 border-b border-marine-border">
          <div className="text-[10px] font-mono uppercase tracking-widest text-marine-text-dim">Alla avgångar</div>
        </div>
        <div className="divide-y divide-marine-border/50">
          {tt.allStops.map((stop, i) => {
            const meeting = tt.allMeetings.find(m =>
              m.pierName === stop.pier.name && m.myTime === stop.departure.time
            )
            return (
              <div
                key={`${stop.departure.pierId}-${stop.departure.time}-${i}`}
                className={`flex items-center px-4 py-2.5 text-sm font-mono ${
                  stop.isCurrent ? 'bg-marine-accent/10' :
                  stop.isPast ? 'opacity-30' : ''
                }`}
              >
                <div className={`w-2 h-2 rounded-full mr-3 flex-shrink-0 ${
                  stop.isCurrent ? 'bg-marine-accent' :
                  stop.isPast ? 'bg-marine-text-dim/30' : 'bg-marine-border'
                }`} />
                <span className={`flex-1 ${stop.isCurrent ? 'text-marine-accent font-semibold' : 'text-marine-text'}`}>
                  {stop.pier.name}
                  {stop.pier.narrow && !stop.isPast && <span className="ml-1.5 text-[10px] text-amber-400">trång</span>}
                </span>
                {meeting && !stop.isPast && (
                  <span className="text-[10px] text-amber-400 mr-3">
                    möte {meeting.otherCircuitLabel} {meeting.otherTime}
                  </span>
                )}
                {stop.distanceNm > 0 && !stop.isPast && (
                  <span className="text-marine-text-dim text-xs mr-3 w-12 text-right">{stop.distanceNm.toFixed(1)} nm</span>
                )}
                <span className={`tabular-nums w-12 text-right ${
                  stop.isCurrent ? 'text-marine-accent font-semibold' : 'text-marine-text-bright'
                }`}>{stop.departure.time}</span>
              </div>
            )
          })}
        </div>
      </div>

      {/* Route progress */}
      <CircuitProgress stops={tt.allStops} />

      {/* All meetings */}
      {tt.allMeetings.length > 0 && (
        <div className="bg-marine-panel rounded-xl border border-marine-border p-4">
          <div className="text-[10px] font-mono uppercase tracking-widest text-marine-text-dim mb-3">Möten under omloppet</div>
          <div className="space-y-1">
            {tt.allMeetings.map((m, i) => {
              const isPast = parseTimeToMinutes(m.myTime) < nowMin
              return (
                <div key={i} className={`flex items-center justify-between text-sm font-mono py-1 px-2 rounded ${isPast ? 'opacity-30' : m.isNarrow ? 'text-amber-400' : ''}`}>
                  <span className="text-marine-text">{m.pierName}{m.isNarrow && !isPast && ' ⚠'}</span>
                  <span className="text-marine-text-dim">{m.otherCircuitLabel} {m.otherTime} | du {m.myTime}</span>
                </div>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}
