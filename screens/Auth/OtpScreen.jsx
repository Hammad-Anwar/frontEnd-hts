import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  ActivityIndicator,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import styles from "../../styles/styles";
import { useMutation } from "@tanstack/react-query";
import apiRequest from "../../api/apiRequest";
import urlType from "../../constants/UrlConstants";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { showMessage } from "react-native-flash-message";
import logoImg from "../../assets/logo.png";
import { Colors } from "../../constants/theme";

const OtpScreen = ({ route }) => {
  const navigation = useNavigation();
  const { email } = route?.params;
  const [otp, setOtp] = useState(["", "", "", ""]);
  const [timer, setTimer] = useState(20); // 5 minutes in seconds

  // Countdown Timer Effect
  useEffect(() => {
    if (timer > 0) {
      const countdown = setInterval(() => setTimer((prev) => prev - 1), 1000);
      return () => clearInterval(countdown);
    }
  }, [timer]);

  const handleOtpChange = (index, value) => {
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
  };

  const sendOtpMutation = useMutation({
    mutationFn: async (data) => {
      const response = await apiRequest(urlType.BACKEND, {
        method: "post",
        url: `/user/forget-password/send-otp`,
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
      } else {
        showMessage({
          message: e.message || "An Error occurred",
          type: "danger",
          color: "#fff",
          backgroundColor: "red",
          floating: true,
        });
      }
    },
  });

  const handleReSendOtp = async () => {
    const data = { email };
    await sendOtpMutation.mutate(data);
    setTimer(20); // Reset timer
  };

  const verifyOtpMutation = useMutation({
    mutationFn: async (data) => {
      const response = await apiRequest(urlType.BACKEND, {
        method: "post",
        url: "/user/forget-password/verify-otp",
        data,
      });
      return response;
    },
    onSuccess: async (e) => {
      if (e.status === 200) {
        showMessage({
          message: e.message || "OTP verified successfully!",
          type: "success",
          floating: true,
        });
        navigation.navigate("ChangePassword", { email, otp: otp.join("") });
      } else {
        showMessage({
          message: e.response?.message || "Failed to verify OTP",
          type: "danger",
          color: "#fff",
          backgroundColor: "red",
          floating: true,
        });
      }
    },
    onError: (error) => {
      showMessage({
        message: error.response?.data?.message || "An error occurred",
        type: "danger",
        color: "#fff",
        backgroundColor: "red",
        floating: true,
      });
    },
  });

  const handleVerifyOtp = () => {
    const otpCode = otp.join("");
    if (otpCode.length === 4) {
      const data = { email, otp: otpCode };
      verifyOtpMutation.mutate(data);
    } else {
      showMessage({
        message: "Please enter all 4 digits of the OTP",
        type: "danger",
        color: "#fff",
        backgroundColor: "red",
        floating: true,
      });
    }
  };

  // Format Timer
  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  };

  return (
    <View style={styles.container}>
      <Image source={logoImg} style={styles.img} />

      <Text style={styles.title}>OTP Verification</Text>
      <Text style={{ color: "#555", marginBottom: 20 }}>
        Enter the OTP sent to your email
      </Text>

      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          width: "80%",
          marginBottom: 20,
        }}
      >
        {otp.map((digit, index) => (
          <TextInput
            key={index}
            style={{
              width: 50,
              height: 50,
              borderWidth: 1,
              borderColor: "#ddd",
              borderRadius: 10,
              textAlign: "center",
              fontSize: 20,
            }}
            keyboardType="numeric"
            maxLength={1}
            value={digit}
            onChangeText={(value) => handleOtpChange(index, value)}
          />
        ))}
      </View>

      <TouchableOpacity
        style={{
          backgroundColor: Colors.primary.main,
          paddingVertical: 12,
          paddingHorizontal: 40,
          borderRadius: 8,
          marginBottom: 20,
        }}
        onPress={handleVerifyOtp}
        disabled={verifyOtpMutation.isPending}
      >
        {verifyOtpMutation.isPending ? (
          <ActivityIndicator size={24} color={"#fff"} />
        ) : (
          <Text style={{ color: "#fff", fontSize: 16 }}>Verify</Text>
        )}
      </TouchableOpacity>

      <Text style={{ color: "#888", marginBottom: 10 }}>
        {timer > 0
          ? `Resend OTP in ${formatTime(timer)}`
          : "Didn't receive the OTP?"}
      </Text>

      {timer === 0 && (
        <TouchableOpacity onPress={handleReSendOtp}>
          <Text style={{ color: "#0A84FF", fontWeight: "bold" }}>
            Resend OTP
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

export default OtpScreen;
