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
import { Colors } from "../../constants/theme";
import { useFocusEffect } from "@react-navigation/native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { MaterialCommunityIcons } from "@expo/vector-icons";

const PostProposal = ({ navigation }) => {
  const [workingDays, setWorkingDays] = useState("");
  const [budget, setBudget] = useState(0);
  const [description, setDescription] = useState("");
  const [selectedService, setSelectedService] = useState("");
  const [userInfo, setUserInfo] = useState(null);
  const [startDate, setStartDate] = useState(null);
  const [startTime, setStartTime] = useState(null);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [isPersonalInfoVisible, setIsPersonalInfoVisible] = useState(false);

  const handleDateChange = (event, selectedDate) => {
    setShowDatePicker(false);
    if (selectedDate) setStartDate(selectedDate);
  };

  const handleTimeChange = (event, selectedTime) => {
    setShowTimePicker(false);
    if (selectedTime) setStartTime(selectedTime);
  };

  useFocusEffect(
    React.useCallback(() => {
      const fetchData = async () => {
        const userString = await AsyncStorage.getItem("@user");
        const user = await JSON.parse(userString);
        if (user) {
          setUserInfo(user);
        }
      };
      fetchData();
      return () => {};
    }, [])
  );

  const { data: servicesData } = useQuery({
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

  const postMutation = useMutation({
    mutationFn: async (data) => {
      const response = await apiRequest(urlType.BACKEND, {
        method: "post",
        url: `proposal`,
        data,
      });
      // console.log(response);
      return response;
    },
    onSuccess: async (e) => {
      if (e.status === 200) {
        console.log("SDDSD", e);
        setDescription(""),
          setWorkingDays(""),
          setStartDate(""),
          setStartTime(""),
          setSelectedService(""),
          setBudget(0),
          showMessage({
            message: e.message,
            type: "success",
            floating: true,
          });
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

  const handlePost = async () => {
    if (
      selectedService.length > 0 &&
      description.length > 0 &&
      startDate !== null &&
      startTime !== null &&
      workingDays.length > 0 &&
      budget > 0
    ) {
      const data = {
        serviceId: selectedService,
        description: description,
        startDate: startDate.toISOString().split("T")[0],
        startTime: startTime.toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
        totalDays: Number(workingDays),
        budget: Number(budget),
        proposalType: "post",
      };
      await postMutation.mutate(data);
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
    // <ScrollView>
    <View
      style={[
        styles.container,
        {
          paddingTop: 0,
          borderTopWidth: 2,
          borderColor: Colors.primary.borderColor,
        },
      ]}
    >
      {/* Personal Information Section */}
      <TouchableOpacity
        onPress={() => setIsPersonalInfoVisible(!isPersonalInfoVisible)}
        style={newStyles.infoToggle}
      >
        <Text style={newStyles.infoHeader}>Personal Information</Text>
        <MaterialCommunityIcons
          name={isPersonalInfoVisible ? "chevron-up" : "chevron-down"}
          size={24}
          color={Colors.primary.darkgray}
        />
      </TouchableOpacity>

      {isPersonalInfoVisible && (
        <View style={newStyles.personalInfo}>
          <Text style={newStyles.infoText}>Phone: {userInfo.mobileNo}</Text>
          <Text style={newStyles.infoText}>City: {userInfo.city}</Text>
          <Text style={newStyles.infoText}>Address: {userInfo.address}</Text>
          <Text style={newStyles.infoText}>Email: {userInfo.email}</Text>
        </View>
      )}
      <ScrollView>
        <Dropdown
          options={servicesOptions}
          selectedValue={selectedService}
          onValueChange={(value) => setSelectedService(value)}
          defaultValue={"Select the service...."}
        />
        <TextInput
          style={[styles.input, { height: 80, textAlignVertical: "top" }]}
          placeholder="Description"
          onChangeText={setDescription}
          value={description}
          keyboardType="default"
          placeholderTextColor={Colors.primary.lightGray}
          multiline={true}
          numberOfLines={3}
        />
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            gap: 20,
          }}
        >
          {/* Start Date Input */}
          <TouchableOpacity
            onPress={() => setShowDatePicker(true)}
            style={{ width: "46%" }}
          >
            <TextInput
              style={styles.input}
              placeholder="Start Date"
              value={startDate ? startDate.toLocaleDateString() : ""}
              editable={false}
              placeholderTextColor={Colors.primary.lightGray}
            />
          </TouchableOpacity>
          {showDatePicker && (
            <DateTimePicker
              value={startDate || new Date()}
              mode="date"
              display="default"
              onChange={handleDateChange}
            />
          )}

          {/* Start Time Input */}
          <TouchableOpacity
            onPress={() => setShowTimePicker(true)}
            style={{ width: "46%" }}
          >
            <TextInput
              style={styles.input}
              placeholder="Start Time"
              value={
                startTime
                  ? startTime.toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })
                  : ""
              }
              editable={false}
              placeholderTextColor={Colors.primary.lightGray}
            />
          </TouchableOpacity>
          {showTimePicker && (
            <DateTimePicker
              value={startTime || new Date()}
              mode="time"
              display="default"
              onChange={handleTimeChange}
            />
          )}
        </View>
        <TextInput
          style={styles.input}
          placeholder="Total Working days"
          onChangeText={setWorkingDays}
          value={workingDays}
          keyboardType="number-pad"
          maxLength={2}
          placeholderTextColor={Colors.primary.lightGray}
        />
        <TextInput
          style={styles.input}
          placeholder="Budget"
          onChangeText={setBudget}
          value={budget}
          keyboardType="number-pad"
          placeholderTextColor={Colors.primary.lightGray}
        />

        <TextInput
          style={styles.input}
          placeholder="Proposal Type: Post"
          editable={false}
          placeholderTextColor={Colors.primary.darkgray}
        />

        <TouchableOpacity
          style={styles.button}
          onPress={handlePost}
          disabled={postMutation.isPending}
        >
          {postMutation.isPending ? (
            <ActivityIndicator size={24} color={"#fff"} />
          ) : (
            <Text style={styles.buttonText}>Post</Text>
          )}
        </TouchableOpacity>
      </ScrollView>
    </View>
    // </ScrollView>
  );
};

const newStyles = StyleSheet.create({
  infoToggle: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 10,
  },
  infoHeader: {
    fontSize: 18,
    fontWeight: "600",
    color: Colors.primary.black,
  },
  personalInfo: {
    width: "100%",
    padding: 10,
    borderWidth: 1,
    borderColor: Colors.primary.borderColor,

    backgroundColor: "#f9f9f9",
    borderRadius: 5,
    marginBottom: 15,
  },
  infoText: {
    fontSize: 16,
    color: Colors.primary.lightBlack,
    marginVertical: 5,
    fontWeight: "500",
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 20,
    marginTop: 15,
  },
});

export default PostProposal;
