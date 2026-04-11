import { useState, useEffect } from 'react'
import { jitter } from '@/data/simulation'

interface TankData {
  label: string
  level: number
  color: string
  unit: string
}

export function EngineTab() {
  const [tick, setTick] = useState(0)

  useEffect(() => {
    const iv = setInterval(() => setTick(t => t + 1), 2000)
    return () => clearInterval(iv)
  }, [])

  const rpm = Math.round(jitter(1850, 30))
  const coolant = jitter(82, 1)
  const exhaust = jitter(340, 10)
  const oilTemp = jitter(95, 2)
  const voltage1 = jitter(13.8, 0.1)
  const voltage2 = jitter(12.4, 0.2)
  const chargeAmps = jitter(15, 2)
  const fuelRate = jitter(18, 1.5)
  const fuelRemaining = jitter(420, 0)
  const range = Math.round(fuelRemaining / fuelRate * jitter(7, 0.3))
  const engineHours = 3847
  const sinceSvc = 247
  const bilgeLevel = jitter(12, 3)
  const pumpCount = 14
  void tick // suppress unused

  const tanks: TankData[] = [
    { label: 'Bränsle', level: jitter(72, 0.5), color: '#e8891c', unit: 'L' },
    { label: 'Färskvatten', level: jitter(85, 0.5), color: '#3498db', unit: 'L' },
    { label: 'Svartvatten', level: jitter(35, 0.5), color: '#6b8a9e', unit: '%' },
  ]

  return (
    <div className="max-w-5xl mx-auto p-3 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
      {/* RPM */}
      <div className="bg-marine-panel rounded-xl border border-marine-border p-4 md:col-span-1">
        <div className="text-xs font-mono uppercase tracking-wider text-marine-text-dim mb-2">Varvtal</div>
        <div className="text-center">
          <div className="text-5xl font-mono font-bold text-marine-text-bright">{rpm}</div>
          <div className="text-marine-text-dim font-mono text-sm">RPM</div>
          <div className="mt-3 h-2 bg-marine-border rounded-full overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-500"
              style={{
                width: `${(rpm / 2500) * 100}%`,
                background: rpm > 2200 ? '#e74c3c' : rpm > 2000 ? '#f1c40f' : 'linear-gradient(90deg, #2ecc71, #e8891c)',
              }}
            />
          </div>
          <div className="flex justify-between text-[10px] font-mono text-marine-text-dim mt-1">
            <span>0</span><span>1000</span><span>2000</span><span>2500</span>
          </div>
        </div>
      </div>

      {/* Temperatures */}
      <div className="bg-marine-panel rounded-xl border border-marine-border p-4">
        <div className="text-xs font-mono uppercase tracking-wider text-marine-text-dim mb-3">Temperaturer</div>
        <div className="space-y-3">
          <TempRow label="Kylvatten" value={coolant} unit="°C" max={100} warn={90} />
          <TempRow label="Avgaser" value={exhaust} unit="°C" max={500} warn={400} />
          <TempRow label="Olja" value={oilTemp} unit="°C" max={120} warn={105} />
        </div>
      </div>

      {/* Tanks */}
      <div className="bg-marine-panel rounded-xl border border-marine-border p-4">
        <div className="text-xs font-mono uppercase tracking-wider text-marine-text-dim mb-3">Tankar</div>
        <div className="space-y-3">
          {tanks.map(t => (
            <div key={t.label}>
              <div className="flex justify-between text-xs font-mono mb-1">
                <span className="text-marine-text-dim">{t.label}</span>
                <span className="text-marine-text-bright">{Math.round(t.level)}%</span>
              </div>
              <div className="h-3 bg-marine-border rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-1000"
                  style={{ width: `${t.level}%`, backgroundColor: t.color }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Battery */}
      <div className="bg-marine-panel rounded-xl border border-marine-border p-4">
        <div className="text-xs font-mono uppercase tracking-wider text-marine-text-dim mb-3">Batteri</div>
        <div className="grid grid-cols-2 gap-3">
          <div className="text-center">
            <div className="text-xs font-mono text-marine-text-dim">Bank 1 (Start)</div>
            <div className="text-2xl font-mono font-bold text-marine-text-bright">{voltage1.toFixed(1)}</div>
            <div className="text-xs font-mono text-marine-text-dim">V</div>
          </div>
          <div className="text-center">
            <div className="text-xs font-mono text-marine-text-dim">Bank 2 (Service)</div>
            <div className="text-2xl font-mono font-bold text-marine-text-bright">{voltage2.toFixed(1)}</div>
            <div className="text-xs font-mono text-marine-text-dim">V</div>
          </div>
        </div>
        <div className="mt-2 text-center">
          <span className="text-xs font-mono text-marine-text-dim">Laddström: </span>
          <span className="text-sm font-mono text-emerald-400">{chargeAmps.toFixed(1)} A</span>
        </div>
      </div>

      {/* Fuel consumption */}
      <div className="bg-marine-panel rounded-xl border border-marine-border p-4">
        <div className="text-xs font-mono uppercase tracking-wider text-marine-text-dim mb-3">Förbrukning</div>
        <div className="grid grid-cols-3 gap-2 text-center">
          <div>
            <div className="text-xl font-mono font-bold text-marine-accent">{fuelRate.toFixed(1)}</div>
            <div className="text-[10px] font-mono text-marine-text-dim">L/h</div>
          </div>
          <div>
            <div className="text-xl font-mono font-bold text-marine-text-bright">{Math.round(fuelRemaining)}</div>
            <div className="text-[10px] font-mono text-marine-text-dim">L kvar</div>
          </div>
          <div>
            <div className="text-xl font-mono font-bold text-emerald-400">{range}</div>
            <div className="text-[10px] font-mono text-marine-text-dim">nm</div>
          </div>
        </div>
      </div>

      {/* Bilge + Service */}
      <div className="bg-marine-panel rounded-xl border border-marine-border p-4">
        <div className="text-xs font-mono uppercase tracking-wider text-marine-text-dim mb-3">Bilge & Drift</div>
        <div className="space-y-2 text-xs font-mono">
          <div className="flex justify-between">
            <span className="text-marine-text-dim">Bilgenivå</span>
            <span className={bilgeLevel > 20 ? 'text-red-400' : 'text-marine-text-bright'}>{Math.round(bilgeLevel)}%</span>
          </div>
          <div className="flex justify-between">
            <span className="text-marine-text-dim">Pumpningar idag</span>
            <span className="text-marine-text-bright">{pumpCount}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-marine-text-dim">Drifttimmar</span>
            <span className="text-marine-text-bright">{engineHours} h</span>
          </div>
          <div className="flex justify-between">
            <span className="text-marine-text-dim">Sedan service</span>
            <span className="text-marine-text-bright">{sinceSvc} h</span>
          </div>
          <div className="flex justify-between">
            <span className="text-marine-text-dim">Till service</span>
            <span className={sinceSvc > 200 ? 'text-amber-400' : 'text-emerald-400'}>{500 - sinceSvc} h</span>
          </div>
        </div>
      </div>
    </div>
  )
}

function TempRow({ label, value, unit, max, warn }: { label: string; value: number; unit: string; max: number; warn: number }) {
  const pct = (value / max) * 100
  const isWarn = value >= warn
  return (
    <div>
      <div className="flex justify-between text-xs font-mono mb-1">
        <span className="text-marine-text-dim">{label}</span>
        <span className={isWarn ? 'text-red-400 font-bold' : 'text-marine-text-bright'}>
          {value.toFixed(0)}{unit}
        </span>
      </div>
      <div className="h-1.5 bg-marine-border rounded-full overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-1000"
          style={{
            width: `${pct}%`,
            backgroundColor: isWarn ? '#e74c3c' : pct > 70 ? '#f1c40f' : '#2ecc71',
          }}
        />
      </div>
    </div>
  )
}
