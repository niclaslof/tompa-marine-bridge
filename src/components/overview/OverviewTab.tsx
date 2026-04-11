import { useMemo } from 'react'
import { useTimetable } from '@/hooks/useTimetable'
import {
  LINE_80_CIRCUITS, LINE_89_CIRCUITS,
  findMeetings, parseTimeToMinutes,
} from '@/data/ferryRoutes'

export function OverviewTab() {
  const tt = useTimetable()
  const circuits = tt.selectedLine.id === 'L80' ? LINE_80_CIRCUITS : LINE_89_CIRCUITS

  // All meetings for selected circuit (not just upcoming)
  const allMeetings = useMemo(() => {
    return findMeetings(tt.selectedLine.id, tt.selectedCircuit, circuits, tt.selectedLine.piers, 5)
  }, [tt.selectedLine, tt.selectedCircuit, circuits])

  const now = useMemo(() => {
    const n = new Date()
    return n.getHours() * 60 + n.getMinutes()
  }, [tt.gpsClock]) // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className="max-w-3xl mx-auto p-3 space-y-3">
      {/* Current selection */}
      <div className="text-center py-2">
        <div className="text-xs font-mono text-marine-text-dim uppercase tracking-widest">
          {tt.selectedLine.name} — {tt.selectedCircuit.label}
        </div>
        <div className="text-sm font-mono text-marine-text-dim mt-0.5">
          {tt.selectedLine.description}
        </div>
      </div>

      {/* Full timetable for this circuit */}
      <div className="bg-marine-panel rounded-xl border border-marine-border overflow-hidden">
        <div className="px-4 py-2 border-b border-marine-border">
          <div className="text-[10px] font-mono uppercase tracking-widest text-marine-text-dim">Alla avgångar</div>
        </div>
        <div className="divide-y divide-marine-border/50">
          {tt.allStops.map((stop, i) => {
            const depMin = parseTimeToMinutes(stop.departure.time)
            const meeting = allMeetings.find(m =>
              m.pierName === stop.pier.name && m.myTime === stop.departure.time
            )

            return (
              <div
                key={`${stop.departure.pierId}-${stop.departure.time}-${i}`}
                className={`flex items-center px-4 py-2.5 text-sm font-mono transition-colors ${
                  stop.isCurrent
                    ? 'bg-marine-accent/10'
                    : stop.isPast
                      ? 'opacity-30'
                      : 'hover:bg-marine-panel-light'
                }`}
              >
                {/* Indicator */}
                <div className={`w-2 h-2 rounded-full mr-3 flex-shrink-0 ${
                  stop.isCurrent ? 'bg-marine-accent' :
                  stop.isPast ? 'bg-marine-text-dim/30' : 'bg-marine-border'
                }`} />

                {/* Pier name */}
                <span className={`flex-1 ${
                  stop.isCurrent ? 'text-marine-accent font-semibold' : 'text-marine-text'
                }`}>
                  {stop.pier.name}
                  {stop.pier.narrow && !stop.isPast && (
                    <span className="ml-1.5 text-[10px] text-amber-400">trång</span>
                  )}
                </span>

                {/* Meeting indicator */}
                {meeting && !stop.isPast && (
                  <span className="text-[10px] text-amber-400 mr-3">
                    möte {meeting.otherCircuitLabel} {meeting.otherTime}
                  </span>
                )}

                {/* Distance */}
                {stop.distanceNm > 0 && !stop.isPast && (
                  <span className="text-marine-text-dim text-xs mr-3 w-12 text-right">
                    {stop.distanceNm.toFixed(1)} nm
                  </span>
                )}

                {/* Time */}
                <span className={`tabular-nums w-12 text-right ${
                  stop.isCurrent ? 'text-marine-accent font-semibold' :
                  depMin < now ? 'text-marine-text-dim' : 'text-marine-text-bright'
                }`}>
                  {stop.departure.time}
                </span>
              </div>
            )
          })}
        </div>
      </div>

      {/* All meetings for this circuit */}
      {allMeetings.length > 0 && (
        <div className="bg-marine-panel rounded-xl border border-marine-border p-4">
          <div className="text-[10px] font-mono uppercase tracking-widest text-marine-text-dim mb-3">
            Möten under omloppet
          </div>
          <div className="space-y-1.5">
            {allMeetings.map((m, i) => {
              const meetMin = parseTimeToMinutes(m.myTime)
              const isPast = meetMin < now
              return (
                <div
                  key={i}
                  className={`flex items-center justify-between text-sm font-mono py-1 px-2 rounded ${
                    isPast ? 'opacity-30' : m.isNarrow ? 'text-amber-400' : ''
                  }`}
                >
                  <span className={isPast ? 'text-marine-text-dim' : 'text-marine-text'}>
                    {m.pierName}
                    {m.isNarrow && !isPast && ' ⚠'}
                  </span>
                  <span className="text-marine-text-dim">
                    {m.otherCircuitLabel} {m.otherTime}
                    <span className="text-marine-text-dim/50 mx-1">|</span>
                    du {m.myTime}
                  </span>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* Quick stats */}
      <div className="grid grid-cols-3 gap-3">
        <StatCard label="Stopp kvar" value={String(tt.allStops.filter(s => !s.isPast && !s.isCurrent).length)} />
        <StatCard label="Total nm" value={tt.allStops.reduce((sum, s) => sum + s.distanceNm, 0).toFixed(1)} />
        <StatCard label="Möten" value={String(allMeetings.filter(m => parseTimeToMinutes(m.myTime) >= now).length)} />
      </div>
    </div>
  )
}

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-marine-panel rounded-xl border border-marine-border p-3 text-center">
      <div className="text-xl font-mono font-bold text-marine-text-bright">{value}</div>
      <div className="text-[10px] font-mono text-marine-text-dim uppercase tracking-widest">{label}</div>
    </div>
  )
}
