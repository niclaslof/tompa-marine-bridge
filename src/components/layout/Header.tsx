interface HeaderProps {
  clock: string
}

export function Header({ clock }: HeaderProps) {
  return (
    <header className="bg-marine-panel border-b border-marine-border px-4 py-2 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <span className="text-marine-accent font-bold text-xl font-sans tracking-tight">TOMPA</span>
        <span className="text-marine-text-dim text-xs font-mono hidden sm:inline">Marine Bridge System</span>
      </div>
      <div className="flex items-center gap-4">
        <span className="text-marine-text font-mono text-sm">{clock}</span>
        <button className="bg-red-700 hover:bg-red-600 text-white font-bold text-xs px-3 py-1.5 rounded transition-colors uppercase tracking-wider">
          MOB
        </button>
      </div>
    </header>
  )
}
