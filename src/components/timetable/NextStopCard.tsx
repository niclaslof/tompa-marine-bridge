import type { DepartureInfo } from '@/hooks/useTimetable'

interface NextStopCardProps {
  label: string
  stop: DepartureInfo | null
  suggestedSpeed?: number | null
  accent?: boolean
}

export function NextStopCard({ label, stop, suggestedSpeed, accent }: NextStopCardProps) {
  if (!stop) {
    return (
      <div className="bg-marine-panel rounded-xl border border-marine-border p-4 opacity-50">
        <div className="text-xs font-mono uppercase tracking-wider text-marine-text-dim">{label}</div>
        <div className="text-marine-text-dim font-mono mt-2">Inga fler stopp</div>
      </div>
    )
  }

  return (
    <div className={`rounded-xl border p-4 ${
      accent
        ? 'bg-marine-accent/10 border-marine-accent/30'
        : 'bg-marine-panel border-marine-border'
    }`}>
      <div className="text-xs font-mono uppercase tracking-wider text-marine-text-dim mb-2">{label}</div>
      <div className="flex items-center justify-between">
        <div>
          <div className={`text-lg font-sans font-semibold ${accent ? 'text-marine-accent' : 'text-marine-text-bright'}`}>
            {stop.pier.name}
          </div>
          <div className="text-sm font-mono text-marine-text-dim">
            Avg. {stop.departure.time}
          </div>
        </div>
        <div className="text-right">
          {stop.distanceNm > 0 && (
            <div className="text-xs font-mono text-marine-text-dim">
              {stop.distanceNm.toFixed(1)} nm
            </div>
          )}
          {suggestedSpeed != null && suggestedSpeed > 0 && (
            <div className="flex items-center gap-1 mt-1">
              <span className="text-[10px] font-mono text-marine-text-dim uppercase">Fart:</span>
              <span className="text-sm font-mono font-bold text-emerald-400">
                {suggestedSpeed} kn
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
