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
  ScrollView,
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
import { Colors } from "../../constants/theme";

const ForgetPassword = () => {
  const [email, setEmail] = useState("");
  const navigation = useNavigation();

  const sendOtpMutation = useMutation({
    mutationFn: async (data) => {
      const response = await apiRequest(urlType.BACKEND, {
        method: "post",
        url: `/user/forget-password/send-otp`,
        data,
      });
      return response;
    },
    onError: async (e) => {
      console.log("SDS", e);
      if (e.status === 404) {
        showMessage({
          message: e.message,
          type: "danger",
          color: "#fff",
          backgroundColor: "red",
          floating: true,
        });
      }
    },
    onSuccess: async (e) => {
      if (e.status === 200) {
        showMessage({
          message: e.message,
          type: "success",
          floating: true,
        });
        setEmail("");
        navigation.navigate("OtpScreen", { email: email });
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
  const handleSend = async () => {
    var format = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/;
    if (email.length > 0) {
      if (email.match(format)) {
        const data = {
          email: email,
        };
        await sendOtpMutation.mutate(data);
      } else {
        showMessage({
          message: "Invalid Email!!",
          type: "danger",
          color: "#fff",
          backgroundColor: "red",
          floating: true,
        });
      }
    } else {
      showMessage({
        message: "Please Write Email Address",
        type: "danger",
        color: "#fff",
        backgroundColor: "red",
        floating: true,
      });
    }
  };

  return (
    <ScrollView style={{ flex: 1, backgroundColor: Colors.primary.white }}>
      <View style={styles.container}>
        <Image source={logoImg} style={styles.img} />
        <Text style={styles.title}>Forget Password</Text>
        <TextInput
          style={styles.input}
          placeholder="Email"
          onChangeText={setEmail}
          value={email}
          keyboardType="email-address"
          autoCapitalize="none"
        />
        <Text style={{ color: Colors.primary.darkgray, marginBottom: 10 }}>
          Write email address for the OTP code*
        </Text>

        <TouchableOpacity
          style={styles.button}
          onPress={handleSend}
          disabled={sendOtpMutation.isPending}
        >
          {sendOtpMutation.isPending ? (
            <ActivityIndicator size={24} color={"#fff"} />
          ) : (
            <Text style={styles.buttonText}>Send Email</Text>
          )}
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

export default ForgetPassword;
