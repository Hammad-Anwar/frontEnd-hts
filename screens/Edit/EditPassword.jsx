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
import { Colors } from "../../constants/theme";

const EditPassword = ({ navigation }) => {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const updatePasswordMutation = useMutation({
    mutationFn: async (data) => {
      const response = await apiRequest(urlType.BACKEND, {
        method: "put",
        url: `/user/updatePassword`,
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
        navigation.goBack();
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

  const handleUpdate = async () => {
    const passwordFormat = /^(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{8,}$/; 
    if (
      oldPassword.length > 0 &&
      newPassword.length > 0 &&
      oldPassword !== newPassword &&
      newPassword === confirmPassword
    ) {
      if (newPassword.match(passwordFormat)) {
        const data = {
          oldPassword: oldPassword,
          newPassword: confirmPassword,
        };
        await updatePasswordMutation.mutate(data);
      } else {
        showMessage({
          message:
            "New password must be at least 8 characters long, include 1 uppercase letter, and 1 number",
          type: "danger",
          color: "#fff",
          backgroundColor: "red",
          floating: true,
        });
      }
    } else if (newPassword !== confirmPassword) {
      showMessage({
        message: "Password does not match",
        type: "danger",
        color: "#fff",
        backgroundColor: "red",
        floating: true,
      });
    } else if (oldPassword === newPassword && oldPassword.length > 0) {
      showMessage({
        message:
          "Your new password must be different from the current password",
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
    <View style={[styles.container, { paddingTop: 20 }]}>
      <TextInput
        style={styles.input}
        placeholder="Old Password"
        onChangeText={setOldPassword}
        value={oldPassword}
        secureTextEntry={true}
        autoCapitalize="none"
        placeholderTextColor={Colors.primary.lightGray}
      />
      <TextInput
        style={styles.input}
        placeholder="New Password"
        onChangeText={setNewPassword}
        value={newPassword}
        secureTextEntry={true}
        autoCapitalize="none"
        placeholderTextColor={Colors.primary.lightGray}
      />
      <TextInput
        style={styles.input}
        placeholder="Re-type New Password"
        onChangeText={setConfirmPassword}
        value={confirmPassword}
        secureTextEntry={true}
        autoCapitalize="none"
        placeholderTextColor={Colors.primary.lightGray}
      />

      <TouchableOpacity
        style={[styles.button, { marginTop: 10 }]}
        onPress={handleUpdate}
        disabled={updatePasswordMutation.isPending}
      >
        {updatePasswordMutation.isPending ? (
          <ActivityIndicator size={24} color={"#fff"} />
        ) : (
          <Text style={styles.buttonText}>Update Password</Text>
        )}
      </TouchableOpacity>
    </View>
  );
};

export default EditPassword;
