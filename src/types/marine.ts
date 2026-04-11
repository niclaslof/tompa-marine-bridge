export interface Position {
  lat: number
  lon: number
}

export interface NavigationData {
  position: Position
  sog: number        // Speed Over Ground (knots)
  cog: number        // Course Over Ground (degrees)
  stw: number        // Speed Through Water (knots)
  heading: number    // Magnetic heading (degrees)
}

export interface WindData {
  twd: number        // True Wind Direction (degrees)
  tws: number        // True Wind Speed (knots)
  aws: number        // Apparent Wind Speed (knots)
  awa: number        // Apparent Wind Angle (degrees)
  gust: number       // Gust speed (knots)
}

export interface DepthData {
  depth: number      // Meters below transducer
  alarm: boolean
  alarmThreshold: number
}

export interface EnvironmentData {
  airTemp: number       // Celsius
  waterTemp: number     // Celsius
  pressure: number      // hPa
  pressureHistory: number[]  // 6h sparkline
  humidity: number      // Percent
}

export interface GnssStatus {
  satellites: number
  hdop: number
  fixType: 'No Fix' | '2D' | '3D' | 'DGPS'
}

export interface AutopilotData {
  mode: 'standby' | 'auto' | 'wind' | 'track'
  targetHeading: number
  rudderAngle: number
}

export interface AnchorData {
  active: boolean
  position: Position | null
  radius: number
  currentDrift: number
  alarm: boolean
}

export interface NextHarbor {
  name: string
  eta: string
  distance: number    // nm
  status: 'open' | 'restricted' | 'closed'
}

export interface BoatData {
  navigation: NavigationData
  wind: WindData
  depth: DepthData
  environment: EnvironmentData
  gnss: GnssStatus
  autopilot: AutopilotData
  anchor: AnchorData
  nextHarbor: NextHarbor
  timestamp: number
}

export type TabId = 'bridge' | 'chart' | 'harbors' | 'engine' | 'weather' | 'safety' | 'log'

export interface Tab {
  id: TabId
  label: string
  icon: string
}
