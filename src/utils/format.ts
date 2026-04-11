export function formatCoordinate(value: number, type: 'lat' | 'lon'): string {
  const abs = Math.abs(value)
  const deg = Math.floor(abs)
  const min = ((abs - deg) * 60).toFixed(3)
  const dir = type === 'lat' ? (value >= 0 ? 'N' : 'S') : (value >= 0 ? 'E' : 'W')
  return `${deg}° ${min}' ${dir}`
}

export function formatSpeed(knots: number): string {
  return knots.toFixed(1)
}

export function formatDegrees(deg: number): string {
  return `${Math.round(deg)}°`
}

export function formatDepth(meters: number): string {
  return meters.toFixed(1)
}

export function formatTemp(celsius: number): string {
  return `${celsius.toFixed(1)}°C`
}

export function formatPressure(hpa: number): string {
  return `${Math.round(hpa)} hPa`
}
