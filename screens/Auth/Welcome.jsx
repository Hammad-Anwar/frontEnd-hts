import React, { useState } from "react";
import {
  View,
  TextInput,
  Button,
  StyleSheet,
  Text,
  TouchableOpacity,
  Image,
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
 
const Welcome = () => {
  const [{}, dispatch] = useStateValue();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigation = useNavigation();
  const handleSignup = () => {
    navigation.navigate("Signup");
  };

  const loginMutation = useMutation({
    mutationFn: async (data) => {
      const response = await apiRequest(urlType.BACKEND, {
        method: "post",
        url: `login`,
        data,
      });
      console.log(response);
      return response;
    },

    onSuccess: async (e) => {
      if (e !== false) {
        await dispatch({
          type: "SET_LOGIN",
          isLogin: true,
        });
      }
      if (e.status === 200) {
        await dispatch({
          type: "SET_USER_TYPE",
          isType: e?.data?.user?.userType,
        });
        await AsyncStorage.setItem("@user", JSON.stringify(e.data.user));
        await AsyncStorage.setItem("@auth_token", e.data.token);
        navigation.navigate("Homepage");
      } else if (e.status === 404) {
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

  const handleLogin = async () => {
    var format = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/;
    if (email.length > 0) {
      if (password.length > 0 && email.match(format)) {
        const data = {
          email: email,
          password: password,
        };
        await loginMutation.mutate(data);
      } else {
        showMessage({
          message: "Invalid Email/Password",
          type: "danger",
          color: "#fff",
          backgroundColor: "red",
          floating: true,
        });
      }
    } else {
      showMessage({
        message: "Please Enter Email Address",
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

      <Text style={styles.title}>Login</Text>
      {error ? <Text style={styles.error}>{error}</Text> : null}
      <TextInput
        style={styles.input}
        placeholder="Email"
        onChangeText={setEmail}
        value={email}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        onChangeText={setPassword}
        value={password}
        secureTextEntry={true}
        autoCapitalize="none"
      />
      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Welcome</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.signupLink} onPress={handleSignup}>
        <View style={styles.row}>
          <Text>Don't have account?</Text>
          <Text style={styles.signupText}>Sign up here</Text>
        </View>
      </TouchableOpacity>
    </View>
  );
};

export default Welcome;
