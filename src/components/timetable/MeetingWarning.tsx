import type { MeetingInfo } from '@/hooks/useTimetable'

interface MeetingWarningProps {
  meetings: MeetingInfo[]
}

export function MeetingWarning({ meetings }: MeetingWarningProps) {
  if (meetings.length === 0) return null

  return (
    <div className="space-y-2">
      <div className="text-xs font-mono uppercase tracking-wider text-marine-text-dim">
        Mötesvarning
      </div>
      {meetings.map((m, i) => (
        <div
          key={i}
          className={`rounded-xl border p-3 flex items-center gap-3 ${
            m.isNarrow
              ? 'bg-red-500/10 border-red-500/30'
              : 'bg-amber-500/10 border-amber-500/30'
          }`}
        >
          <div className={`text-2xl ${m.isNarrow ? 'animate-pulse' : ''}`}>
            {m.isNarrow ? '⚠️' : '🚢'}
          </div>
          <div className="flex-1">
            <div className="font-sans font-semibold text-sm text-marine-text-bright">
              {m.vesselName}
            </div>
            <div className="text-xs font-mono text-marine-text-dim">
              {m.pierName} kl {m.time}
              {m.isNarrow && (
                <span className="ml-2 text-red-400 font-bold">TRÅNG PASSAGE</span>
              )}
            </div>
          </div>
          {m.isNarrow && (
            <div className="text-xs font-mono text-red-400 text-right">
              Överväg att<br/>invänta
            </div>
          )}
        </div>
      ))}
    </div>
  )
}
