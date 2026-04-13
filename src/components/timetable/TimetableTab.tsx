import type { TimetableState } from '@/hooks/useTimetable'
import { RouteMap } from './RouteMap'

interface TimetableTabProps {
  tt: TimetableState
  onSwitchCircuit: (circuitId: string) => void
}

export function TimetableTab({ tt, onSwitchCircuit: _onSwitchCircuit }: TimetableTabProps) {
  const { currentStop, nextStop, afterStop, upcomingStops, countdown, suggestedSpeed, gpsClock, meetings } = tt

  return (
    <div className="flex gap-3 p-3 h-[calc(100vh-90px)]">
    {/* Left: Timetable */}
    <div className="flex-1 max-w-lg space-y-3 overflow-y-auto">
      {/* GPS Clock */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-xs font-mono text-marine-text-dim">GPS</span>
        </div>
        <span className="text-2xl font-mono font-bold text-marine-text-bright tabular-nums tracking-wider">
          {gpsClock}
        </span>
      </div>

      {/* ─── AVGÅNG OM ─── */}
      {currentStop && (
        <div className="bg-marine-panel rounded-2xl border border-marine-border p-6 text-center">
          <div className="text-xs font-mono uppercase tracking-widest text-marine-text-dim mb-2">Avgång om</div>
          <div className={`text-8xl font-mono font-bold tracking-tight leading-none tabular-nums ${
            countdown.isLate ? 'text-blue-400' : 'text-marine-text-bright'
          }`}>
            {countdown.isLate && '−'}{String(countdown.minutes).padStart(2, '0')}:{String(countdown.seconds).padStart(2, '0')}
          </div>
          <div className="mt-3">
            <div className="text-xl font-sans font-semibold text-marine-accent">{currentStop.pierName}</div>
            <div className="text-sm font-mono text-marine-text-dim mt-0.5">
              Planerad avgång: <span className="text-marine-text">{currentStop.time}</span>
            </div>
          </div>
        </div>
      )}

      {/* ─── NÄSTA BRYGGA ─── */}
      {nextStop && (
        <div className="bg-marine-panel rounded-xl border border-marine-border p-4">
          <div className="text-[10px] font-mono uppercase tracking-widest text-marine-text-dim mb-1">Nästa brygga</div>
          <div className="flex items-center justify-between">
            <div>
              <div className="text-lg font-sans font-semibold text-marine-accent">{nextStop.pierName}</div>
              <div className="text-sm font-mono text-marine-text-dim">Avg. {nextStop.time}</div>
            </div>
            <div className="text-right font-mono">
              {nextStop.distanceNm > 0 && (
                <div className="text-sm text-marine-text-dim">{nextStop.distanceNm.toFixed(1)} nm</div>
              )}
              {suggestedSpeed != null && suggestedSpeed > 0 && (
                <div className="text-sm">
                  <span className="text-marine-text-dim">FART: </span>
                  <span className="text-emerald-400 font-bold">{suggestedSpeed} kn</span>
                </div>
              )}
            </div>
          </div>
          {/* Meeting on this card */}
          {meetings.length > 0 && (
            <div className="mt-2 pt-2 border-t border-marine-border/50">
              {meetings.map((m, i) => (
                <div key={i} className="text-xs font-mono text-amber-400">
                  MÖTE: {m.otherCircuitLabel} avg: {m.otherTime} ({m.pierName})
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ─── DÄREFTER ─── */}
      {afterStop && (
        <div className="bg-marine-panel rounded-xl border border-marine-border p-4">
          <div className="text-[10px] font-mono uppercase tracking-widest text-marine-text-dim mb-1">Därefter</div>
          <div className="flex items-center justify-between">
            <div>
              <div className="text-base font-sans font-semibold text-marine-text-bright">{afterStop.pierName}</div>
              <div className="text-sm font-mono text-marine-text-dim">Avg. {afterStop.time}</div>
            </div>
            {afterStop.distanceNm > 0 && (
              <div className="text-sm font-mono text-marine-text-dim">{afterStop.distanceNm.toFixed(1)} nm</div>
            )}
          </div>
        </div>
      )}

      {/* ─── KOMMANDE ─── */}
      {upcomingStops.length > 0 && (
        <div className="bg-marine-panel rounded-xl border border-marine-border p-4">
          <div className="text-[10px] font-mono uppercase tracking-widest text-marine-text-dim mb-2">Kommande</div>
          <div className="space-y-1">
            {upcomingStops.map((stop, i) => (
              <div key={i} className="flex items-center justify-between text-sm font-mono py-1">
                <span className="text-marine-text">{stop.pierName}</span>
                <span className="text-marine-text-dim tabular-nums">{stop.time}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Simulator controls */}
      <SimulatorBar tt={tt} />
    </div>

    {/* Right: Map */}
    <div className="hidden lg:block w-[400px] flex-shrink-0">
      <RouteMap
        allStops={tt.allStops}
        currentStop={currentStop}
        nextStop={nextStop}
      />
    </div>
    </div>
  )
}

function SimulatorBar({ tt }: { tt: TimetableState }) {
  const handlePlay = () => {
    // Start simulation at circuit start time
    const [h, m] = tt.selectedCircuit.startTime.split(':').map(Number)
    tt.setSimulatedTime(h * 60 + m)
  }

  const handleAdvance = () => {
    if (tt.simulatedTime !== null) {
      tt.setSimulatedTime(tt.simulatedTime + 1) // +1 minute
    }
  }

  const handleReset = () => {
    tt.setSimulatedTime(null) // back to real time
  }

  return (
    <div className="bg-marine-panel rounded-xl border border-marine-border p-3">
      <div className="text-[10px] font-mono uppercase tracking-widest text-marine-text-dim mb-2">Simulering</div>
      <div className="flex gap-2">
        {tt.simulatedTime === null ? (
          <button
            onClick={handlePlay}
            className="flex-1 bg-marine-accent/15 border border-marine-accent/30 text-marine-accent py-2 rounded-lg text-sm font-mono hover:bg-marine-accent/25 transition-colors"
          >
            ▶ Starta från {tt.selectedCircuit.startTime}
          </button>
        ) : (
          <>
            <button
              onClick={handleAdvance}
              className="flex-1 bg-marine-panel-light border border-marine-border text-marine-text py-2 rounded-lg text-sm font-mono hover:bg-marine-accent/15 transition-colors"
            >
              +1 min
            </button>
            <button
              onClick={() => tt.setSimulatedTime(tt.simulatedTime! + 5)}
              className="flex-1 bg-marine-panel-light border border-marine-border text-marine-text py-2 rounded-lg text-sm font-mono hover:bg-marine-accent/15 transition-colors"
            >
              +5 min
            </button>
            <button
              onClick={handleReset}
              className="bg-marine-panel-light border border-marine-border text-marine-text-dim py-2 px-3 rounded-lg text-sm font-mono hover:text-marine-text transition-colors"
            >
              ✕ Live
            </button>
          </>
        )}
      </div>
    </div>
  )
}
