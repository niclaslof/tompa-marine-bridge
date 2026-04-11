import { useSimulatedData } from './useSimulatedData'
import type { BoatData } from '@/types/marine'

// Detects environment and picks the right data source.
// Vercel/browser: simulated data
// Pi: would use useSignalKData (future)
export function useBoatData(): BoatData {
  // For now, always use simulated data.
  // On Pi, this will switch to useSignalKData()
  return useSimulatedData()
}
