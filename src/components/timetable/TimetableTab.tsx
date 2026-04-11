import { useTimetable } from '@/hooks/useTimetable'
import { CountdownDisplay } from './CountdownDisplay'
import { NextStopCard } from './NextStopCard'
import { MeetingWarning } from './MeetingWarning'
import { CircuitProgress } from './CircuitProgress'
import { RouteSelector } from './RouteSelector'

export function TimetableTab() {
  const tt = useTimetable()

  return (
    <div className="max-w-5xl mx-auto p-3 grid grid-cols-1 lg:grid-cols-3 gap-3">
      {/* Left column: Countdown + Next stops */}
      <div className="lg:col-span-2 space-y-3">
        {/* GPS Clock */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-xs font-mono text-marine-text-dim">GPS</span>
          </div>
          <div className="text-2xl font-mono font-bold text-marine-text-bright tracking-wider">
            {tt.gpsClock}
          </div>
        </div>

        {/* Main countdown */}
        {tt.currentStop && (
          <CountdownDisplay
            minutes={tt.countdown.minutes}
            seconds={tt.countdown.seconds}
            isOverdue={tt.countdown.isOverdue}
            pierName={tt.currentStop.pier.name}
            departureTime={tt.currentStop.departure.time}
          />
        )}

        {/* Next stops */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <NextStopCard
            label="Nästa brygga"
            stop={tt.nextStop}
            suggestedSpeed={tt.suggestedSpeed}
            accent
          />
          {tt.upcomingStops[0] && (
            <NextStopCard
              label="Därefter"
              stop={tt.upcomingStops[0]}
            />
          )}
        </div>

        {/* Upcoming stops list */}
        {tt.upcomingStops.length > 1 && (
          <div className="bg-marine-panel rounded-xl border border-marine-border p-3">
            <div className="text-xs font-mono uppercase tracking-wider text-marine-text-dim mb-2">Kommande</div>
            <div className="space-y-1">
              {tt.upcomingStops.slice(1).map((stop, i) => (
                <div key={i} className="flex items-center justify-between text-xs font-mono py-1 px-2 rounded hover:bg-marine-panel-light">
                  <span className="text-marine-text">{stop.pier.name}</span>
                  <span className="text-marine-text-dim">{stop.departure.time}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Meeting warnings */}
        <MeetingWarning meetings={tt.meetings} />
      </div>

      {/* Right column: Route selector + Progress */}
      <div className="space-y-3">
        <RouteSelector
          selectedLine={tt.selectedLine}
          selectedCircuit={tt.selectedCircuit}
          onSelectLine={tt.selectLine}
          onSelectCircuit={tt.selectCircuit}
        />
        <CircuitProgress
          circuit={tt.selectedCircuit}
          progress={tt.progress}
          currentPierId={tt.currentStop?.pier.id || null}
        />

        {/* Info card */}
        <div className="bg-marine-panel rounded-xl border border-marine-border p-4">
          <div className="text-xs font-mono uppercase tracking-wider text-marine-text-dim mb-2">Info</div>
          <div className="space-y-2 text-xs font-mono">
            <div className="flex justify-between">
              <span className="text-marine-text-dim">Linje</span>
              <span className="text-marine-text-bright">{tt.selectedLine.name}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-marine-text-dim">Omlopp</span>
              <span className="text-marine-text-bright">{tt.selectedCircuit.id}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-marine-text-dim">Stopp kvar</span>
              <span className="text-marine-text-bright">
                {tt.upcomingStops.length + (tt.nextStop ? 1 : 0)}
              </span>
            </div>
            {tt.suggestedSpeed && (
              <div className="flex justify-between">
                <span className="text-marine-text-dim">Rekommenderad fart</span>
                <span className="text-emerald-400 font-bold">{tt.suggestedSpeed} kn</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
