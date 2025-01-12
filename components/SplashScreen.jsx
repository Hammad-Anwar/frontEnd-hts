import React, { useEffect } from "react";
import { View, Text, StyleSheet, Image, ActivityIndicator, StatusBar } from "react-native";

const SplashScreen = ({}) => {
  return (
    <View style={styles.container}>
      <StatusBar barStyle={"light-content"} translucent={false} backgroundColor={"#165069"}/>
      <Image
        source={require("../assets/splash_logo.png")}
        style={styles.logo}
      />
      <Text style={styles.text}>Home Tech Solutions</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#165069", // Background color of the splash screen
  },
  logo: {
    width: 200,
    height: 200,
    marginBottom: 10,
  },
  text: {
    color: "#ffff",
    fontSize: 18,
  },
});

export default SplashScreen;
