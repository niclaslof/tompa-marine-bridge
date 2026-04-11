import type { Circuit } from '@/data/ferryRoutes'

interface CircuitProgressProps {
  circuit: Circuit
  progress: number
  currentPierId: string | null
}

export function CircuitProgress({ circuit, progress, currentPierId }: CircuitProgressProps) {
  const stops = circuit.departures
  const uniquePiers = stops.reduce<{pierId: string; time: string; idx: number}[]>((acc, d, i) => {
    if (!acc.find(x => x.pierId === d.pierId && x.time === d.time)) {
      acc.push({ pierId: d.pierId, time: d.time, idx: i })
    }
    return acc
  }, [])

  return (
    <div className="bg-marine-panel rounded-xl border border-marine-border p-4">
      <div className="text-xs font-mono uppercase tracking-wider text-marine-text-dim mb-3">
        Rutt
      </div>

      {/* Progress bar */}
      <div className="relative h-1.5 bg-marine-border rounded-full mb-4">
        <div
          className="absolute top-0 left-0 h-full bg-gradient-to-r from-marine-accent to-amber-400 rounded-full transition-all duration-1000"
          style={{ width: `${Math.min(progress * 100, 100)}%` }}
        />
      </div>

      {/* Stop list */}
      <div className="space-y-1">
        {uniquePiers.map((stop) => {
          const isCurrent = stop.pierId === currentPierId
          const isPast = stop.idx / stops.length < progress
          return (
            <div
              key={`${stop.pierId}-${stop.time}`}
              className={`flex items-center gap-2 py-1 px-2 rounded text-xs font-mono transition-colors ${
                isCurrent
                  ? 'bg-marine-accent/15 text-marine-accent font-bold'
                  : isPast
                    ? 'text-marine-text-dim line-through opacity-50'
                    : 'text-marine-text'
              }`}
            >
              <div className={`w-2 h-2 rounded-full flex-shrink-0 ${
                isCurrent ? 'bg-marine-accent animate-pulse' :
                isPast ? 'bg-marine-text-dim' : 'bg-marine-border'
              }`} />
              <span className="flex-1">{stop.pierId.replace('89', '')}</span>
              <span>{stop.time}</span>
            </div>
          )
        })}
      </div>
    </div>
  )
}
