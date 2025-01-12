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
import { useFocusEffect } from "@react-navigation/native";
import { citiesName } from "../../constants/helper";
import Dropdown from "../../components/Dropdown";
import * as ImagePicker from "expo-image-picker";

const EditProfile = ({ navigation, route }) => {
  const { userInfo } = route?.params;
  const [profileImage, setProfileImage] = useState(null);
  const [mobileNo, setMobileNo] = useState(userInfo?.mobileNo);
  const [address, setAddress] = useState(userInfo?.address);
  const [workDescription, setWorkDescription] = useState(
    userInfo?.vendorDetails?.workDescription
  );
  const [workExperience, setWorkExperience] = useState(
    userInfo?.vendorDetails?.workExperience
  );
  const [selectedCity, setSelectedCity] = useState(userInfo?.city);

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.2,
      base64: true,
    });
    if (!result.cancelled) {
      const base64Image = `data:${result.assets[0]?.mimeType};base64,${result?.assets[0]?.base64}`;
      console.log("CHECKEC_____", base64Image)
      setProfileImage(base64Image);
    }
  };

  const updateMutation = useMutation({
    mutationFn: async (data) => {
      const response = await apiRequest(urlType.BACKEND, {
        method: "put",
        url: `/user/update`,
        data,
      });
      // console.log(response);
      return response;
    },
    onSuccess: async (e) => {
      if (e.status === 200) {
        await AsyncStorage.setItem("@user", JSON.stringify(e?.data));
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
    if (userInfo?.userType === "customer") {
      const data = {
        profileImage: profileImage,
        mobileNo: mobileNo,
        address: address,
        city: selectedCity,
      };
      await updateMutation.mutate(data);
      // console.log(loginMutation.isLoading);
      //   console.log(data);
    } else if (userInfo?.userType === "vendor") {
      const data = {
        profileImage: profileImage,
        mobileNo: mobileNo,
        address: address,
        workDescription: workDescription,
        workExperience: workExperience,
      };
      await updateMutation.mutate(data);
      // console.log(loginMutation.isLoading);
      //   console.log(data);
    }
  };
  return (
    <View style={[styles.container, { paddingTop: 20 }]}>
      <TouchableOpacity onPress={pickImage}>
        <Image
          source={
            profileImage
              ? { uri: profileImage }
              : {
                  uri: "https://img.freepik.com/premium-vector/default-image-icon-vector-missing-picture-page-website-design-mobile-app-no-photo-available_87543-11093.jpg",
                }
          }
          style={extrStyle.profileImage}
        />
        <Text style={extrStyle.uploadText}>Upload Profile Picture</Text>
      </TouchableOpacity>
      <Dropdown
        options={citiesName}
        selectedValue={selectedCity}
        onValueChange={(value) => setSelectedCity(value)}
        defaultValue={"Select the city...."}
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

      {userInfo?.userType === "vendor" ? (
        <>
          <TextInput
            style={[styles.input, { height: 80, textAlignVertical: "top" }]}
            placeholder="Description"
            onChangeText={setWorkDescription}
            value={workDescription}
            keyboardType="default"
            placeholderTextColor={Colors.primary.lightGray}
            multiline={true}
            numberOfLines={3}
          />
          <TextInput
            style={styles.input}
            placeholder="Work experience in year"
            onChangeText={setWorkExperience}
            value={String(workExperience)}
            keyboardType="number-pad"
            maxLength={2}
            placeholderTextColor={Colors.primary.lightGray}
          />
        </>
      ) : null}

      <TouchableOpacity
        style={styles.button}
        onPress={handleUpdate}
        disabled={updateMutation.isPending}
      >
        {updateMutation.isPending ? (
          <ActivityIndicator size={24} color={"#fff"} />
        ) : (
          <Text style={styles.buttonText}>Update</Text>
        )}
      </TouchableOpacity>
    </View>
  );
};

const extrStyle = StyleSheet.create({
  profileImage: {
    width: 150,
    height: 150,
    borderRadius: 75,
    borderColor: "#ccc",
    borderWidth: 2,
    marginBottom: 20,
    alignSelf: "center",
    backgroundColor: "#cccccc",
  },
  uploadText: {
    textAlign: "center",
    color: "#007bff",
    fontSize: 16,
    marginBottom: 20,
  },
});

export default EditProfile;
