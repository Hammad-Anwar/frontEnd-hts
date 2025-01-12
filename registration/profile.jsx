import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Button,
  TouchableOpacity,
  Image,
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useStateValue } from "../context/GlobalContextProvider";
import CustomModal from "../components/CustomModal";
import AsyncStorage from "@react-native-async-storage/async-storage";
import profileImg from "../assets/profileImg.jpg";
import { TextInput } from "react-native-paper";

const ProfilePage = ({ navigation }) => {
  const [{}, dispatch] = useStateValue();
  const [isLogoutModalVisible, setLogoutModalVisible] = useState(false);
  const [userInfo, setUserInfo] = useState(null);

  useFocusEffect(
    React.useCallback(() => {
      const fetchData = async () => {
        try {
          const userString = await AsyncStorage.getItem("@user");
          const user = await JSON.parse(userString);

          if (user) {
            setUserInfo(user);
          }
        } catch (error) {
          console.error("Error fetching user data:", error);
        }
      };

      fetchData();

      return () => {};
    }, [])
  );

  console.log("first", userInfo);
  const handleLogout = () => {
    setLogoutModalVisible(true);
  };

  const confirmLogout = async () => {
    await AsyncStorage.removeItem("@auth_token");
    await AsyncStorage.removeItem("@user");
    dispatch({
      type: "SET_LOGIN",
      isLogin: false,
    });
    setLogoutModalVisible(false);
  };
  return (
    <>
      <View style={styles.container}>
        <View style={[styles.row, { justifyContent: "space-between" }]}>
          <Text style={styles.largeTxt}>Profile</Text>
          <TouchableOpacity onPress={handleLogout}>
            <MaterialCommunityIcons
              name="logout"
              size={30}
              color={"indianred"}
            />
          </TouchableOpacity>
        </View>
        <View style={styles.line}></View>
        <View style={{ alignItems: "center" }}>
          <Image source={profileImg} style={styles.img} resizeMode={"cover"} />
          <Text style={styles.text}>{userInfo?.customername}</Text>
        </View>
        <View style={{ marginTop: 20 }}>
          <TextInput label={"Email"} value={userInfo?.email} />
        </View>
      </View>
      <CustomModal
        visible={isLogoutModalVisible}
        onClose={() => setLogoutModalVisible(false)}
        onAction={confirmLogout}
        action="Sign out"
        message="Are you sure you want to sign out?"
      />
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  profileInfo: {
    marginBottom: 10,
  },
  label: {
    fontWeight: "bold",
    marginBottom: 5,
  },
  text: {
    fontSize: 20,
    fontWeight: "500",
    textTransform: "capitalize",
    marginTop: 10,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    alignContent: "center",
  },
  largeTxt: {
    fontSize: 22,
    fontWeight: "600",
    color: "#000",
  },
  smallTxt: {
    fontSize: 16,
    fontWeight: "500",
    color: "#000",
  },
  line: {
    marginTop: 10,
    marginBottom: 20,
    height: 1,
    width: "100%",
    backgroundColor: "lightgrey",
  },
  img: {
    height: 140,
    width: 140,
    borderRadius: 80,
  },
});

export default ProfilePage;
