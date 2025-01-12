import React, { useEffect, useState } from "react";
import { useFocusEffect } from "@react-navigation/native";
import { View, Text, StyleSheet, TouchableOpacity, Image } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useQuery, useMutation } from "@tanstack/react-query";
import apiRequest from "../api/apiRequest";
import urlType from "../constants/UrlConstants";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { positionStyle, showMessage } from "react-native-flash-message";
import ProfilePage from "./profile";
import { Button } from "react-native-elements";
import { MaterialCommunityIcons, MaterialIcons } from "@expo/vector-icons";
import logoImg from "../assets/logo.png";
import computerImg from "../assets/ComputerSupport.png";
import electricImg from "../assets/FuseSymbol.png";
import techImg from "../assets/Vector.png";
import { Searchbar } from "react-native-paper";

const HomeScreen = () => {
  return (
    <>
      <View style={styles.container}>
        <View style={[styles.row, { justifyContent: "space-between" }]}>
          <Image source={logoImg} style={styles.img} />
          <View style={[styles.row, { marginRight: 20 }]}>
            <TouchableOpacity style={{ marginRight: 10 }}>
              <MaterialCommunityIcons
                name="cart-variant"
                size={24}
                color={"#000"}
              />
            </TouchableOpacity>
            <TouchableOpacity>
              <MaterialCommunityIcons
                name="shopping-outline"
                size={24}
                color={"#000"}
              />
            </TouchableOpacity>
          </View>
        </View>

        <View style={{ padding: 20 }}>
          <View
            style={{
              alignItems: "flex-start",
              backgroundColor: "#165069",
              borderRadius: 12,
              padding: 10,
              marginBottom: 20,
            }}
          >
            <Text
              style={{
                color: "#fff",
                fontWeight: "700",
                fontSize: 42,
                marginRight: 40,
              }}
            >
              What are you looking for today?
            </Text>
          </View>
          <Searchbar placeholder="Search" />
          <View
            style={[
              styles.row,
              { justifyContent: "space-between", marginVertical: 20 },
            ]}
          >
            <TouchableOpacity
              style={{
                alignItems: "center",
                padding: 20,
                borderRadius: 12,
                backgroundColor: "lightgrey",
              }}
            >
              <MaterialIcons name="computer" size={34} color="#165069" />
              <Text style={{ color: "#0C2D57", fontWeight: "500" }}>
                Technician
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={{
                alignItems: "center",
                padding: 20,
                borderRadius: 12,
                backgroundColor: "lightgrey",
              }}
            >
              <MaterialIcons
                name="electrical-services"
                size={34}
                color="#165069"
              />
              <Text style={{ color: "#0C2D57", fontWeight: "500" }}>
                Electrician
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={{
                alignItems: "center",
                padding: 20,
                borderRadius: 12,
                backgroundColor: "lightgrey",
              }}
            >
              <MaterialCommunityIcons
                name="hammer-screwdriver"
                size={34}
                color="#165069"
              />
              <Text style={{ color: "#0C2D57", fontWeight: "500" }}>
                Repairing
              </Text>
            </TouchableOpacity>
          </View>
          <Text style={{ marginVertical: 10, fontSize: 22, fontWeight: "500" }}>
            Recomended for you
          </Text>
        </View>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    height: 50,
    backgroundColor: "grey",
    justifyContent: "center",
    alignItems: "center",
  },
  headerText: {
    color: "#fff",
    fontSize: 18,
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
  footerText: {
    fontSize: 14,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
  },
  img: {
    height: 80,
    width: 80,
  },
  iconStyle: {
    height: 20,
    width: 20,
  },
});

export default HomeScreen;
