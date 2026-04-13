import { useEffect, useRef } from 'react'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { PIER_COORDS } from '@/data/pierCoordinates'
import type { StopInfo } from '@/hooks/useTimetable'

interface RouteMapProps {
  allStops: StopInfo[]
  currentStop: StopInfo | null
  nextStop: StopInfo | null
}

export function RouteMap({ allStops, currentStop, nextStop }: RouteMapProps) {
  const mapRef = useRef<HTMLDivElement>(null)
  const mapInstance = useRef<L.Map | null>(null)
  const boatMarker = useRef<L.Marker | null>(null)

  // Initialize map once
  useEffect(() => {
    if (!mapRef.current || mapInstance.current) return

    const map = L.map(mapRef.current, {
      center: [59.335, 18.100],
      zoom: 13,
      zoomControl: false,
      attributionControl: false,
    })

    L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
      maxZoom: 18,
    }).addTo(map)

    // Draw route line through all unique piers in order
    const seenPiers = new Set<string>()
    const routeCoords: [number, number][] = []
    for (const stop of allStops) {
      if (!seenPiers.has(stop.pierId) && PIER_COORDS[stop.pierId]) {
        seenPiers.add(stop.pierId)
        routeCoords.push(PIER_COORDS[stop.pierId])
      }
    }

    // Route line
    L.polyline(routeCoords, {
      color: '#e8891c',
      weight: 2,
      opacity: 0.4,
      dashArray: '6, 8',
    }).addTo(map)

    // Pier markers
    for (const [pierId, coords] of Object.entries(PIER_COORDS)) {
      const pierName = allStops.find(s => s.pierId === pierId)?.pierName ?? pierId
      L.circleMarker(coords, {
        radius: 5,
        color: '#e8891c',
        fillColor: '#e8891c',
        fillOpacity: 0.7,
        weight: 1,
      }).bindTooltip(pierName, {
        permanent: false,
        direction: 'top',
        className: 'pier-tooltip',
        offset: [0, -8],
      }).addTo(map)
    }

    // Boat marker (triangle icon)
    const boatIcon = L.divIcon({
      html: `<div style="width:20px;height:20px;display:flex;align-items:center;justify-content:center">
        <svg width="18" height="18" viewBox="0 0 18 18">
          <polygon points="9,1 3,16 9,12 15,16" fill="#e8891c" stroke="#fff" stroke-width="1"/>
        </svg>
      </div>`,
      iconSize: [20, 20],
      iconAnchor: [10, 10],
      className: '',
    })

    boatMarker.current = L.marker([59.3565, 18.1015], { icon: boatIcon }).addTo(map)

    mapInstance.current = map

    return () => {
      map.remove()
      mapInstance.current = null
    }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  // Update boat position when current stop changes
  useEffect(() => {
    if (!boatMarker.current) return

    let targetCoords: [number, number] | null = null

    if (currentStop && nextStop) {
      // Interpolate between current and next pier
      const from = PIER_COORDS[currentStop.pierId]
      const to = PIER_COORDS[nextStop.pierId]
      if (from && to) {
        // Put boat 30% of the way toward next stop (rough visual)
        targetCoords = [
          from[0] + (to[0] - from[0]) * 0.3,
          from[1] + (to[1] - from[1]) * 0.3,
        ]
      }
    } else if (currentStop) {
      targetCoords = PIER_COORDS[currentStop.pierId] ?? null
    }

    if (targetCoords) {
      boatMarker.current.setLatLng(targetCoords)
    }
  }, [currentStop, nextStop])

  // Highlight current pier
  useEffect(() => {
    if (!mapInstance.current || !currentStop) return
    const coords = PIER_COORDS[currentStop.pierId]
    if (coords) {
      mapInstance.current.panTo(coords, { animate: true, duration: 1 })
    }
  }, [currentStop?.pierId]) // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div
      ref={mapRef}
      className="w-full h-full rounded-xl overflow-hidden border border-marine-border"
      style={{ minHeight: 300 }}
    />
  )
}
