import type { BoatData } from '@/types/marine'
import { formatCoordinate } from '@/utils/format'

interface ChartTabProps {
  data: BoatData
}

// Placeholder chart tab - Leaflet will be added later
export function ChartTab({ data }: ChartTabProps) {
  const { position } = data.navigation
  const aisVessels = [
    { name: 'M/S Emelie', mmsi: '265001000', sog: 8.2, cog: 45, dist: 0.8 },
    { name: 'M/S Gurli', mmsi: '265002000', sog: 7.5, cog: 225, dist: 1.2 },
    { name: 'M/S Lisen', mmsi: '265003000', sog: 9.1, cog: 180, dist: 2.1 },
    { name: 'Sjöräddning 401', mmsi: '265010000', sog: 0, cog: 0, dist: 3.5 },
  ]

  return (
    <div className="max-w-5xl mx-auto p-3 space-y-3">
      {/* Map placeholder */}
      <div className="bg-marine-panel rounded-xl border border-marine-border overflow-hidden" style={{ height: '400px' }}>
        <div className="h-full flex flex-col items-center justify-center relative">
          {/* Simulated chart background */}
          <div className="absolute inset-0 opacity-10" style={{
            backgroundImage: `
              linear-gradient(0deg, #e2e8f0 1px, transparent 1px),
              linear-gradient(90deg, #e2e8f0 1px, transparent 1px)
            `,
            backgroundSize: '40px 40px',
          }} />

          {/* Position marker */}
          <div className="relative z-10 text-center">
            <div className="w-16 h-16 rounded-full border-2 border-marine-accent flex items-center justify-center mb-3 mx-auto">
              <div
                className="text-marine-accent text-2xl"
                style={{ transform: `rotate(${data.navigation.heading}deg)`, transition: 'transform 0.5s' }}
              >
                ▲
              </div>
            </div>
            <div className="font-mono text-sm text-marine-text-bright">
              {formatCoordinate(position.lat, 'lat')}
            </div>
            <div className="font-mono text-sm text-marine-text-bright">
              {formatCoordinate(position.lon, 'lon')}
            </div>
            <div className="text-xs font-mono text-marine-text-dim mt-2">
              Leaflet + OpenSeaMap — kommer i nästa version
            </div>
          </div>
        </div>
      </div>

      {/* AIS list */}
      <div className="bg-marine-panel rounded-xl border border-marine-border p-4">
        <div className="text-xs font-mono uppercase tracking-wider text-marine-text-dim mb-3">
          AIS-fartyg i närheten
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-xs font-mono">
            <thead>
              <tr className="text-marine-text-dim">
                <th className="text-left py-1.5 px-2">Namn</th>
                <th className="text-left py-1.5 px-2">MMSI</th>
                <th className="text-right py-1.5 px-2">SOG</th>
                <th className="text-right py-1.5 px-2">COG</th>
                <th className="text-right py-1.5 px-2">Avstånd</th>
              </tr>
            </thead>
            <tbody>
              {aisVessels.map((v, i) => (
                <tr key={i} className="border-t border-marine-border hover:bg-marine-panel-light">
                  <td className="py-2 px-2 text-marine-text-bright">{v.name}</td>
                  <td className="py-2 px-2 text-marine-text-dim">{v.mmsi}</td>
                  <td className="py-2 px-2 text-right text-marine-text">{v.sog} kn</td>
                  <td className="py-2 px-2 text-right text-marine-text">{v.cog}°</td>
                  <td className="py-2 px-2 text-right text-marine-accent">{v.dist} nm</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
