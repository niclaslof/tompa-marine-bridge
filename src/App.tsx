import { useState, useEffect, useCallback } from 'react'
import type { TabId, AppMode } from '@/types/marine'
import { Header } from '@/components/layout/Header'
import { TabBar } from '@/components/layout/TabBar'
import { HomeScreen } from '@/components/home/HomeScreen'
import { TimetableTab } from '@/components/timetable/TimetableTab'
import { OverviewTab } from '@/components/overview/OverviewTab'
import { SafetyTab } from '@/components/safety/SafetyTab'
import { LogTab } from '@/components/log/LogTab'
import { DocsPage } from '@/components/docs/DocsPage'
import { useTimetable } from '@/hooks/useTimetable'

const STORAGE_KEY = 'tompa_last_selection'

function loadLastSelection(): { lineId: string; circuitId: string } | null {
  try {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved) return JSON.parse(saved)
  } catch { /* ignore */ }
  return null
}

export default function App() {
  const [appMode, setAppMode] = useState<AppMode>('home')
  const [activeTab, setActiveTab] = useState<TabId>('timetable')
  const [clock, setClock] = useState('')
  const [nightMode, setNightMode] = useState(false)
  const [theme, setTheme] = useState<'dark' | 'light'>('dark')
  const [showDocs, setShowDocs] = useState(false)
  const [lineId, setLineId] = useState('L80')
  const [circuitId, setCircuitId] = useState('L80-1')

  // Timetable state — controlled by App
  const tt = useTimetable(lineId, circuitId)

  useEffect(() => {
    const update = () => {
      const now = new Date()
      setClock(
        `${String(now.getHours()).padStart(2, '0')}.${String(now.getMinutes()).padStart(2, '0')}.${String(now.getSeconds()).padStart(2, '0')}`
      )
    }
    update()
    const id = setInterval(update, 1000)
    return () => clearInterval(id)
  }, [])

  useEffect(() => {
    document.documentElement.dataset.theme = theme
  }, [theme])

  const handleStart = useCallback((newLineId: string, newCircuitId: string) => {
    setLineId(newLineId)
    setCircuitId(newCircuitId)
    setAppMode('operating')
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ lineId: newLineId, circuitId: newCircuitId }))
  }, [])

  const handleSwitchCircuit = useCallback((newCircuitId: string) => {
    setCircuitId(newCircuitId)
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ lineId, circuitId: newCircuitId }))
  }, [lineId])

  const handleGoHome = useCallback(() => {
    setAppMode('home')
  }, [])

  // Check for saved session on mount
  useEffect(() => {
    const saved = loadLastSelection()
    if (saved) {
      setLineId(saved.lineId)
      setCircuitId(saved.circuitId)
      // Don't auto-start — let user confirm from home screen
    }
  }, [])

  if (showDocs) {
    return <DocsPage onBack={() => setShowDocs(false)} />
  }

  if (appMode === 'home') {
    return <HomeScreen onStart={handleStart} />
  }

  return (
    <div className={`min-h-screen bg-marine-bg text-marine-text flex flex-col ${nightMode ? 'night-mode' : ''}`}>
      <Header
        clock={clock}
        nightMode={nightMode}
        theme={theme}
        lineName={tt.selectedLine.name}
        circuitLabel={tt.selectedCircuit.label}
        onToggleNight={() => setNightMode(!nightMode)}
        onToggleTheme={() => setTheme(t => t === 'dark' ? 'light' : 'dark')}
        onShowDocs={() => setShowDocs(true)}
        onGoHome={handleGoHome}
      />
      <TabBar active={activeTab} onChange={setActiveTab} />
      <main className="flex-1 overflow-auto">
        {activeTab === 'timetable' && (
          <TimetableTab tt={tt} onSwitchCircuit={handleSwitchCircuit} />
        )}
        {activeTab === 'overview' && <OverviewTab tt={tt} />}
        {activeTab === 'safety' && <SafetyTab />}
        {activeTab === 'log' && <LogTab tt={tt} />}
      </main>
    </div>
  )
}
