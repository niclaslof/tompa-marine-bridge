import { FERRY_LINES, LINE_80_CIRCUITS, LINE_89_CIRCUITS } from '@/data/ferryRoutes'
import type { FerryLine, Circuit } from '@/data/ferryRoutes'

interface RouteSelectorProps {
  selectedLine: FerryLine
  selectedCircuit: Circuit
  onSelectLine: (lineId: string) => void
  onSelectCircuit: (circuitId: string) => void
}

export function RouteSelector({ selectedLine, selectedCircuit, onSelectLine, onSelectCircuit }: RouteSelectorProps) {
  const circuits = selectedLine.id === 'L80' ? LINE_80_CIRCUITS : LINE_89_CIRCUITS

  return (
    <div className="bg-marine-panel rounded-xl border border-marine-border p-4 space-y-3">
      {/* Line selector */}
      <div>
        <div className="text-[10px] font-mono uppercase tracking-widest text-marine-text-dim mb-2">Linje</div>
        <div className="flex gap-2">
          {FERRY_LINES.map(line => (
            <button
              key={line.id}
              onClick={() => onSelectLine(line.id)}
              className={`flex-1 py-2 px-3 rounded-lg font-mono text-sm transition-all ${
                selectedLine.id === line.id
                  ? 'bg-marine-accent/15 border border-marine-accent/30 text-marine-accent font-semibold'
                  : 'bg-marine-panel-light border border-marine-border text-marine-text-dim hover:text-marine-text'
              }`}
            >
              {line.name}
            </button>
          ))}
        </div>
        <div className="text-[10px] font-mono text-marine-text-dim mt-1.5">{selectedLine.description}</div>
      </div>

      {/* Omlopp selector */}
      <div>
        <div className="text-[10px] font-mono uppercase tracking-widest text-marine-text-dim mb-2">Omlopp</div>
        <select
          value={selectedCircuit.id}
          onChange={e => onSelectCircuit(e.target.value)}
          className="w-full bg-marine-panel-light border border-marine-border rounded-lg px-3 py-2 text-sm font-mono text-marine-text-bright focus:outline-none focus:border-marine-accent cursor-pointer"
        >
          {circuits.map(c => {
            const firstDep = c.departures[0]
            return (
              <option key={c.id} value={c.id}>
                {c.label} — avg. {firstDep.time}
              </option>
            )
          })}
        </select>
      </div>
    </div>
  )
}
