import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View } from 'react-native';
import AvailableSlide from './Authentication/background'; // your component path

export default function App() {
  return (
    <View style={styles.container}>
      <AvailableSlide />
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
