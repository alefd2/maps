import {
  Accuracy,
  hasStartedLocationUpdatesAsync,
  startLocationUpdatesAsync,
  stopLocationUpdatesAsync,
} from "expo-location"

export const BACKGROUND_TASK_NAME = "location-tracking"

// TaskManager.defineTask(BACKGROUND_TASK_NAME, async ({ data, error }: any) => {
//   try {
//     if (error) {
//       throw error
//     }
//     if (data) {
//       const { coords, timestamp } = data.locations[0]

//       const currentLocation = {
//         latitude: coords.latitude,
//         longitude: coords.longitude,
//       }

//       console.log(currentLocation)

//       await saveStorageLocations(currentLocation)
//     }
//   } catch (error) {
//     console.error(error)
//   }
// })

export async function startLocationTask() {
  try {
    const hasStarted = await hasStartedLocationUpdatesAsync(
      BACKGROUND_TASK_NAME
    )

    if (!hasStarted) {
      await startLocationUpdatesAsync(BACKGROUND_TASK_NAME, {
        accuracy: Accuracy.BestForNavigation,
        timeInterval: 3000,
        distanceInterval: 1,
      })
    }
    console.info("start task")
  } catch (error) {
    console.error(error)
  }
}
export async function stopLocationTask() {
  try {
    const hasStarted = await hasStartedLocationUpdatesAsync(
      BACKGROUND_TASK_NAME
    )

    if (hasStarted) {
      await stopLocationUpdatesAsync(BACKGROUND_TASK_NAME)
    }
    console.info("stop task")
  } catch (error) {
    console.error(error)
  }
}
