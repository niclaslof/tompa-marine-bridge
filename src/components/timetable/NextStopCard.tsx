import type { StopInfo } from '@/hooks/useTimetable'

interface NextStopCardProps {
  stop: StopInfo | null
  suggestedSpeed?: number | null
}

export function NextStopCard({ stop, suggestedSpeed }: NextStopCardProps) {
  if (!stop) return null

  return (
    <div className="bg-marine-panel rounded-xl border border-marine-border p-4">
      <div className="text-[10px] font-mono uppercase tracking-widest text-marine-text-dim mb-1">Nästa</div>
      <div className="flex items-center justify-between">
        <div>
          <div className="text-base font-sans font-semibold text-marine-text-bright">{stop.pierName}</div>
          <div className="text-sm font-mono text-marine-text-dim">avg. {stop.time}</div>
        </div>
        <div className="text-right font-mono text-sm">
          {stop.distanceNm > 0 && (
            <div className="text-marine-text-dim">{stop.distanceNm.toFixed(1)} nm</div>
          )}
          {suggestedSpeed != null && suggestedSpeed > 0 && (
            <div className="text-emerald-400 font-semibold">{suggestedSpeed} kn</div>
          )}
        </div>
      </div>
    </div>
  )
}
