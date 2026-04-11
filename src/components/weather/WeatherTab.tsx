import { useMemo } from 'react'
import { jitter } from '@/data/simulation'

interface HourForecast {
  hour: string
  icon: string
  temp: number
  windDir: number
  windSpeed: number
  precip: number
}

interface DayForecast {
  day: string
  icon: string
  high: number
  low: number
  wind: string
  desc: string
}

const WIND_DIRS = ['N', 'NNO', 'NO', 'ONO', 'O', 'OSO', 'SO', 'SSO', 'S', 'SSV', 'SV', 'VSV', 'V', 'VNV', 'NV', 'NNV']
function windLabel(deg: number): string {
  return WIND_DIRS[Math.round(deg / 22.5) % 16]
}

export function WeatherTab() {
  const hours = useMemo<HourForecast[]>(() => {
    const now = new Date()
    const icons = ['☀️', '⛅', '🌤', '☁️', '🌧', '⛈']
    return Array.from({ length: 12 }, (_, i) => {
      const h = new Date(now.getTime() + i * 3600000)
      const temp = jitter(14 - Math.abs(i - 6) * 0.5, 0.5)
      return {
        hour: `${h.getHours().toString().padStart(2, '0')}:00`,
        icon: icons[Math.floor(Math.random() * 3)],
        temp: Math.round(temp * 10) / 10,
        windDir: jitter(220, 15),
        windSpeed: jitter(12, 2),
        precip: Math.random() < 0.3 ? jitter(1.2, 0.8) : 0,
      }
    })
  }, [])

  const days = useMemo<DayForecast[]>(() => {
    const dayNames = ['Idag', 'Imorgon', 'Onsdag', 'Torsdag', 'Fredag']
    return dayNames.map((day, i) => ({
      day,
      icon: ['⛅', '🌤', '☁️', '🌧', '☀️'][i],
      high: Math.round(jitter(15 - i * 0.5, 1)),
      low: Math.round(jitter(8 + i * 0.3, 1)),
      wind: `SV ${Math.round(jitter(12, 3))} kn`,
      desc: ['Halvklart', 'Mestadels sol', 'Mulet', 'Regnskurar', 'Klart'][i],
    }))
  }, [])

  const seaWeather = useMemo(() => ({
    waveHeight: jitter(0.8, 0.2),
    wavePeriod: jitter(4.5, 0.5),
    visibility: jitter(12, 3),
    waterTemp: jitter(11, 0.3),
  }), [])

  return (
    <div className="max-w-5xl mx-auto p-3 space-y-3">
      {/* 12-hour forecast */}
      <div className="bg-marine-panel rounded-xl border border-marine-border p-4">
        <div className="text-xs font-mono uppercase tracking-wider text-marine-text-dim mb-3">12-timmarsprognos</div>
        <div className="flex gap-1 overflow-x-auto pb-2">
          {hours.map((h, i) => (
            <div key={i} className="flex-shrink-0 w-16 text-center p-2 rounded-lg hover:bg-marine-panel-light transition-colors">
              <div className="text-[10px] font-mono text-marine-text-dim">{h.hour}</div>
              <div className="text-xl my-1">{h.icon}</div>
              <div className="text-sm font-mono font-bold text-marine-text-bright">{h.temp}°</div>
              <div className="mt-1">
                <div
                  className="text-[10px] font-mono text-marine-blue inline-block"
                  style={{ transform: `rotate(${h.windDir}deg)` }}
                >↓</div>
              </div>
              <div className="text-[10px] font-mono text-marine-text-dim">{Math.round(h.windSpeed)}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {/* Sea weather */}
        <div className="bg-marine-panel rounded-xl border border-marine-border p-4">
          <div className="text-xs font-mono uppercase tracking-wider text-marine-text-dim mb-3">Sjöväder</div>
          <div className="space-y-3">
            <WeatherRow label="Våghöjd" value={`${seaWeather.waveHeight.toFixed(1)} m`} />
            <WeatherRow label="Vågperiod" value={`${seaWeather.wavePeriod.toFixed(1)} s`} />
            <WeatherRow label="Sikt" value={`${Math.round(seaWeather.visibility)} km`} />
            <WeatherRow label="Vattentemp" value={`${seaWeather.waterTemp.toFixed(1)}°C`} />
            <WeatherRow label="Vind" value={`${windLabel(220)} ${Math.round(jitter(12, 1))} kn`} />
          </div>
        </div>

        {/* 5-day forecast */}
        <div className="bg-marine-panel rounded-xl border border-marine-border p-4">
          <div className="text-xs font-mono uppercase tracking-wider text-marine-text-dim mb-3">5-dagarsprognos</div>
          <div className="space-y-2">
            {days.map((d, i) => (
              <div key={i} className="flex items-center gap-3 py-1.5 px-2 rounded-lg hover:bg-marine-panel-light transition-colors">
                <span className="text-lg">{d.icon}</span>
                <span className="font-sans text-sm text-marine-text-bright w-20">{d.day}</span>
                <span className="text-xs font-mono text-marine-text-dim flex-1">{d.desc}</span>
                <span className="text-xs font-mono text-marine-text">
                  {d.low}° / <span className="text-marine-text-bright">{d.high}°</span>
                </span>
                <span className="text-[10px] font-mono text-marine-blue">{d.wind}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Warnings */}
      <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-4">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-lg">⚠️</span>
          <span className="text-xs font-mono uppercase tracking-wider text-amber-400">Kulingvarning</span>
        </div>
        <div className="text-sm font-mono text-marine-text">
          SMHI varnar för sydvästlig kuling 15-20 m/s i Stockholms skärgård från torsdag kväll.
          Vindbyar upp till 25 m/s.
        </div>
      </div>
    </div>
  )
}

function WeatherRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between text-sm font-mono">
      <span className="text-marine-text-dim">{label}</span>
      <span className="text-marine-text-bright">{value}</span>
    </div>
  )
}
