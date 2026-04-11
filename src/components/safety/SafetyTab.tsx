import { useState, useEffect } from 'react'

interface ChecklistItem {
  id: string
  text: string
  checked: boolean
}

const DEPARTURE_CHECKLIST: Omit<ChecklistItem, 'checked'>[] = [
  { id: 'd1', text: 'Maskinkontroll utförd' },
  { id: 'd2', text: 'Bränslenivå kontrollerad' },
  { id: 'd3', text: 'Livräddningsutrustning kontrollerad' },
  { id: 'd4', text: 'VHF testad - kanal 16' },
  { id: 'd5', text: 'Navigation och ljus kontrollerade' },
  { id: 'd6', text: 'Väderprognos inhämtad' },
  { id: 'd7', text: 'Passagerarräkning genomförd' },
  { id: 'd8', text: 'Förtöjningar klara att kasta loss' },
  { id: 'd9', text: 'Lejdare/landgång intagen' },
  { id: 'd10', text: 'Avgångsrapport till VTS/rederi' },
  { id: 'd11', text: 'Bilgepumpar kontrollerade' },
  { id: 'd12', text: 'Tidtabell och omlopp inställt' },
]

const ARRIVAL_CHECKLIST: Omit<ChecklistItem, 'checked'>[] = [
  { id: 'a1', text: 'Fendrar utlagda' },
  { id: 'a2', text: 'Förtöjningar förberedda' },
  { id: 'a3', text: 'Passagerare informerade' },
  { id: 'a4', text: 'Ankomstrapport till VTS' },
  { id: 'a5', text: 'Landgång/lejdare förberedd' },
  { id: 'a6', text: 'Motor på tomgång' },
  { id: 'a7', text: 'Förtöjningar fast' },
  { id: 'a8', text: 'Loggbok uppdaterad' },
]

const EMERGENCY_CHECKLIST: Omit<ChecklistItem, 'checked'>[] = [
  { id: 'e1', text: 'MAYDAY/PAN PAN på VHF 16' },
  { id: 'e2', text: 'Position rapporterad' },
  { id: 'e3', text: 'Passagerare samlade vid samlingspunkt' },
  { id: 'e4', text: 'Flytvästar utdelade' },
  { id: 'e5', text: 'Livflottar förberedda' },
  { id: 'e6', text: 'EPIRB aktiverad' },
  { id: 'e7', text: 'Nödsignal skickad' },
  { id: 'e8', text: 'Besättning på station' },
  { id: 'e9', text: 'Skadekontroll påbörjad' },
  { id: 'e10', text: 'Sjukvård administrerad' },
]

function loadChecklist(key: string, items: Omit<ChecklistItem, 'checked'>[]): ChecklistItem[] {
  try {
    const saved = localStorage.getItem(`tompa_checklist_${key}`)
    if (saved) {
      const checked = JSON.parse(saved) as string[]
      return items.map(i => ({ ...i, checked: checked.includes(i.id) }))
    }
  } catch { /* ignore */ }
  return items.map(i => ({ ...i, checked: false }))
}

function saveChecklist(key: string, items: ChecklistItem[]) {
  const checked = items.filter(i => i.checked).map(i => i.id)
  localStorage.setItem(`tompa_checklist_${key}`, JSON.stringify(checked))
}

