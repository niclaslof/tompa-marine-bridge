import { useState, useMemo } from 'react'
import { FERRY_LINES, getCircuitsForLine, getCurrentSeason, parseTimeToMinutes, flattenCircuit } from '@/data/ferryRoutes'

interface HomeScreenProps {
  onStart: (lineId: string, circuitId: string) => void
}

export function HomeScreen({ onStart }: HomeScreenProps) {
  const [selectedLineId, setSelectedLineId] = useState<string | null>(null)
  const season = getCurrentSeason()

  const selectedLine = FERRY_LINES.find(l => l.id === selectedLineId)
  const circuits = useMemo(
    () => selectedLineId ? getCircuitsForLine(selectedLineId) : [],
    [selectedLineId]
  )

  const now = new Date()
  const nowMin = now.getHours() * 60 + now.getMinutes()

  const activeCircuitId = useMemo(() => {
    for (const c of circuits) {
      const flat = flattenCircuit(c, selectedLine?.piers ?? [])
      const lastDep = flat[flat.length - 1]
      if (lastDep && parseTimeToMinutes(lastDep.time) >= nowMin - 5) return c.id
    }
    return circuits[0]?.id
  }, [circuits, nowMin])

  return (
    <div className="min-h-screen bg-marine-bg text-marine-text flex flex-col items-center justify-center p-6">
      <div className="mb-8 text-center">
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-marine-accent to-amber-600 flex items-center justify-center mx-auto mb-3">
          <span className="text-white font-bold text-3xl">T</span>
        </div>
        <h1 className="text-2xl font-sans font-bold text-marine-text-bright">TOMPA</h1>
        <p className="text-xs font-mono text-marine-text-dim mt-1">{season.label} {now.getFullYear()}</p>
      </div>

      {/* Step 1: Pick line */}
      {!selectedLineId && (
        <div className="w-full max-w-md space-y-3">
          <div className="text-center text-sm font-mono text-marine-text-dim mb-4">Välj linje</div>
          {FERRY_LINES.map(line => (
            <button
              key={line.id}
              onClick={() => setSelectedLineId(line.id)}
              className="w-full bg-marine-panel border border-marine-border rounded-xl p-5 text-left hover:border-marine-accent transition-colors"
            >
              <div className="text-lg font-sans font-bold text-marine-text-bright">{line.name}</div>
              <div className="text-sm font-mono text-marine-text-dim mt-1">{line.description}</div>
            </button>
          ))}
        </div>
      )}

      {/* Step 2: Pick circuit — ONE TAP and you're in */}
      {selectedLineId && (
        <div className="w-full max-w-md">
          <button
            onClick={() => setSelectedLineId(null)}
            className="text-sm font-mono text-marine-text-dim hover:text-marine-text mb-4"
          >
            ← Byt linje
          </button>
          <div className="text-center mb-4">
            <div className="text-lg font-sans font-semibold text-marine-accent">{selectedLine?.name}</div>
            <div className="text-xs font-mono text-marine-text-dim">Välj omlopp</div>
          </div>
          <div className="space-y-1.5 max-h-[60vh] overflow-y-auto">
            {circuits.map(c => {
              const isActive = c.id === activeCircuitId
              return (
                <button
                  key={c.id}
                  onClick={() => onStart(selectedLineId, c.id)}
                  className={`w-full rounded-lg p-3 text-left font-mono text-sm transition-colors flex items-center justify-between ${
                    isActive
                      ? 'bg-marine-accent/15 border border-marine-accent/30 text-marine-accent'
                      : 'bg-marine-panel border border-marine-border text-marine-text hover:border-marine-accent/50'
                  }`}
                >
                  <span className="font-semibold">{c.label}</span>
                  <span className="text-marine-text-dim">avg. {c.startTime}</span>
                </button>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}
