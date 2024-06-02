import AsyncStorage from "@react-native-async-storage/async-storage"
const STORAGE_KEY = "@storage:conectados"
const CURRENT_STORAGE_KEY = "@current:conectados"

export type LocationProps = {
  latitude: number
  longitude: number
}

export async function getStorageLocations() {
  const storage = await AsyncStorage.getItem(STORAGE_KEY)
  const response = storage ? JSON.parse(storage) : []
  return response
}

export async function saveStorageLocations(newLocation: LocationProps) {
  const storage = await getStorageLocations()
  storage.push(newLocation)
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(storage))
}

export async function removeStorageLocations() {
  await AsyncStorage.removeItem(STORAGE_KEY)
}

export async function saveStorageCurrentLocations(newLocation: LocationProps) {
  await AsyncStorage.setItem(CURRENT_STORAGE_KEY, JSON.stringify(newLocation))
}

export async function getStorageCurrentLocations() {
  const storage = await AsyncStorage.getItem(CURRENT_STORAGE_KEY)
  const response = storage ? JSON.parse(storage) : {}
  return response
}
