import { Switch, Text, View } from "react-native";
import { styles } from "./styles";
import { MaterialCommunityIcons } from "@expo/vector-icons";

import {
  requestForegroundPermissionsAsync,
  getCurrentPositionAsync,
  LocationObject,
  watchPositionAsync,
  LocationAccuracy,
} from "expo-location";
import { useEffect, useState, useRef } from "react";
import MapView, { LatLng, Marker, Polyline } from "react-native-maps";

export default function App() {
  const [location, setLocation] = useState<LocationObject | null>(null);
  const [route, setRoute] = useState<LatLng[]>([]);
  const [getRoute, setGetRoute] = useState<boolean>(true);

  const mapRef = useRef<MapView>(null);

  async function requestPermissionAsync() {
    const { granted } = await requestForegroundPermissionsAsync();

    if (granted) {
      const currentPosition = await getCurrentPositionAsync();
      setLocation(currentPosition);
    }
  }
  useEffect(() => {
    requestPermissionAsync();
  }, []);

  const isGetRoute = () => {
    setRoute([]);
    setGetRoute(true);
  };

  const isCancelGetRoute = () => {
    setGetRoute(false);
  };

  const handleGetRoute = (value?: boolean) => {
    if (value) {
      return isGetRoute();
    }
    return isCancelGetRoute();
  };

  useEffect(() => {
    watchPositionAsync(
      {
        accuracy: LocationAccuracy.Highest,
        timeInterval: 3000,
        distanceInterval: 5,
      },
      (response) => {
        // console.log(response);
        mapRef.current?.animateCamera({
          pitch: 70,
          center: response.coords,
        });

        if (getRoute) {
          setRoute((prevRoute) => [...prevRoute, response.coords]);
        }
      }
    );
  }, [isGetRoute, isCancelGetRoute]);

  return (
    <View style={styles.container}>
      <View style={styles.switchContainer}>
        <Switch
          trackColor={{ false: "#777575", true: "#115500" }}
          ios_backgroundColor="#3e3e3e"
          onValueChange={(value) => handleGetRoute(value)}
          value={getRoute}
        />
        <Text>{getRoute ? "ativo" : "Inativo "} |</Text>

        {route.length >= 0 && <Text>Pontos salvos: {route.length} </Text>}
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
