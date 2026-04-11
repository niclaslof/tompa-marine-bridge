import type { StopInfo } from '@/hooks/useTimetable'

interface CircuitProgressProps {
  stops: StopInfo[]
}

export function CircuitProgress({ stops }: CircuitProgressProps) {
  return (
    <div className="bg-marine-panel rounded-xl border border-marine-border p-4">
      <div className="text-[10px] font-mono uppercase tracking-widest text-marine-text-dim mb-3">Rutt</div>
      <div className="space-y-0.5">
        {stops.map((stop, i) => (
          <div
            key={`${stop.departure.pierId}-${stop.departure.time}-${i}`}
            className={`flex items-center gap-2 py-1.5 px-2 rounded text-sm font-mono transition-colors ${
              stop.isCurrent
                ? 'bg-marine-accent/10 text-marine-accent font-semibold'
                : stop.isPast
                  ? 'text-marine-text-dim/40'
                  : 'text-marine-text'
            }`}
          >
            <div className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${
              stop.isCurrent ? 'bg-marine-accent' :
              stop.isPast ? 'bg-marine-text-dim/30' : 'bg-marine-border'
            }`} />
            <span className="flex-1 truncate">{stop.pier.name}</span>
            <span className="tabular-nums">{stop.departure.time}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
