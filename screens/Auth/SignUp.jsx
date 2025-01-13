import React, { useState } from "react";
import {
  View,
  TextInput,
  Button,
  StyleSheet,
  Text,
  TouchableOpacity,
  Image,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import styles from "../../styles/styles";
import { useQuery, useMutation } from "@tanstack/react-query";
import apiRequest from "../../api/apiRequest";
import urlType from "../../constants/UrlConstants";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { showMessage } from "react-native-flash-message";
import logoImg from "../../assets/logo.png";
import { useStateValue } from "../../context/GlobalContextProvider";
import Dropdown from "../../components/Dropdown";
import { citiesName } from "../../constants/helper";
import { Colors } from "../../constants/theme";

const SignUp = ({ navigation }) => {
  const [{}, dispatch] = useStateValue();
  const [fullName, setfullName] = useState("");
  const [mobileNo, setMobileNo] = useState("");
  const [address, setAddress] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [selectedCity, setSelectedCity] = useState("");
  const [selectedUser, setSelectedUser] = useState("");

  const userTypes = [
    { label: "Customer", value: "customer" },
    { label: "Vendor", value: "vendor" },
  ];

  const signupMutation = useMutation({
    mutationFn: async (data) => {
      const response = await apiRequest(urlType.BACKEND, {
        method: "post",
        url: `signup`,
        data,
      });
      // console.log(response);
      return response;
    },
    onSuccess: async (e) => {
      if (e.status === 200) {
        if (selectedUser === "customer") {
          if (e !== false) {
            await dispatch(
              {
                type: "SET_LOGIN",
                isLogin: true,
              },
              {
                type: "SET_USER_TYPE",
                isType: e?.data?.user?.userType,
              }
            );
          }
          await AsyncStorage.setItem("@user", JSON.stringify(e.data.user));
          await AsyncStorage.setItem("@auth_token", e.data.token);
          // navigation.navigate("BottomNavigation");
        } else if (selectedUser === "vendor") {
          if (e !== false) {
            await dispatch({
              type: "SET_USER_TYPE",
              isType: e?.data?.user?.userType,
            });
          }
          // await AsyncStorage.setItem("@user", JSON.stringify(e.data.user));
          await AsyncStorage.setItem("@auth_token", e.data.token);
          navigation.navigate("VendorDetails", { userId: e?.data?.user?._id });
        }
      } else if (e.response.status === 404) {
        showMessage({
          message: e.response.message,
          type: "danger",
          color: "#fff",
          backgroundColor: "red",
          floating: true,
        });
      } else {
        showMessage({
          message: e.response.message || "An Error occured",
          type: "danger",
          color: "#fff",
          backgroundColor: "red",
          floating: true,
        });
      }
    },
  });

  const handleSignup = async () => {
    var emailFormat = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    var passwordFormat = /^(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{8,}$/;
  
    if (
      email.length > 0 &&
      fullName.length > 0 &&
      mobileNo.length > 0 &&
      address.length > 0 &&
      selectedCity.length > 0 &&
      selectedUser.length > 0 &&
      password.length > 0 &&
      password === confirmPassword
    ) {
      if (email.match(emailFormat)) {
        if (password.match(passwordFormat)) {
          const data = {
            fullName: fullName,
            email: email,
            password: password,
            mobileNo: mobileNo,
            address: address,
            city: selectedCity,
            userType: selectedUser,
          };
          await signupMutation.mutate(data);
        } else {
          showMessage({
            message:
              "Password must be at least 8 characters long, include 1 uppercase letter, and 1 number",
            type: "danger",
            color: "#fff",
            backgroundColor: "red",
            floating: true,
          });
        }
      } else {
        showMessage({
          message: "Invalid Email Format",
          type: "danger",
          color: "#fff",
          backgroundColor: "red",
          floating: true,
        });
      }
    } else if (password !== confirmPassword) {
      showMessage({
        message: "Password does not match",
        type: "danger",
        color: "#fff",
        backgroundColor: "red",
        floating: true,
      });
    } else {
      showMessage({
        message: "Please fill all the fields",
        type: "danger",
        color: "#fff",
        backgroundColor: "red",
        floating: true,
      });
    }
  };
  
  return (
    <ScrollView>
      <View style={[styles.container, { paddingTop: 0 }]}>
        <Image source={logoImg} style={styles.img} />
        {/* <Text style={styles.title}>Welcome to HTS</Text> */}
        <Text style={styles.title}>Sign Up</Text>
        {error ? <Text style={styles.error}>{error}</Text> : null}
        <TextInput
          style={styles.input}
          placeholder="Full Name"
          onChangeText={setfullName}
          value={fullName}
          keyboardType="default"
          placeholderTextColor={Colors.primary.lightGray}
        />
        <TextInput
          style={styles.input}
          placeholder="Mobile Number"
          onChangeText={setMobileNo}
          value={mobileNo}
          keyboardType="number-pad"
          maxLength={11}
          placeholderTextColor={Colors.primary.lightGray}
        />
        <TextInput
          style={styles.input}
          placeholder="Address"
          onChangeText={setAddress}
          value={address}
          keyboardType="default"
          placeholderTextColor={Colors.primary.lightGray}
        />
        <Dropdown
          options={citiesName}
          selectedValue={selectedCity}
          onValueChange={(value) => setSelectedCity(value)}
          defaultValue={"Select the city...."}
        />
        <TextInput
          style={styles.input}
          placeholder="Email"
          onChangeText={setEmail}
          value={email}
          keyboardType="email-address"
          autoCapitalize="none"
          placeholderTextColor={Colors.primary.lightGray}
        />
        <TextInput
          style={styles.input}
          placeholder="Password"
          onChangeText={setPassword}
          value={password}
          secureTextEntry={true}
          autoCapitalize="none"
          placeholderTextColor={Colors.primary.lightGray}
        />
        <TextInput
          style={styles.input}
          placeholder="Confirm Password"
          onChangeText={setConfirmPassword}
          value={confirmPassword}
          secureTextEntry={true}
          autoCapitalize="none"
          placeholderTextColor={Colors.primary.lightGray}
        />
        <Dropdown
          options={userTypes}
          selectedValue={selectedUser}
          onValueChange={(value) => setSelectedUser(value)}
          defaultValue={"Select the user type...."}
        />

        <TouchableOpacity
          style={styles.button}
          onPress={handleSignup}
          disabled={signupMutation.isPending}
        >
          {signupMutation.isPending ? (
            <ActivityIndicator size={24} color={"#fff"} />
          ) : (
            <Text style={styles.buttonText}>Sign Up</Text>
          )}
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

export default SignUp;
