import React, { useEffect, useState } from "react";
// import { useFocusEffect } from "@react-navigation/native";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  FlatList,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
// import { useNavigation } from "@react-navigation/native";
// import { useQuery, useMutation } from "@tanstack/react-query";
// import apiRequest from "../api/apiRequest";
// import urlType from "../constants/UrlConstants";
// import AsyncStorage from "@react-native-async-storage/async-storage";
// import { positionStyle, showMessage } from "react-native-flash-message";
// import { Button } from "react-native-elements";
import profileImg from "../assets/profileImg.jpg";

const Services = ({ navigation }) => {
  return (
    <>
      <View style={styles.container}>
        <FlatList
          showsVerticalScrollIndicator={false}
          data={Array.from({ length: 5 })}
          keyExtractor={(item, index) => String(index)}
          renderItem={({ item }) => (
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
              <Image
                source={profileImg}
                style={styles.img}
                resizeMode={"contain"}
              />
              <View>
                <View style={{ alignItems: "center" }}>
                  <Text style={styles.largeTxt}>Haseebullah</Text>
                  <Text style={styles.smallTxt}>Technician</Text>
                </View>
                <View
                  style={[
                    styles.row,
                    { justifyContent: "flex-end", marginVertical: 5 },
                  ]}
                >
                  <Text style={styles.smallTxt}>4.5</Text>
                  <MaterialCommunityIcons
                    name="star"
                    size={22}
                    color={"yellow"}
                  />
                </View>
                <TouchableOpacity
                  style={styles.btn}
                  onPress={() => navigation.navigate("ServiceUser")}
                >
                  <Text style={styles.btnTxt}>Book</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        />
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
    // backgroundColor: "grey",
    justifyContent: "center",
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
  },
  largeTxt: {
    fontSize: 16,
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
    height: 120,
    width: 100,
  },
});

export default Services;
