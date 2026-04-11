import { useMemo } from 'react'
import { getScheduleLog, computeAnalytics } from '@/hooks/useScheduleTracking'

export function ScheduleAnalytics() {
  const analytics = useMemo(() => {
    const log = getScheduleLog()
    return computeAnalytics(log)
  }, [])

  if (analytics.totalEntries === 0) {
    return (
      <div className="bg-marine-panel rounded-xl border border-marine-border p-4">
        <div className="text-[10px] font-mono uppercase tracking-widest text-marine-text-dim mb-2">Tidtabellshållning</div>
        <div className="text-sm font-mono text-marine-text-dim text-center py-4">
          Ingen data ännu. Kör ett omlopp för att börja samla statistik.
        </div>
      </div>
    )
  }

  return (
    <div className="bg-marine-panel rounded-xl border border-marine-border p-4">
      <div className="text-[10px] font-mono uppercase tracking-widest text-marine-text-dim mb-3">Tidtabellshållning</div>

      {/* Summary */}
      <div className="grid grid-cols-3 gap-3 mb-4">
        <div className="text-center">
          <div className={`text-2xl font-mono font-bold ${analytics.overallOnTime >= 80 ? 'text-emerald-400' : analytics.overallOnTime >= 60 ? 'text-amber-400' : 'text-blue-400'}`}>
            {analytics.overallOnTime}%
          </div>
          <div className="text-[10px] font-mono text-marine-text-dim">I tid (±60s)</div>
        </div>
        <div className="text-center">
          <div className={`text-2xl font-mono font-bold ${Math.abs(analytics.avgDeviation) <= 30 ? 'text-marine-text-bright' : 'text-blue-400'}`}>
            {analytics.avgDeviation > 0 ? '+' : ''}{analytics.avgDeviation}s
          </div>
          <div className="text-[10px] font-mono text-marine-text-dim">Snitt avvikelse</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-mono font-bold text-marine-text-bright">{analytics.totalEntries}</div>
          <div className="text-[10px] font-mono text-marine-text-dim">Registreringar</div>
        </div>
      </div>

      {/* Per pier */}
      {analytics.pierStats.length > 0 && (
        <div className="space-y-1">
          <div className="text-[10px] font-mono uppercase tracking-widest text-marine-text-dim mb-1">Per brygga</div>
          {analytics.pierStats.map(ps => (
            <div key={ps.pierName} className="flex items-center justify-between text-xs font-mono py-1 px-2 rounded hover:bg-marine-panel-light">
              <span className="text-marine-text flex-1">{ps.pierName}</span>
              <span className="text-marine-text-dim w-10 text-right">{ps.count}st</span>
              <span className={`w-14 text-right ${ps.onTimePercent >= 80 ? 'text-emerald-400' : 'text-blue-400'}`}>{ps.onTimePercent}%</span>
              <span className={`w-14 text-right ${Math.abs(ps.avgDeviation) <= 30 ? 'text-marine-text-dim' : 'text-blue-400'}`}>
                {ps.avgDeviation > 0 ? '+' : ''}{ps.avgDeviation}s
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
