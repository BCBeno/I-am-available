//background.js
import { Dimensions, View, Image, Text, StyleSheet, ImageBackground, TouchableOpacity } from "react-native";
import React from "react";
import { useNavigation } from "@react-navigation/native";
import logo from "../assets/logo.png";
import background from "../assets/Background.png";

const { width, height } = Dimensions.get("window");

const Background = () => {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <ImageBackground source={background} style={styles.backgroundImage}>
        <View style={styles.centerContent}>
          <Image source={logo} style={styles.logo} resizeMode="contain" />
          <TouchableOpacity onPress={() => navigation.navigate("SignIn")}>
            <Text style={styles.link}>Sign In</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => navigation.navigate("SignUp")}>
            <Text style={styles.link}>Sign Up</Text>
          </TouchableOpacity>
        </View>
      </ImageBackground>
    </View>
  );
};

export default Background;

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
  link: {
    color: "#6200ea",
    fontSize: 18,
    marginTop: 20,
    textDecorationLine: "underline",
    fontFamily: "Poppins",
  },
});
