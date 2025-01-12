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
} from "react-native";
import styles from "../../styles/styles";
import { useQuery, useMutation } from "@tanstack/react-query";
import apiRequest from "../../api/apiRequest";
import urlType from "../../constants/UrlConstants";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { showMessage } from "react-native-flash-message";
import { Colors } from "../../constants/theme";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useFocusEffect } from "@react-navigation/native";
import { citiesName } from "../../constants/helper";
import Dropdown from "../../components/Dropdown";

const UpdateProposal = ({ navigation, route }) => {
  const { proposalDetails } = route?.params;
  console.log("sadsd", proposalDetails);
  const [workingDays, setWorkingDays] = useState(proposalDetails?.totalDays);
  const [budget, setBudget] = useState(proposalDetails?.budget);
  const [description, setDescription] = useState(proposalDetails?.description);
  // Initialize startDate and startTime with values from proposalDetails
  const [startDate, setStartDate] = useState(
    proposalDetails?.startDate ? new Date(proposalDetails.startDate) : null
  );
  // Parse startTime, using a fallback to current time if invalid or missing
  const initialStartTime = proposalDetails?.startTime
    ? new Date(`1970-01-01T${proposalDetails.startTime}`)
    : new Date();
  const [startTime, setStartTime] = useState(
    isNaN(initialStartTime.getTime()) ? new Date() : initialStartTime
  );

  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);

  const handleDateChange = (event, selectedDate) => {
    setShowDatePicker(false);
    if (selectedDate) setStartDate(selectedDate);
  };

  const handleTimeChange = (event, selectedTime) => {
    setShowTimePicker(false);
    if (selectedTime) setStartTime(selectedTime);
  };

  const updateMutation = useMutation({
    mutationFn: async (data) => {
      const response = await apiRequest(urlType.BACKEND, {
        method: "put",
        url: `/proposal/update-details`,
        data,
      });
      // console.log(response);
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
    const data = {
      proposalId: proposalDetails?._id,
      description: description,
      startDate: startDate ? startDate.toISOString().split("T")[0] : null,
      startTime: startTime
        ? startTime.toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          })
        : null,
      totalDays: Number(workingDays),
      budget: Number(budget),
    };
    await updateMutation.mutate(data);
    // console.log(loginMutation.isLoading);
    // console.log(data);
  };
  return (
    <View style={[styles.container, { paddingTop: 20 }]}>
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
        value={String(workingDays)}
        keyboardType="number-pad"
        maxLength={2}
        placeholderTextColor={Colors.primary.lightGray}
      />
      <TextInput
        style={styles.input}
        placeholder="Budget"
        onChangeText={setBudget}
        value={String(budget)}
        keyboardType="number-pad"
        placeholderTextColor={Colors.primary.lightGray}
      />

      <TouchableOpacity style={styles.button} onPress={handleUpdate}>
        <Text style={styles.buttonText}>Update</Text>
      </TouchableOpacity>
    </View>
  );
};

export default UpdateProposal;
