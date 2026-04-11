import { useState } from 'react'
import type { TimetableState } from '@/hooks/useTimetable'
import { ScheduleAnalytics } from './ScheduleAnalytics'

interface LogTabProps {
  tt: TimetableState
}

interface LogEntry {
  id: string
  time: string
  type: 'auto' | 'manual' | 'event'
  text: string
}

export function LogTab({ tt }: LogTabProps) {
  const [logEntries, setLogEntries] = useState<LogEntry[]>([
    { id: '1', time: '06:15', type: 'event', text: 'Systemet startat' },
    { id: '2', time: '06:20', type: 'auto', text: `Avgång Nacka Strand — ${tt.selectedCircuit.label}, ${tt.selectedLine.name}` },
    { id: '3', time: '06:30', type: 'auto', text: 'Ankomst Ropsten' },
    { id: '4', time: '06:33', type: 'auto', text: 'Avgång Ropsten' },
    { id: '5', time: '06:43', type: 'auto', text: 'Ankomst Mor Annas brygga' },
  ])

  const [newEntry, setNewEntry] = useState('')

  const addEntry = () => {
    if (!newEntry.trim()) return
    const now = new Date()
    const time = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`
    setLogEntries(prev => [...prev, { id: String(Date.now()), time, type: 'manual', text: newEntry.trim() }])
    setNewEntry('')
  }

  return (
    <div className="max-w-3xl mx-auto p-3 space-y-3">
      {/* Schedule analytics */}
      <ScheduleAnalytics />

      {/* Log */}
      <div className="bg-marine-panel rounded-xl border border-marine-border p-4">
        <div className="text-[10px] font-mono uppercase tracking-widest text-marine-text-dim mb-3">
          Skeppsdagbok — {new Date().toLocaleDateString('sv-SE')}
        </div>

        <div className="flex gap-2 mb-3">
          <input
            type="text"
            value={newEntry}
            onChange={e => setNewEntry(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && addEntry()}
            placeholder="Ny loggpost..."
            className="flex-1 bg-marine-panel-light border border-marine-border rounded-lg px-3 py-2 text-sm font-mono text-marine-text-bright placeholder:text-marine-text-dim focus:outline-none focus:border-marine-accent"
          />
          <button
            onClick={addEntry}
            className="bg-marine-accent hover:bg-marine-accent-dim text-white px-4 py-2 rounded-lg text-xs font-mono uppercase transition-colors"
          >
            Lägg till
          </button>
        </div>

        <div className="space-y-1 max-h-80 overflow-y-auto">
          {[...logEntries].reverse().map(entry => (
            <div key={entry.id} className="flex items-start gap-2 py-1.5 px-2 rounded hover:bg-marine-panel-light text-xs font-mono">
              <span className="text-marine-text-dim w-12 flex-shrink-0 tabular-nums">{entry.time}</span>
              <span className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${
                entry.type === 'auto' ? 'bg-marine-blue' :
                entry.type === 'manual' ? 'bg-marine-accent' : 'bg-emerald-400'
              }`} />
              <span className="text-marine-text">{entry.text}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
