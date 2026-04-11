import { useState, useEffect } from 'react'
import type { TabId } from '@/types/marine'
import { useBoatData } from '@/hooks/useBoatData'
import { Header } from '@/components/layout/Header'
import { TabBar } from '@/components/layout/TabBar'
import { BridgeTab } from '@/components/bridge/BridgeTab'
import { TimetableTab } from '@/components/timetable/TimetableTab'
import { EngineTab } from '@/components/engine/EngineTab'
import { WeatherTab } from '@/components/weather/WeatherTab'
import { SafetyTab } from '@/components/safety/SafetyTab'
import { LogTab } from '@/components/log/LogTab'
import { ChartTab } from '@/components/chart/ChartTab'
import { DocsPage } from '@/components/docs/DocsPage'

export default function App() {
  const [activeTab, setActiveTab] = useState<TabId>('timetable')
  const [clock, setClock] = useState('')
  const [nightMode, setNightMode] = useState(false)
  const [theme, setTheme] = useState<'dark' | 'light'>('dark')
  const [showDocs, setShowDocs] = useState(false)
  const data = useBoatData()

  useEffect(() => {
    const update = () => {
      const now = new Date()
      setClock(now.toLocaleTimeString('sv-SE', { hour: '2-digit', minute: '2-digit', second: '2-digit' }))
    }
    update()
    const id = setInterval(update, 1000)
    return () => clearInterval(id)
  }, [])

  useEffect(() => {
    document.documentElement.dataset.theme = theme
  }, [theme])

  if (showDocs) {
    return <DocsPage onBack={() => setShowDocs(false)} />
  }

  return (
    <div className={`min-h-screen bg-marine-bg text-marine-text flex flex-col ${nightMode ? 'night-mode' : ''}`}>
      <Header
        clock={clock}
        nightMode={nightMode}
        theme={theme}
        onToggleNight={() => setNightMode(!nightMode)}
        onToggleTheme={() => setTheme(t => t === 'dark' ? 'light' : 'dark')}
        onShowDocs={() => setShowDocs(true)}
      />
      <TabBar active={activeTab} onChange={setActiveTab} />
      <main className="flex-1 overflow-auto">
        {activeTab === 'timetable' && <TimetableTab />}
        {activeTab === 'bridge' && <BridgeTab data={data} />}
        {activeTab === 'chart' && <ChartTab data={data} />}
        {activeTab === 'engine' && <EngineTab />}
        {activeTab === 'weather' && <WeatherTab />}
        {activeTab === 'safety' && <SafetyTab />}
        {activeTab === 'log' && <LogTab />}
      </main>
    </div>
  )
}
