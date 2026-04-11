import type { Meeting } from '@/data/ferryRoutes'

interface MeetingWarningProps {
  meetings: Meeting[]
}

export function MeetingWarning({ meetings }: MeetingWarningProps) {
  if (meetings.length === 0) return null

  return (
    <div className="space-y-2">
      <div className="text-[10px] font-mono uppercase tracking-widest text-marine-text-dim">
        Möten
      </div>
      {meetings.map((m, i) => (
        <div
          key={i}
          className={`rounded-xl border p-3 ${
            m.isNarrow
              ? 'bg-amber-500/10 border-amber-500/20'
              : 'bg-marine-panel border-marine-border'
          }`}
        >
          <div className="flex items-center justify-between">
            <div>
              <div className="font-sans text-sm text-marine-text-bright">
                {m.pierName}
                {m.isNarrow && <span className="ml-2 text-amber-400 text-xs font-mono">trång</span>}
              </div>
              <div className="text-xs font-mono text-marine-text-dim mt-0.5">
                {m.otherCircuitLabel} avg. {m.otherTime}
              </div>
            </div>
            <div className="text-right text-xs font-mono">
              <div className="text-marine-text-dim">du</div>
              <div className="text-marine-text">{m.myTime}</div>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
