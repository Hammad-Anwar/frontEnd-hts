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

const VendorDetails = ({ navigation, route }) => {
  const userId = route?.params?.userId;
  const [{}, dispatch] = useStateValue();
  const [workDescription, setWorkDescription] = useState("");
  const [workExperience, setWorkExperience] = useState("");
  const [selectedService, setSelectedService] = useState("");

  const {
    data: servicesData,
    error,
    isLoading,
  } = useQuery({
    queryKey: ["services"],
    queryFn: async () => {
      const response = await apiRequest(urlType.BACKEND, {
        method: "get",
        url: "services",
      });
      if (response.status === 200) {
        return response.data;
      }
      throw new Error("Error fetching services");
    },
  });

  // Transform servicesData into the dropdown-compatible format
  const servicesOptions = servicesData
    ? servicesData.map((service) => ({
        label: service.serivceName,
        value: service._id,
      }))
    : [];

  const signupMutation = useMutation({
    mutationFn: async (data) => {
      const response = await apiRequest(urlType.BACKEND, {
        method: "post",
        url: `vendor/details`,
        data,
      });
      // console.log(response);
      return response;
    },
    onSuccess: async (e) => {
      if (e.status === 200) {
        if (e !== false) {
          await dispatch({
            type: "SET_LOGIN",
            isLogin: true,
          });
        }
        await AsyncStorage.setItem("@user", JSON.stringify(e.data));
        navigation.navigate("BottomNavigation");
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

  const handlDone = async () => {
    if (
      workDescription.length > 0 &&
      workExperience.length > 0 &&
      selectedService.length > 0
    ) {
      const data = {
        serviceId: selectedService,
        workDescription: workDescription,
        workExperience: workExperience,
        vendorId: userId,
      };
      await signupMutation.mutate(data);
      // console.log(loginMutation.isLoading);
      // console.log(data);
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
    <View style={[styles.container, { paddingTop: 0 }]}>
      <Image source={logoImg} style={styles.img} />
      <Text style={styles.title}>Vendor More Details</Text>
      <Dropdown
        options={servicesOptions}
        selectedValue={selectedService}
        onValueChange={(value) => setSelectedService(value)}
        defaultValue={"Select the service...."}
      />
      <TextInput
        style={styles.input}
        placeholder="Work description"
        onChangeText={setWorkDescription}
        value={workDescription}
        keyboardType="default"
        placeholderTextColor={Colors.primary.lightGray}
      />
      <TextInput
        style={styles.input}
        placeholder="Work experience in year"
        onChangeText={setWorkExperience}
        value={workExperience}
        keyboardType="number-pad"
        maxLength={2}
        placeholderTextColor={Colors.primary.lightGray}
      />

      <TouchableOpacity
        style={styles.button}
        onPress={handlDone}
        disabled={signupMutation.isPending}
      >
        {signupMutation.isPending ? (
          <ActivityIndicator size={24} color={"#fff"} />
        ) : (
          <Text style={styles.buttonText}>Done</Text>
        )}
      </TouchableOpacity>
    </View>
  );
};

export default VendorDetails;
