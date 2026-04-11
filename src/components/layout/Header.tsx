interface HeaderProps {
  clock: string
  nightMode: boolean
  onToggleNight: () => void
  onShowDocs: () => void
}

export function Header({ clock, nightMode, onToggleNight, onShowDocs }: HeaderProps) {
  return (
    <header className="bg-marine-panel border-b border-marine-border px-4 py-2 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-marine-accent to-amber-600 flex items-center justify-center">
            <span className="text-white font-bold text-sm">T</span>
          </div>
          <div>
            <span className="text-marine-accent font-bold text-lg font-sans tracking-tight leading-none">TOMPA</span>
            <span className="text-marine-text-dim text-[10px] font-mono hidden sm:block leading-none">Marine Bridge</span>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2">
        {/* Docs button */}
        <button
          onClick={onShowDocs}
          className="p-1.5 rounded-lg bg-marine-panel-light text-marine-text-dim hover:text-marine-text transition-colors text-sm"
          title="Dokumentation"
        >
          📖
        </button>

        {/* Night mode toggle */}
        <button
          onClick={onToggleNight}
          className={`p-1.5 rounded-lg transition-colors text-sm ${
            nightMode
              ? 'bg-red-900/30 text-red-400'
              : 'bg-marine-panel-light text-marine-text-dim hover:text-marine-text'
          }`}
          title={nightMode ? 'Dagläge' : 'Nattläge'}
        >
          {nightMode ? '🌙' : '☀️'}
        </button>

        {/* Clock */}
        <div className="text-marine-text-bright font-mono text-sm tabular-nums">{clock}</div>

        {/* MOB Button */}
        <button className="bg-red-700 hover:bg-red-600 active:bg-red-500 text-white font-bold text-xs px-3 py-2 rounded-lg transition-colors uppercase tracking-wider shadow-lg shadow-red-900/30 min-w-[60px]">
          MOB
        </button>
      </div>
    </header>
  )
}
