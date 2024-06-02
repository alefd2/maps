import React, { useState, useEffect, useRef } from "react";
import * as TaskManager from "expo-task-manager";
import { View, TouchableOpacity, Text } from "react-native";
import MapView, { LatLng, Marker, Polyline } from "react-native-maps";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import {
  requestForegroundPermissionsAsync,
  getCurrentPositionAsync,
  LocationObject,
  requestBackgroundPermissionsAsync,
} from "expo-location";
import { styles } from "./styles";
import {
  BACKGROUND_TASK_NAME,
  startLocationTask,
} from "./src/tasks/backgroundTask";

export default function App() {
  const [location, setLocation] = useState<LocationObject | null>(null);
  const [reset, setReset] = useState<boolean>(false);
  const [currentLocation, setCurrentLocation] = useState<LatLng | null>(null);
  const [route, setRoute] = useState<LatLng[]>([]);
  const [getRoute, setGetRoute] = useState<boolean>(true);
  const [intervalo, setIntervalo] = useState<number>(3000);
  const [distance, setDistance] = useState<number>(10);

  const mapRef = useRef<MapView>(null);

  async function requestPermissionAsync() {
    const { granted } = await requestForegroundPermissionsAsync();
    if (granted) {
      const currentPosition = await getCurrentPositionAsync();
      setLocation(currentPosition);
      clearLatLong();
      setRoute([currentPosition?.coords!]);
    }
  }

  useEffect(() => {
    requestPermissionAsync();
  }, [reset]);

  useEffect(() => {
    const requestPermissions = async () => {
      const { status: foregroundStatus } =
        await requestForegroundPermissionsAsync();
      if (foregroundStatus === "granted") {
        const { status: backgroundStatus } =
          await requestBackgroundPermissionsAsync();
        if (backgroundStatus === "granted") {
          await startLocationTask();
        }
      }
    };
    requestPermissions();
  }, []);

  const handleSalveLatLng = () => {
    if (currentLocation) {
      setRoute((prevRoute) => [...prevRoute, currentLocation!]);
    }
  };

  const handleRestore = () => {
    setReset(!reset);
  };

  const clearLatLong = () => {
    setRoute([]);
  };

  TaskManager.defineTask(BACKGROUND_TASK_NAME, async ({ data, error }: any) => {
    try {
      if (error) {
        throw error;
      }
      if (data) {
        const { coords, timestamp } = data.locations[0];

        let currentLocation = {
          latitude: coords.latitude,
          longitude: coords.longitude,
        };

        setCurrentLocation(currentLocation);
        console.log("teste", currentLocation);

        mapRef.current?.animateCamera({
          pitch: 70,
          center: currentLocation,
        });
      }
    } catch (error) {
      console.error(error);
    }
  });

  return (
    <View style={styles.container}>
      <View style={styles.actionWrapper}>
        <TouchableOpacity
          style={{
            backgroundColor: "#b4a201",
            padding: 10,
            borderRadius: 5,
            elevation: 5,
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.25,
            shadowRadius: 3.84,
            display: "flex",
            margin: 10,
            width: "auto",
          }}
          onPress={() => handleRestore()}
        >
          <MaterialCommunityIcons name="restore" size={30} color="#fdfdfd" />
        </TouchableOpacity>
        <TouchableOpacity
          style={{
            backgroundColor: "#01b452",
            padding: 10,
            borderRadius: 5,
            elevation: 5,
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.25,
            shadowRadius: 3.84,
            display: "flex",
            margin: 10,
            width: "auto",
          }}
          onPress={() => handleSalveLatLng()}
        >
          <MaterialCommunityIcons
            name="map-marker-check"
            size={30}
            color="#fdfdfd"
          />
        </TouchableOpacity>
        <TouchableOpacity
          style={{
            backgroundColor: "#b42b01",
            elevation: 5,
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.25,
            shadowRadius: 3.84,
            padding: 10,
            borderRadius: 5,
            margin: 10,
          }}
          onPress={() => clearLatLong()}
        >
          <MaterialCommunityIcons name="trash-can" size={30} color="#fdfdfd" />
        </TouchableOpacity>
        {route.length >= 0 && (
          <Text
            style={{
              backgroundColor: "#ffffff",
              padding: 10,
              borderRadius: 5,
              elevation: 5,
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.25,
              shadowRadius: 3.84,
              fontSize: 10,
            }}
          >
            Pontos salvos: {route.length}
          </Text>
        )}
      </View>
      {location && (
        <MapView
          ref={mapRef}
          style={styles.map}
          initialRegion={{
            latitude: location!.coords.latitude,
            longitude: location!.coords.longitude,
            latitudeDelta: 0.005,
            longitudeDelta: 0.005,
          }}
        >
          <Marker
            coordinate={{
              latitude: location!.coords.latitude,
              longitude: location!.coords.longitude,
            }}
          />
          {route && (
            <Polyline
              coordinates={[...route]}
              strokeColor="#12a336"
              strokeWidth={2}
              pointerEvents="box-only"
            />
          )}

          {route &&
            route.map((data, index) => (
              <Marker
                key={index}
                coordinate={{
                  latitude: data.latitude,
                  longitude: data.longitude,
                }}
              >
                <MaterialCommunityIcons
                  name="map-marker"
                  size={16}
                  color="#0b9121"
                />
              </Marker>
            ))}
        </MapView>
      )}
    </View>
  );
}
