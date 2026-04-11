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
    <div className="space-y-3">
      {/* Line selector */}
      <div>
        <div className="text-xs font-mono uppercase tracking-wider text-marine-text-dim mb-2">Linje</div>
        <div className="flex gap-2">
          {FERRY_LINES.map(line => (
            <button
              key={line.id}
              onClick={() => onSelectLine(line.id)}
              className={`flex-1 py-3 px-4 rounded-xl font-sans font-semibold text-sm transition-all ${
                selectedLine.id === line.id
                  ? 'text-white shadow-lg scale-[1.02]'
                  : 'bg-marine-panel border border-marine-border text-marine-text-dim hover:text-marine-text hover:border-marine-text-dim'
              }`}
              style={selectedLine.id === line.id ? {
                background: `linear-gradient(135deg, ${line.color}, ${line.color}88)`,
                borderColor: line.color,
              } : undefined}
            >
              {line.name}
              <div className="text-[10px] opacity-70 mt-0.5 font-mono">
                {line.piers[0].name} → {line.piers[line.piers.length - 1].name}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Circuit/Omlopp selector */}
      <div>
        <div className="text-xs font-mono uppercase tracking-wider text-marine-text-dim mb-2">Omlopp</div>
        <select
          value={selectedCircuit.id}
          onChange={e => onSelectCircuit(e.target.value)}
          className="w-full bg-marine-panel border border-marine-border rounded-xl px-4 py-2.5 text-sm font-mono text-marine-text-bright focus:outline-none focus:border-marine-accent appearance-none cursor-pointer"
          style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath d='M3 5l3 3 3-3' stroke='%236b8a9e' fill='none' stroke-width='1.5'/%3E%3C/svg%3E")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 12px center' }}
        >
          {circuits.map(c => (
            <option key={c.id} value={c.id}>{c.label}</option>
          ))}
        </select>
      </div>
    </div>
  )
}
