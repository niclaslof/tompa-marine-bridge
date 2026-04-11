interface CountdownDisplayProps {
  minutes: number
  seconds: number
  isLate: boolean
  pierName: string
  departureTime: string
}

export function CountdownDisplay({ minutes, seconds, isLate, pierName, departureTime }: CountdownDisplayProps) {
  const mm = String(minutes).padStart(2, '0')
  const ss = String(seconds).padStart(2, '0')

  // No stress: white when on time, soft blue when late. Never red, never "FÖRSENAD".
  const timeColor = isLate ? 'text-blue-400' : 'text-marine-text-bright'

  return (
    <div className="text-center py-4">
      {/* The countdown — biggest thing on screen */}
      <div className={`text-8xl sm:text-9xl font-mono font-bold tracking-tight leading-none tabular-nums ${timeColor}`}>
        {isLate && '−'}{mm}:{ss}
      </div>

      {/* Current pier + scheduled time */}
      <div className="mt-3 space-y-0.5">
        <div className="text-lg font-sans font-semibold text-marine-accent">{pierName}</div>
        <div className="text-marine-text-dim font-mono text-sm">avg. {departureTime}</div>
      </div>
    </div>
  )
}
