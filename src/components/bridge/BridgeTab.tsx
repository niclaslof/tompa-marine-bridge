import type { BoatData } from '@/types/marine'
import { formatCoordinate } from '@/utils/format'
import { Compass } from './Compass'
import { WindIndicator } from './WindIndicator'
import { DataPanel } from './DataPanel'
import { BarometerSparkline } from './BarometerSparkline'

interface BridgeTabProps {
  data: BoatData
}

export function BridgeTab({ data }: BridgeTabProps) {
  const { navigation, wind, depth, environment, gnss, autopilot, nextHarbor } = data

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 p-3">
      {/* Compass — center stage */}
      <div className="md:col-span-1 flex justify-center items-start bg-marine-panel rounded-lg p-4 border border-marine-border">
        <Compass heading={navigation.heading} cog={navigation.cog} />
      </div>

      {/* Speed & Course */}
      <DataPanel
        title="Fart & Kurs"
        items={[
          { label: 'SOG', value: navigation.sog, unit: 'kn' },
          { label: 'COG', value: `${Math.round(navigation.cog)}°` },
          { label: 'STW', value: navigation.stw, unit: 'kn' },
        ]}
      />

      {/* Position & GNSS */}
      <div className="bg-marine-panel rounded-lg p-3 border border-marine-border">
        <h3 className="text-marine-text-dim text-xs font-mono mb-2 uppercase tracking-wider">Position</h3>
        <div className="font-mono text-marine-text-bright text-sm space-y-1">
          <div>{formatCoordinate(navigation.position.lat, 'lat')}</div>
          <div>{formatCoordinate(navigation.position.lon, 'lon')}</div>
        </div>
        <div className="flex gap-3 mt-2 text-[10px] font-mono text-marine-text-dim">
          <span>Fix: <span className="text-marine-green">{gnss.fixType}</span></span>
          <span>Sat: {gnss.satellites}</span>
          <span>HDOP: {gnss.hdop}</span>
        </div>
      </div>

      {/* Wind */}
      <WindIndicator
        awa={wind.awa}
        aws={wind.aws}
        tws={wind.tws}
        twd={wind.twd}
        gust={wind.gust}
      />

      {/* Depth */}
      <DataPanel
        title="Djup"
        items={[
          { label: 'Djup', value: depth.depth, unit: 'm', alert: depth.alarm },
          { label: 'Larm', value: `< ${depth.alarmThreshold}m` },
        ]}
      />

      {/* Environment */}
      <DataPanel
        title="Temperatur"
        items={[
          { label: 'Luft', value: `${environment.airTemp.toFixed(1)}°` },
          { label: 'Vatten', value: `${environment.waterTemp.toFixed(1)}°` },
          { label: 'Fukt', value: `${Math.round(environment.humidity)}%` },
        ]}
      />

      {/* Barometer */}
      <BarometerSparkline
        history={environment.pressureHistory}
        current={environment.pressure}
      />

      {/* Autopilot */}
      <div className="bg-marine-panel rounded-lg p-3 border border-marine-border">
        <h3 className="text-marine-text-dim text-xs font-mono mb-2 uppercase tracking-wider">Autopilot</h3>
        <div className="flex justify-around font-mono text-sm">
          <div className="text-center">
            <span className={`inline-block px-2 py-0.5 rounded text-xs font-bold uppercase ${
              autopilot.mode === 'auto' ? 'bg-marine-green/20 text-marine-green' :
              autopilot.mode === 'standby' ? 'bg-marine-yellow/20 text-marine-yellow' :
              'bg-marine-blue/20 text-marine-blue'
            }`}>
              {autopilot.mode}
            </span>
          </div>
          <div className="text-center">
            <span className="text-marine-text-dim text-[10px] block">Kurs</span>
            <span className="text-marine-text-bright">{autopilot.targetHeading}°</span>
          </div>
          <div className="text-center">
            <span className="text-marine-text-dim text-[10px] block">Roder</span>
            <span className="text-marine-text-bright">{autopilot.rudderAngle}°</span>
          </div>
        </div>
      </div>

      {/* Next Harbor */}
      <div className="bg-marine-panel rounded-lg p-3 border border-marine-border">
        <h3 className="text-marine-text-dim text-xs font-mono mb-2 uppercase tracking-wider">Nästa hamn</h3>
        <div className="flex justify-between items-center font-mono">
          <div>
            <span className="text-marine-text-bright text-lg font-bold">{nextHarbor.name}</span>
            <span className={`ml-2 text-xs px-1.5 py-0.5 rounded ${
              nextHarbor.status === 'open' ? 'bg-marine-green/20 text-marine-green' :
              nextHarbor.status === 'restricted' ? 'bg-marine-yellow/20 text-marine-yellow' :
              'bg-marine-red/20 text-marine-red'
            }`}>
              {nextHarbor.status === 'open' ? 'Öppen' : nextHarbor.status === 'restricted' ? 'Begränsad' : 'Stängd'}
            </span>
          </div>
          <div className="text-right text-sm">
            <div className="text-marine-accent font-bold">ETA {nextHarbor.eta}</div>
            <div className="text-marine-text-dim">{nextHarbor.distance} nm</div>
          </div>
        </div>
      </div>
    </div>
  )
}
