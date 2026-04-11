import type { TabId } from '@/types/marine'

const TABS: { id: TabId; label: string }[] = [
  { id: 'timetable', label: 'Tidtabell' },
  { id: 'overview', label: 'Översikt' },
  { id: 'safety', label: 'Säkerhet' },
  { id: 'log', label: 'Logg' },
]

interface TabBarProps {
  active: TabId
  onChange: (tab: TabId) => void
}

export function TabBar({ active, onChange }: TabBarProps) {
  return (
    <nav className="bg-marine-panel border-b border-marine-border flex">
      {TABS.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onChange(tab.id)}
          className={`flex-1 py-2.5 px-3 text-xs font-mono uppercase tracking-wider transition-colors ${
            active === tab.id
              ? 'text-marine-accent border-b-2 border-marine-accent bg-marine-panel-light'
              : 'text-marine-text-dim hover:text-marine-text'
          }`}
        >
          {tab.label}
        </button>
      ))}
    </nav>
  )
}
