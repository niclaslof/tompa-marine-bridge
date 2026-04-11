interface HeaderProps {
  clock: string
  nightMode: boolean
  theme: 'dark' | 'light'
  onToggleNight: () => void
  onToggleTheme: () => void
  onShowDocs: () => void
}

export function Header({ clock, nightMode, theme, onToggleNight, onToggleTheme, onShowDocs }: HeaderProps) {
  return (
    <header className="bg-marine-panel border-b border-marine-border px-4 py-2 flex items-center justify-between">
      <div className="flex items-center gap-2">
        <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-marine-accent to-amber-600 flex items-center justify-center">
          <span className="text-white font-bold text-xs">T</span>
        </div>
        <span className="text-marine-accent font-bold text-lg font-sans tracking-tight">TOMPA</span>
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={onShowDocs}
          className="p-1.5 rounded-lg bg-marine-panel-light text-marine-text-dim hover:text-marine-text text-sm"
          title="Dokumentation"
        >
          📖
        </button>
        <button
          onClick={onToggleTheme}
          className={`p-1.5 rounded-lg text-sm ${
            theme === 'light'
              ? 'bg-amber-100 text-amber-700'
              : 'bg-marine-panel-light text-marine-text-dim hover:text-marine-text'
          }`}
          title={theme === 'dark' ? 'Dagläge' : 'Mörkt läge'}
        >
          {theme === 'dark' ? '☀' : '🌙'}
        </button>
        <button
          onClick={onToggleNight}
          className={`p-1.5 rounded-lg text-sm ${
            nightMode
              ? 'bg-red-900/30 text-red-400'
              : 'bg-marine-panel-light text-marine-text-dim hover:text-marine-text'
          }`}
          title={nightMode ? 'Av nattseende' : 'Nattseende'}
        >
          {nightMode ? '🔴' : '👁'}
        </button>
        <div className="text-marine-text-bright font-mono text-sm tabular-nums ml-1">{clock}</div>
      </div>
    </header>
  )
}
