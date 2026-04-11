interface SuggestedSpeedProps {
  speed: number | null
  distanceNm: number
}

export function SuggestedSpeed({ speed, distanceNm }: SuggestedSpeedProps) {
  if (!speed || speed <= 0) return null

  return (
    <div className="bg-marine-panel rounded-xl border border-marine-border p-4 flex items-center justify-between">
      <div>
        <div className="text-[10px] font-mono uppercase tracking-widest text-marine-text-dim">Rec. fart</div>
        <div className="text-3xl font-mono font-bold text-emerald-400 tabular-nums">{speed} <span className="text-lg">kn</span></div>
      </div>
      {distanceNm > 0 && (
        <div className="text-right">
          <div className="text-[10px] font-mono uppercase tracking-widest text-marine-text-dim">Avstånd</div>
          <div className="text-lg font-mono text-marine-text-bright tabular-nums">{distanceNm.toFixed(1)} <span className="text-sm text-marine-text-dim">nm</span></div>
        </div>
      )}
    </div>
  )
}
