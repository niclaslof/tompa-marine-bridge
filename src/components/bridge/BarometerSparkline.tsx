interface BarometerSparklineProps {
  history: number[]
  current: number
}

export function BarometerSparkline({ history, current }: BarometerSparklineProps) {
  const min = Math.min(...history) - 1
  const max = Math.max(...history) + 1
  const range = max - min
  const w = 120
  const h = 32

  const points = history.map((v, i) => {
    const x = (i / (history.length - 1)) * w
    const y = h - ((v - min) / range) * h
    return `${x},${y}`
  }).join(' ')

  const trend = current - history[0]
  const trendLabel = trend > 0.5 ? 'Stigande' : trend < -0.5 ? 'Fallande' : 'Stabil'
  const trendColor = trend > 0.5 ? 'text-marine-green' : trend < -0.5 ? 'text-marine-red' : 'text-marine-text-dim'

  return (
    <div className="bg-marine-panel rounded-lg p-3 border border-marine-border">
      <h3 className="text-marine-text-dim text-xs font-mono mb-2 uppercase tracking-wider">Barometer</h3>
      <div className="flex items-center gap-3">
        <div className="text-center">
          <span className="text-2xl font-mono font-bold text-marine-text-bright">{Math.round(current)}</span>
          <span className="text-marine-text-dim text-xs font-mono block">hPa</span>
        </div>
        <div>
          <svg width={w} height={h} className="overflow-visible">
            <polyline
              points={points}
              fill="none"
              stroke="#3498db"
              strokeWidth="1.5"
            />
          </svg>
          <span className={`text-[10px] font-mono ${trendColor}`}>{trendLabel}</span>
        </div>
      </div>
    </div>
  )
}
