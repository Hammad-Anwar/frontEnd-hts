import React, { useState } from "react";
import {
  View,
  TextInput,
  Button,
  StyleSheet,
  Text,
  TouchableOpacity,
  Image,
  ActivityIndicator,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import styles from "../../styles/styles";
import { useQuery, useMutation } from "@tanstack/react-query";
import apiRequest from "../../api/apiRequest";
import urlType from "../../constants/UrlConstants";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { showMessage } from "react-native-flash-message";
import { useStateValue } from "../../context/GlobalContextProvider";
import logoImg from "../../assets/logo.png";

const ChangePassword = ({ route }) => {
  const { email, otp } = route?.params;
  const navigation = useNavigation();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const resetMutation = useMutation({
    mutationFn: async (data) => {
      const response = await apiRequest(urlType.BACKEND, {
        method: "post",
        url: `/user/forget-password/change-password`,
        data,
      });
      return response;
    },

    onSuccess: async (e) => {
      if (e.status === 200) {
        showMessage({
          message: e.message,
          type: "success",
          floating: true,
        });
        navigation.navigate("Login");
      } else {
        showMessage({
          message: e.message || "An Error occured",
          type: "danger",
          color: "#fff",
          backgroundColor: "red",
          floating: true,
        });
      }
    },
  });

  const handleReset = async () => {
    if (password.length > 0 || confirmPassword.length > 0) {
      if (password === confirmPassword) {
        const data = {
          email: email,
          otp: otp,
          newPassword: password,
        };
        await resetMutation.mutate(data);
      } else {
        showMessage({
          message:
            "Passwords do not match. Please re-enter to ensure they are identical.",
          type: "danger",
          color: "#fff",
          backgroundColor: "red",
          floating: true,
        });
      }
    } else {
      showMessage({
        message: "Please fill the both fields",
        type: "danger",
        color: "#fff",
        backgroundColor: "red",
        floating: true,
      });
    }
  };

  return (
    <View style={styles.container}>
      <Image source={logoImg} style={styles.img} />

      <Text style={styles.title}>Change Password</Text>
      <TextInput
        style={styles.input}
        placeholder="Password"
        onChangeText={setPassword}
        value={password}
        secureTextEntry={true}
        autoCapitalize="none"
      />
      <TextInput
        style={styles.input}
        placeholder="Confirm Password"
        onChangeText={setConfirmPassword}
        value={confirmPassword}
        secureTextEntry={true}
        autoCapitalize="none"
      />
      <TouchableOpacity
        style={styles.button}
        onPress={handleReset}
        disabled={resetMutation.isPending}
      >
        {resetMutation.isPending ? (
          <ActivityIndicator size={24} color={"#fff"} />
        ) : (
          <Text style={styles.buttonText}>Reset</Text>
        )}
      </TouchableOpacity>
    </View>
  );
};

export default ChangePassword;
