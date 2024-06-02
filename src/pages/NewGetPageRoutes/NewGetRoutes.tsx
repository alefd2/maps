import {
  Button,
  SafeAreaView,
  Switch,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { styles } from "../../../styles";
import { MaterialCommunityIcons } from "@expo/vector-icons";

import {
  requestForegroundPermissionsAsync,
  getCurrentPositionAsync,
  LocationObject,
  watchPositionAsync,
  LocationAccuracy,
  requestBackgroundPermissionsAsync,
} from "expo-location";
import { useEffect, useState, useRef } from "react";
import MapView, { LatLng, Marker, Polyline } from "react-native-maps";
import { saveStorageLocations } from "../../storage/storageLocation";

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

  const handleSalveLatLng = () => {
    setRoute((prevRoute) => [...prevRoute, currentLocation!]);
  };

  const handleRestore = () => {
    setReset(!reset);
  };

  const clearLatLong = () => {
    setRoute([]);
  };

  // useEffect(() => {
  //   watchPositionAsync(
  //     {
  //       accuracy: LocationAccuracy.Highest,
  //       timeInterval: intervalo,
  //       distanceInterval: distance,
  //     },
  //     (response) => {
  //       mapRef.current?.animateCamera({
  //         pitch: 70,
  //         center: response.coords,
  //       });
  //       setCurrentLocation(response.coords);
  //     }
  //   );
  // }, []);

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
            elevation: 5, // Adicionando sombra
            shadowColor: "#000", // Cor da sombra
            shadowOffset: { width: 0, height: 2 }, // Offset da sombra
            shadowOpacity: 0.25, // Opacidade da sombra
            shadowRadius: 3.84, // Raio da sombra
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
            elevation: 5, // Adicionando sombra
            shadowColor: "#000", // Cor da sombra
            shadowOffset: { width: 0, height: 2 }, // Offset da sombra
            shadowOpacity: 0.25, // Opacidade da sombra
            shadowRadius: 3.84, // Raio da sombra
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
              elevation: 5, // Adicionando sombra
              shadowColor: "#000", // Cor da sombra
              shadowOffset: { width: 0, height: 2 }, // Offset da sombra
              shadowOpacity: 0.25, // Opacidade da sombra
              shadowRadius: 3.84, // Raio da sombra
              fontSize: 10,
            }}
          >
            Pontos salvos: {route.length}{" "}
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
