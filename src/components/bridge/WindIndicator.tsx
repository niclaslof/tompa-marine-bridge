interface WindIndicatorProps {
  awa: number      // Apparent wind angle (degrees, negative = port)
  aws: number      // Apparent wind speed (knots)
  tws: number      // True wind speed
  twd: number      // True wind direction
  gust: number
}

export function WindIndicator({ awa, aws, tws, gust }: WindIndicatorProps) {
  const awaRad = (awa * Math.PI) / 180
  const arrowX = 50 + 35 * Math.sin(awaRad)
  const arrowY = 50 - 35 * Math.cos(awaRad)

  return (
    <div className="bg-marine-panel rounded-lg p-3 border border-marine-border">
      <h3 className="text-marine-text-dim text-xs font-mono mb-2 uppercase tracking-wider">Vind</h3>
      <div className="flex items-center gap-4">
        {/* Wind angle indicator */}
        <div className="w-24 h-24 flex-shrink-0">
          <svg viewBox="0 0 100 100" className="w-full h-full">
            <circle cx="50" cy="50" r="40" fill="none" stroke="#1a3a4a" strokeWidth="1.5" />
            {/* Port/Starboard arcs */}
            <path d="M 50 10 A 40 40 0 0 0 50 90" fill="none" stroke="#e74c3c" strokeWidth="1" opacity="0.3" />
            <path d="M 50 10 A 40 40 0 0 1 50 90" fill="none" stroke="#2ecc71" strokeWidth="1" opacity="0.3" />
            {/* Ship */}
            <line x1="50" y1="38" x2="50" y2="62" stroke="#6b8a9e" strokeWidth="2" />
            {/* Wind arrow */}
            <line
              x1="50" y1="50" x2={arrowX} y2={arrowY}
              stroke="#3498db" strokeWidth="2.5"
              style={{ transition: 'all 0.5s ease-out' }}
            />
            <circle cx={arrowX} cy={arrowY} r="3" fill="#3498db"
              style={{ transition: 'all 0.5s ease-out' }}
            />
          </svg>
        </div>
        {/* Wind data */}
        <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-sm font-mono">
          <span className="text-marine-text-dim">AWA</span>
          <span className="text-marine-text-bright">{awa > 0 ? '+' : ''}{awa}°</span>
          <span className="text-marine-text-dim">AWS</span>
          <span className="text-marine-text-bright">{aws} kn</span>
          <span className="text-marine-text-dim">TWS</span>
          <span className="text-marine-text-bright">{tws} kn</span>
          <span className="text-marine-text-dim">Byvind</span>
          <span className="text-marine-yellow">{gust} kn</span>
        </div>
      </div>
    </div>
  )
}
