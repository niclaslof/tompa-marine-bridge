import { useState, useEffect } from 'react'
import type { TabId } from '@/types/marine'
import { useBoatData } from '@/hooks/useBoatData'
import { Header } from '@/components/layout/Header'
import { TabBar } from '@/components/layout/TabBar'
import { BridgeTab } from '@/components/bridge/BridgeTab'

export default function App() {
  const [activeTab, setActiveTab] = useState<TabId>('bridge')
  const [clock, setClock] = useState('')
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

  return (
    <div className="min-h-screen bg-marine-bg text-marine-text flex flex-col">
      <Header clock={clock} />
      <TabBar active={activeTab} onChange={setActiveTab} />
      <main className="flex-1 overflow-auto">
        {activeTab === 'bridge' && <BridgeTab data={data} />}
        {activeTab === 'chart' && <Placeholder label="Karta" />}
        {activeTab === 'harbors' && <Placeholder label="Hamnar" />}
        {activeTab === 'engine' && <Placeholder label="Maskin" />}
        {activeTab === 'weather' && <Placeholder label="Väder" />}
        {activeTab === 'safety' && <Placeholder label="Säkerhet" />}
        {activeTab === 'log' && <Placeholder label="Logg" />}
      </main>
    </div>
  )
}

function Placeholder({ label }: { label: string }) {
  return (
    <div className="flex items-center justify-center h-64">
      <span className="text-marine-text-dim font-mono text-lg">{label} — kommer snart</span>
    </div>
  )
}
