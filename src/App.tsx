import { useState, useEffect } from 'react'
import type { TabId } from '@/types/marine'
import { Header } from '@/components/layout/Header'
import { TabBar } from '@/components/layout/TabBar'
import { TimetableTab } from '@/components/timetable/TimetableTab'
import { OverviewTab } from '@/components/overview/OverviewTab'
import { SafetyTab } from '@/components/safety/SafetyTab'
import { LogTab } from '@/components/log/LogTab'
import { DocsPage } from '@/components/docs/DocsPage'

export default function App() {
  const [activeTab, setActiveTab] = useState<TabId>('timetable')
  const [clock, setClock] = useState('')
  const [nightMode, setNightMode] = useState(false)
  const [theme, setTheme] = useState<'dark' | 'light'>('dark')
  const [showDocs, setShowDocs] = useState(false)

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
        {activeTab === 'overview' && <OverviewTab />}
        {activeTab === 'safety' && <SafetyTab />}
        {activeTab === 'log' && <LogTab />}
      </main>
    </div>
  )
}
