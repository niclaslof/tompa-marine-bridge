import { useState } from 'react'
import { jitter } from '@/data/simulation'

interface LogEntry {
  id: string
  time: string
  type: 'auto' | 'manual' | 'event'
  text: string
}

interface TripData {
  distance: number
  avgSpeed: number
  maxSpeed: number
  duration: string
  fuelUsed: number
}

export function LogTab() {
  const [logEntries, setLogEntries] = useState<LogEntry[]>([
    { id: '1', time: '06:15', type: 'event', text: 'Motor startad' },
    { id: '2', time: '06:20', type: 'auto', text: 'Avgång Nacka Strand — Omlopp 1, Linje 80' },
    { id: '3', time: '06:30', type: 'auto', text: 'Ankomst Ropsten' },
    { id: '4', time: '06:33', type: 'auto', text: 'Avgång Ropsten' },
    { id: '5', time: '06:43', type: 'auto', text: 'Ankomst Mor Annas brygga' },
    { id: '6', time: '06:46', type: 'auto', text: 'Avgång Mor Annas brygga (retur)' },
    { id: '7', time: '06:50', type: 'manual', text: 'Passerade drivande boj vid 59°19.8N 018°05.2E' },
    { id: '8', time: '06:56', type: 'auto', text: 'Ankomst Ropsten' },
    { id: '9', time: '07:00', type: 'auto', text: 'Avgång Ropsten' },
    { id: '10', time: '07:10', type: 'auto', text: 'Ankomst Nacka Strand' },
  ])

  const [newEntry, setNewEntry] = useState('')

  const addEntry = () => {
    if (!newEntry.trim()) return
    const now = new Date()
    const time = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`
    setLogEntries(prev => [...prev, {
      id: String(Date.now()),
      time,
      type: 'manual',
      text: newEntry.trim(),
    }])
    setNewEntry('')
  }

  const trip: TripData = {
    distance: jitter(12.4, 0),
    avgSpeed: jitter(8.2, 0),
    maxSpeed: jitter(11.5, 0),
    duration: '03:45',
    fuelUsed: jitter(67, 0),
  }

  const crew = [
    { name: 'Niclas Löfvenmark', role: 'Skeppare', watch: '06:00-14:00' },
    { name: 'Erik Johansson', role: 'Styrman', watch: '06:00-14:00' },
    { name: 'Anna Svensson', role: 'Matros', watch: '06:00-14:00' },
  ]

  return (
    <div className="max-w-5xl mx-auto p-3 grid grid-cols-1 lg:grid-cols-3 gap-3">
      {/* Log entries */}
      <div className="lg:col-span-2 space-y-3">
        <div className="bg-marine-panel rounded-xl border border-marine-border p-4">
          <div className="text-xs font-mono uppercase tracking-wider text-marine-text-dim mb-3">
            Digital Skeppsdagbok — {new Date().toLocaleDateString('sv-SE')}
          </div>

          {/* Add entry */}
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
              className="bg-marine-accent hover:bg-marine-accent-dim text-white px-4 py-2 rounded-lg text-xs font-mono uppercase tracking-wider transition-colors"
            >
              Lägg till
            </button>
          </div>

          {/* Log list */}
          <div className="space-y-1 max-h-96 overflow-y-auto">
            {[...logEntries].reverse().map(entry => (
              <div key={entry.id} className="flex items-start gap-2 py-1.5 px-2 rounded hover:bg-marine-panel-light text-xs font-mono">
                <span className="text-marine-text-dim w-12 flex-shrink-0">{entry.time}</span>
                <span className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${
                  entry.type === 'auto' ? 'bg-marine-blue' :
                  entry.type === 'manual' ? 'bg-marine-accent' :
                  'bg-emerald-400'
                }`} />
                <span className="text-marine-text">{entry.text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right column: Trip + Crew */}
      <div className="space-y-3">
        {/* Trip computer */}
        <div className="bg-marine-panel rounded-xl border border-marine-border p-4">
          <div className="text-xs font-mono uppercase tracking-wider text-marine-text-dim mb-3">Trip-dator — Idag</div>
          <div className="space-y-2 text-sm font-mono">
            <TripRow label="Distans" value={`${trip.distance.toFixed(1)} nm`} />
            <TripRow label="Snittfart" value={`${trip.avgSpeed.toFixed(1)} kn`} />
            <TripRow label="Maxfart" value={`${trip.maxSpeed.toFixed(1)} kn`} />
            <TripRow label="Gångtid" value={trip.duration} />
            <TripRow label="Bränsle" value={`${Math.round(trip.fuelUsed)} L`} />
            <TripRow label="Förbrukning" value={`${(trip.fuelUsed / (3.75)).toFixed(1)} L/h`} />
          </div>
        </div>

        {/* Crew */}
        <div className="bg-marine-panel rounded-xl border border-marine-border p-4">
          <div className="text-xs font-mono uppercase tracking-wider text-marine-text-dim mb-3">Besättning</div>
          <div className="space-y-2">
            {crew.map((c, i) => (
              <div key={i} className="flex items-center gap-3 py-1.5 text-xs font-mono">
                <div className="w-8 h-8 rounded-full bg-marine-panel-light border border-marine-border flex items-center justify-center text-marine-text-dim">
                  {c.name[0]}
                </div>
                <div className="flex-1">
                  <div className="text-marine-text-bright">{c.name}</div>
                  <div className="text-marine-text-dim">{c.role}</div>
                </div>
                <div className="text-marine-text-dim">{c.watch}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

function TripRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between">
      <span className="text-marine-text-dim">{label}</span>
      <span className="text-marine-text-bright">{value}</span>
    </div>
  )
}
