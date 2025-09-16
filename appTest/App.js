import React, { useState, useRef } from "react";
import { StyleSheet, Text, View, Button, Image } from "react-native";
import Camera from "expo-camera";
import * as Location from "expo-location";

export default function App() {
  const [hasPermission, setHasPermission] = useState(null);
  const [photo, setPhoto] = useState(null);
  const [location, setLocation] = useState(null);
  const [isCameraReady, setIsCameraReady] = useState(false);
  const [isFetchingLocation, setIsFetchingLocation] = useState(false);
  const cameraRef = useRef(null);

  React.useEffect(() => {
    (async () => {
      const cameraStatus = await Camera.requestCameraPermissionsAsync();
      const locationStatus = await Location.requestForegroundPermissionsAsync();
      setHasPermission(
        cameraStatus.status === "granted" && locationStatus.status === "granted"
      );
    })();
  }, []);

  const takePicture = async () => {
    if (cameraRef.current && isCameraReady) {
      setIsFetchingLocation(true);
      const photoData = await cameraRef.current.takePictureAsync();
      const loc = await Location.getCurrentPositionAsync({});
      setPhoto(photoData.uri);
      setLocation(loc.coords);
      setIsFetchingLocation(false);
    }
  };

  if (hasPermission === null) {
    return (
      <View style={styles.centered}>
        <Text>Solicitando permissões...</Text>
      </View>
    );
  }
  if (hasPermission === false) {
    return (
      <View style={styles.centered}>
        <Text>Permissão negada.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {!photo ? (
        <View style={styles.cameraContainer}>
          <Camera
            style={styles.camera}
            ref={cameraRef}
            onCameraReady={() => setIsCameraReady(true)}
          />
          <Button
            title="Tirar Foto"
            onPress={takePicture}
            disabled={!isCameraReady}
          />
        </View>
      ) : (
        <View style={styles.centered}>
          <Image source={{ uri: photo }} style={styles.preview} />
          {isFetchingLocation && <Text>Buscando localização...</Text>}
          {location && (
            <Text>
              Localização: {location.latitude}, {location.longitude}
            </Text>
          )}
          <Button
            title="Tirar outra foto"
            onPress={() => {
              setPhoto(null);
              setLocation(null);
              setIsFetchingLocation(false);
            }}
          />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  centered: { flex: 1, justifyContent: "center", alignItems: "center" },
  cameraContainer: { flex: 1, justifyContent: "center", alignItems: "center" },
  camera: { width: 300, height: 400 },
  preview: { width: 300, height: 400, margin: 10 },
});
