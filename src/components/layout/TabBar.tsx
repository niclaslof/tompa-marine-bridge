import type { TabId } from '@/types/marine'

const TABS: { id: TabId; label: string; icon: string }[] = [
  { id: 'timetable', label: 'Tidtabell', icon: '⏱' },
  { id: 'bridge', label: 'Brygga', icon: '🧭' },
  { id: 'chart', label: 'Karta', icon: '🗺' },
  { id: 'engine', label: 'Maskin', icon: '⚙' },
  { id: 'weather', label: 'Väder', icon: '🌊' },
  { id: 'safety', label: 'Säkerhet', icon: '🛟' },
  { id: 'log', label: 'Logg', icon: '📋' },
]

interface TabBarProps {
  active: TabId
  onChange: (tab: TabId) => void
}

export function TabBar({ active, onChange }: TabBarProps) {
  return (
    <nav className="bg-marine-panel border-b border-marine-border flex overflow-x-auto">
      {TABS.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onChange(tab.id)}
          className={`flex-1 min-w-[80px] py-2.5 px-3 text-xs font-mono uppercase tracking-wider transition-colors
            ${active === tab.id
              ? 'text-marine-accent border-b-2 border-marine-accent bg-marine-panel-light'
              : 'text-marine-text-dim hover:text-marine-text hover:bg-marine-panel-light/50'
            }`}
        >
          <span className="hidden sm:inline mr-1">{tab.icon}</span>
          {tab.label}
        </button>
      ))}
    </nav>
  )
}