export function SafetyTab() {
  const [activeList, setActiveList] = useState<'departure' | 'arrival' | 'emergency'>('departure')
  const [departure, setDeparture] = useState(() => loadChecklist('departure', DEPARTURE_CHECKLIST))
  const [arrival, setArrival] = useState(() => loadChecklist('arrival', ARRIVAL_CHECKLIST))
  const [emergency, setEmergency] = useState(() => loadChecklist('emergency', EMERGENCY_CHECKLIST))

  const lists = { departure, arrival, emergency }
  const setters = { departure: setDeparture, arrival: setArrival, emergency: setEmergency }
  const currentList = lists[activeList]

  const toggle = (id: string) => {
    const updated = currentList.map(i => i.id === id ? { ...i, checked: !i.checked } : i)
    setters[activeList](updated)
    saveChecklist(activeList, updated)
  }

  const resetList = () => {
    const items = activeList === 'departure' ? DEPARTURE_CHECKLIST
      : activeList === 'arrival' ? ARRIVAL_CHECKLIST : EMERGENCY_CHECKLIST
    const reset = items.map(i => ({ ...i, checked: false }))
    setters[activeList](reset)
    saveChecklist(activeList, reset)
  }

  const checked = currentList.filter(i => i.checked).length
  const total = currentList.length
  const pct = (checked / total) * 100

  // NAVTEX messages
  const [navtex] = useState([
    { id: 'N1', time: '08:15', area: 'Stockholm', text: 'Farled Oxdjupet: Bojlykta ur funktion. Pos 59°20.3N 018°05.1E.' },
    { id: 'N2', time: '06:30', area: 'Stockholms skärgård', text: 'Militärövning området Mysingen 11-13 april. Passage förbjuden.' },
    { id: 'N3', time: 'Igår 22:00', area: 'Norra Östersjön', text: 'Kulingvarning SV 15-20 m/s från torsdag kväll.' },
  ])

  // Suppress unused warning
  useEffect(() => {}, [])

  return (
    <div className="max-w-5xl mx-auto p-3 space-y-3">
      {/* Checklist selector */}
      <div className="flex gap-2">
        {([
          { id: 'departure' as const, label: 'Avgång', color: 'emerald' },
          { id: 'arrival' as const, label: 'Ankomst', color: 'blue' },
          { id: 'emergency' as const, label: 'Nödsituation', color: 'red' },
        ]).map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveList(tab.id)}
            className={`flex-1 py-2.5 px-3 rounded-xl font-mono text-xs uppercase tracking-wider transition-all ${
              activeList === tab.id
                ? tab.id === 'emergency'
                  ? 'bg-red-500/20 border border-red-500/40 text-red-400'
                  : 'bg-marine-accent/15 border border-marine-accent/30 text-marine-accent'
                : 'bg-marine-panel border border-marine-border text-marine-text-dim hover:text-marine-text'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Progress bar */}
      <div className="bg-marine-panel rounded-xl border border-marine-border p-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-mono text-marine-text-dim uppercase tracking-wider">
            {activeList === 'departure' ? 'Avgångschecklista' :
             activeList === 'arrival' ? 'Ankomstchecklista' : 'Nödchecklista'}
          </span>
          <div className="flex items-center gap-3">
            <span className="text-sm font-mono text-marine-text-bright">{checked}/{total}</span>
            <button onClick={resetList} className="text-[10px] font-mono text-marine-text-dim hover:text-marine-text underline">
              Återställ
            </button>
          </div>
        </div>
        <div className="h-2 bg-marine-border rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-500 ${
              pct === 100 ? 'bg-emerald-400' : 'bg-marine-accent'
            }`}
            style={{ width: `${pct}%` }}
          />
        </div>
        {pct === 100 && (
          <div className="text-xs font-mono text-emerald-400 mt-2 text-center">
            ✓ Alla punkter avbockade
          </div>
        )}
      </div>

      {/* Checklist items */}
      <div className="bg-marine-panel rounded-xl border border-marine-border divide-y divide-marine-border">
        {currentList.map((item, i) => (
          <button
            key={item.id}
            onClick={() => toggle(item.id)}
            className={`w-full flex items-center gap-3 px-4 py-3 text-left transition-colors hover:bg-marine-panel-light ${
              item.checked ? 'opacity-60' : ''
            }`}
          >
            <div className={`w-6 h-6 rounded-md border-2 flex items-center justify-center flex-shrink-0 transition-colors ${
              item.checked
                ? 'bg-emerald-500 border-emerald-500'
                : 'border-marine-border'
            }`}>
              {item.checked && <span className="text-white text-sm">✓</span>}
            </div>
            <span className="text-marine-text-dim text-xs font-mono w-6">{i + 1}.</span>
            <span className={`text-sm font-mono ${item.checked ? 'line-through text-marine-text-dim' : 'text-marine-text-bright'}`}>
              {item.text}
            </span>
          </button>
        ))}
      </div>

      {/* NAVTEX */}
      <div className="bg-marine-panel rounded-xl border border-marine-border p-4">
        <div className="text-xs font-mono uppercase tracking-wider text-marine-text-dim mb-3">
          NAVTEX / Sjöfartsmeddelanden
        </div>
        <div className="space-y-2">
          {navtex.map(msg => (
            <div key={msg.id} className="bg-marine-panel-light rounded-lg p-3 border border-marine-border">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-mono text-marine-accent">{msg.area}</span>
                <span className="text-[10px] font-mono text-marine-text-dim">{msg.time}</span>
              </div>
              <div className="text-xs font-mono text-marine-text">{msg.text}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
