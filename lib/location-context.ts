import type { LocationData } from "./weather-types"

let currentLocation: LocationData | null = null

export function setCurrentLocation(location: LocationData) {
  currentLocation = location
}

export function getCurrentLocationData(): LocationData | null {
  return currentLocation
}
