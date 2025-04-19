import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import MapView, { Marker, Circle } from 'react-native-maps';

export default function LocationDetailsScreen({ route }) {
  const { coordinates, radius } = route.params;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Location Details</Text>
      <MapView
        style={styles.map}
        initialRegion={{
          ...coordinates,
          latitudeDelta: 0.005,
          longitudeDelta: 0.005,
        }}
      >
        <Marker coordinate={coordinates} />
        <Circle
          center={coordinates}
          radius={Math.min(radius || 100, 1000)}
          strokeColor='#7C0152'
          fillColor='rgba(124, 1, 82, 0.1)'
        />
      </MapView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  map: {
    flex: 1,
    borderRadius: 10,
  },
});
