import { useState } from 'react'
import { getCircuitsForLine, parseTimeToMinutes, flattenCircuit } from '@/data/ferryRoutes'
import type { FerryLine, Circuit } from '@/data/ferryRoutes'

interface CircuitSwitcherProps {
  line: FerryLine
  currentCircuit: Circuit
  onSwitch: (circuitId: string) => void
}

export function CircuitSwitcher({ line, currentCircuit, onSwitch }: CircuitSwitcherProps) {
  const [open, setOpen] = useState(false)
  const circuits = getCircuitsForLine(line.id)
  const now = new Date()
  const nowMin = now.getHours() * 60 + now.getMinutes()

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="text-xs font-mono text-marine-text-dim hover:text-marine-accent transition-colors underline underline-offset-2"
      >
        Byt omlopp
      </button>
    )
  }

  return (
    <div className="bg-marine-panel rounded-xl border border-marine-border p-3">
      <div className="flex items-center justify-between mb-2">
        <span className="text-[10px] font-mono uppercase tracking-widest text-marine-text-dim">Byt omlopp</span>
        <button onClick={() => setOpen(false)} className="text-xs font-mono text-marine-text-dim hover:text-marine-text">✕</button>
      </div>
      <div className="space-y-1 max-h-48 overflow-y-auto">
        {circuits.map(c => {
          const flat = flattenCircuit(c, line.piers)
          const lastDep = flat[flat.length - 1]
          const isPast = !lastDep || parseTimeToMinutes(lastDep.time) < nowMin - 5
          const isCurrent = c.id === currentCircuit.id
          return (
            <button
              key={c.id}
              disabled={isPast}
              onClick={() => { onSwitch(c.id); setOpen(false) }}
              className={`w-full text-left rounded-lg px-3 py-2 text-sm font-mono flex justify-between transition-colors ${
                isCurrent ? 'bg-marine-accent/15 text-marine-accent' :
                isPast ? 'text-marine-text-dim/30 cursor-not-allowed' :
                'text-marine-text hover:bg-marine-panel-light'
              }`}
            >
              <span>{c.label}</span>
              <span className="text-marine-text-dim">{c.startTime}</span>
            </button>
          )
        })}
      </div>
    </div>
  )
}
