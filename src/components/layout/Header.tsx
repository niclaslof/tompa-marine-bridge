interface HeaderProps {
  clock: string
  nightMode: boolean
  theme: 'dark' | 'light'
  lineName: string
  circuitLabel: string
  onToggleNight: () => void
  onToggleTheme: () => void
  onShowDocs: () => void
  onGoHome: () => void
}

export function Header({ clock, nightMode, theme, lineName, circuitLabel, onToggleNight, onToggleTheme, onShowDocs, onGoHome }: HeaderProps) {
  return (
    <header className="bg-marine-panel border-b border-marine-border px-4 py-2 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <button onClick={onGoHome} className="flex items-center gap-2 hover:opacity-80 transition-opacity" title="Tillbaka till start">
          <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-marine-accent to-amber-600 flex items-center justify-center">
            <span className="text-white font-bold text-xs">T</span>
          </div>
        </button>
        <div className="text-xs font-mono text-marine-text-dim">
          <span className="text-marine-text">{lineName}</span>
          <span className="mx-1.5 opacity-40">·</span>
          <span>{circuitLabel}</span>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <button onClick={onShowDocs} className="p-1.5 rounded-lg bg-marine-panel-light text-marine-text-dim hover:text-marine-text text-sm" title="Dokumentation">📖</button>
        <button onClick={onToggleTheme} className={`p-1.5 rounded-lg text-sm ${theme === 'light' ? 'bg-amber-100 text-amber-700' : 'bg-marine-panel-light text-marine-text-dim hover:text-marine-text'}`} title={theme === 'dark' ? 'Dagläge' : 'Mörkt läge'}>{theme === 'dark' ? '☀' : '🌙'}</button>
        <button onClick={onToggleNight} className={`p-1.5 rounded-lg text-sm ${nightMode ? 'bg-red-900/30 text-red-400' : 'bg-marine-panel-light text-marine-text-dim hover:text-marine-text'}`} title={nightMode ? 'Av nattseende' : 'Nattseende'}>{nightMode ? '🔴' : '👁'}</button>
        <div className="text-marine-text-bright font-mono text-sm tabular-nums ml-1">{clock}</div>
      </div>
    </header>
  )
}
