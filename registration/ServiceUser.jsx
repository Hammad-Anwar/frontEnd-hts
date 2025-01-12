import React, { useEffect, useState } from "react";
// import { useFocusEffect } from "@react-navigation/native";
import { View, Text, StyleSheet, TouchableOpacity, Image } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
// import { useNavigation } from "@react-navigation/native";
// import { useQuery, useMutation } from "@tanstack/react-query";
// import apiRequest from "../api/apiRequest";
// import urlType from "../constants/UrlConstants";
// import AsyncStorage from "@react-native-async-storage/async-storage";
// import { positionStyle, showMessage } from "react-native-flash-message";
// import { Button } from "react-native-elements";
import profileImg from "../assets/profileImg.jpg";

const ServiceUser = ({ navigation }) => {
  return (
    <>
      <View style={styles.container}>
        <View style={{ alignItems: "center" }}>
          <Image source={profileImg} style={styles.img} resizeMode={"cover"} />
          <Text style={styles.largeTxt}>Haseebullah</Text>
        </View>
        <View
          style={[
            styles.row,
            {
              justifyContent: "space-around",
              backgroundColor: "lightgrey",
              padding: 20,
              marginHorizontal: 20,
              marginTop: 20,
              borderRadius: 12,
            },
          ]}
        >
          <View style={{ alignItems: "center" }}>
            <Text style={styles.largeTxt}>Technician</Text>
            <Text style={styles.smallTxt}>
              Contrary to popular belief, Lorem Ipsum is not simply random text.
              It has roots in a piece of classical Latin literature from 45 BC,
              making it over 2000 years old. Richard McClintock, a Latin
              professor at Hampden-Sydney College in Virginia, looked up one of
              the more obscure Latin words, consectetur, from a Lorem Ipsum
            </Text>
          </View>
        </View>
        <View
          style={[
            styles.row,
            { justifyContent: "space-evenly", marginTop: 20 },
          ]}
        >
          <View style={{ alignItems: "center" }}>
            <Text style={styles.largeTxt}>Experience</Text>
            <Text style={[styles.largeTxt, { fontWeight: "800" }]}>4 Yr</Text>
          </View>
          <View style={{ alignItems: "center" }}>
            <Text style={styles.largeTxt}>Rating</Text>
            <Text style={[styles.largeTxt, { fontWeight: "800" }]}>4.5</Text>
          </View>
        </View>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingVertical: 20,
    paddingHorizontal: 10,
    backgroundColor: "#fff",
  },
  header: {
    flexDirection: "row",
    // backgroundColor: "grey",
    // justifyContent: "center",
    alignItems: "flex-start",
  },
  headerText: {
    color: "#000",
    fontSize: 22,
    fontWeight: "600",
  },
  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  contentText: {
    fontSize: 16,
  },
  footer: {
    height: 50,
    backgroundColor: "grey",
    justifyContent: "center",
    alignItems: "center",
  },
  smallTxt: {
    fontSize: 14,
    color: "#000",
    fontWeight: "500",
    textAlign: "center",
    marginVertical: 10,
  },
  largeTxt: {
    fontSize: 18,
    color: "#000",
    fontWeight: "600",
  },
  btn: {
    backgroundColor: "#0C2D57",
    paddingHorizontal: 30,
    paddingVertical: 10,
    borderRadius: 12,
  },
  btnTxt: {
    fontSize: 16,
    fontWeight: "600",
    color: "#fff",
    textTransform: "uppercase",
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
  },
  img: {
    height: 180,
    width: 160,
    borderRadius: 18,
    marginBottom: 10,
  },
});

export default ServiceUser;
