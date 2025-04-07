import React from "react";
import { View, Image, Text, StyleSheet, ImageBackground } from "react-native";
import logo from "../assets/logo.png";
import background from "../assets/background.png";

const AvailableSlide = () => {
  return (
    <View style={styles.container}>
      {/* Background swirl */}
      <ImageBackground source={background} style={styles.backgroundImage}>
        {/* Center content */}
        <View style={styles.centerContent}>
          <Image source={logo} style={styles.logo} resizeMode="contain" />
        </View>
      </ImageBackground>
    </View>
  );
};

export default AvailableSlide;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#EEEEEE",
  },
  backgroundImage: {
    flex: 1,
    justifyContent: "flex-start",
    resizeMode: "cover",
  },
  centerContent: {
    marginTop: 60,
    alignItems: "center",
  },
  logo: {
    width: 150,
    height: 150,
  },
});
