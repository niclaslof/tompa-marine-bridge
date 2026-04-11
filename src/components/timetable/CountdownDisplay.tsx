interface CountdownDisplayProps {
  minutes: number
  seconds: number
  isOverdue: boolean
  pierName: string
  departureTime: string
}

export function CountdownDisplay({ minutes, seconds, isOverdue, pierName, departureTime }: CountdownDisplayProps) {
  const timeStr = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`

  return (
    <div className="bg-marine-panel rounded-2xl border border-marine-border p-6 text-center">
      {/* Status label */}
      <div className={`text-xs font-mono uppercase tracking-widest mb-2 ${
        isOverdue ? 'text-red-400' : 'text-marine-text-dim'
      }`}>
        {isOverdue ? 'Försenad' : 'Avgång om'}
      </div>

      {/* Big countdown */}
      <div className={`text-7xl md:text-8xl font-mono font-bold tracking-tight leading-none ${
        isOverdue
          ? 'text-red-400 animate-pulse'
          : minutes < 1
            ? 'text-amber-400'
            : 'text-marine-text-bright'
      }`}>
        {isOverdue && '-'}{timeStr}
      </div>

      {/* Pier name and time */}
      <div className="mt-4 space-y-1">
        <div className="text-xl font-sans font-semibold text-marine-accent">{pierName}</div>
        <div className="text-marine-text-dim font-mono text-sm">
          Planerad avgång: <span className="text-marine-text">{departureTime}</span>
        </div>
      </div>
    </div>
  )
}
